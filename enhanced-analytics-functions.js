// Enhanced Analytics Functions
function loadEnhancedAnalytics() {
    
    // Add a small delay to ensure statsSystem is fully loaded
    setTimeout(() => {
        refreshEnhancedAnalytics();
    }, 100);
}

function refreshEnhancedAnalytics() {
    
    try {
        // Get data from statsSystem if available, fallback to direct localStorage
        let performances = [];
        let shows = [];
        
        if (window.statsSystem && window.statsSystem.data) {
            performances = window.statsSystem.data.performances || [];
            shows = window.statsSystem.data.shows || [];
        } else if (window.db) {
            performances = window.db.getPerformances() || [];
            shows = window.db.getShows() || [];
        } else {
            const stagelogData = JSON.parse(localStorage.getItem('stagelog_data') || '{}');
            performances = stagelogData.performances || [];
            shows = stagelogData.shows || [];
        }
        
        // Calculate enhanced analytics
        const analytics = calculateEnhancedAnalytics(performances, shows);
        
        // Update all views
        updateEnhancedOverview(analytics);
        updateLiveAnalytics(analytics);
        updateProShotAnalytics(analytics);
        updateComparisonAnalytics(analytics);
        
        // Update additional analytics sections
        updateAdditionalAnalytics(analytics);
        
        
    } catch (error) {
        console.error('❌ Error refreshing enhanced analytics:', error);
    }
}

function calculateEnhancedAnalytics(performances, shows) {
    
    // Separate performances by type
    const livePerformances = performances.filter(p => p.production_type !== 'Pro Shot');
    const proShotPerformances = performances.filter(p => p.production_type === 'Pro Shot');
    const futurePerformances = performances.filter(p => new Date(p.date_seen) > new Date());
    
    // Calculate live performance analytics
    const liveAnalytics = {
        count: livePerformances.length,
        averageRating: calculateAverageRating(livePerformances),
        averageCost: calculateAverageTicketPrice(livePerformances),
        totalSpent: calculateTotalSpent(livePerformances)
    };
    
    // Calculate Pro Shot analytics
    const proShotAnalytics = {
        count: proShotPerformances.length,
        averageRating: calculateAverageRating(proShotPerformances),
        bestRating: proShotPerformances.length > 0 ? Math.max(...proShotPerformances.map(p => p.weighted_rating || 0)).toFixed(2) : 0,
        recentCount: proShotPerformances.filter(p => new Date(p.date_seen).getFullYear() === new Date().getFullYear()).length
    };
    
    return {
        total: performances.length,
        live: livePerformances.length,
        proShot: proShotPerformances.length,
        upcoming: futurePerformances.length,
        liveAnalytics,
        proShotAnalytics,
        performances,
        livePerformances,
        proShotPerformances,
        shows
    };
}

function calculateAverageRating(performances) {
    const ratedPerformances = performances.filter(p => p.weighted_rating > 0);
    if (ratedPerformances.length === 0) return 0;
    return (ratedPerformances.reduce((sum, p) => sum + p.weighted_rating, 0) / ratedPerformances.length).toFixed(2);
}

function calculateAverageTicketPrice(performances) {
    const performancesWithCost = performances.filter(p => p.ticket_price > 0);
    if (performancesWithCost.length === 0) return 0;
    return (performancesWithCost.reduce((sum, p) => sum + p.ticket_price, 0) / performancesWithCost.length).toFixed(2);
}

function calculateTotalSpent(performances) {
    return performances.reduce((sum, p) => {
        const totalCost = (p.ticket_price || 0) + (p.booking_fee || 0) + (p.travel_cost || 0) + (p.other_expenses || 0);
        return sum + totalCost;
    }, 0).toFixed(2);
}

function updateEnhancedOverview(analytics) {
    updateElement('enhanced-total-performances', analytics.total);
    updateElement('enhanced-live-performances', analytics.live);
    updateElement('enhanced-pro-shot-performances', analytics.proShot);
    updateElement('enhanced-upcoming-performances', analytics.upcoming);
    
    // Generate insights
    generateEnhancedInsights(analytics);
    generateEnhancedAchievements(analytics);
}

