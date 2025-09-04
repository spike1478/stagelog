/**
 * 📊 COMPREHENSIVE STATS SYSTEM
 * Advanced analytics and insights for theatre performance tracking
 */

class StatsSystem {
    constructor() {
        this.data = {
            performances: [],
            shows: [],
            accessSchemes: []
        };
        this.stats = {};
        this.charts = {};
        this.isInitialized = false;
    }

    async init() {
        console.log('📊 Initializing Stats System...');
        await this.loadData();
        this.calculateAllStats();
        this.isInitialized = true;
        console.log('📊 Stats System Ready!');
    }

    async loadData() {
        try {
            // Load performances - try multiple possible keys
            let performancesData = localStorage.getItem('stagelog_performances') || 
                                  localStorage.getItem('performances') || 
                                  localStorage.getItem('stagelog_shows');
            
            if (performancesData) {
                this.data.performances = JSON.parse(performancesData);
            }

            // Load shows - try multiple possible keys
            let showsData = localStorage.getItem('stagelog_shows') || 
                           localStorage.getItem('shows');
            
            if (showsData) {
                this.data.shows = JSON.parse(showsData);
            }

            // Load access schemes - try multiple possible keys
            let accessData = localStorage.getItem('stagelog_access_schemes') || 
                            localStorage.getItem('accessSchemes');
            
            if (accessData) {
                this.data.accessSchemes = JSON.parse(accessData);
            }

            console.log(`📊 Loaded ${this.data.performances.length} performances, ${this.data.shows.length} shows`);
            console.log('📊 Available localStorage keys:', Object.keys(localStorage));
            
            // Debug: Show what fields are available in the first performance
            if (this.data.performances.length > 0) {
                console.log('📊 Sample performance data fields:', Object.keys(this.data.performances[0]));
                console.log('📊 Sample performance data:', this.data.performances[0]);
            }
        } catch (error) {
            console.error('📊 Error loading data:', error);
        }
    }

    calculateAllStats() {
        this.stats = {
            overview: this.calculateOverviewStats(),
            spending: this.calculateSpendingStats(),
            ratings: this.calculateRatingStats(),
            venues: this.calculateVenueStats(),
            shows: this.calculateShowStats(),
            trends: this.calculateTrendStats(),
            comparisons: this.calculateComparisonStats(),
            achievements: this.calculateAchievements(),
            insights: this.generateInsights()
        };
    }

    calculateOverviewStats() {
        const performances = this.data.performances;
        const totalShows = performances.length;
        
        // Calculate total spent using the correct field names
        const totalSpent = performances.reduce((sum, p) => {
            const ticketPrice = parseFloat(p.ticket_price) || 0;
            const bookingFee = parseFloat(p.booking_fee) || 0;
            const travelCost = parseFloat(p.travel_cost) || 0;
            const otherExpenses = parseFloat(p.other_expenses) || 0;
            return sum + ticketPrice + bookingFee + travelCost + otherExpenses;
        }, 0);
        
        // Calculate average rating using weighted_rating field
        const ratings = performances.map(p => parseFloat(p.weighted_rating) || 0).filter(r => r > 0);
        const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) : 0;
        
        // Date range - only count past shows for frequency calculation
        const today = new Date();
        const pastPerformances = performances.filter(p => new Date(p.date_seen) <= today);
        const dates = pastPerformances.map(p => new Date(p.date_seen)).filter(d => !isNaN(d)).sort();
        const firstShow = dates[0];
        const lastShow = dates[dates.length - 1];
        const daysSinceFirst = firstShow ? Math.floor((today - firstShow) / (1000 * 60 * 60 * 24)) : 0;
        
        // Frequency - only count past shows
        const pastShowsCount = pastPerformances.length;
        const showsPerMonth = daysSinceFirst > 0 ? (pastShowsCount / (daysSinceFirst / 30.44)).toFixed(1) : 0;
        const showsPerYear = daysSinceFirst > 0 ? (pastShowsCount / (daysSinceFirst / 365.25)).toFixed(1) : 0;

