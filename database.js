/**
 * StageLog Database Management System
 * 
 * Handles all data persistence using localStorage with performance optimizations.
 * Manages shows, performances, ratings, access schemes, and expense tracking.
 * 
 * Features:
 * - Client-side localStorage persistence
 * - Performance optimizations with caching
 * - Batch operations for improved performance
 * - Comprehensive expense analytics
 * - Data validation and integrity
 * 
 * @class StageLogDB
 * @version 2.0.0
 * @since 2024
 */
class StageLogDB {
    /**
     * Initialize the database and load default data
     * @constructor
     */
    constructor() {
        this.adapter = null; // Will be set later if available
        this.init();
    }
    
    // Set the database adapter for file/server mode
    setAdapter(adapter) {
        this.adapter = adapter;
        console.log('🔗 Database adapter set:', adapter.useServer ? 'Server mode' : 'localStorage mode');
    }

    init() {
        // Initialize storage if it doesn't exist (localStorage fallback)
        if (!localStorage.getItem('stagelog_shows')) {
            localStorage.setItem('stagelog_shows', JSON.stringify([]));
        }
        if (!localStorage.getItem('stagelog_performances')) {
            localStorage.setItem('stagelog_performances', JSON.stringify([]));
        }
        
        // Force refresh access schemes to get the latest data
        this.refreshAccessSchemes();
    }

    // Force refresh access schemes with latest default data
    refreshAccessSchemes() {
        localStorage.setItem('stagelog_access_schemes', JSON.stringify(this.getDefaultAccessSchemes()));
    }