function updateLiveAnalytics(analytics) {
    updateElement('live-total-count', analytics.liveAnalytics.count);
    updateElement('live-average-rating', analytics.liveAnalytics.averageRating);
    updateElement('live-average-cost', `£${analytics.liveAnalytics.averageCost}`);
    updateElement('live-total-spent', `£${analytics.liveAnalytics.totalSpent}`);
    
    // Update live rating distribution
    updateRatingDistribution(analytics.livePerformances, 'enhanced-live-rating-distribution');
    updatePriceRangeAnalysis(analytics.livePerformances, 'enhanced-live-price-ranges');
}

function updateProShotAnalytics(analytics) {
    updateElement('proshot-total-count', analytics.proShotAnalytics.count);
    updateElement('proshot-average-rating', analytics.proShotAnalytics.averageRating);
    updateElement('proshot-best-rating', analytics.proShotAnalytics.bestRating);
    updateElement('proshot-recent-count', analytics.proShotAnalytics.recentCount);
    
    // Update Pro Shot rating distribution
    updateRatingDistribution(analytics.proShotPerformances, 'enhanced-proshot-rating-distribution');
}

function updateComparisonAnalytics(analytics) {
    updateElement('comparison-live-count', analytics.liveAnalytics.count);
    updateElement('comparison-proshot-count', analytics.proShotAnalytics.count);
    updateElement('comparison-live-rating', analytics.liveAnalytics.averageRating);
    updateElement('comparison-proshot-rating', analytics.proShotAnalytics.averageRating);
    
    // Update year-over-year comparison
    updateYearOverYearComparison(analytics.performances);
}

function updateAdditionalAnalytics(analytics) {
    console.log('🔄 Updating additional analytics sections...');
    
    // Update detailed spending analysis (live performances only)
    updateDetailedSpendingAnalysis(analytics.livePerformances);
    
    // Update venue analysis (live performances only)
    updateVenueAnalysis(analytics.livePerformances);
    
    // Update show analysis
    updateShowAnalysis(analytics.performances, analytics.shows);
    
    // Update rating analysis
    updateRatingAnalysis(analytics.performances);
    
    console.log('✅ Additional analytics sections updated');
}

function updateDetailedSpendingAnalysis(livePerformances) {
    console.log('💰 Updating detailed spending analysis...');
    
    if (livePerformances.length === 0) {
        // Set all values to 0 if no live performances
        updateElement('enhanced-avg-cost', '£0.00');
        updateElement('enhanced-median-cost', '£0.00');
        updateElement('enhanced-max-cost', '£0.00');
        updateElement('enhanced-min-cost', '£0.00');
        updateElement('enhanced-avg-cost-per-ticket', '£0.00');
        updateElement('enhanced-median-cost-per-ticket', '£0.00');
        updateElement('enhanced-max-cost-per-ticket', '£0.00');
        updateElement('enhanced-min-cost-per-ticket', '£0.00');
        return;
    }
    
    // Calculate total costs for each performance
    const costs = livePerformances.map(p => {
        const totalCost = (p.ticket_price || 0) + (p.booking_fee || 0) + (p.travel_cost || 0) + (p.other_expenses || 0);
        const costPerTicket = totalCost / 2; // Assuming 2 people
        return { totalCost, costPerTicket };
    });
    
    // Sort costs for median calculation
    const sortedCosts = costs.map(c => c.totalCost).sort((a, b) => a - b);
    const sortedCostsPerTicket = costs.map(c => c.costPerTicket).sort((a, b) => a - b);
    
    // Calculate statistics
    const avgCost = costs.reduce((sum, c) => sum + c.totalCost, 0) / costs.length;
    const medianCost = sortedCosts[Math.floor(sortedCosts.length / 2)];
    const maxCost = Math.max(...costs.map(c => c.totalCost));
    const minCost = Math.min(...costs.map(c => c.totalCost));
    
    const avgCostPerTicket = costs.reduce((sum, c) => sum + c.costPerTicket, 0) / costs.length;
    const medianCostPerTicket = sortedCostsPerTicket[Math.floor(sortedCostsPerTicket.length / 2)];
    const maxCostPerTicket = Math.max(...costs.map(c => c.costPerTicket));
    const minCostPerTicket = Math.min(...costs.map(c => c.costPerTicket));
    
    // Update elements
    updateElement('enhanced-avg-cost', `£${avgCost.toFixed(2)}`);
    updateElement('enhanced-median-cost', `£${medianCost.toFixed(2)}`);
    updateElement('enhanced-max-cost', `£${maxCost.toFixed(2)}`);
    updateElement('enhanced-min-cost', `£${minCost.toFixed(2)}`);
    updateElement('enhanced-avg-cost-per-ticket', `£${avgCostPerTicket.toFixed(2)}`);
    updateElement('enhanced-median-cost-per-ticket', `£${medianCostPerTicket.toFixed(2)}`);
    updateElement('enhanced-max-cost-per-ticket', `£${maxCostPerTicket.toFixed(2)}`);
    updateElement('enhanced-min-cost-per-ticket', `£${minCostPerTicket.toFixed(2)}`);
}

