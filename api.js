// API Integration for Show Information
// Handles external API calls to fetch show details

class ShowAPI {
    constructor() {
        // Using multiple free APIs for show information
        this.apis = {
            // TMDb API for movies and some shows
            tmdb: {
                baseUrl: 'https://api.themoviedb.org/3',
                apiKey: '', // Will need to be set by user or use demo data
                imageBaseUrl: 'https://image.tmdb.org/t/p/w500'
            },
            // Wikipedia API for general information
            wikipedia: {
                baseUrl: 'https://en.wikipedia.org/api/rest_v1'
            }
        };

        // Demo show data for when APIs are not available
        this.demoShows = this.getDemoShows();
    }

    // Search for shows across multiple sources
    async searchShows(query) {
        try {
            // First check local database
            const localResults = window.db.searchShows(query);
            
            // Try to fetch from external APIs
            const externalResults = await this.searchExternalAPIs(query);
            
            // Combine and deduplicate results
            const allResults = [...localResults, ...externalResults];
            const uniqueResults = this.deduplicateResults(allResults);
            
            return uniqueResults.slice(0, 10); // Limit to 10 results
        } catch (error) {
            console.warn('API search failed, using demo data:', error);
            return this.searchDemoShows(query);
        }
    }

    // Search external APIs
    async searchExternalAPIs(query) {
        console.log('Starting external API search with musical database priority...');
        
        // PRIORITY 1: Use musical database first (most accurate)
        if (window.MusicalDatabase) {
            console.log('Using musical database as primary source');
            const musicalResults = window.MusicalDatabase.searchMusicals(query);
            console.log('Musical database found:', musicalResults.length, 'results');
            
            // If we have good musical results, use them and skip external APIs
            if (musicalResults.length > 0) {
                return musicalResults.slice(0, 8);
            }
        }
        
        // PRIORITY 2: Only try Wikidata if no musical database results
        console.log('No musical database results, trying Wikidata...');
        const results = [];
        
        try {
            // Search Wikidata for musicals only (more restrictive)
            const wikiResults = await this.searchWikipedia(query);
            results.push(...wikiResults);
        } catch (error) {
            console.warn('Wikidata search failed:', error);
        }

        return results;
    }