    // Update existing shows with latest data from MusicalDatabase
    updateShowsWithLatestData() {
        console.log('Updating existing shows with latest database information...');
        
        // Get the latest musical database
        if (!window.MusicalDatabase) {
            console.log('Musical database not available for updates');
            return 0;
        }
        
        const latestMusicals = window.MusicalDatabase.getMusicals();
        const storedShows = this.getShows();
        let updatedCount = 0;
        
        // Update each stored show with latest data if available
        const updatedShows = storedShows.map(storedShow => {
            // Find matching show in latest database by title (case insensitive)
            const latestShow = latestMusicals.find(latest => 
                latest.title.toLowerCase() === storedShow.title.toLowerCase()
            );
            
            if (latestShow) {
                console.log(`Updating ${storedShow.title} with latest data`);
                console.log('  Old composer:', storedShow.composer);
                console.log('  New composer:', latestShow.composer);
                updatedCount++;
                
                // Merge latest data while preserving any user-added fields
                return {
                    ...storedShow,
                    composer: latestShow.composer || storedShow.composer,
                    lyricist: latestShow.lyricist || storedShow.lyricist,
                    synopsis: latestShow.synopsis || storedShow.synopsis,
                    genre: latestShow.genre || storedShow.genre,
                    premiere_date: latestShow.premiere_date || storedShow.premiere_date,
                    // Keep original source if it was user-created, otherwise update
                    source: storedShow.source === 'local' ? 'local' : (latestShow.source || storedShow.source)
                };
            }
            
            return storedShow;
        });
        
        // Save updated shows
        localStorage.setItem('stagelog_shows', JSON.stringify(updatedShows));
        
        console.log(`Updated ${updatedCount} shows with latest database information`);
        return updatedCount;
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Show Management
    getShows() {
        if (this.adapter) {
            // For now, just use localStorage even if adapter is set
            console.log('Using localStorage fallback for getShows');
        }
        return JSON.parse(localStorage.getItem('stagelog_shows') || '[]');
    }

    addShow(showData) {
        const shows = this.getShows();
        const show = {
            id: this.generateId(),
            title: showData.title,
            synopsis: showData.synopsis || '',
            composer: showData.composer || '',
            lyricist: showData.lyricist || '',
            poster_image_url: showData.poster_image_url || '',
            created_at: new Date().toISOString()
        };
        shows.push(show);
        localStorage.setItem('stagelog_shows', JSON.stringify(shows));
        return show;
    }

    getShowById(id) {
        const shows = this.getShows();
        return shows.find(show => show.id === id);
    }

    findShowByTitle(title) {
        const shows = this.getShows();
        return shows.find(show => 
            show.title.toLowerCase() === title.toLowerCase()
        );
    }

    searchShows(query) {
        const shows = this.getShows();
        const lowerQuery = query.toLowerCase();
        return shows.filter(show =>
            show.title.toLowerCase().includes(lowerQuery) ||
            show.composer.toLowerCase().includes(lowerQuery) ||
            show.lyricist.toLowerCase().includes(lowerQuery)
        );
    }

    // Performance Management
    getPerformances() {
        return JSON.parse(localStorage.getItem('stagelog_performances') || '[]');
    }

    addPerformance(performanceData) {
        const performances = this.getPerformances();
        const performance = {
            id: this.generateId(),
            show_id: performanceData.show_id,
            date_seen: performanceData.date_seen,
            theatre_name: performanceData.theatre_name,
            city: performanceData.city,
            production_type: performanceData.production_type,
            is_musical: performanceData.is_musical !== undefined ? performanceData.is_musical : true, // Default to true for backward compatibility
            notes_on_access: performanceData.notes_on_access || '',
            general_notes: performanceData.general_notes || '',
            // Expense tracking
            ticket_price: parseFloat(performanceData.ticket_price || 0),
            currency: performanceData.currency || 'GBP',
            seat_location: performanceData.seat_location || '',
            booking_fee: parseFloat(performanceData.booking_fee || 0),
            travel_cost: parseFloat(performanceData.travel_cost || 0),
            other_expenses: parseFloat(performanceData.other_expenses || 0),
            rating: {
                music_songs: parseFloat(performanceData.rating.music_songs),
                story_plot: parseFloat(performanceData.rating.story_plot),
                performance_cast: parseFloat(performanceData.rating.performance_cast),
                stage_visuals: parseFloat(performanceData.rating.stage_visuals),
                rewatch_value: parseFloat(performanceData.rating.rewatch_value),
                theatre_experience: parseFloat(performanceData.rating.theatre_experience || 0),
                programme: parseFloat(performanceData.rating.programme || 0),
                atmosphere: parseFloat(performanceData.rating.atmosphere || 0)
            },
            weighted_rating: this.calculateWeightedRating(performanceData.rating, performanceData.production_type, performanceData.is_musical),
            created_at: new Date().toISOString()
        };
        performances.push(performance);
        
        // Use batch operations for better performance
        this.batchWrite([
            { key: 'stagelog_performances', value: performances }
        ]);
        
        // Invalidate cache
        this.invalidateCache();
        
        return performance;
    }

    updatePerformance(id, performanceData) {
        const performances = this.getPerformances();
        const index = performances.findIndex(p => p.id === id);
        if (index !== -1) {
            performances[index] = {
                ...performances[index],
                ...performanceData,
                // Update expense fields
                ticket_price: parseFloat(performanceData.ticket_price || performances[index].ticket_price || 0),
                currency: performanceData.currency || performances[index].currency || 'GBP',
                seat_location: performanceData.seat_location || performances[index].seat_location || '',
                booking_fee: parseFloat(performanceData.booking_fee || performances[index].booking_fee || 0),
                travel_cost: parseFloat(performanceData.travel_cost || performances[index].travel_cost || 0),
                other_expenses: parseFloat(performanceData.other_expenses || performances[index].other_expenses || 0),
                is_musical: performanceData.is_musical !== undefined ? performanceData.is_musical : performances[index].is_musical,
                weighted_rating: this.calculateWeightedRating(performanceData.rating, performanceData.production_type, performanceData.is_musical),
                updated_at: new Date().toISOString()
            };
            localStorage.setItem('stagelog_performances', JSON.stringify(performances));
            return performances[index];
        }
        return null;
    }

    deletePerformance(id) {
        const performances = this.getPerformances();
        const filtered = performances.filter(p => p.id !== id);
        localStorage.setItem('stagelog_performances', JSON.stringify(filtered));
        return filtered.length < performances.length;
    }

    getPerformanceById(id) {
        const performances = this.getPerformances();
        return performances.find(p => p.id === id);
    }

    // Calculate weighted rating based on production type and whether it's a musical
    calculateWeightedRating(rating, productionType, isMusical = true) {
        // Different weight distributions for musicals vs non-musicals
        const musicalWeights = {
            music_songs: 0.25,         // Music and songs
            performance_cast: 0.20,    // Singing and acting
            stage_visuals: 0.20,       // Choreography, sets, costumes
            story_plot: 0.15,          // Book/script quality
            theatre_experience: 0.10,  // Overall venue experience
            programme: 0.05,           // Quality of program/playbill
            atmosphere: 0.05           // General theatre atmosphere
        };

        const nonMusicalWeights = {
            performance_cast: 0.25,    // Acting in plays
            stage_visuals: 0.20,       // Staging/design
            story_plot: 0.20,          // Story in plays
            theatre_experience: 0.15,  // Overall venue experience
            programme: 0.10,           // Quality of program/playbill
            atmosphere: 0.10           // General theatre atmosphere
        };

        const weights = isMusical ? musicalWeights : nonMusicalWeights;

        let weightedScore = 0;
        let totalWeight = 0;

        // Core ratings (always included, but different weights for musicals vs non-musicals)
        for (const [key, weight] of Object.entries(weights)) {
            if (rating[key] && rating[key] > 0) {
                weightedScore += rating[key] * weight;
                totalWeight += weight;
            }
        }

        // For Pro Shot productions, exclude in-person experience factors
        if (productionType === 'Pro Shot') {
            // Remove experience factors from the calculation for Pro Shot
            const proShotWeights = { ...weights };
            delete proShotWeights.theatre_experience;
            delete proShotWeights.programme;
            delete proShotWeights.atmosphere;
            
            // Recalculate with only the core factors
            weightedScore = 0;
            totalWeight = 0;
            for (const [key, weight] of Object.entries(proShotWeights)) {
                if (rating[key] && rating[key] > 0) {
                    weightedScore += rating[key] * weight;
                    totalWeight += weight;
                }
            }
        }

        return totalWeight > 0 ? (weightedScore / totalWeight) : 0;
    }

    // Get performances with show details
    getPerformancesWithShows() {
        const performances = this.getPerformances();
        const shows = this.getShows();
        
        return performances.map(performance => {
            const show = shows.find(s => s.id === performance.show_id);
            return {
                ...performance,
                show: show || { title: 'Unknown Show', poster_image_url: '' }
            };
        });
    }

    // Filter and sort performances
    getFilteredPerformances(filters = {}) {
        let performances = this.getPerformancesWithShows();

        // Text search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            performances = performances.filter(p => 
                p.show.title.toLowerCase().includes(searchLower) ||
                p.theatre_name.toLowerCase().includes(searchLower) ||
                p.city.toLowerCase().includes(searchLower)
            );
        }