function updateVenueAnalysis(livePerformances) {
    console.log('🏛️ Updating venue analysis...');
    
    if (livePerformances.length === 0) {
        updateElement('enhanced-total-venues', '0');
        updateElement('enhanced-most-frequent-venue', '-');
        document.getElementById('enhanced-top-venues').innerHTML = '<p>No venues visited yet.</p>';
        return;
    }
    
    // Count venue visits
    const venueCounts = {};
    livePerformances.forEach(p => {
        const venue = p.theatre_name || 'Unknown Venue';
        venueCounts[venue] = (venueCounts[venue] || 0) + 1;
    });
    
    // Find most frequent venue
    const venues = Object.entries(venueCounts);
    const mostFrequent = venues.reduce((max, [venue, count]) => count > max.count ? {venue, count} : max, {venue: '-', count: 0});
    
    // Sort venues by visit count
    const sortedVenues = venues.sort((a, b) => b[1] - a[1]);
    
    // Update elements
    updateElement('enhanced-total-venues', venues.length);
    updateElement('enhanced-most-frequent-venue', mostFrequent.venue);
    
    // Update top venues list
    const topVenuesContainer = document.getElementById('enhanced-top-venues');
    if (topVenuesContainer) {
        topVenuesContainer.innerHTML = sortedVenues.slice(0, 5).map(([venue, count]) => `
            <div class="venue-item">
                <span class="venue-name">${venue}</span>
                <span class="venue-count">${count} visit${count > 1 ? 's' : ''}</span>
            </div>
        `).join('');
    }
}

function updateShowAnalysis(performances, shows) {
    console.log('🎪 Updating show analysis...');
    
    if (performances.length === 0) {
        updateElement('enhanced-unique-shows', '0');
        updateElement('enhanced-repeat-percentage', '0%');
        document.getElementById('enhanced-top-shows').innerHTML = '<p>No shows seen yet.</p>';
        return;
    }
    
    // Count show visits
    const showCounts = {};
    performances.forEach(p => {
        const showId = p.show_id;
        showCounts[showId] = (showCounts[showId] || 0) + 1;
    });
    
    // Calculate repeat percentage
    const totalPerformances = performances.length;
    const uniqueShows = Object.keys(showCounts).length;
    const repeatPerformances = totalPerformances - uniqueShows;
    const repeatPercentage = totalPerformances > 0 ? (repeatPerformances / totalPerformances * 100) : 0;
    
    // Sort shows by visit count
    const sortedShows = Object.entries(showCounts).sort((a, b) => b[1] - a[1]);
    
    // Update elements
    updateElement('enhanced-unique-shows', uniqueShows);
    updateElement('enhanced-repeat-percentage', `${repeatPercentage.toFixed(1)}%`);
    
    // Update top shows list
    const topShowsContainer = document.getElementById('enhanced-top-shows');
    if (topShowsContainer) {
        topShowsContainer.innerHTML = sortedShows.slice(0, 5).map(([showId, count]) => {
            const show = shows.find(s => s.id === showId);
            const showName = show ? show.title : `Show ID: ${showId}`;
            return `
                <div class="show-item">
                    <span class="show-name">${showName}</span>
                    <span class="show-count">${count} time${count > 1 ? 's' : ''}</span>
                </div>
            `;
        }).join('');
    }
}