        return {
            totalShows,
            totalSpent: totalSpent.toFixed(2),
            avgRating: avgRating.toFixed(1),
            avgCost: totalShows > 0 ? (totalSpent / totalShows).toFixed(2) : 0,
            firstShow: firstShow ? firstShow.toLocaleDateString() : 'N/A',
            lastShow: lastShow ? lastShow.toLocaleDateString() : 'N/A',
            daysSinceFirst,
            showsPerMonth,
            showsPerYear,
            uniqueVenues: new Set(performances.map(p => p.theatre_name)).size,
            uniqueShows: new Set(performances.map(p => p.show_id)).size
        };
    }

    calculateSpendingStats() {
        const performances = this.data.performances;
        
        // Calculate total cost for each performance
        const costs = performances.map(p => {
            const ticketPrice = parseFloat(p.ticket_price) || 0;
            const bookingFee = parseFloat(p.booking_fee) || 0;
            const travelCost = parseFloat(p.travel_cost) || 0;
            const otherExpenses = parseFloat(p.other_expenses) || 0;
            return ticketPrice + bookingFee + travelCost + otherExpenses;
        }).filter(c => c > 0);
        
        if (costs.length === 0) return {};

        const sorted = costs.sort((a, b) => a - b);
        const total = costs.reduce((sum, c) => sum + c, 0);
        const avg = total / costs.length;
        const median = sorted.length % 2 === 0 
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

        // Monthly spending
        const monthlySpending = {};
        performances.forEach(p => {
            const ticketPrice = parseFloat(p.ticket_price) || 0;
            const bookingFee = parseFloat(p.booking_fee) || 0;
            const travelCost = parseFloat(p.travel_cost) || 0;
            const otherExpenses = parseFloat(p.other_expenses) || 0;
            const totalCost = ticketPrice + bookingFee + travelCost + otherExpenses;
            
            if (totalCost > 0 && p.date_seen) {
                const month = new Date(p.date_seen).toISOString().substring(0, 7);
                monthlySpending[month] = (monthlySpending[month] || 0) + totalCost;
            }
        });

        // Price ranges - fix the logic
        const ranges = {
            under25: costs.filter(c => c < 25).length,
            under50: costs.filter(c => c >= 25 && c < 50).length,
            under75: costs.filter(c => c >= 50 && c < 75).length,
            under100: costs.filter(c => c >= 75 && c < 100).length,
            over100: costs.filter(c => c >= 100).length
        };

        return {
            total: total.toFixed(2),
            average: avg.toFixed(2),
            median: median.toFixed(2),
            min: sorted[0].toFixed(2),
            max: sorted[sorted.length - 1].toFixed(2),
            monthlySpending,
            ranges,
            totalWithCost: costs.length
        };
    }

    calculateRatingStats() {
        const performances = this.data.performances;
        const ratings = performances.map(p => parseFloat(p.weighted_rating) || 0).filter(r => r > 0);
        
        if (ratings.length === 0) return {};

        // Create distribution based on rating ranges (since weighted_rating is decimal)
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(r => {
            if (r >= 4.5) distribution[5]++;
            else if (r >= 3.5) distribution[4]++;
            else if (r >= 2.5) distribution[3]++;
            else if (r >= 1.5) distribution[2]++;
            else if (r >= 0.5) distribution[1]++;
        });

        const total = ratings.reduce((sum, r) => sum + r, 0);
        const avg = total / ratings.length;
        const sorted = ratings.sort((a, b) => a - b);
        const median = sorted.length % 2 === 0 
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

        // Rating trends over time
        const ratingTrends = {};
        performances.forEach(p => {
            if (p.weighted_rating && p.date_seen) {
                const month = new Date(p.date_seen).toISOString().substring(0, 7);
                if (!ratingTrends[month]) ratingTrends[month] = [];
                ratingTrends[month].push(parseFloat(p.weighted_rating));
            }
        });

        // Calculate monthly averages
        const monthlyAverages = {};
        Object.keys(ratingTrends).forEach(month => {
            const monthRatings = ratingTrends[month];
            monthlyAverages[month] = (monthRatings.reduce((sum, r) => sum + r, 0) / monthRatings.length).toFixed(1);
        });

        return {
            average: avg.toFixed(1),
            median: median.toFixed(1),
            min: sorted[0].toFixed(1),
            max: sorted[sorted.length - 1].toFixed(1),
            distribution,
            monthlyAverages,
            totalRated: ratings.length,
            percentageRated: ((ratings.length / performances.length) * 100).toFixed(1)
        };
    }

    calculateVenueStats() {
        const performances = this.data.performances;
        const venueStats = {};

        performances.forEach(p => {
            const venue = p.theatre_name || 'Unknown';
            if (!venueStats[venue]) {
                venueStats[venue] = {
                    count: 0,
                    totalSpent: 0,
                    ratings: [],
                    shows: new Set()
                };
            }
            venueStats[venue].count++;
            
            // Calculate total spent for this performance
            const ticketPrice = parseFloat(p.ticket_price) || 0;
            const bookingFee = parseFloat(p.booking_fee) || 0;
            const travelCost = parseFloat(p.travel_cost) || 0;
            const otherExpenses = parseFloat(p.other_expenses) || 0;
            const totalCost = ticketPrice + bookingFee + travelCost + otherExpenses;
            
            venueStats[venue].totalSpent += totalCost;
            if (p.weighted_rating) venueStats[venue].ratings.push(parseFloat(p.weighted_rating));
            venueStats[venue].shows.add(p.show_id);
        });

        // Convert to array and calculate averages
        const venueArray = Object.keys(venueStats).map(venue => {
            const stats = venueStats[venue];
            const avgRating = stats.ratings.length > 0 
                ? (stats.ratings.reduce((sum, r) => sum + r, 0) / stats.ratings.length).toFixed(1)
                : 'N/A';
            
            return {
                venue,
                count: stats.count,
                totalSpent: stats.totalSpent.toFixed(2),
                avgSpent: (stats.totalSpent / stats.count).toFixed(2),
                avgRating,
                uniqueShows: stats.shows.size,
                ratings: stats.ratings
            };
        }).sort((a, b) => b.count - a.count);

        return {
            venues: venueArray,
            totalVenues: venueArray.length,
            mostFrequent: venueArray[0] || null,
            totalSpentAtVenues: venueArray.reduce((sum, v) => sum + parseFloat(v.totalSpent), 0).toFixed(2)
        };
    }

    calculateShowStats() {
        const performances = this.data.performances;
        const shows = this.data.shows;
        const showStats = {};

        // Create a lookup map for show IDs to show titles
        const showLookup = {};
        if (shows && shows.length > 0) {
            shows.forEach(show => {
                if (show.id && show.title) {
                    showLookup[show.id] = show.title;
                }
            });
        }

        performances.forEach(p => {
            // Get the show title from the lookup, or fallback to ID
            let showTitle = 'Unknown Show';
            
            if (p.show_id && showLookup[p.show_id]) {
                showTitle = showLookup[p.show_id];
            } else if (p.show_id) {
                // If we can't find the title, use a shortened ID
                showTitle = `Show ${p.show_id.substring(0, 8)}...`;
            }
            
            if (!showStats[showTitle]) {
                showStats[showTitle] = {
                    count: 0,
                    venues: new Set(),
                    ratings: [],
                    totalSpent: 0,
                    dates: [],
                    showId: p.show_id // Keep track of the original ID
                };
            }
            showStats[showTitle].count++;
            showStats[showTitle].venues.add(p.theatre_name);
            if (p.weighted_rating) showStats[showTitle].ratings.push(parseFloat(p.weighted_rating));
            
            // Calculate total spent for this performance
            const ticketPrice = parseFloat(p.ticket_price) || 0;
            const bookingFee = parseFloat(p.booking_fee) || 0;
            const travelCost = parseFloat(p.travel_cost) || 0;
            const otherExpenses = parseFloat(p.other_expenses) || 0;
            const totalCost = ticketPrice + bookingFee + travelCost + otherExpenses;
            
            showStats[showTitle].totalSpent += totalCost;
            showStats[showTitle].dates.push(new Date(p.date_seen));
        });

        // Convert to array and calculate stats
        const showArray = Object.keys(showStats).map(show => {
            const stats = showStats[show];
            const avgRating = stats.ratings.length > 0 
                ? (stats.ratings.reduce((sum, r) => sum + r, 0) / stats.ratings.length).toFixed(1)
                : 'N/A';
            
            const dateRange = stats.dates.length > 1 
                ? Math.floor((Math.max(...stats.dates) - Math.min(...stats.dates)) / (1000 * 60 * 60 * 24))
                : 0;

            return {
                show,
                count: stats.count,
                venues: stats.venues.size,
                avgRating,
                totalSpent: stats.totalSpent.toFixed(2),
                avgSpent: (stats.totalSpent / stats.count).toFixed(2),
                dateRange,
                isRepeat: stats.count > 1
            };
        }).sort((a, b) => b.count - a.count);

        const repeatShows = showArray.filter(s => s.isRepeat);
        const uniqueShows = showArray.length;

        return {
            shows: showArray,
            totalShows: uniqueShows,
            repeatShows: repeatShows.length,
            mostSeen: showArray[0] || null,
            repeatPercentage: uniqueShows > 0 ? ((repeatShows.length / uniqueShows) * 100).toFixed(1) : '0'
        };
    }

    calculateTrendStats() {
        const performances = this.data.performances;
        const monthlyData = {};
        const yearlyData = {};

        performances.forEach(p => {
            if (p.date_seen) {
                const date = new Date(p.date_seen);
                const month = date.toISOString().substring(0, 7);
                const year = date.getFullYear().toString();

                if (!monthlyData[month]) {
                    monthlyData[month] = { count: 0, spent: 0, ratings: [] };
                }
                if (!yearlyData[year]) {
                    yearlyData[year] = { count: 0, spent: 0, ratings: [] };
                }

                monthlyData[month].count++;
                yearlyData[year].count++;
                
                // Calculate total spent for this performance
                const ticketPrice = parseFloat(p.ticket_price) || 0;
                const bookingFee = parseFloat(p.booking_fee) || 0;
                const travelCost = parseFloat(p.travel_cost) || 0;
                const otherExpenses = parseFloat(p.other_expenses) || 0;
                const totalCost = ticketPrice + bookingFee + travelCost + otherExpenses;
                
                monthlyData[month].spent += totalCost;
                yearlyData[year].spent += totalCost;
                
                if (p.weighted_rating) {
                    monthlyData[month].ratings.push(parseFloat(p.weighted_rating));
                    yearlyData[year].ratings.push(parseFloat(p.weighted_rating));
                }
            }
        });

        // Calculate averages
        Object.keys(monthlyData).forEach(month => {
            const data = monthlyData[month];
            data.avgRating = data.ratings.length > 0 
                ? (data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length).toFixed(1)
                : 'N/A';
        });

        Object.keys(yearlyData).forEach(year => {
            const data = yearlyData[year];
            data.avgRating = data.ratings.length > 0 
                ? (data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length).toFixed(1)
                : 'N/A';
        });

        return {
            monthly: monthlyData,
            yearly: yearlyData,
            peakMonth: Object.keys(monthlyData).reduce((a, b) => 
                monthlyData[a].count > monthlyData[b].count ? a : b, Object.keys(monthlyData)[0]) || null,
            peakYear: Object.keys(yearlyData).reduce((a, b) => 
                yearlyData[a].count > yearlyData[b].count ? a : b, Object.keys(yearlyData)[0]) || null
        };
    }

    calculateComparisonStats() {
        const performances = this.data.performances;
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;
        
        const thisYear = performances.filter(p => new Date(p.date_seen).getFullYear() === currentYear);
        const previousYear = performances.filter(p => new Date(p.date_seen).getFullYear() === lastYear);

        const thisYearStats = this.calculateYearStats(thisYear);
        const previousYearStats = this.calculateYearStats(previousYear);

        return {
            thisYear: thisYearStats,
            previousYear: previousYearStats,
            yearOverYear: {
                showsChange: this.calculatePercentageChange(previousYearStats.count, thisYearStats.count),
                spendingChange: this.calculatePercentageChange(previousYearStats.totalSpent, thisYearStats.totalSpent),
                ratingChange: this.calculatePercentageChange(previousYearStats.avgRating, thisYearStats.avgRating)
            }
        };
    }

    calculateYearStats(yearPerformances) {
        const count = yearPerformances.length;
        
        const totalSpent = yearPerformances.reduce((sum, p) => {
            const ticketPrice = parseFloat(p.ticket_price) || 0;
            const bookingFee = parseFloat(p.booking_fee) || 0;
            const travelCost = parseFloat(p.travel_cost) || 0;
            const otherExpenses = parseFloat(p.other_expenses) || 0;
            return sum + ticketPrice + bookingFee + travelCost + otherExpenses;
        }, 0);
        
        const ratings = yearPerformances.map(p => parseFloat(p.weighted_rating) || 0).filter(r => r > 0);
        const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) : 0;

        return {
            count,
            totalSpent: totalSpent.toFixed(2),
            avgRating: avgRating.toFixed(1),
            avgSpent: count > 0 ? (totalSpent / count).toFixed(2) : 0
        };
    }

    calculatePercentageChange(oldValue, newValue) {
        if (oldValue === 0) return newValue > 0 ? '100' : '0';
        const change = ((newValue - oldValue) / oldValue) * 100;
        return change.toFixed(1);
    }

    calculateAchievements() {
        const performances = this.data.performances;
        const achievements = [];

        // Show count achievements
        if (performances.length >= 1) achievements.push({ name: 'First Steps', description: 'Seen your first show!', icon: '👶' });
        if (performances.length >= 3) achievements.push({ name: 'Getting Started', description: 'Seen 3+ shows', icon: '🚀' });
        if (performances.length >= 5) achievements.push({ name: 'Theatre Newbie', description: 'Seen 5+ shows', icon: '🎭' });
        if (performances.length >= 10) achievements.push({ name: 'Theatre Enthusiast', description: 'Seen 10+ shows', icon: '🎪' });
        if (performances.length >= 15) achievements.push({ name: 'Theatre Addict', description: 'Seen 15+ shows', icon: '🤪' });
        if (performances.length >= 20) achievements.push({ name: 'Theatre Lover', description: 'Seen 20+ shows', icon: '💕' });
        if (performances.length >= 25) achievements.push({ name: 'Theatre Obsessed', description: 'Seen 25+ shows', icon: '😍' });
        if (performances.length >= 30) achievements.push({ name: 'Theatre Expert', description: 'Seen 30+ shows', icon: '🏆' });
        if (performances.length >= 40) achievements.push({ name: 'Theatre Master', description: 'Seen 40+ shows', icon: '🎓' });
        if (performances.length >= 50) achievements.push({ name: 'Theatre Legend', description: 'Seen 50+ shows', icon: '👑' });
        if (performances.length >= 75) achievements.push({ name: 'Theatre Deity', description: 'Seen 75+ shows', icon: '⚡' });
        if (performances.length >= 100) achievements.push({ name: 'Theatre God', description: 'Seen 100+ shows', icon: '🌟' });

        // Spending achievements
        const totalSpent = performances.reduce((sum, p) => {
            const ticketPrice = parseFloat(p.ticket_price) || 0;
            const bookingFee = parseFloat(p.booking_fee) || 0;
            const travelCost = parseFloat(p.travel_cost) || 0;
            const otherExpenses = parseFloat(p.other_expenses) || 0;
            return sum + ticketPrice + bookingFee + travelCost + otherExpenses;
        }, 0);
        
        if (totalSpent >= 50) achievements.push({ name: 'Small Spender', description: 'Spent £50+ on theatre', icon: '🪙' });
        if (totalSpent >= 100) achievements.push({ name: 'Budget Theatre', description: 'Spent £100+ on theatre', icon: '💸' });
        if (totalSpent >= 250) achievements.push({ name: 'Theatre Shopper', description: 'Spent £250+ on theatre', icon: '🛒' });
        if (totalSpent >= 500) achievements.push({ name: 'Big Spender', description: 'Spent £500+ on theatre', icon: '💰' });
        if (totalSpent >= 750) achievements.push({ name: 'Theatre Investor', description: 'Spent £750+ on theatre', icon: '💎' });
        if (totalSpent >= 1000) achievements.push({ name: 'Theatre Tycoon', description: 'Spent £1000+ on theatre', icon: '🏦' });
        if (totalSpent >= 1500) achievements.push({ name: 'Theatre Millionaire', description: 'Spent £1500+ on theatre', icon: '💵' });
        if (totalSpent >= 2000) achievements.push({ name: 'Theatre Billionaire', description: 'Spent £2000+ on theatre', icon: '🤑' });

        // Rating achievements
        const ratings = performances.map(p => parseFloat(p.weighted_rating) || 0).filter(r => r > 0);
        const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) : 0;
        
        if (avgRating >= 1.0 && avgRating < 2.0) achievements.push({ name: 'Harsh Critic', description: 'Average rating 1.0-1.9', icon: '😤' });
        if (avgRating >= 2.0 && avgRating < 3.0) achievements.push({ name: 'Tough Judge', description: 'Average rating 2.0-2.9', icon: '😠' });
        if (avgRating >= 3.0 && avgRating < 4.0) achievements.push({ name: 'Fair Reviewer', description: 'Average rating 3.0-3.9', icon: '😐' });
        if (avgRating >= 4.0 && avgRating < 4.5) achievements.push({ name: 'Positive Patron', description: 'Average rating 4.0-4.4', icon: '😊' });
        if (avgRating >= 4.5) achievements.push({ name: 'Quality Seeker', description: 'Average rating 4.5+', icon: '⭐' });
        if (avgRating >= 4.8) achievements.push({ name: 'Eternal Optimist', description: 'Average rating 4.8+', icon: '🌈' });
        if (avgRating >= 4.9) achievements.push({ name: 'Theatre Pollyanna', description: 'Average rating 4.9+', icon: '🦄' });

        // Venue diversity achievements
        const uniqueVenues = new Set(performances.map(p => p.theatre_name)).size;
        if (uniqueVenues >= 2) achievements.push({ name: 'Venue Explorer', description: 'Visited 2+ different venues', icon: '🚶' });
        if (uniqueVenues >= 3) achievements.push({ name: 'Venue Tourist', description: 'Visited 3+ different venues', icon: '🧳' });
        if (uniqueVenues >= 5) achievements.push({ name: 'Venue Nomad', description: 'Visited 5+ different venues', icon: '🏛️' });
        if (uniqueVenues >= 7) achievements.push({ name: 'Venue Collector', description: 'Visited 7+ different venues', icon: '🗺️' });
        if (uniqueVenues >= 10) achievements.push({ name: 'Theatre Nomad', description: 'Visited 10+ different venues', icon: '🌍' });
        if (uniqueVenues >= 15) achievements.push({ name: 'Venue Hopper', description: 'Visited 15+ different venues', icon: '🐰' });
        if (uniqueVenues >= 20) achievements.push({ name: 'Theatre Wanderer', description: 'Visited 20+ different venues', icon: '🎪' });

        // Repeat shows achievements
        const showCounts = {};
        const shows = this.data.shows;
        
        // Create a lookup map for show IDs to show titles
        const showLookup = {};
        if (shows && shows.length > 0) {
            shows.forEach(show => {
                if (show.id && show.title) {
                    showLookup[show.id] = show.title;
                }
            });
        }
        
        performances.forEach(p => {
            // Get the show title from the lookup, or fallback to ID
            let showTitle = 'Unknown Show';
            
            if (p.show_id && showLookup[p.show_id]) {
                showTitle = showLookup[p.show_id];
            } else if (p.show_id) {
                showTitle = `Show ${p.show_id.substring(0, 8)}...`;
            }
            
            showCounts[showTitle] = (showCounts[showTitle] || 0) + 1;
        });
        
        const maxRepeats = Object.values(showCounts).length > 0 ? Math.max(...Object.values(showCounts)) : 0;
        if (maxRepeats >= 2) achievements.push({ name: 'Show Repeater', description: 'Seen a show 2+ times', icon: '🔄' });
        if (maxRepeats >= 3) achievements.push({ name: 'Show Devotee', description: 'Seen a show 3+ times', icon: '❤️' });
        if (maxRepeats >= 4) achievements.push({ name: 'Show Stalker', description: 'Seen a show 4+ times', icon: '👀' });
        if (maxRepeats >= 5) achievements.push({ name: 'Show Obsessed', description: 'Seen a show 5+ times', icon: '😵' });
        if (maxRepeats >= 7) achievements.push({ name: 'Show Addict', description: 'Seen a show 7+ times', icon: '🤯' });
        if (maxRepeats >= 10) achievements.push({ name: 'Show Legend', description: 'Seen a show 10+ times', icon: '👑' });

        // Funny spending pattern achievements
        const expensiveShows = performances.filter(p => {
            const ticketPrice = parseFloat(p.ticket_price) || 0;
            const bookingFee = parseFloat(p.booking_fee) || 0;
            const travelCost = parseFloat(p.travel_cost) || 0;
            const otherExpenses = parseFloat(p.other_expenses) || 0;
            const totalCost = ticketPrice + bookingFee + travelCost + otherExpenses;
            return totalCost >= 100;
        }).length;

        const cheapShows = performances.filter(p => {
            const ticketPrice = parseFloat(p.ticket_price) || 0;
            const bookingFee = parseFloat(p.booking_fee) || 0;
            const travelCost = parseFloat(p.travel_cost) || 0;
            const otherExpenses = parseFloat(p.other_expenses) || 0;
            const totalCost = ticketPrice + bookingFee + travelCost + otherExpenses;
            return totalCost > 0 && totalCost <= 25;
        }).length;

        if (expensiveShows >= 5) achievements.push({ name: 'Premium Patron', description: 'Seen 5+ shows over £100', icon: '💎' });
        if (expensiveShows >= 10) achievements.push({ name: 'Luxury Lover', description: 'Seen 10+ shows over £100', icon: '🏆' });
        if (cheapShows >= 5) achievements.push({ name: 'Budget Boss', description: 'Seen 5+ shows under £25', icon: '💸' });
        if (cheapShows >= 10) achievements.push({ name: 'Penny Pincher', description: 'Seen 10+ shows under £25', icon: '🪙' });

        // Time-based achievements
        const now = new Date();
        const thisMonth = performances.filter(p => {
            const showDate = new Date(p.date_seen);
            return showDate.getMonth() === now.getMonth() && showDate.getFullYear() === now.getFullYear();
        }).length;

        const thisWeek = performances.filter(p => {
            const showDate = new Date(p.date_seen);
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return showDate >= weekAgo;
        }).length;

        if (thisMonth >= 3) achievements.push({ name: 'Monthly Madness', description: 'Seen 3+ shows this month', icon: '📅' });
        if (thisMonth >= 5) achievements.push({ name: 'Monthly Maniac', description: 'Seen 5+ shows this month', icon: '🗓️' });
        if (thisWeek >= 2) achievements.push({ name: 'Weekly Warrior', description: 'Seen 2+ shows this week', icon: '⚔️' });
        if (thisWeek >= 3) achievements.push({ name: 'Weekly Wizard', description: 'Seen 3+ shows this week', icon: '🧙' });

        // Rating distribution achievements
        const ratingDistribution = {};
        ratings.forEach(rating => {
            ratingDistribution[Math.floor(rating)] = (ratingDistribution[Math.floor(rating)] || 0) + 1;
        });

        if (ratingDistribution[5] >= 5) achievements.push({ name: 'Five Star Fan', description: 'Given 5+ five-star ratings', icon: '⭐' });
        if (ratingDistribution[5] >= 10) achievements.push({ name: 'Five Star Fiend', description: 'Given 10+ five-star ratings', icon: '🌟' });
        if (ratingDistribution[1] >= 3) achievements.push({ name: 'One Star Ogre', description: 'Given 3+ one-star ratings', icon: '👹' });
        if (ratingDistribution[1] >= 5) achievements.push({ name: 'One Star Monster', description: 'Given 5+ one-star ratings', icon: '👺' });

        // Funny combination achievements
        if (performances.length >= 10 && avgRating >= 4.5) achievements.push({ name: 'Quality Queen/King', description: '10+ shows with 4.5+ avg rating', icon: '👸' });
        if (performances.length >= 20 && uniqueVenues >= 10) achievements.push({ name: 'Theatre Tourist', description: '20+ shows at 10+ venues', icon: '🗺️' });
        if (totalSpent >= 1000 && avgRating <= 3.0) achievements.push({ name: 'Expensive Disappointment', description: 'Spent £1000+ with low ratings', icon: '😭' });
        if (performances.length >= 15 && maxRepeats >= 3) achievements.push({ name: 'Loyal Customer', description: '15+ shows with 3+ repeats', icon: '🤝' });

        // Silly achievements
        if (performances.length >= 1) achievements.push({ name: 'Theatre Virgin', description: 'Lost your theatre virginity', icon: '🌸' });
        if (performances.length >= 7) achievements.push({ name: 'Lucky Seven', description: 'Seen exactly 7 shows (or more)', icon: '🍀' });
        if (performances.length >= 13) achievements.push({ name: 'Unlucky Thirteen', description: 'Seen 13+ shows (unlucky for your wallet)', icon: '🖤' });
        if (performances.length >= 21) achievements.push({ name: 'Blackjack', description: 'Seen 21+ shows', icon: '🃏' });
        if (performances.length >= 42) achievements.push({ name: 'Answer to Everything', description: 'Seen 42+ shows (the answer to life)', icon: '🤖' });
        if (performances.length >= 69) achievements.push({ name: 'Nice', description: 'Seen 69+ shows (nice)', icon: '😏' });
        if (performances.length >= 100) achievements.push({ name: 'Century Club', description: 'Seen 100+ shows', icon: '💯' });

        // Special venue achievements
        const venueNames = performances.map(p => p.theatre_name?.toLowerCase() || '');
        if (venueNames.some(name => name.includes('west end'))) achievements.push({ name: 'West End Wanderer', description: 'Seen shows in the West End', icon: '🎭' });
        if (venueNames.some(name => name.includes('broadway'))) achievements.push({ name: 'Broadway Baby', description: 'Seen shows on Broadway', icon: '🗽' });
        if (venueNames.some(name => name.includes('fringe'))) achievements.push({ name: 'Fringe Festival', description: 'Seen fringe shows', icon: '🎪' });

        return achievements;
    }

    generateInsights() {
        const insights = [];
        const stats = this.stats;

        // Spending insights
        if (stats.spending && stats.spending.ranges) {
            const over100 = stats.spending.ranges.over100;
            const total = stats.spending.totalWithCost;
            if (over100 > 0) {
                insights.push({
                    type: 'spending',
                    message: `You've splurged on ${over100} premium shows (over £100) - ${((over100/total)*100).toFixed(0)}% of your shows!`,
                    icon: '💎'
                });
            }
        }

        // Rating insights
        if (stats.ratings && stats.ratings.distribution) {
            const fives = stats.ratings.distribution[5];
            const total = stats.ratings.totalRated;
            if (fives > 0 && (fives/total) > 0.3) {
                insights.push({
                    type: 'quality',
                    message: `You're a tough critic! Only ${((fives/total)*100).toFixed(0)}% of shows get your 5-star rating.`,
                    icon: '🎯'
                });
            }
        }

        // Venue insights
        if (stats.venues && stats.venues.mostFrequent) {
            const mostFrequent = stats.venues.mostFrequent;
            if (mostFrequent.count > 3) {
                insights.push({
                    type: 'venue',
                    message: `${mostFrequent.venue} is your go-to venue with ${mostFrequent.count} visits!`,
                    icon: '🏛️'
                });
            }
        }

        // Show insights
        if (stats.shows && stats.shows.mostSeen) {
            const mostSeen = stats.shows.mostSeen;
            if (mostSeen.isRepeat) {
                insights.push({
                    type: 'show',
                    message: `You've seen "${mostSeen.show}" ${mostSeen.count} times - a true favorite!`,
                    icon: '❤️'
                });
            }
        }

        // Trend insights
        if (stats.comparisons && stats.comparisons.yearOverYear) {
            const yoy = stats.comparisons.yearOverYear;
            if (parseFloat(yoy.showsChange) > 20) {
                insights.push({
                    type: 'trend',
                    message: `Your theatre-going is up ${yoy.showsChange}% this year!`,
                    icon: '📈'
                });
            }
        }

        return insights;
    }

    // Export functionality
    exportStats(format = 'json') {
        // Always export JSON including full data (performances include seat_location)
        const exportData = {
            generated: new Date().toISOString(),
            performances: this.data.performances || [],
            shows: this.data.shows || [],
            access_schemes: this.data.accessSchemes || [],
            stats: this.stats
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stagelog-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportStatsCSV() {
        const performances = this.data.performances;
        const headers = ['Date', 'Show', 'Venue', 'Rating', 'Cost', 'Notes'];
        const csvContent = [
            headers.join(','),
            ...performances.map(p => [
                p.date_seen,
                `"${p.show_name}"`,
                `"${p.venue}"`,
                p.rating || '',
                p.cost || '',
                `"${p.notes || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stagelog-performances-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Refresh stats (call when data changes)
    async refresh() {
        await this.loadData();
        this.calculateAllStats();
        if (this.isInitialized) {
            this.updateStatsDisplay();
        }
    }

    updateStatsDisplay() {
        // This will be called by the main app to update the stats page
        if (typeof window.updateStatsPage === 'function') {
            window.updateStatsPage();
        }
    }
}

// Initialize stats system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.statsSystem = new StatsSystem();
    window.statsSystem.init();
});
