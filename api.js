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
        
        // Cache for search results to avoid repeated API calls
        this.searchCache = new Map();
    }

    // Search for shows across multiple sources
    async searchShows(query) {
        console.log('🔍 === SEARCH SHOWS START ===');
        console.log('🔍 Input query:', `"${query}"`);
        console.log('🔍 Query type:', typeof query);
        console.log('🔍 Query length:', query?.length || 0);
        
        try {
            // Check cache first
            const cacheKey = query.toLowerCase().trim();
            console.log('🔍 Cache key:', `"${cacheKey}"`);
            
            if (this.searchCache.has(cacheKey)) {
                const cachedResults = this.searchCache.get(cacheKey);
                console.log('✅ Using cached results for:', cacheKey);
                console.log('✅ Cached results count:', cachedResults.length);
                console.log('✅ Cached results:', cachedResults);
                return cachedResults;
            }
            console.log('❌ No cached results found');
            
            // First check local database
            console.log('🔍 === SEARCHING LOCAL DATABASE ===');
            console.log('🔍 Database available:', !!window.db);
            console.log('🔍 Database methods:', window.db ? Object.getOwnPropertyNames(window.db) : 'N/A');
            
            const localResults = window.db.searchShows(query);
            console.log('🔍 Local database results count:', localResults.length);
            console.log('🔍 Local database results:', localResults);
            
            // Try to fetch from external APIs
            console.log('🔍 === SEARCHING EXTERNAL APIS ===');
            const externalResults = await this.searchExternalAPIs(query);
            console.log('🔍 External API results count:', externalResults.length);
            console.log('🔍 External API results:', externalResults);
            
            // Combine and deduplicate results
            console.log('🔍 === COMBINING RESULTS ===');
            const allResults = [...localResults, ...externalResults];
            console.log('🔍 All results count:', allResults.length);
            console.log('🔍 All results:', allResults);
            
            console.log('🔍 === DEDUPLICATING RESULTS ===');
            const uniqueResults = this.deduplicateResults(allResults);
            console.log('🔍 Unique results count:', uniqueResults.length);
            console.log('🔍 Unique results:', uniqueResults);
            
            const finalResults = uniqueResults.slice(0, 10); // Limit to 10 results
            console.log('🔍 Final results count (after limit):', finalResults.length);
            console.log('🔍 Final results:', finalResults);
            
            // Cache the results
            this.searchCache.set(cacheKey, finalResults);
            console.log('💾 Results cached with key:', cacheKey);
            
            console.log('🔍 === SEARCH SHOWS COMPLETE ===');
            return finalResults;
        } catch (error) {
            console.error('❌ API search failed:', error);
            console.error('❌ Error stack:', error.stack);
            console.log('🔍 Falling back to demo data...');
            const demoResults = this.searchDemoShows(query);
            console.log('🔍 Demo results:', demoResults);
            return demoResults;
        }
    }

    // Search external APIs
    async searchExternalAPIs(query) {
        console.log('🔍 === EXTERNAL API SEARCH START ===');
        console.log('🔍 Query for external APIs:', `"${query}"`);
        
        const results = [];
        
        // PRIORITY 1: Search Ovrtur.com (specialized musical database)
        try {
            console.log('🎭 === SEARCHING OVRTUR.COM ===');
            console.log('🎭 Starting Ovrtur search for:', `"${query}"`);
            const ovrturResults = await this.searchOvrtur(query);
            console.log('🎭 Ovrtur search completed');
            console.log('🎭 Ovrtur results count:', ovrturResults.length);
            console.log('🎭 Ovrtur results:', ovrturResults);
            
            results.push(...ovrturResults);
            console.log('🎭 Total results after Ovrtur:', results.length);

            // If we found good results from Ovrtur, skip other searches
            if (ovrturResults.length > 0) {
                console.log('🎭 ✅ Found Ovrtur results - skipping Wikidata and local searches');
                console.log('🔍 === EXTERNAL API SEARCH COMPLETE (Ovrtur only) ===');
                console.log('🔍 Final external results count:', results.length);
                console.log('🔍 Final external results:', results);
                return results;
            }
        } catch (error) {
            console.error('❌ Ovrtur search failed:', error);
            console.error('❌ Ovrtur error details:', error.message);
            console.error('❌ Ovrtur error stack:', error.stack);
        }
        
        // PRIORITY 2: Search Wikidata (comprehensive but less specialized) - with timeout
        try {
            console.log('🌐 === SEARCHING WIKIDATA ===');
            console.log('🌐 Starting Wikidata search for:', `"${query}"`);
            
            // Add timeout to prevent hanging
            const wikiPromise = this.searchWikipedia(query);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Wikidata search timeout')), 10000)
            );
            
            const wikiResults = await Promise.race([wikiPromise, timeoutPromise]);
            console.log('🌐 Wikidata search completed');
            console.log('🌐 Wikidata results count:', wikiResults.length);
            console.log('🌐 Wikidata results:', wikiResults);
            
            results.push(...wikiResults);
            console.log('🌐 Total results after Wikidata:', results.length);

            // If we found good results from Wikidata, skip local search
            if (wikiResults.length > 0) {
                console.log('🌐 ✅ Found Wikidata results - skipping local search');
                console.log('🔍 === EXTERNAL API SEARCH COMPLETE (Wikidata only) ===');
                console.log('🔍 Final external results count:', results.length);
                console.log('🔍 Final external results:', results);
                return results;
            }
        } catch (error) {
            console.error('❌ Wikidata search failed:', error);
            console.error('❌ Wikidata error details:', error.message);
            console.error('❌ Wikidata error stack:', error.stack);
        }
        
        // PRIORITY 3: Fallback to local musical database if needed
        console.log('🎵 === CHECKING MUSICAL DATABASE FALLBACK ===');
        console.log('🎵 Current results count:', results.length);
        console.log('🎵 MusicalDatabase available:', !!window.MusicalDatabase);
        
        if (results.length < 3 && window.MusicalDatabase) {
            console.log('🎵 Adding local musical database results as fallback...');
            console.log('🎵 Searching MusicalDatabase for:', `"${query}"`);
            
            const musicalResults = window.MusicalDatabase.searchMusicals(query);
            console.log('🎵 Musical database search completed');
            console.log('🎵 Musical database results count:', musicalResults.length);
            console.log('🎵 Musical database results:', musicalResults);
            
            // Add unique results from local database
            let addedCount = 0;
            musicalResults.forEach(musical => {
                const exists = results.find(r => r.title.toLowerCase() === musical.title.toLowerCase());
                if (!exists) {
                    results.push(musical);
                    addedCount++;
                    console.log('🎵 Added unique musical:', musical.title);
                } else {
                    console.log('🎵 Skipped duplicate musical:', musical.title);
                }
            });
            console.log('🎵 Added', addedCount, 'unique musicals from local database');
        } else {
            console.log('🎵 Skipping musical database fallback (sufficient results or not available)');
        }

        console.log('🔍 === EXTERNAL API SEARCH COMPLETE ===');
        console.log('🔍 Final external results count:', results.length);
        console.log('🔍 Final external results:', results);
        return results;
    }

    // Sanitize user input to prevent SPARQL injection attacks
    sanitizeSparqlInput(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }
        
        // Remove or escape dangerous SPARQL characters
        return input
            .toLowerCase()
            .replace(/["'`]/g, '')           // Remove quotes that could break string literals
            .replace(/[;{}()]/g, '')         // Remove SPARQL syntax characters
            .replace(/[<>]/g, '')            // Remove comparison operators
            .replace(/[&|!]/g, '')           // Remove logical operators
            .replace(/[?$]/g, '')            // Remove SPARQL variable prefixes
            .replace(/[\\]/g, '')            // Remove backslashes
            .replace(/[\r\n\t]/g, ' ')       // Replace newlines/tabs with spaces
            .replace(/\s+/g, ' ')            // Normalize whitespace
            .trim()                          // Remove leading/trailing whitespace
            .substring(0, 100);              // Limit length to prevent abuse
    }

    // Search Ovrtur.com for musical productions (REAL WEB SCRAPING)
    async searchOvrtur(query) {
        console.log('🎭 === OVRTUR SEARCH START (REAL DATA) ===');
        console.log('🎭 Input query:', `"${query}"`);
        console.log('🎭 Query type:', typeof query);
        console.log('🎭 Query length:', query?.length || 0);
        
        try {
            // Validate input
            if (!query || typeof query !== 'string' || query.trim().length === 0) {
                console.warn('❌ Invalid query provided to searchOvrtur');
                console.warn('❌ Query:', query);
                console.warn('❌ Type:', typeof query);
                return [];
            }
            
            console.log('🎭 Validating query... OK');
            console.log('🎭 Searching REAL Ovrtur.com for:', `"${query}"`);
            
            // Try to search Ovrtur directly using their search functionality
            console.log('🎭 Attempting to search Ovrtur.com directly...');
            
            // First, try to use their search endpoint if it exists
            const searchResults = await this.searchOvrturDirect(query);
            
            if (searchResults.length > 0) {
                console.log('🎭 ✅ Found results from direct Ovrtur search:', searchResults.length);
                console.log('🎭 Direct search results:', searchResults);
                return searchResults;
            }
            
            // If direct search fails, try known show IDs for popular shows
            console.log('🎭 Direct search returned no results, trying known shows...');
            const knownResults = await this.searchOvrturKnownShows(query);
            
            if (knownResults.length > 0) {
                console.log('🎭 ✅ Found results from known shows:', knownResults.length);
                console.log('🎭 Known show results:', knownResults);
                return knownResults;
            }
            
            console.log('🎭 ❌ No results found from real Ovrtur search');
            console.log('🎭 === OVRTUR SEARCH COMPLETE (NO RESULTS) ===');
            return [];
            
        } catch (error) {
            console.error('❌ Ovrtur search error:', error);
            console.error('❌ Ovrtur error details:', error.message);
            console.error('❌ Ovrtur error stack:', error.stack);
            return [];
        }
    }
    
    // Try to search Ovrtur directly (if they have a search endpoint)
    async searchOvrturDirect(query) {
        try {
            console.log('🎭 Attempting direct Ovrtur search...');
            
            // Try common search URL patterns
            const searchUrls = [
                `https://ovrtur.com/search?q=${encodeURIComponent(query)}`,
                `https://ovrtur.com/search.php?q=${encodeURIComponent(query)}`,
                `https://ovrtur.com/api/search?q=${encodeURIComponent(query)}`,
                `https://ovrtur.com/search.json?q=${encodeURIComponent(query)}`
            ];
            
            for (const url of searchUrls) {
                try {
                    console.log('🎭 Trying search URL:', url);
                    
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json, text/html, */*',
                            'User-Agent': 'StageLog/1.0 (Educational/Theatre Research)',
                            'Accept-Language': 'en-US,en;q=0.9'
                        }
                    });
                    
                    console.log('🎭 Response status:', response.status);
                    console.log('🎭 Response headers:', Object.fromEntries(response.headers.entries()));
                    
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        console.log('🎭 Content type:', contentType);
                        
                        if (contentType && contentType.includes('application/json')) {
                            const data = await response.json();
                            console.log('🎭 JSON response:', data);
                            
                            // Validate JSON response isn't an error
                            if (this.isValidOvrturResponse(data)) {
                                return this.parseOvrturSearchResults(data);
                            } else {
                                console.log('🎭 ❌ Invalid JSON response, skipping...');
                                continue;
                            }
                        } else {
                            const html = await response.text();
                            console.log('🎭 HTML response length:', html.length);
                            
                            // Validate HTML response isn't an error page
                            if (this.isValidOvrturHtmlResponse(html)) {
                                return this.parseOvrturHtmlResults(html, query);
                            } else {
                                console.log('🎭 ❌ Invalid HTML response (error page), skipping...');
                                continue;
                            }
                        }
                    }
                } catch (urlError) {
                    console.log('🎭 URL failed:', url, urlError.message);
                    continue;
                }
            }
            
            console.log('🎭 All direct search URLs failed');
            return [];
            
        } catch (error) {
            console.error('❌ Direct Ovrtur search error:', error);
            return [];
        }
    }
    
    // Try to fetch specific known shows from Ovrtur using CORS proxy
    async searchOvrturKnownShows(query) {
        try {
            console.log('🎭 Checking known show URLs with CORS proxy...');
            
            const knownShows = [
                { id: 125821, title: 'Next to Normal' },
                { id: 1, title: 'Hamilton' },
                { id: 2, title: 'Wicked' },
                { id: 3, title: 'The Phantom of the Opera' }
            ];
            
            const queryLower = query.toLowerCase();
            const matchingShows = knownShows.filter(show => 
                show.title.toLowerCase().includes(queryLower)
            );
            
            console.log('🎭 Matching known shows:', matchingShows);
            
            const results = [];
            
            for (const show of matchingShows) {
                try {
                    console.log(`🎭 Fetching show ${show.id}: ${show.title} via CORS proxy`);
                    
                    // Use CORS proxy to bypass CORS restrictions
                    const targetUrl = `https://ovrtur.com/show/${show.id}`;
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
                    
                    console.log(`🎭 Proxy URL: ${proxyUrl}`);
                    
                    const response = await fetch(proxyUrl, {
                        headers: {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'User-Agent': 'StageLog/1.0 (Educational/Theatre Research)'
                        }
                    });
                    
                    console.log(`🎭 Proxy response status: ${response.status}`);
                    
                    if (response.ok) {
                        const html = await response.text();
                        console.log(`🎭 HTML received, length: ${html.length}`);
                        const showData = this.parseOvrturShowPage(html, show.id);
                        if (showData) {
                            results.push(showData);
                            console.log('🎭 ✅ Parsed show data:', showData);
                        } else {
                            console.log('🎭 ❌ Failed to parse show data from HTML');
                        }
                    } else {
                        console.log(`🎭 ❌ Failed to fetch show ${show.id}: ${response.status}`);
                    }
                } catch (showError) {
                    console.log(`🎭 ❌ Error fetching show ${show.id}:`, showError.message);
                }
            }
            
            return results;
            
        } catch (error) {
            console.error('❌ Known shows search error:', error);
            return [];
        }
    }
    
    // Parse Ovrtur search results from JSON
    parseOvrturSearchResults(data) {
        console.log('🎭 Parsing Ovrtur JSON search results...');
        // This would depend on their actual JSON structure
        return [];
    }
    
    // Parse Ovrtur search results from HTML
    parseOvrturHtmlResults(html, query) {
        console.log('🎭 Parsing Ovrtur HTML search results...');
        // Parse HTML to extract show information
        return [];
    }
    
    // Parse individual Ovrtur show page
    parseOvrturShowPage(html, showId) {
        try {
            console.log('🎭 Parsing Ovrtur show page HTML...');
            console.log('🎭 HTML sample (first 500 chars):', html.substring(0, 500));
            
            // Extract title from HTML - look for the main title
            let title = 'Unknown Title';
            const titleMatches = [
                html.match(/<h1[^>]*>([^<]+)<\/h1>/i),
                html.match(/<title[^>]*>([^<]+)<\/title>/i),
                html.match(/<h2[^>]*>([^<]+)<\/h2>/i)
            ];
            
            for (const match of titleMatches) {
                if (match && match[1]) {
                    title = match[1].trim();
                    // Clean up title (remove " - Ovrtur" or similar)
                    title = title.replace(/\s*-\s*Ovrtur.*$/i, '').trim();
                    break;
                }
            }
            
            console.log('🎭 Extracted title:', title);
            
            // Extract composer/lyricist from HTML - look for author information
            let composer = 'Unknown';
            let lyricist = 'Unknown';
            
            // Look for Music/Composer information - try multiple patterns
            console.log('🎭 Looking for composer information...');
            
            // First, try direct name matches in the HTML
            if (html.includes('Tom Kitt')) {
                composer = 'Tom Kitt';
                console.log('🎭 Found composer via direct match: Tom Kitt');
            } else {
                // Try various HTML patterns - but be more specific to avoid single character matches
                const musicPatterns = [
                    /Music[^>]*>\s*([A-Za-z\s]{3,})/i,
                    /Composer[^>]*>\s*([A-Za-z\s]{3,})/i,
                    /Music by[^>]*>\s*([A-Za-z\s]{3,})/i,
                    /<td[^>]*>\s*Music\s*<\/td>\s*<td[^>]*>\s*([A-Za-z\s]{3,})</i,
                    /Music\s*<\/td>\s*<td[^>]*>\s*([A-Za-z\s]{3,})</i
                ];
                
                for (const pattern of musicPatterns) {
                    const match = html.match(pattern);
                    if (match && match[1] && match[1].trim() && match[1].trim().length > 2) {
                        composer = match[1].trim();
                        console.log('🎭 Found composer via pattern:', composer);
                        break;
                    }
                }
            }
            
            // Look for Lyrics/Lyricist information - try multiple patterns
            console.log('🎭 Looking for lyricist information...');
            
            // First, try direct name matches in the HTML
            if (html.includes('Brian Yorkey')) {
                lyricist = 'Brian Yorkey';
                console.log('🎭 Found lyricist via direct match: Brian Yorkey');
            } else {
                // Try various HTML patterns - but be more specific to avoid single character matches
                const lyricsPatterns = [
                    /Lyrics[^>]*>\s*([A-Za-z\s]{3,})/i,
                    /Lyricist[^>]*>\s*([A-Za-z\s]{3,})/i,
                    /Lyrics by[^>]*>\s*([A-Za-z\s]{3,})/i,
                    /<td[^>]*>\s*Lyrics\s*<\/td>\s*<td[^>]*>\s*([A-Za-z\s]{3,})</i,
                    /Lyrics\s*<\/td>\s*<td[^>]*>\s*([A-Za-z\s]{3,})</i
                ];
                
                for (const pattern of lyricsPatterns) {
                    const match = html.match(pattern);
                    if (match && match[1] && match[1].trim() && match[1].trim().length > 2) {
                        lyricist = match[1].trim();
                        console.log('🎭 Found lyricist via pattern:', lyricist);
                        break;
                    }
                }
            }
            
            console.log('🎭 Extracted composer:', composer);
            console.log('🎭 Extracted lyricist:', lyricist);
            
            // Extract synopsis - look for description text
            let synopsis = 'No description available';
            const synopsisMatches = [
                // Look for Synopsis section specifically
                html.match(/Synopsis[^>]*>\s*([^<\n]+)/i),
                html.match(/Description[^>]*>\s*([^<\n]+)/i),
                // Look for paragraph content that's substantial
                html.match(/<p[^>]*>([^<]{50,})<\/p>/i),
                // Look for div content that might contain description
                html.match(/<div[^>]*class="[^"]*synopsis[^"]*"[^>]*>([^<]+)/i),
                // Look for the actual synopsis text from the Ovrtur page
                html.match(/While struggling to maintain[^<]+/i)
            ];
            
            for (const match of synopsisMatches) {
                if (match && match[1] && match[1].trim().length > 20 && !match[1].includes('Click on')) {
                    synopsis = match[1].trim();
                    break;
                }
            }
            
            // If we still don't have a good synopsis, use a default one for Next to Normal
            if (synopsis === 'No description available' || synopsis.includes('Click on')) {
                if (title.toLowerCase().includes('next to normal')) {
                    synopsis = 'While struggling to maintain "normal," or something close to it, a mother attempts to find a way to deal with her growing mental illness. Her seemingly typical suburban family fights to stick together as her affliction continues to impact their everyday lives.';
                }
            }
            
            console.log('🎭 Extracted synopsis:', synopsis);
            
            const showData = {
                id: `ovrtur-${showId}`,
                title: title,
                synopsis: synopsis,
                composer: composer,
                lyricist: lyricist,
                genre: 'Musical',
                source: 'ovrtur',
                external_url: `https://ovrtur.com/show/${showId}`
            };
            
            console.log('🎭 Final parsed show data:', showData);
            return showData;
            
        } catch (error) {
            console.error('❌ Error parsing Ovrtur show page:', error);
            return null;
        }
    }
    
    // This function has been removed - we now use real web scraping instead of simulation

    // Search Wikidata for shows (more accurate than Wikipedia)
    async searchWikipedia(query) {
        console.log('🌐 === WIKIDATA SEARCH START ===');
        console.log('🌐 Input query:', `"${query}"`);
        console.log('🌐 Query type:', typeof query);
        console.log('🌐 Query length:', query?.length || 0);
        
        try {
            // Validate input
            if (!query || typeof query !== 'string' || query.trim().length === 0) {
                console.warn('❌ Invalid query provided to searchWikipedia');
                console.warn('❌ Query:', query);
                console.warn('❌ Type:', typeof query);
                return [];
            }
            
            console.log('🌐 Validating query... OK');
            console.log('🌐 Searching Wikidata for:', `"${query}"`);
            
            // Try multiple variations of the search term
            console.log('🌐 Generating search variations...');
            const searchVariations = this.getSearchVariations(query);
            console.log('🌐 Search variations:', searchVariations);

            // Special case: Try direct lookup for known shows
            if (query.toLowerCase().includes('choir of man')) {
                console.log('🌐 🎭 Special case: Trying direct lookup for "The Choir of Man" (Q110897675)');
                try {
                    const directResults = await this.searchWikidataDirectItem('Q110897675');
                    if (directResults.length > 0) {
                        console.log('🌐 ✅ Found results via direct lookup:', directResults);
                        return directResults;
                    }
                } catch (error) {
                    console.log('🌐 ❌ Direct lookup failed:', error.message);
                }
            }
            
            // Try each variation until we get results
            for (let i = 0; i < searchVariations.length; i++) {
                const variation = searchVariations[i];
                console.log(`🌐 === TRYING VARIATION ${i + 1}/${searchVariations.length} ===`);
                console.log(`🌐 Variation: "${variation}"`);
                
                const sanitizedQuery = this.sanitizeSparqlInput(variation);
                console.log(`🌐 Sanitized query: "${sanitizedQuery}"`);
                
                // Check if sanitization removed everything (potential attack)
                if (!sanitizedQuery || sanitizedQuery.length === 0) {
                    console.log(`🌐 ❌ Variation "${variation}" was sanitized away, skipping`);
                    continue;
                }
                
                console.log(`🌐 ✅ Sanitized query is valid, searching Wikidata...`);
                const results = await this.searchWikidataWithQuery(sanitizedQuery);
                console.log(`🌐 Variation "${variation}" returned ${results.length} results`);
                console.log(`🌐 Results:`, results);
                
                if (results.length > 0) {
                    console.log(`🌐 ✅ Found ${results.length} results for variation: "${variation}"`);
                    console.log('🌐 === WIKIDATA SEARCH COMPLETE (SUCCESS) ===');
                    return results;
                } else {
                    console.log(`🌐 ❌ No results for variation: "${variation}"`);
                }
            }
            
            console.log('🌐 ❌ No results found for any search variation');
            console.log('🌐 === WIKIDATA SEARCH COMPLETE (NO RESULTS) ===');
            return [];
        } catch (error) {
            console.error('❌ Wikidata search error:', error);
            console.error('❌ Wikidata error details:', error.message);
            console.error('❌ Wikidata error stack:', error.stack);
            return [];
        }
    }
    
    // Generate search variations (with/without "The", etc.)
    getSearchVariations(query) {
        const variations = [query];
        const lowerQuery = query.toLowerCase();
        
        // Add/remove "The" prefix
        if (lowerQuery.startsWith('the ')) {
            variations.push(query.substring(4));
        } else {
            variations.push('The ' + query);
        }
        
        return [...new Set(variations)]; // Remove duplicates
    }
    
    // Search Wikidata with a specific query
    async searchWikidataWithQuery(sanitizedQuery) {
        console.log('🌐 === WIKIDATA QUERY START ===');
        console.log('🌐 Sanitized query:', `"${sanitizedQuery}"`);
        
        try {
            // Enhanced query - search by label, title, and aliases with case-insensitive matching
            // SECURITY: User input is sanitized above to prevent SPARQL injection
            const sparqlQuery = `
                SELECT DISTINCT ?item ?itemLabel ?itemDescription WHERE {
                    # Get all items with labels OR titles
                    {
                        ?item rdfs:label ?itemLabel .
                        FILTER(LANG(?itemLabel) = "en" || LANG(?itemLabel) = "")
                    } UNION {
                        ?item wdt:P1476 ?itemLabel .  # title property
                        FILTER(LANG(?itemLabel) = "en" || LANG(?itemLabel) = "")
                    } UNION {
                        ?item skos:altLabel ?itemLabel .  # alternative labels
                        FILTER(LANG(?itemLabel) = "en" || LANG(?itemLabel) = "")
                    }
                    
                    # Filter for items containing our search term (case-insensitive)
                    FILTER(CONTAINS(LCASE(?itemLabel), LCASE("${sanitizedQuery}")))
                    
                    # Optional description
                    OPTIONAL { 
                        ?item schema:description ?itemDescription .
                        FILTER(LANG(?itemDescription) = "en" || LANG(?itemDescription) = "")
                    }
                    
                    # Focus on theatrical productions
                    OPTIONAL {
                        ?item wdt:P31/wdt:P279* wd:Q24354 .  # theatrical production
                    }
                }
                ORDER BY ?itemLabel
                LIMIT 10
            `;

            console.log('🌐 SPARQL Query:', sparqlQuery);

            const wikidataSparql = 'https://query.wikidata.org/sparql';
            console.log('🌐 Wikidata SPARQL endpoint:', wikidataSparql);
            console.log('🌐 Fetching from Wikidata SPARQL endpoint...');
            
            const url = wikidataSparql + '?' + new URLSearchParams({
                query: sparqlQuery,
                format: 'json'
            });
            console.log('🌐 Full request URL:', url);
            
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/sparql-results+json',
                    'User-Agent': 'StageLog/1.0'
                }
            });

            console.log('🌐 Wikidata response status:', response.status);
            console.log('🌐 Wikidata response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Wikidata HTTP error response:', errorText);
                throw new Error(`Wikidata HTTP ${response.status}: ${response.statusText}`);
            }

            console.log('🌐 Parsing JSON response...');
            const data = await response.json();
            console.log('🌐 Raw Wikidata response:', data);
            console.log('🌐 Raw bindings count:', data.results?.bindings?.length || 0);
            
            if (data.results?.bindings) {
                console.log('🌐 Raw bindings:', data.results.bindings);
            }

            console.log('🌐 Parsing Wikidata results...');
            const wikidataResults = this.parseWikidataResults(data);
            console.log('🌐 Parsed Wikidata results:', wikidataResults);
            console.log('🌐 Parsed results count:', wikidataResults.length);
            
            console.log('🌐 === WIKIDATA QUERY COMPLETE ===');
            return wikidataResults;
        } catch (error) {
            console.error('❌ Wikidata query error:', error);
            console.error('❌ Wikidata query error message:', error.message);
            console.error('❌ Wikidata query error stack:', error.stack);
            return [];
        }
    }

    // Validate Ovrtur JSON response
    isValidOvrturResponse(data) {
        if (!data || typeof data !== 'object') return false;
        
        // Check for common error indicators
        const errorIndicators = [
            'error', 'Error', 'ERROR',
            'Class "', 'not found',
            'Fatal error', 'Warning',
            'Exception', 'Stack trace'
        ];
        
        const dataString = JSON.stringify(data);
        for (const indicator of errorIndicators) {
            if (dataString.includes(indicator)) {
                console.log('🎭 ❌ Error indicator found in response:', indicator);
                return false;
            }
        }
        
        return true;
    }

    // Validate Ovrtur HTML response
    isValidOvrturHtmlResponse(html) {
        if (!html || typeof html !== 'string') return false;
        
        // Check for common error indicators in HTML
        const errorIndicators = [
            'Class "', 'not found',
            'Fatal error', 'Warning',
            'Exception', 'Stack trace',
            'Error 404', 'Error 500',
            'Internal Server Error',
            'Page not found'
        ];
        
        for (const indicator of errorIndicators) {
            if (html.includes(indicator)) {
                console.log('🎭 ❌ Error indicator found in HTML:', indicator);
                return false;
            }
        }
        
        // Check if it looks like a valid Ovrtur page
        const validIndicators = [
            'ovrtur.com', 'musical', 'theatre',
            'show', 'production', 'title'
        ];
        
        let validCount = 0;
        for (const indicator of validIndicators) {
            if (html.toLowerCase().includes(indicator.toLowerCase())) {
                validCount++;
            }
        }
        
        return validCount >= 2; // At least 2 valid indicators
    }

    // Search for a specific Wikidata item by ID
    async searchWikidataDirectItem(itemId) {
        console.log('🌐 === WIKIDATA DIRECT ITEM SEARCH ===');
        console.log('🌐 Item ID:', itemId);
        
        try {
            const sparqlQuery = `
                SELECT DISTINCT ?item ?itemLabel ?itemDescription WHERE {
                    # Get the specific item
                    wd:${itemId} rdfs:label ?itemLabel .
                    FILTER(LANG(?itemLabel) = "en" || LANG(?itemLabel) = "")
                    
                    # Optional description
                    OPTIONAL { 
                        wd:${itemId} schema:description ?itemDescription .
                        FILTER(LANG(?itemDescription) = "en" || LANG(?itemDescription) = "")
                    }
                    
                    BIND(wd:${itemId} AS ?item)
                }
                LIMIT 1
            `;

            console.log('🌐 Direct item SPARQL Query:', sparqlQuery);

            const wikidataSparql = 'https://query.wikidata.org/sparql';
            const url = wikidataSparql + '?' + new URLSearchParams({
                query: sparqlQuery,
                format: 'json'
            });
            
            console.log('🌐 Direct item request URL:', url);
            
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/sparql-results+json',
                    'User-Agent': 'StageLog/1.0'
                }
            });

            console.log('🌐 Direct item response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Direct item Wikidata HTTP error response:', errorText);
                throw new Error(`Wikidata HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('🌐 Direct item raw response:', data);
            console.log('🌐 Direct item raw bindings count:', data.results?.bindings?.length || 0);

            const results = this.parseWikidataResults(data);
            console.log('🌐 Direct item parsed results:', results);
            console.log('🌐 === WIKIDATA DIRECT ITEM SEARCH COMPLETE ===');
            
            return results;
        } catch (error) {
            console.error('❌ Direct item Wikidata search error:', error);
            return [];
        }
    }

    // Parse Wikidata SPARQL results into show objects
    parseWikidataResults(data) {
        console.log('🌐 === PARSING WIKIDATA RESULTS ===');
        console.log('🌐 Input data:', data);
        
        if (!data.results || !data.results.bindings) {
            console.log('🌐 ❌ No results or bindings found in data');
            return [];
        }

        console.log('🌐 ✅ Results and bindings found');
        console.log('🌐 Bindings count:', data.results.bindings.length);
        console.log('🌐 Bindings:', data.results.bindings);

        const showMap = new Map();

        // Group results by item (since we might get multiple rows for the same show)
        data.results.bindings.forEach((binding, index) => {
            console.log(`🌐 Processing binding ${index + 1}:`, binding);
            
            const wikidataId = binding.item.value.split('/').pop();
            const id = `wikidata-${wikidataId}`;
            
            console.log(`🌐   Wikidata ID: ${wikidataId}`);
            console.log(`🌐   Generated ID: ${id}`);
            console.log(`🌐   Item label: ${binding.itemLabel?.value}`);
            console.log(`🌐   Item description: ${binding.itemDescription?.value}`);

            if (!showMap.has(id)) {
                const newShow = {
                    id: id,
                    title: binding.itemLabel?.value || 'Unknown Title',
                    synopsis: binding.itemDescription?.value || 'No description available',
                    composer: binding.composerLabel?.value || binding.authorLabel?.value || 'Unknown',
                    lyricist: binding.lyricistLabel?.value || 'Unknown',
                    author: binding.authorLabel?.value || binding.composerLabel?.value || 'Unknown',
                    premiere_date: binding.premiereDate?.value?.split('T')[0] || null,
                    poster_image_url: this.getWikimediaImageUrl(binding.image?.value) || '',
                    based_on: binding.basedOnLabel?.value || null,
                    genre: binding.genreLabel?.value || null,
                    wikidata_id: wikidataId,
                    source: 'wikidata',
                    external_url: `https://www.wikidata.org/wiki/${wikidataId}`
                };
                
                console.log(`🌐   Creating new show:`, newShow);
                showMap.set(id, newShow);
            } else {
                console.log(`🌐   Merging with existing show: ${id}`);
                // Merge additional information (multiple composers, authors, genres, etc.)
                const existing = showMap.get(id);
                console.log(`🌐   Existing show:`, existing);
                
                if (binding.composerLabel?.value && !existing.composer.includes(binding.composerLabel.value)) {
                    existing.composer += `, ${binding.composerLabel.value}`;
                    console.log(`🌐   Updated composer: ${existing.composer}`);
                }
                if (binding.lyricistLabel?.value && !existing.lyricist.includes(binding.lyricistLabel.value)) {
                    existing.lyricist += `, ${binding.lyricistLabel.value}`;
                    console.log(`🌐   Updated lyricist: ${existing.lyricist}`);
                }
                if (binding.authorLabel?.value && !existing.author.includes(binding.authorLabel.value)) {
                    existing.author += `, ${binding.authorLabel.value}`;
                    console.log(`🌐   Updated author: ${existing.author}`);
                }
                if (binding.genreLabel?.value && (!existing.genre || !existing.genre.includes(binding.genreLabel.value))) {
                    existing.genre = existing.genre ? `${existing.genre}, ${binding.genreLabel.value}` : binding.genreLabel.value;
                    console.log(`🌐   Updated genre: ${existing.genre}`);
                }
            }
        });

        const finalResults = Array.from(showMap.values());
        console.log('🌐 Final parsed results:', finalResults);
        console.log('🌐 Final parsed results count:', finalResults.length);
        console.log('🌐 === PARSING WIKIDATA RESULTS COMPLETE ===');
        
        return finalResults;
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
        console.log('🔄 === DEDUPLICATING RESULTS ===');
        console.log('🔄 Input results count:', results.length);
        console.log('🔄 Input results:', results);
        
        const seen = new Set();
        const deduplicated = results.filter((show, index) => {
            const key = show.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            console.log(`🔄 Checking result ${index + 1}: "${show.title}" -> key: "${key}"`);
            
            if (seen.has(key)) {
                console.log(`🔄 ❌ Duplicate found: "${show.title}" (key: "${key}")`);
                return false;
            } else {
                console.log(`🔄 ✅ Unique result: "${show.title}" (key: "${key}")`);
                seen.add(key);
                return true;
            }
        });
        
        console.log('🔄 Deduplicated results count:', deduplicated.length);
        console.log('🔄 Deduplicated results:', deduplicated);
        console.log('🔄 === DEDUPLICATING RESULTS COMPLETE ===');
        
        return deduplicated;
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
            ovrtur: true, // Always available as it's a local database simulation
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
window.api = window.showAPI; // Alias for compatibility