function updateRatingAnalysis(performances) {
    console.log('⭐ Updating rating analysis...');
    
    if (performances.length === 0) {
        updateElement('enhanced-rating-avg', '0.0');
        updateElement('enhanced-rating-median', '0.0');
        updateElement('enhanced-rating-percentage', '0%');
        updateElement('enhanced-five-stars', '0');
        return;
    }
    
    // Filter rated performances
    const ratedPerformances = performances.filter(p => p.weighted_rating > 0);
    const ratings = ratedPerformances.map(p => p.weighted_rating);
    
    if (ratings.length === 0) {
        updateElement('enhanced-rating-avg', '0.0');
        updateElement('enhanced-rating-median', '0.0');
        updateElement('enhanced-rating-percentage', '0%');
        updateElement('enhanced-five-stars', '0');
        return;
    }
    
    // Calculate rating statistics
    const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const sortedRatings = ratings.sort((a, b) => a - b);
    const medianRating = sortedRatings[Math.floor(sortedRatings.length / 2)];
    const fiveStarCount = ratings.filter(rating => rating >= 4.5).length;
    const ratedPercentage = (ratedPerformances.length / performances.length * 100);
    
    // Update elements
    updateElement('enhanced-rating-avg', avgRating.toFixed(2));
    updateElement('enhanced-rating-median', medianRating.toFixed(2));
    updateElement('enhanced-rating-percentage', `${ratedPercentage.toFixed(1)}%`);
    updateElement('enhanced-five-stars', fiveStarCount);
}

function updateYearOverYearComparison(performances) {
    console.log('📅 Updating year-over-year comparison...');
    
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    // Filter performances by year
    const thisYearPerformances = performances.filter(p => new Date(p.date_seen).getFullYear() === currentYear);
    const lastYearPerformances = performances.filter(p => new Date(p.date_seen).getFullYear() === lastYear);
    
    // Calculate this year stats
    const thisYearShows = thisYearPerformances.length;
    const thisYearSpent = thisYearPerformances.reduce((sum, p) => {
        return sum + (p.ticket_price || 0) + (p.booking_fee || 0) + (p.travel_cost || 0) + (p.other_expenses || 0);
    }, 0);
    const thisYearRated = thisYearPerformances.filter(p => p.weighted_rating > 0);
    const thisYearRating = thisYearRated.length > 0 ? 
        (thisYearRated.reduce((sum, p) => sum + p.weighted_rating, 0) / thisYearRated.length) : 0;
    
    // Calculate last year stats
    const lastYearShows = lastYearPerformances.length;
    const lastYearSpent = lastYearPerformances.reduce((sum, p) => {
        return sum + (p.ticket_price || 0) + (p.booking_fee || 0) + (p.travel_cost || 0) + (p.other_expenses || 0);
    }, 0);
    const lastYearRated = lastYearPerformances.filter(p => p.weighted_rating > 0);
    const lastYearRating = lastYearRated.length > 0 ? 
        (lastYearRated.reduce((sum, p) => sum + p.weighted_rating, 0) / lastYearRated.length) : 0;
    
    // Calculate changes
    const showsChange = lastYearShows > 0 ? ((thisYearShows - lastYearShows) / lastYearShows * 100) : 0;
    const spendingChange = lastYearSpent > 0 ? ((thisYearSpent - lastYearSpent) / lastYearSpent * 100) : 0;
    const ratingChange = lastYearRating > 0 ? ((thisYearRating - lastYearRating) / lastYearRating * 100) : 0;
    
    // Update elements
    updateElement('enhanced-this-year-shows', thisYearShows);
    updateElement('enhanced-this-year-spent', `£${thisYearSpent.toFixed(2)}`);
    updateElement('enhanced-this-year-rating', thisYearRating.toFixed(2));
    
    updateElement('enhanced-last-year-shows', lastYearShows);
    updateElement('enhanced-last-year-spent', `£${lastYearSpent.toFixed(2)}`);
    updateElement('enhanced-last-year-rating', lastYearRating.toFixed(2));
    
    updateElement('enhanced-shows-change', `${showsChange.toFixed(1)}%`);
    updateElement('enhanced-spending-change', `${spendingChange.toFixed(1)}%`);
    updateElement('enhanced-rating-change', `${ratingChange.toFixed(1)}%`);
}

