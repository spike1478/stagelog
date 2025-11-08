(function(global){
    function normalize(str){
        return (str||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,' ').trim();
    }

    function similarity(a,b){
        a = normalize(a); b = normalize(b);
        if (!a || !b) return 0;
        // Dice coefficient over bigrams (simple, good-enough)
        function bigrams(s){
            const arr=[]; for(let i=0;i<s.length-1;i++) arr.push(s.slice(i,i+2)); return arr;
        }
        const A = bigrams(a), B = bigrams(b);
        const set = new Map(); let inter=0;
        A.forEach(x=> set.set(x,(set.get(x)||0)+1));
        B.forEach(x=> { const c=set.get(x)||0; if(c>0){ inter++; set.set(x,c-1);} });
        const score = (2*inter)/(A.length+B.length||1);
        return Math.max(0, Math.min(1, score));
    }

    function deriveCityFromComponents(components){
        const by = (t)=> (components||[]).find(c=> (c.types||[]).includes(t))?.longText || (components||[]).find(c=> (c.types||[]).includes(t))?.long_name;
        return by('locality')||by('postal_town')||by('sublocality')||by('administrative_area_level_2')||by('administrative_area_level_1')||'';
    }

    const cache = new Map();
    function getKey(){ return global.__PLACES_KEY__ || ''; }
    function fieldsMask(){ return 'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.addressComponents'; }
    function detailsMask(){ return 'id,displayName,formattedAddress,location,types,addressComponents'; }

    async function httpSearchText(query){
        const key = getKey();
        if (!key) return [];
        const url = 'https://places.googleapis.com/v1/places:searchText';
        const body = {
            textQuery: query,
            maxResultCount: 5,
            languageCode: 'en'
        };
        const res = await fetch(url+'?key='+encodeURIComponent(key), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': key,
                'X-Goog-FieldMask': fieldsMask()
            },
            body: JSON.stringify(body)
        });
        if (!res.ok){
            const t = await res.text();
            console.warn('Places searchText error', res.status, t);
            return [];
        }
        const data = await res.json();
        return data.places || [];
    }

    async function httpDetails(placeId){
        const key = getKey();
        if (!key) return null;
        const url = 'https://places.googleapis.com/v1/places/'+encodeURIComponent(placeId);
        const res = await fetch(url+'?key='+encodeURIComponent(key)+'&fields='+encodeURIComponent(detailsMask()), {
            headers: { 'X-Goog-Api-Key': key }
        });
        if (!res.ok) return null;
        return await res.json();
    }

    function scoreCandidate(cand, theatreName, city){
        let score = 0;
        score += 0.5 * similarity(cand.name||'', theatreName||'');
        const addr = cand.formatted_address||'';
        if (normalize(addr).includes(normalize(city||''))) score += 0.3;
        if ((cand.types||[]).includes('establishment')) score += 0.1;
        // Rough distance scoring could be added if city geocode available
        return Math.min(1, score);
    }

    async function resolvePlaceForTheatre(theatreName, city){
        const query = [theatreName, city].filter(Boolean).join(', ');
        const key = normalize(query);
        if (cache.has(key)) return cache.get(key);
        const results = await httpSearchText(query);
        // Normalize result object to match scoring helpers
        const mapped = results.map(p => ({
            place_id: p.id,
            name: p.displayName?.text || p.displayName || p.name,
            formatted_address: p.formattedAddress,
            geometry: { location: { lat: ()=> (p.location?.latitude ?? null), lng: ()=> (p.location?.longitude ?? null) } },
            types: p.types || [],
            address_components: p.addressComponents || p.address_components
        }));
        const ranked = mapped.map(r=> ({ candidate: r, score: scoreCandidate(r, theatreName, city) })).sort((a,b)=> b.score-a.score);
        cache.set(key, ranked);
        return ranked;
    }

    global.PlacesResolver = { resolvePlaceForTheatre, deriveCityFromComponents };
})(window);

// Minimal Places resolver with rate limiting and confidence scoring
(function (global) {
    const RATE_MS = 350; // ~3 req/s
    let lastTs = 0;

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function normalize(str) {
        return (str || '')
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function similarity(a, b) {
        a = normalize(a); b = normalize(b);
        if (!a || !b) return 0;
        const setA = new Set(a.split(' '));
        const setB = new Set(b.split(' '));
        let inter = 0; setA.forEach(w => { if (setB.has(w)) inter++; });
        const union = new Set([...setA, ...setB]).size;
        return inter / union; // Jaccard on tokens
    }

    function extractCityFromComponents(components) {
        if (!components) return '';
        const get = (t) => {
            const comp = components.find(c => Array.isArray(c.types) && c.types.includes(t));
            return comp ? (comp.long_text || comp.long_name || '') : '';
        };
        return get('locality') || get('postal_town') || get('sublocality') || get('administrative_area_level_2') || get('administrative_area_level_1') || '';
    }

    async function placesSearch(query) {
        while (Date.now() - lastTs < RATE_MS) await sleep(20);
        lastTs = Date.now();
        return new Promise((resolve, reject) => {
            if (!global.google || !google.maps || !google.maps.places) {
                return reject(new Error('Places not loaded'));
            }
            const svc = new google.maps.places.PlacesService(document.createElement('div'));
            const req = { query, fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types'] };
            svc.findPlaceFromQuery(req, (results, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !results) return resolve([]);
                resolve(results);
            });
        });
    }

    function scoreCandidate(targetName, targetCity, result) {
        let score = 0;
        score += similarity(targetName, result.name || '') * 0.6;
        const addr = result.formatted_address || '';
        const cityMatch = targetCity && normalize(addr).includes(normalize(targetCity));
        if (cityMatch) score += 0.3;
        const types = result.types || [];
        if (types.includes('establishment') || types.includes('point_of_interest')) score += 0.1;
        return Math.min(1, score);
    }

    async function resolvePlace(theatreName, city) {
        const query = [theatreName, city].filter(Boolean).join(', ');
        const results = await placesSearch(query);
        const scored = results.map(r => ({ r, score: scoreCandidate(theatreName, city, r) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
        return scored;
    }

    global.StageLogPlacesResolver = {
        resolvePlace,
        extractCityFromComponents,
        similarity,
    };
})(window);