        // City filter
        if (filters.city) {
            performances = performances.filter(p => p.city === filters.city);
        }

        // Date range filter
        if (filters.dateFrom) {
            performances = performances.filter(p => p.date_seen >= filters.dateFrom);
        }
        if (filters.dateTo) {
            performances = performances.filter(p => p.date_seen <= filters.dateTo);
        }

        // Sort
        if (filters.sort) {
            const [field, direction] = filters.sort.split('-');
            performances.sort((a, b) => {
                let aVal, bVal;
                
                switch (field) {
                    case 'date':
                        aVal = new Date(a.date_seen);
                        bVal = new Date(b.date_seen);
                        break;
                    case 'rating':
                        aVal = a.weighted_rating;
                        bVal = b.weighted_rating;
                        break;
                    case 'title':
                        aVal = a.show.title.toLowerCase();
                        bVal = b.show.title.toLowerCase();
                        break;
                    default:
                        return 0;
                }

                if (direction === 'desc') {
                    return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
                } else {
                    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                }
            });
        }

        return performances;
    }

    // Get unique cities for filter dropdown
    getUniqueCities() {
        const performances = this.getPerformances();
        const cities = [...new Set(performances.map(p => p.city))];
        return cities.sort();
    }

    // Separate past and upcoming performances
    getPastPerformances(filters = {}) {
        const today = new Date().toISOString().split('T')[0];
        return this.getFilteredPerformances({
            ...filters,
            dateTo: today
        }).filter(p => p.date_seen < today);
    }

    getUpcomingPerformances(filters = {}) {
        const today = new Date().toISOString().split('T')[0];
        return this.getFilteredPerformances({
            ...filters,
            dateFrom: today
        }).filter(p => p.date_seen >= today);
    }

    // Access Schemes Management
    getAccessSchemes() {
        return JSON.parse(localStorage.getItem('stagelog_access_schemes') || '[]');
    }

    addAccessScheme(schemeData) {
        const schemes = this.getAccessSchemes();
        const scheme = {
            id: this.generateId(),
            venue_name: schemeData.venue_name,
            location: schemeData.location,
            companion_policy: schemeData.companion_policy || '',
            conditions_proof: schemeData.conditions_proof || '',
            how_to_book: schemeData.how_to_book || '',
            created_at: new Date().toISOString()
        };
        schemes.push(scheme);
        localStorage.setItem('stagelog_access_schemes', JSON.stringify(schemes));
        return scheme;
    }

    getFilteredAccessSchemes(filters = {}) {
        let schemes = this.getAccessSchemes();

        // Venue search
        if (filters.venue) {
            const venueLower = filters.venue.toLowerCase();
            schemes = schemes.filter(s => 
                s.venue_name.toLowerCase().includes(venueLower)
            );
        }

        // Location filter
        if (filters.location) {
            schemes = schemes.filter(s => s.location === filters.location);
        }

        return schemes.sort((a, b) => a.venue_name.localeCompare(b.venue_name));
    }

    getUniqueLocations() {
        const schemes = this.getAccessSchemes();
        const locations = [...new Set(schemes.map(s => s.location))];
        return locations.sort();
    }

    // Default access schemes data
    getDefaultAccessSchemes() {
        return [
            {
                venue_name: "ATG Theatres (Apollo Victoria, Lyceum, Duke of York's, Fortune, Harold Pinter, Piccadilly, Phoenix, Playhouse, Savoy, Ambassadors)",
                location: "London",
                companion_policy: "1 free Essential Companion ticket",
                conditions_proof: "Free ATG Access Membership + proof (Access Card +1, PIP, DLA, etc.)",
                how_to_book: "Online (with Access account) or ATG Access Line"
            },
            {
                venue_name: "Delfont Mackintosh Theatres (Prince Edward, Prince of Wales, Gielgud, Noël Coward, Novello, Sondheim, Victoria Palace, Wyndham's)",
                location: "London",
                companion_policy: "1 free Essential Companion ticket",
                conditions_proof: "DMT Access Register (free, 3 yrs) or Nimbus Access Card +1",
                how_to_book: "Online (once registered) or DMT Access Line"
            },
            {
                venue_name: "Nimax Theatres (Apollo (Shaftesbury Ave), Duchess, Garrick, Lyric, Palace, Vaudeville, @sohoplace)",
                location: "London",
                companion_policy: "50% off for disabled patron + 1 companion (≈ \"carer goes free\")",
                conditions_proof: "Declare need; Access Card +1 or disability proof accepted",
                how_to_book: "Online (select \"Access rate\") or Nimax Access Team"
            },
            {
                venue_name: "LW Theatres (Drury Lane, Palladium, His Majesty's, Cambridge, Gillian Lynne, Adelphi)",
                location: "London",
                companion_policy: "1 free Essential Companion ticket",
                conditions_proof: "LW Access Scheme or Access Card +1",
                how_to_book: "Online (logged-in Access member) or Box Office"
            },
            {
                venue_name: "Nederlander Theatres (Dominion, Aldwych)",
                location: "London",
                companion_policy: "50% off disabled patron + 1 companion",
                conditions_proof: "Nederlander Access List or Access Card +1",
                how_to_book: "Online (with Access List) or Box Office"
            },
            {
                venue_name: "Trafalgar Entertainment (Trafalgar Theatre)",
                location: "London",
                companion_policy: "1 free Essential Companion ticket",
                conditions_proof: "TEG Access Membership or Access form; Access Card accepted",
                how_to_book: "Box Office / Access Line"
            },
            {
                venue_name: "Theatre Royal Haymarket",
                location: "London",
                companion_policy: "Limited free carer tickets (excl. premium seats)",
                conditions_proof: "Access Card +1 or proof of need",
                how_to_book: "Box Office only"
            },
            {
                venue_name: "Criterion Theatre",
                location: "London",
                companion_policy: "Free/discounted companion (at same rate as access patron)",
                conditions_proof: "Inform Box Office; Access Card accepted",
                how_to_book: "Box Office"
            },
            {
                venue_name: "Arts Theatre",
                location: "London",
                companion_policy: "1 free companion ticket",
                conditions_proof: "Request via Box Office",
                how_to_book: "Phone / in person"
            },
            {
                venue_name: "St Martin's Theatre (The Mousetrap)",
                location: "London",
                companion_policy: "Free companion / reduced rate",
                conditions_proof: "Inform Box Office; Access Card accepted",
                how_to_book: "Box Office only"
            },
            {
                venue_name: "National Theatre (Olivier, Lyttelton, Dorfman)",
                location: "London",
                companion_policy: "Adjusted price for patron + 1 companion (often free or low-cost)",
                conditions_proof: "NT Access List (free)",
                how_to_book: "Online (Access account) or NT Access Line"
            },
            {
                venue_name: "Barbican (Barbican Theatre & Concert Hall)",
                location: "London",
                companion_policy: "1 free companion ticket",
                conditions_proof: "Barbican Access Membership",
                how_to_book: "Online (auto £0 companion) or Box Office"
            },
            {
                venue_name: "Shakespeare's Globe (Globe Theatre, Sam Wanamaker Playhouse)",
                location: "London",
                companion_policy: "Reduced price for patron + 1 companion (often free companion)",
                conditions_proof: "Globe Access Scheme",
                how_to_book: "Online / Access Line"
            },
            {
                venue_name: "Old Vic",
                location: "London",
                companion_policy: "Patron + 1 companion at flat £20 each",
                conditions_proof: "Old Vic Access Membership",
                how_to_book: "Online / Box Office"
            },
            {
                venue_name: "Young Vic",
                location: "London",
                companion_policy: "1 free companion ticket (limited per show)",
                conditions_proof: "Inform Box Office; light proof may be requested",
                how_to_book: "Online / Box Office"
            },
            {
                venue_name: "Royal Court",
                location: "London",
                companion_policy: "1 free companion ticket",
                conditions_proof: "Request via Box Office; Access Card accepted",
                how_to_book: "Phone / in person"
            },
            {
                venue_name: "Donmar Warehouse",
                location: "London",
                companion_policy: "1 free companion ticket",
                conditions_proof: "Donmar Access registration or Nimbus Access Card",
                how_to_book: "Online / Box Office"
            },
            {
                venue_name: "Almeida",
                location: "London",
                companion_policy: "Patron & companion both at £19",
                conditions_proof: "Inform Box Office; Access List",
                how_to_book: "Phone / email"
            },
            {
                venue_name: "Sadler's Wells & Peacock",
                location: "London",
                companion_policy: "50% off patron + 1 companion",
                conditions_proof: "Sadler's Wells Access Scheme; Access Card accepted",
                how_to_book: "Online / Box Office"
            },
            {
                venue_name: "Regent's Park Open Air",
                location: "London",
                companion_policy: "1 free companion ticket",
                conditions_proof: "Access List registration",
                how_to_book: "Box Office"
            },
            {
                venue_name: "Bridge Theatre",
                location: "London",
                companion_policy: "1 free companion ticket",
                conditions_proof: "Bridge Access List",
                how_to_book: "Online / Box Office"
            },
            {
                venue_name: "Roundhouse",
                location: "London",
                companion_policy: "1 free companion ticket (auto with wheelchair booking)",
                conditions_proof: "Select wheelchair ticket; no extra proof needed",
                how_to_book: "Online / Box Office"
            },
            // Yorkshire and Further Afield Access Schemes
            {
                venue_name: "Leeds Heritage Theatres (Grand, City Varieties)",
                location: "Leeds",
                companion_policy: "Free Essential Companion ticket",
                conditions_proof: "Access Membership or Access Card (+1)",
                how_to_book: "Online via Access account or Box Office"
            },
            {
                venue_name: "Leeds Playhouse",
                location: "Leeds",
                companion_policy: "Free Essential Companion seat",
                conditions_proof: "Join free Priority Access Membership",
                how_to_book: "Online or Box Office once registered"
            },
            {
                venue_name: "Carriageworks Theatre",
                location: "Leeds",
                companion_policy: "2-for-1 (companion free)",
                conditions_proof: "Essential Companion Scheme; proof of disability",
                how_to_book: "Box Office only"
            },
            {
                venue_name: "Bradford Theatres (Alhambra, St George's Hall, King's Hall)",
                location: "Bradford/Ilkley",
                companion_policy: "Free Essential Companion ticket",
                conditions_proof: "Bradford Theatres Access Scheme; Access Card, PIP, DLA, etc.",
                how_to_book: "Online, phone, or in person once registered"
            },
            {
                venue_name: "Theatre Royal Wakefield",
                location: "Wakefield",
                companion_policy: "One free carer ticket",
                conditions_proof: "Evidence required; Box Office discretion",
                how_to_book: "In person or phone only"
            },
            {
                venue_name: "Lawrence Batley Theatre",
                location: "Huddersfield",
                companion_policy: "Free companion ticket",
                conditions_proof: "Declare need; may ask for supporting details",
                how_to_book: "Phone/email first time; then online"
            },
            {
                venue_name: "Victoria Theatre",
                location: "Halifax",
                companion_policy: "Free essential carer ticket",
                conditions_proof: "Inform Box Office of need",
                how_to_book: "Phone or in person"
            },
            {
                venue_name: "Harrogate Theatre",
                location: "Harrogate",
                companion_policy: "Free carer/companion ticket",
                conditions_proof: "Inform Box Office",
                how_to_book: "Phone or in person"
            },
            {
                venue_name: "York Theatre Royal",
                location: "York",
                companion_policy: "Companion at 50% discount",
                conditions_proof: "Access needs declaration",
                how_to_book: "Box Office"
            },
            {
                venue_name: "Grand Opera House (ATG)",
                location: "York",
                companion_policy: "Free Essential Companion ticket",
                conditions_proof: "ATG Access Membership; Nimbus Access Card +1",
                how_to_book: "ATG Access line or online if linked"
            },
            {
                venue_name: "Hull New Theatre & City Hall",
                location: "Hull",
                companion_policy: "Free carer ticket",
                conditions_proof: "Access Card +1 accepted",
                how_to_book: "Box Office"
            },
            {
                venue_name: "Hull Truck Theatre",
                location: "Hull",
                companion_policy: "Free companion ticket",
                conditions_proof: "Access Register or Access Card +1",
                how_to_book: "Box Office / online once registered"
            },
            {
                venue_name: "Bridlington Spa",
                location: "Bridlington",
                companion_policy: "Free essential companion",
                conditions_proof: "Proof of disability",
                how_to_book: "Box Office"
            },
            {
                venue_name: "Sheffield Theatres (Crucible & Lyceum)",
                location: "Sheffield",
                companion_policy: "Free companion ticket",
                conditions_proof: "Join Access Scheme / declare need",
                how_to_book: "Phone or Access Scheme"
            },
            {
                venue_name: "Sheffield City Hall",
                location: "Sheffield",
                companion_policy: "Free companion ticket",
                conditions_proof: "Proof required: PIP, DLA, Access Card +1, GP letter",
                how_to_book: "Access line or in person"
            },
            {
                venue_name: "Rotherham Civic Theatre",
                location: "Rotherham",
                companion_policy: "Free companion ticket",
                conditions_proof: "Inform Box Office",
                how_to_book: "Phone or in person"
            },
            {
                venue_name: "Cast Theatre",
                location: "Doncaster",
                companion_policy: "Free access companion ticket",
                conditions_proof: "Free Access Membership",
                how_to_book: "Online/phone once registered"
            },
            {
                venue_name: "Barnsley Civic",
                location: "Barnsley",
                companion_policy: "Free carer ticket (wheelchair/visually impaired patrons)",
                conditions_proof: "Request via Box Office",
                how_to_book: "Phone or in person"
            },
            {
                venue_name: "Chesterfield Theatres (Pomegranate, Winding Wheel)",
                location: "Chesterfield",
                companion_policy: "Free essential companion",
                conditions_proof: "Access register; wheelchair users must have companion",
                how_to_book: "Box Office"
            },
            {
                venue_name: "Palace Theatre & Opera House (ATG)",
                location: "Manchester",
                companion_policy: "Free Essential Companion ticket",
                conditions_proof: "ATG Access Membership (Nimbus Access Card +1)",
                how_to_book: "ATG Access line or online"
            },
            {
                venue_name: "The Lowry",
                location: "Salford",
                companion_policy: "Free Personal Assistant ticket",
                conditions_proof: "Free Access Register; Access Card accepted",
                how_to_book: "Online/phone once registered"
            },
            {
                venue_name: "Royal Exchange Theatre",
                location: "Manchester",
                companion_policy: "Both patron & companion tickets £15 each",
                conditions_proof: "Access Register; concessionary pricing",
                how_to_book: "Online/phone"
            },
            {
                venue_name: "Octagon Theatre",
                location: "Bolton",
                companion_policy: "Free companion ticket",
                conditions_proof: "Access For All scheme",
                how_to_book: "Online/phone once registered"
            },
            {
                venue_name: "Stockport Plaza",
                location: "Stockport",
                companion_policy: "Free or discounted companion ticket",
                conditions_proof: "Inform Box Office; flexible policy",
                how_to_book: "Box Office"
            },
            {
                venue_name: "Nottingham Theatre Royal & Concert Hall",
                location: "Nottingham",
                companion_policy: "Reduced/free companion ticket",
                conditions_proof: "Access Requirement Register (Nimbus Access Card +1)",
                how_to_book: "Online/phone once registered"
            },
            {
                venue_name: "Nottingham Playhouse",
                location: "Nottingham",
                companion_policy: "Free companion ticket",
                conditions_proof: "Declare need (inform Box Office)",
                how_to_book: "Phone/in person"
            },
            {
                venue_name: "Derby Theatre",
                location: "Derby",
                companion_policy: "Free essential companion",
                conditions_proof: "Assisted Access Scheme",
                how_to_book: "Box Office"
            },
            {
                venue_name: "Derby LIVE (Arena, Guildhall, etc.)",
                location: "Derby",
                companion_policy: "Free essential companion",
                conditions_proof: "Nimbus Access Card +1 or Derby Access Register",
                how_to_book: "Online/phone once registered"
            }
        ];
    }

    // Data export/import
    exportData() {
        return {
            shows: this.getShows(),
            performances: this.getPerformances(),
            access_schemes: this.getAccessSchemes(),
            exported_at: new Date().toISOString()
        };
    }

    importData(data) {
        try {
            if (data.shows) {
                localStorage.setItem('stagelog_shows', JSON.stringify(data.shows));
            }
            if (data.performances) {
                localStorage.setItem('stagelog_performances', JSON.stringify(data.performances));
            }
            if (data.access_schemes) {
                localStorage.setItem('stagelog_access_schemes', JSON.stringify(data.access_schemes));
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Clear all data (for development/testing)
    clearAllData() {
        localStorage.removeItem('stagelog_shows');
        localStorage.removeItem('stagelog_performances');
        localStorage.removeItem('stagelog_access_schemes');
        this.init();
    }

    // Performance-optimized methods with caching
    
    /**
     * Get cached statistics with automatic cache invalidation
     * @returns {Object} Statistics object with performance and expense data
     */
    getCachedStatistics() {
        const cacheKey = 'statistics';
        const cached = window.cacheManager?.get(cacheKey);
        
        if (cached) {
            console.log('📊 Statistics loaded from cache');
            return cached;
        }
        
        const stats = this.getStatistics();
        window.cacheManager?.set(cacheKey, stats, 2 * 60 * 1000); // 2 minutes cache
        console.log('📊 Statistics calculated and cached');
        return stats;
    }
    
    /**
     * Batch multiple localStorage operations
     * @param {Array} operations - Array of {key, value} objects
     */
    batchWrite(operations) {
        if (!window.batchOperations) {
            // Fallback to immediate execution
            operations.forEach(op => {
                localStorage.setItem(op.key, JSON.stringify(op.value));
            });
            return;
        }
        
        window.batchOperations.addOperation(() => {
            operations.forEach(op => {
                localStorage.setItem(op.key, JSON.stringify(op.value));
            });
        });
    }
    
    /**
     * Optimized performance search with caching
     * @param {Object} filters - Search filters
     * @returns {Array} Filtered performances
     */
    getCachedFilteredPerformances(filters = {}) {
        const cacheKey = `filtered_performances_${JSON.stringify(filters)}`;
        const cached = window.cacheManager?.get(cacheKey);
        
        if (cached) {
            console.log('🔍 Filtered performances loaded from cache');
            return cached;
        }
        
        const results = this.getFilteredPerformances(filters);
        window.cacheManager?.set(cacheKey, results, 1 * 60 * 1000); // 1 minute cache
        console.log('🔍 Performances filtered and cached');
        return results;
    }
    
    /**
     * Invalidate relevant caches when data changes
     */
    invalidateCache() {
        if (!window.cacheManager) return;
        
        // Clear statistics cache
        window.cacheManager.delete('statistics');
        
        // Clear filtered performance caches
        const stats = window.cacheManager.getStats();
        stats.keys.forEach(key => {
            if (key.startsWith('filtered_performances_')) {
                window.cacheManager.delete(key);
            }
        });
        
        console.log('🗑️ Cache invalidated');
    }

    // Get statistics including expense analytics
    getStatistics() {
        const performances = this.getPerformances();
        const shows = this.getShows();
        
        const pastPerformances = this.getPastPerformances();
        const upcomingPerformances = this.getUpcomingPerformances();
        
        const avgRating = pastPerformances.length > 0 
            ? pastPerformances.reduce((sum, p) => sum + p.weighted_rating, 0) / pastPerformances.length 
            : 0;

        const citiesVisited = [...new Set(pastPerformances.map(p => p.city))];
        const productionTypes = [...new Set(performances.map(p => p.production_type))];

        // Expense analytics
        const expenseStats = this.getExpenseStatistics();

        return {
            total_shows: shows.length,
            total_performances: performances.length,
            past_performances: pastPerformances.length,
            upcoming_performances: upcomingPerformances.length,
            average_rating: Math.round(avgRating * 100) / 100,
            cities_visited: citiesVisited.length,
            production_types: productionTypes,
            ...expenseStats
        };
    }

    // Comprehensive expense analytics
    getExpenseStatistics() {
        const performances = this.getPerformances();
        // Include ALL performances with expense data, not just past ones
        const performancesWithExpenses = performances.filter(perf => {
            const totalCost = (perf.ticket_price || 0) + (perf.booking_fee || 0) + 
                            (perf.travel_cost || 0) + (perf.other_expenses || 0);
            return totalCost > 0;
        });
        
        console.log('All performances:', performances.length);
        console.log('Performances with expenses:', performancesWithExpenses.length);
        
        let totalSpent = 0;
        let totalTickets = 0;
        let totalBookingFees = 0;
        let totalTravel = 0;
        let totalOther = 0;
        
        const spendingByYear = {};
        const spendingByCity = {};
        const spendingByGenre = {};
        let highestTicketPrice = 0;
        let lowestTicketPrice = Infinity;
        let mostExpensiveShow = null;
        let cheapestShow = null;

        performancesWithExpenses.forEach(perf => {
            const ticketPrice = perf.ticket_price || 0;
            const bookingFee = perf.booking_fee || 0;
            const travelCost = perf.travel_cost || 0;
            const otherExpenses = perf.other_expenses || 0;
            const totalPerformanceCost = ticketPrice + bookingFee + travelCost + otherExpenses;
            
            totalSpent += totalPerformanceCost;
            totalTickets += ticketPrice;
            totalBookingFees += bookingFee;
            totalTravel += travelCost;
            totalOther += otherExpenses;
            
            // Track highest/lowest
            if (ticketPrice > 0) {
                if (ticketPrice > highestTicketPrice) {
                    highestTicketPrice = ticketPrice;
                    mostExpensiveShow = perf;
                }
                if (ticketPrice < lowestTicketPrice) {
                    lowestTicketPrice = ticketPrice;
                    cheapestShow = perf;
                }
            }
            
            // Spending by year
            const year = new Date(perf.date_seen).getFullYear();
            spendingByYear[year] = (spendingByYear[year] || 0) + totalPerformanceCost;
            
            // Spending by city
            spendingByCity[perf.city] = (spendingByCity[perf.city] || 0) + totalPerformanceCost;
            
            // Spending by genre (get from show data)
            const show = this.getShowById(perf.show_id);
            if (show && show.genre) {
                spendingByGenre[show.genre] = (spendingByGenre[show.genre] || 0) + totalPerformanceCost;
            }
        });

        const avgTicketPrice = performancesWithExpenses.length > 0 ? totalTickets / performancesWithExpenses.length : 0;
        const avgTotalCost = performancesWithExpenses.length > 0 ? totalSpent / performancesWithExpenses.length : 0;

        console.log('Expense statistics calculated:', {
            total_spent: totalSpent,
            performances_with_costs: performancesWithExpenses.length,
            average_ticket_price: avgTicketPrice
        });

        return {
            expense_stats: {
                total_spent: Math.round(totalSpent * 100) / 100,
                total_tickets: Math.round(totalTickets * 100) / 100,
                total_booking_fees: Math.round(totalBookingFees * 100) / 100,
                total_travel: Math.round(totalTravel * 100) / 100,
                total_other: Math.round(totalOther * 100) / 100,
                average_ticket_price: Math.round(avgTicketPrice * 100) / 100,
                average_total_cost: Math.round(avgTotalCost * 100) / 100,
                highest_ticket_price: highestTicketPrice === 0 ? 0 : highestTicketPrice,
                lowest_ticket_price: lowestTicketPrice === Infinity ? 0 : lowestTicketPrice,
                most_expensive_show: mostExpensiveShow,
                cheapest_show: cheapestShow,
                spending_by_year: spendingByYear,
                spending_by_city: spendingByCity,
                spending_by_genre: spendingByGenre,
                performances_with_costs: performancesWithExpenses.length
            }
        };
    }

    // Get monthly spending breakdown
    getMonthlySpending(year = new Date().getFullYear()) {
        const performances = this.getPerformances().filter(perf => {
            const totalCost = (perf.ticket_price || 0) + (perf.booking_fee || 0) + 
                            (perf.travel_cost || 0) + (perf.other_expenses || 0);
            return totalCost > 0;
        });
        const monthlyData = Array(12).fill(0);
        
        performances.forEach(perf => {
            const perfDate = new Date(perf.date_seen);
            if (perfDate.getFullYear() === year) {
                const month = perfDate.getMonth();
                const totalCost = (perf.ticket_price || 0) + (perf.booking_fee || 0) + 
                                (perf.travel_cost || 0) + (perf.other_expenses || 0);
                monthlyData[month] += totalCost;
            }
        });
        
        return monthlyData.map(amount => Math.round(amount * 100) / 100);
    }
}

// Initialize global database instance
window.db = new StageLogDB();