function switchAnalyticsView(view) {
    console.log(`🔄 Switching to ${view} view`);
    
    // Hide all views
    document.querySelectorAll('.analytics-view').forEach(view => view.classList.add('hidden'));
    
    // Show selected view
    document.getElementById(`analytics-${view}`).classList.remove('hidden');
    
    // Update button states
    document.querySelectorAll('.view-toggle .btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });
    
    document.getElementById(`${view}-btn`).classList.remove('btn-secondary');
    document.getElementById(`${view}-btn`).classList.add('btn-primary');
}

function generateEnhancedInsights(analytics) {
    const container = document.getElementById('enhanced-insights-container');
    if (!container) return;
    
    const insights = [];
    
    if (analytics.live > 0 && analytics.proShot > 0) {
        const liveRatio = (analytics.live / (analytics.live + analytics.proShot) * 100).toFixed(1);
        insights.push({
            icon: '🎭',
            title: 'Performance Mix',
            description: `${liveRatio}% live performances, ${(100 - liveRatio).toFixed(1)}% Pro Shots`
        });
    }
    
    if (analytics.liveAnalytics.count > 0) {
        insights.push({
            icon: '💰',
            title: 'Spending Insights',
            description: `Average live performance cost: £${analytics.liveAnalytics.averageCost}`
        });
    }
    
    if (analytics.upcoming > 0) {
        insights.push({
            icon: '📅',
            title: 'Upcoming Shows',
            description: `${analytics.upcoming} performances scheduled`
        });
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        </div>
    `).join('');
}

function generateEnhancedAchievements(analytics) {
    const container = document.getElementById('enhanced-achievements-container');
    if (!container) return;
    
    const achievements = [];
    
    // Get performances data for more detailed calculations
    let performances = [];
    if (window.statsSystem && window.statsSystem.data) {
        performances = window.statsSystem.data.performances || [];
    } else if (window.db) {
        performances = window.db.getPerformances() || [];
    } else {
        const stagelogData = JSON.parse(localStorage.getItem('stagelog_data') || '{}');
        performances = stagelogData.performances || [];
    }
    
    // === PRO SHOT SPECIFIC ACHIEVEMENTS ===
    
    // Pro Shot Milestones
    if (analytics.proShot >= 1) {
        achievements.push({
            icon: '📺',
            title: 'First Stream',
            description: 'Your first Pro Shot experience'
        });
    }
    
    if (analytics.proShot >= 5) {
        achievements.push({
            icon: '🛋️',
            title: 'Couch Critic',
            description: 'Watched 5+ Pro Shots'
        });
    }
    
    if (analytics.proShot >= 10) {
        achievements.push({
            icon: '🏠',
            title: 'Home Theatre',
            description: 'Watched 10+ Pro Shots'
        });
    }
    
    if (analytics.proShot >= 20) {
        achievements.push({
            icon: '📱',
            title: 'Streaming Enthusiast',
            description: 'Watched 20+ Pro Shots'
        });
    }
    
    if (analytics.proShot >= 50) {
        achievements.push({
            icon: '🎬',
            title: 'Pro Shot Pro',
            description: 'Watched 50+ Pro Shots'
        });
    }
    
    // Pro Shot Quality Achievements
    if (analytics.proShotAnalytics && analytics.proShotAnalytics.averageRating > 4.0) {
        achievements.push({
            icon: '🌟',
            title: 'Quality Viewer',
            description: 'Average Pro Shot rating > 4.0'
        });
    }
    
    if (analytics.proShotAnalytics && analytics.proShotAnalytics.averageRating > 4.5) {
        achievements.push({
            icon: '⭐',
            title: 'Pro Shot Perfectionist',
            description: 'Average Pro Shot rating > 4.5'
        });
    }
    
    // Genre Explorer - Pro Shots from different shows
    const proShotShows = new Set(performances.filter(p => p.production_type === 'Pro Shot').map(p => p.show_id));
    if (proShotShows.size >= 5) {
        achievements.push({
            icon: '🎪',
            title: 'Genre Explorer',
            description: 'Watched Pro Shots from 5+ different shows'
        });
    }
    
    // Repeat Streamer - same Pro Shot multiple times
    const proShotCounts = {};
    performances.filter(p => p.production_type === 'Pro Shot').forEach(p => {
        proShotCounts[p.show_id] = (proShotCounts[p.show_id] || 0) + 1;
    });
    const maxProShotRepeats = Object.values(proShotCounts).length > 0 ? Math.max(...Object.values(proShotCounts)) : 0;
    if (maxProShotRepeats >= 3) {
        achievements.push({
            icon: '🔄',
            title: 'Repeat Streamer',
            description: 'Watched the same Pro Shot 3+ times'
        });
    }
    
    // === LIVE VS PRO SHOT COMPARISON ACHIEVEMENTS ===
    
    // Balanced Viewer
    if (Math.abs(analytics.live - analytics.proShot) <= 2 && analytics.live > 0 && analytics.proShot > 0) {
        achievements.push({
            icon: '⚖️',
            title: 'Balanced Viewer',
            description: 'Equal Live and Pro Shot counts (within 2)'
        });
    }
    
    // Live Performance Loyalist
    if (analytics.live >= 5 && analytics.proShot > 0 && analytics.live >= (analytics.proShot * 5)) {
        achievements.push({
            icon: '🎭',
            title: 'Live Performance Loyalist',
            description: '5x more Live than Pro Shots'
        });
    }
    
    // Streaming Specialist
    if (analytics.proShot >= 5 && analytics.live > 0 && analytics.proShot >= (analytics.live * 5)) {
        achievements.push({
            icon: '📺',
            title: 'Streaming Specialist',
            description: '5x more Pro Shots than Live'
        });
    }
    
    // Hybrid Theatre-Goer - both in same month
    const now = new Date();
    const thisMonthLive = performances.filter(p => {
        const showDate = new Date(p.date_seen);
        return showDate.getMonth() === now.getMonth() && 
               showDate.getFullYear() === now.getFullYear() && 
               p.production_type !== 'Pro Shot';
    }).length;
    
    const thisMonthProShot = performances.filter(p => {
        const showDate = new Date(p.date_seen);
        return showDate.getMonth() === now.getMonth() && 
               showDate.getFullYear() === now.getFullYear() && 
               p.production_type === 'Pro Shot';
    }).length;
    
    if (thisMonthLive > 0 && thisMonthProShot > 0) {
        achievements.push({
            icon: '🎪',
            title: 'Hybrid Theatre-Goer',
            description: 'Both Live and Pro Shot in the same month'
        });
    }
    
    // === SPECIAL FEATURES ===
    
    // Musical Marathoner
    const musicalProShots = performances.filter(p => p.production_type === 'Pro Shot' && p.is_musical).length;
    if (musicalProShots >= 10) {
        achievements.push({
            icon: '🎵',
            title: 'Musical Marathoner',
            description: 'Watched 10+ musical Pro Shots'
        });
    }
    
    // Play Purist
    const playProShots = performances.filter(p => p.production_type === 'Pro Shot' && !p.is_musical).length;
    if (playProShots >= 10) {
        achievements.push({
            icon: '🎭',
            title: 'Play Purist',
            description: 'Watched 10+ play Pro Shots'
        });
    }
    
    // === REGULAR ANALYTICS ACHIEVEMENTS ===
    
    // Show Count Milestones
    if (analytics.total >= 1) {
        achievements.push({
            icon: '🎉',
            title: 'Opening Night',
            description: 'Your first-ever logged show!'
        });
    }
    
    if (analytics.total >= 7) {
        achievements.push({
            icon: '🍀',
            title: 'Lucky Seven',
            description: 'Seven shows in your journey'
        });
    }
    
    if (analytics.total >= 21) {
        achievements.push({
            icon: '🃏',
            title: 'Blackjack',
            description: 'Hit 21 shows like a pro'
        });
    }
    
    if (analytics.total >= 100) {
        achievements.push({
            icon: '💯',
            title: 'Century Club',
            description: 'One hundred shows witnessed'
        });
    }
    
    // Spending Milestones (Live performances only)
    const livePerformances = performances.filter(p => p.production_type !== 'Pro Shot');
    const totalSpent = livePerformances.reduce((sum, p) => {
        const ticketPrice = parseFloat(p.ticket_price) || 0;
        const bookingFee = parseFloat(p.booking_fee) || 0;
        const travelCost = parseFloat(p.travel_cost) || 0;
        const otherExpenses = parseFloat(p.other_expenses) || 0;
        return sum + ticketPrice + bookingFee + travelCost + otherExpenses;
    }, 0);
    
    if (totalSpent >= 100) {
        achievements.push({
            icon: '💷',
            title: 'Patron of the Arts',
            description: 'Spent triple digits on theatre'
        });
    }
    
    if (totalSpent >= 500) {
        achievements.push({
            icon: '💰',
            title: 'Big Night Out',
            description: 'Half a grand to the stage gods'
        });
    }
    
    if (totalSpent >= 1000) {
        achievements.push({
            icon: '🏦',
            title: 'Serious Supporter',
            description: 'Four figures deep'
        });
    }
    
    // Venue Diversity
    const uniqueVenues = new Set(performances.map(p => p.theatre_name)).size;
    if (uniqueVenues >= 3) {
        achievements.push({
            icon: '🧳',
            title: 'Venue Tourist',
            description: 'A sampler of stages'
        });
    }
    
    if (uniqueVenues >= 10) {
        achievements.push({
            icon: '🏛️',
            title: 'Stage Hopper',
            description: 'Double digits of different venues'
        });
    }
    
    if (uniqueVenues >= 20) {
        achievements.push({
            icon: '🌍',
            title: 'Theatre Wanderer',
            description: 'Twenty different venues explored'
        });
    }
    
    // Repeat Show Loyalty
    const showCounts = {};
    performances.forEach(p => {
        const showTitle = p.show_id || 'Unknown Show';
        showCounts[showTitle] = (showCounts[showTitle] || 0) + 1;
    });
    
    const maxRepeats = Object.values(showCounts).length > 0 ? Math.max(...Object.values(showCounts)) : 0;
    if (maxRepeats >= 2) {
        achievements.push({
            icon: '🍰',
            title: 'Second Helping',
            description: 'You went back for seconds'
        });
    }
    
    if (maxRepeats >= 5) {
        achievements.push({
            icon: '❤️',
            title: 'Superfan',
            description: 'Five or more repeat visits to one show'
        });
    }
    
    // Quality Recognition
    const ratings = performances.map(p => parseFloat(p.weighted_rating) || 0).filter(r => r > 0);
    const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) : 0;
    if (avgRating > 4.5) {
        achievements.push({
            icon: '🏅',
            title: 'Quality Magnet',
            description: 'You pick winners (avg > 4.5)'
        });
    }
    
    const fiveStarRatings = ratings.filter(r => r >= 4.75).length;
    if (fiveStarRatings >= 5) {
        achievements.push({
            icon: '⭐',
            title: 'Five Star Fan',
            description: 'Given 5+ five-star ratings'
        });
    }
    
    // Special Venue Types
    const venueNames = performances.map(p => p.theatre_name?.toLowerCase() || '');
    if (venueNames.some(name => name.includes('west end'))) {
        achievements.push({
            icon: '🎭',
            title: 'West End Wanderer',
            description: 'Seen shows in the West End'
        });
    }
    
    if (venueNames.some(name => name.includes('broadway'))) {
        achievements.push({
            icon: '🗽',
            title: 'Broadway Baby',
            description: 'Seen shows on Broadway'
        });
    }
    
    if (venueNames.some(name => name.includes('fringe'))) {
        achievements.push({
            icon: '🎪',
            title: 'Fringe Festival',
            description: 'Seen fringe shows'
        });
    }
    
    // Display achievements
    if (achievements.length === 0) {
        container.innerHTML = '<div class="achievement-card"><div class="achievement-icon">🏆</div><div class="achievement-content"><h4>Keep Going!</h4><p>Add more performances to unlock achievements</p></div></div>';
        return;
    }
    
    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-card">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        </div>
    `).join('');
}

function updateRatingDistribution(performances, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const ratingRanges = {
        '5.0': 0, '4.5-4.9': 0, '4.0-4.4': 0, '3.5-3.9': 0, '3.0-3.4': 0,
        '2.5-2.9': 0, '2.0-2.4': 0, '1.5-1.9': 0, '1.0-1.4': 0, '0.0-0.9': 0
    };
    
    performances.forEach(perf => {
        const rating = perf.weighted_rating || 0;
        if (rating > 0) { // Only count performances with actual ratings
            if (rating >= 5.0) ratingRanges['5.0']++;
            else if (rating >= 4.5) ratingRanges['4.5-4.9']++;
            else if (rating >= 4.0) ratingRanges['4.0-4.4']++;
            else if (rating >= 3.5) ratingRanges['3.5-3.9']++;
            else if (rating >= 3.0) ratingRanges['3.0-3.4']++;
            else if (rating >= 2.5) ratingRanges['2.5-2.9']++;
            else if (rating >= 2.0) ratingRanges['2.0-2.4']++;
            else if (rating >= 1.5) ratingRanges['1.5-1.9']++;
            else if (rating >= 1.0) ratingRanges['1.0-1.4']++;
            else ratingRanges['0.0-0.9']++;
        }
    });
    
    const ratedPerformances = performances.filter(p => (p.weighted_rating || 0) > 0);
    const totalRated = ratedPerformances.length;
    
    if (totalRated === 0) {
        container.innerHTML = '<div class="rating-bar"><div class="rating-label">No ratings yet</div></div>';
        return;
    }
    
    container.innerHTML = Object.entries(ratingRanges).map(([range, count]) => {
        const percentage = totalRated > 0 ? (count / totalRated * 100) : 0;
        return `
            <div class="rating-bar">
                <div class="rating-label">${range}</div>
                <div class="rating-progress">
                    <div class="rating-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="rating-count">${count}</div>
            </div>
        `;
    }).join('');
}

function updatePriceRangeAnalysis(performances, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const priceRanges = {
        '£0-£25': 0, '£26-£50': 0, '£51-£75': 0, '£76-£100': 0, '£100+': 0
    };
    
    performances.forEach(perf => {
        const cost = (perf.ticket_price || 0) + (perf.booking_fee || 0) + (perf.travel_cost || 0) + (perf.other_expenses || 0);
        if (cost === 0) priceRanges['£0-£25']++;
        else if (cost <= 25) priceRanges['£0-£25']++;
        else if (cost <= 50) priceRanges['£26-£50']++;
        else if (cost <= 75) priceRanges['£51-£75']++;
        else if (cost <= 100) priceRanges['£76-£100']++;
        else priceRanges['£100+']++;
    });
    
    container.innerHTML = Object.entries(priceRanges).map(([range, count]) => `
        <div class="price-range-card">
            <div class="price-range">${range}</div>
            <div class="price-count">${count}</div>
        </div>
    `).join('');
}

function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
        console.log(`✅ Updated ${elementId} with value: ${value}`);
    } else {
        console.warn(`⚠️ Element ${elementId} not found`);
    }
}

function exportEnhancedStats(format = 'json') {
    console.log(`📤 Exporting enhanced analytics as ${format}`);
    
    try {
        const analytics = calculateEnhancedAnalytics(
            window.db ? window.db.getPerformances() : [],
            window.db ? window.db.getShows() : []
        );
        
        const filename = `enhanced-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
        const dataStr = JSON.stringify(analytics, null, 2);
        
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`✅ Enhanced analytics exported as ${filename}`);
    } catch (error) {
        console.error('❌ Error exporting enhanced analytics:', error);
    }
}
