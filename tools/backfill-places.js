(function(){
    const logEl = document.getElementById('log');
    const countEl = document.getElementById('count');
    const updatedEl = document.getElementById('updated');
    const reviewEl = document.getElementById('review');
    const skippedEl = document.getElementById('skipped');
    const tbody = document.querySelector('#results tbody');
    const btnLoad = document.getElementById('btn-load');
    const btnStart = document.getElementById('btn-start');
    const btnExport = document.getElementById('btn-export');

    let db; let performances=[]; let report=[];
    let reviewMap = new Map();

    function log(msg){ logEl.textContent += (msg+'\n'); logEl.scrollTop = logEl.scrollHeight; }

    function addRow(p, status, score, match){
        const tr = document.createElement('tr');
        const cid = 'cand-'+p.id;
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${(p.show_id||'')}</td>
            <td>${p.theatre_name||''}</td>
            <td>${p.city||''}</td>
            <td>${status==='review' ? `<select id="${cid}"></select>` : (match ? (match.name||'') : '-')}</td>
            <td>${score!=null ? score.toFixed(2) : '-'}</td>
            <td><span class="pill ${status==='updated'?'ok':status==='review'?'warn':'err'}">${status}</span></td>
        `;
        tbody.appendChild(tr);
        if (status==='review'){
            const sel = tr.querySelector('#'+cid);
            const options = (reviewMap.get(p.id)||[]).slice(0,5);
            options.forEach(o=>{
                const opt = document.createElement('option');
                opt.value = o.place_id; opt.textContent = `${o.name} (${(o.score).toFixed(2)})`;
                sel.appendChild(opt);
            });
            sel.onchange = function(){
                const pick = options.find(o=>o.place_id===sel.value);
                if (!pick) return;
                const patch = { location_place_id: pick.place_id, location_address: pick.address||'', location_lat: pick.lat||null, location_lng: pick.lng||null };
                db.updatePerformance(p.id, patch);
                updatedEl.textContent = String(Number(updatedEl.textContent||'0')+1);
                sel.parentElement.nextElementSibling.textContent = (pick.score||0).toFixed(2);
                sel.parentElement.nextElementSibling.nextElementSibling.innerHTML = '<span class="pill ok">updated</span>';
            };
        }
    }

    function rateLimit(ms){ return new Promise(r=>setTimeout(r, ms)); }

    btnLoad.onclick = function(){
        db = window.StageLogDB ? new StageLogDB() : window.LocalDB;
        performances = db.getPerformances();
        countEl.textContent = String(performances.length);
        btnStart.disabled = performances.length === 0;
        log('Loaded '+performances.length+' performances');
    };

    btnStart.onclick = async function(){
        btnStart.disabled = true; btnLoad.disabled = true; btnExport.disabled = true;
        let updated=0, review=0, skipped=0;
        const thresholdAccept = 0.7; const thresholdReview = 0.5;

        for (let i=0;i<performances.length;i++){
            const p = performances[i];
            // Skip if Pro Shot or already enriched
            if (String(p.production_type||'') === 'Pro Shot') { skipped++; skippedEl.textContent=String(skipped); addRow(p,'skipped',1,null); continue; }
            if (p.location_place_id) { skipped++; skippedEl.textContent=String(skipped); addRow(p,'skipped',1,null); continue; }

            const theatre = p.theatre_name || '';
            const city = p.city || '';
            if (!theatre){ skipped++; skippedEl.textContent=String(skipped); addRow(p,'skipped',0,null); continue; }

            try {
                const ranked = await PlacesResolver.resolvePlaceForTheatre(theatre, city);
                const best = ranked[0];
                if (best && best.score >= thresholdAccept){
                    const c = best.candidate;
                    const loc = c.geometry && c.geometry.location;
                    const patch = {
                        location_place_id: c.place_id || '',
                        location_address: c.formatted_address || '',
                        location_lat: loc ? (typeof loc.lat==='function'? loc.lat(): loc.lat) : null,
                        location_lng: loc ? (typeof loc.lng==='function'? loc.lng(): loc.lng) : null,
                    };
                    // Derive city if missing/empty
                    if (!p.city && c.formatted_address){
                        const parts = c.formatted_address.split(',').map(s=>s.trim());
                        if (parts.length>=2) patch.city = parts[parts.length-2];
                    }
                    db.updatePerformance(p.id, patch);
                    updated++; updatedEl.textContent = String(updated);
                    addRow(p,'updated',best.score,{ name:c.name });
                    report.push({ id:p.id, status:'updated', score:best.score, place_id:patch.location_place_id, address:patch.location_address });
                } else if (best && best.score >= thresholdReview) {
                    review++; reviewEl.textContent = String(review);
                    const opts = ranked.slice(0,5).map(r=>({ name:r.candidate.name, place_id:r.candidate.place_id, score:r.score, address: r.candidate.formatted_address||'', lat: r.candidate.geometry?.location?.lat?.() ?? null, lng: r.candidate.geometry?.location?.lng?.() ?? null }));
                    reviewMap.set(p.id, opts);
                    addRow(p,'review',best.score,{ name: best.candidate.name });
                    report.push({ id:p.id, status:'review', score:best.score, candidates: opts });
                } else {
                    skipped++; skippedEl.textContent=String(skipped);
                    addRow(p,'skipped',best?best.score:0,null);
                    report.push({ id:p.id, status:'skipped' });
                }
            } catch (e) {
                skipped++; skippedEl.textContent=String(skipped);
                addRow(p,'skipped',0,null);
                report.push({ id:p.id, status:'error', error: String(e&&e.message||e) });
                log('Error resolving '+(p.theatre_name||p.id)+': '+(e&&e.message||e));
            }
            // 3 req/s approx
            await rateLimit(350);
        }

        btnExport.disabled = false;
        log('Backfill complete. Updated: '+updated+'; Review: '+review+'; Skipped: '+skipped);
    };

    btnExport.onclick = function(){
        const blob = new Blob([JSON.stringify({ when:new Date().toISOString(), report }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'places-backfill-report.json';
        a.click();
    };
})();