    // Search Wikidata for shows (more accurate than Wikipedia)
    async searchWikipedia(query) {
        try {
            console.log('Searching Wikidata for:', query);
            
            // SPARQL query to find ONLY stage musicals (no TV, films, or sketches)
            const sparqlQuery = `
                SELECT DISTINCT ?item ?itemLabel ?itemDescription ?composer ?composerLabel ?lyricist ?lyricistLabel 
                       ?premiereDate ?image ?basedOn ?basedOnLabel ?genre ?genreLabel WHERE {
                    # Only musical theatre works
                    ?item wdt:P31/wdt:P279* wd:Q2743 .  # Instance of musical
                    
                    # Must have a theatre premiere (not TV/film)
                    ?item wdt:P1191 ?premiereDate .     # Must have premiere date
                    
                    # Exclude TV shows, films, and sketches
                    FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q5398426 . }  # Not a TV series
                    FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q11424 . }    # Not a film
                    FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q53094 . }    # Not a television program
                    FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q1261214 . }  # Not a sketch
                    
                    # Must be in English
                    ?item rdfs:label ?itemLabel .
                    FILTER(LANG(?itemLabel) = "en")
                    FILTER(CONTAINS(LCASE(?itemLabel), "${query.toLowerCase()}"))
                    
                    # Must have composer (key requirement for musicals)
                    ?item wdt:P86 ?composer .           # Must have composer
                    
                    OPTIONAL { ?item wdt:P676 ?lyricist . }     # Lyricist
                    OPTIONAL { ?item wdt:P18 ?image . }         # Image
                    OPTIONAL { ?item wdt:P144 ?basedOn . }      # Based on
                    OPTIONAL { ?item wdt:P136 ?genre . }        # Genre
                    
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
                }
                LIMIT 5
            `;

            const wikidataSparql = 'https://query.wikidata.org/sparql';
            console.log('Fetching from Wikidata SPARQL endpoint...');
            const response = await fetch(wikidataSparql + '?' + new URLSearchParams({
                query: sparqlQuery,
                format: 'json'
            }), {
                headers: {
                    'Accept': 'application/sparql-results+json',
                    'User-Agent': 'StageLog/1.0'
                }
            });

            console.log('Wikidata response status:', response.status);

            if (!response.ok) {
                throw new Error(`Wikidata HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Wikidata results:', data);

            const wikidataResults = this.parseWikidataResults(data);
            console.log('Parsed Wikidata results:', wikidataResults);
            
            return wikidataResults;
        } catch (error) {
            console.warn('Wikidata search error:', error.message);
            console.warn('Falling back to demo shows...');
            
            // Enhanced fallback with more shows matching the query
            const enhancedDemoResults = this.getEnhancedDemoShows(query);
            console.log('Enhanced demo results:', enhancedDemoResults);
            
            return enhancedDemoResults;
        }
    }

    // Parse Wikidata SPARQL results into show objects
    parseWikidataResults(data) {
        if (!data.results || !data.results.bindings) {
            return [];
        }

        const showMap = new Map();

        // Group results by item (since we might get multiple rows for the same show)
        data.results.bindings.forEach(binding => {
            const wikidataId = binding.item.value.split('/').pop();
            const id = `wikidata-${wikidataId}`;

            if (!showMap.has(id)) {
                showMap.set(id, {
                    id: id,
                    title: binding.itemLabel?.value || 'Unknown Title',
                    synopsis: binding.itemDescription?.value || 'No description available',
                    composer: binding.composerLabel?.value || 'Unknown',
                    lyricist: binding.lyricistLabel?.value || 'Unknown',
                    premiere_date: binding.premiereDate?.value?.split('T')[0] || null,
                    poster_image_url: this.getWikimediaImageUrl(binding.image?.value) || '',
                    based_on: binding.basedOnLabel?.value || null,
                    genre: binding.genreLabel?.value || null,
                    wikidata_id: wikidataId,
                    source: 'wikidata',
                    external_url: `https://www.wikidata.org/wiki/${wikidataId}`
                });
            } else {
                // Merge additional information (multiple composers, genres, etc.)
                const existing = showMap.get(id);
                if (binding.composerLabel?.value && !existing.composer.includes(binding.composerLabel.value)) {
                    existing.composer += `, ${binding.composerLabel.value}`;
                }
                if (binding.lyricistLabel?.value && !existing.lyricist.includes(binding.lyricistLabel.value)) {
                    existing.lyricist += `, ${binding.lyricistLabel.value}`;
                }
                if (binding.genreLabel?.value && (!existing.genre || !existing.genre.includes(binding.genreLabel.value))) {
                    existing.genre = existing.genre ? `${existing.genre}, ${binding.genreLabel.value}` : binding.genreLabel.value;
                }
            }
        });

        return Array.from(showMap.values());
    }

    // Convert Wikimedia Commons URL to a proper thumbnail URL
    getWikimediaImageUrl(wikimediaUrl) {
        if (!wikimediaUrl) return '';
        
        try {
            // Extract filename from Wikimedia Commons URL
            const filename = wikimediaUrl.split('/').pop();
            return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=300`;
        } catch {
            return wikimediaUrl;
        }
    }

    // Get detailed information from Wikidata
    async getWikipediaPageInfo(title) {
        // This method is kept for compatibility but now uses Wikidata
        try {
            console.log('Getting detailed info for:', title);
            
            // Search for the specific show to get its Wikidata ID
            const results = await this.searchWikipedia(title);
            
            if (results.length > 0) {
                const exactMatch = results.find(r => 
                    r.title.toLowerCase() === title.toLowerCase()
                );
                return exactMatch || results[0];
            }
            
            return null;
        } catch (error) {
            console.warn('Error fetching detailed show info:', error);
            return null;
        }
    }

    // Check if the content is about a theatre show
    isTheatreShow(pageInfo) {
        const text = (pageInfo.synopsis || '').toLowerCase();
        const title = (pageInfo.title || '').toLowerCase();
        
        const theatreKeywords = [
            'musical', 'play', 'theatre', 'theater', 'broadway', 'west end',
            'opera', 'operetta', 'show', 'production', 'stage', 'drama'
        ];
        
        return theatreKeywords.some(keyword => 
            text.includes(keyword) || title.includes(keyword)
        );
    }

    // Extract composer information from text
    extractComposer(text) {
        if (!text) return '';
        
        const composerPatterns = [
            /music by ([^,\n.]+)/i,
            /composed by ([^,\n.]+)/i,
            /composer:?\s*([^,\n.]+)/i
        ];
        
        for (const pattern of composerPatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        
        return '';
    }

    // Extract lyricist information from text
    extractLyricist(text) {
        if (!text) return '';
        
        const lyricistPatterns = [
            /lyrics by ([^,\n.]+)/i,
            /lyricist:?\s*([^,\n.]+)/i,
            /words by ([^,\n.]+)/i
        ];
        
        for (const pattern of lyricistPatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        
        return '';
    }

    // Remove duplicate results
    deduplicateResults(results) {
        const seen = new Set();
        return results.filter(show => {
            const key = show.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    // Search demo shows when APIs are unavailable
    searchDemoShows(query) {
        const lowerQuery = query.toLowerCase();
        return this.demoShows.filter(show =>
            show.title.toLowerCase().includes(lowerQuery) ||
            show.composer.toLowerCase().includes(lowerQuery) ||
            show.lyricist.toLowerCase().includes(lowerQuery)
        ).slice(0, 5);
    }

    // Enhanced demo shows using comprehensive musical database
    getEnhancedDemoShows(query) {
        console.log('Getting comprehensive musical database for:', query);
        
        // Use the new comprehensive musical database
        if (window.MusicalDatabase) {
            const results = window.MusicalDatabase.searchMusicals(query);
            console.log('Musical database results:', results.length);
            return results.slice(0, 8);
        }
        
        // Fallback to basic demo data if musical database not loaded
        console.log('Musical database not available, using basic fallback');
        return this.searchDemoShows(query);
    }

    // Get detailed show information
    async getShowDetails(showId, source = 'local') {
        if (source === 'local') {
            return window.db.getShowById(showId);
        }
        
        // For external sources, try to fetch more details
        if (source === 'wikipedia') {
            // Already have the details from search
            return null;
        }
        
        return null;
    }

    // Demo show data for offline functionality (minimal fallback only)
    getDemoShows() {
        return [
            {
                id: 'demo_hamilton_fallback',
                title: 'Hamilton',
                synopsis: 'Hip-hop musical biography of Alexander Hamilton',
                composer: 'Lin-Manuel Miranda',
                lyricist: 'Lin-Manuel Miranda',
                genre: 'Musical',
                premiere_date: '2015-08-06',
                source: 'demo'
            },
            {
                id: 'demo_phantom_fallback',
                title: 'The Phantom of the Opera',
                synopsis: 'Musical about a mysterious figure who haunts the Paris Opera House',
                composer: 'Andrew Lloyd Webber',
                lyricist: 'Charles Hart, Richard Stilgoe',
                genre: 'Musical',
                premiere_date: '1986-10-09',
                source: 'demo'
            },
            {
                id: 'demo_wicked_fallback',
                title: 'Wicked',
                synopsis: 'Musical about the witches of Oz before Dorothy arrives',
                composer: 'Stephen Schwartz',
                lyricist: 'Stephen Schwartz',
                genre: 'Musical',
                premiere_date: '2003-10-30',
                source: 'demo'
            }
        ];
    }

    // Save selected show to local database
    async saveShowToDatabase(showData) {
        // Check if show already exists
        const existingShow = window.db.findShowByTitle(showData.title);
        if (existingShow) {
            return existingShow;
        }

        // Add new show to database
        return window.db.addShow(showData);
    }

    // Rate limiting for API calls
    async makeApiCall(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'User-Agent': 'StageLog-App/1.0',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }

    // Check API availability
    async checkApiAvailability() {
        const status = {
            wikipedia: false,
            tmdb: false
        };

        try {
            const wikiResponse = await fetch(`${this.apis.wikipedia.baseUrl}/page/summary/Hamilton_(musical)`, {
                method: 'HEAD'
            });
            status.wikipedia = wikiResponse.ok;
        } catch (error) {
            console.warn('Wikipedia API not available:', error);
        }

        // Add TMDb check if API key is available
        if (this.apis.tmdb.apiKey) {
            try {
                const tmdbResponse = await fetch(`${this.apis.tmdb.baseUrl}/configuration?api_key=${this.apis.tmdb.apiKey}`, {
                    method: 'HEAD'
                });
                status.tmdb = tmdbResponse.ok;
            } catch (error) {
                console.warn('TMDb API not available:', error);
            }
        }

        return status;
    }
}

// Initialize global API instance
window.showAPI = new ShowAPI();
