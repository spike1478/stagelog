/**
 * 📊 ANALYTICS FUNCTIONS
 * Functions to populate and manage the analytics page
 */

/**
 * Refresh stats data and update the analytics page
 */
async function refreshStats() {
    try {
        console.log('📊 Refreshing analytics data...');
        if (window.statsSystem) {
            await window.statsSystem.refresh();
            updateStatsPage();
        } else {
            console.warn('📊 Stats system not available');
        }
    } catch (error) {
        console.error('❌ Error refreshing stats:', error);
    }
}

/**
 * Export stats data in specified format
 * @param {string} format - 'json' or 'csv'
 */
function exportStats(format = 'json') {
    try {
        if (window.statsSystem) {
            window.statsSystem.exportStats(format);
            console.log(`📊 Stats exported as ${format.toUpperCase()}`);
        } else {
            console.warn('📊 Stats system not available');
        }
    } catch (error) {
        console.error('❌ Error exporting stats:', error);
    }
}

/**
 * Update the analytics page with current stats data
 */
function updateStatsPage() {
    if (!window.statsSystem || !window.statsSystem.isInitialized) {
        console.warn('📊 Stats system not ready, attempting to initialize...');
        if (typeof StatsSystem !== 'undefined' && !window.statsSystem) {
            window.statsSystem = new StatsSystem();
            window.statsSystem.init().then(() => {
                updateStatsPage(); // Retry after initialization
            }).catch(error => {
                console.error('❌ Error initializing stats system:', error);
            });
        }
        return;
    }

    const stats = window.statsSystem.stats;
    if (!stats) {
        console.warn('📊 No stats data available');
        return;
    }

    try {
        // Update overview stats
        updateOverviewStats(stats.overview);
        
        // Update insights
        updateInsights(stats.insights);
        
        // Update achievements
        updateAchievements(stats.achievements);
        
        // Update detailed stats
        updateDetailedStats(stats);
        
        // Update comparison stats
        updateComparisonStats(stats.comparisons);
        
        // Update rating distribution
        updateRatingDistribution(stats.ratings);
        
        // Update price analysis
        updatePriceAnalysis(stats.spending);
        
        // Update cost per ticket analysis
        updateCostPerTicketAnalysis(stats.spending);
        
        console.log('📊 Analytics page updated successfully');
    } catch (error) {
        console.error('❌ Error updating analytics page:', error);
    }
}

/**
 * Update overview statistics section
 */
function updateOverviewStats(overview) {
    if (!overview) return;
    
    const totalShowsEl = document.getElementById('total-shows');
    const totalSpentEl = document.getElementById('total-spent');
    const avgRatingEl = document.getElementById('avg-rating');
    const showsPerMonthEl = document.getElementById('shows-per-month');
    
    if (totalShowsEl) totalShowsEl.textContent = overview.totalShows || 0;
    if (totalSpentEl) totalSpentEl.textContent = `£${overview.totalSpent || '0.00'}`;
    if (avgRatingEl) avgRatingEl.textContent = overview.avgRating || '0.0';
    if (showsPerMonthEl) showsPerMonthEl.textContent = overview.showsPerMonth || '0.0';

    const live = document.getElementById('analytics-live');
    if (live) {
        live.textContent = `Analytics updated. Total shows ${overview.totalShows || 0}, total spent £${overview.totalSpent || '0.00'}, average rating ${overview.avgRating || '0.0'}.`;
    }
}

/**
 * Update insights section
 */
function updateInsights(insights) {
    const container = document.getElementById('insights-container');
    if (!container || !insights) return;
    
    if (insights.length === 0) {
        container.innerHTML = '<div class="insight-card"><div class="insight-icon">💡</div><div class="insight-message">Add more performances to see personalized insights!</div></div>';
        return;
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-message">${insight.message}</div>
        </div>
    `).join('');
}

/**
 * Update achievements section
 */
function updateAchievements(achievements) {
    const container = document.getElementById('achievements-container');
    if (!container || !achievements) return;
    
    if (achievements.length === 0) {
        container.innerHTML = '<div class="achievement-card"><div class="achievement-icon">🏆</div><div class="achievement-name">Keep Going!</div><div class="achievement-description">Add more performances to unlock achievements</div></div>';
        return;
    }
    
    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-card">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
        </div>
    `).join('');
}

/**
 * Update detailed statistics sections
 */
function updateDetailedStats(stats) {
    // Spending Analysis
    if (stats.spending) {
        const avgCostEl = document.getElementById('avg-cost');
        const medianCostEl = document.getElementById('median-cost');
        const maxCostEl = document.getElementById('max-cost');
        const minCostEl = document.getElementById('min-cost');
        
        if (avgCostEl) avgCostEl.textContent = `£${stats.spending.average || '0.00'}`;
        if (medianCostEl) medianCostEl.textContent = `£${stats.spending.median || '0.00'}`;
        if (maxCostEl) maxCostEl.textContent = `£${stats.spending.max || '0.00'}`;
        if (minCostEl) minCostEl.textContent = `£${stats.spending.min || '0.00'}`;
    }
    
    // Rating Analysis
    if (stats.ratings) {
        const ratingAvgEl = document.getElementById('rating-avg');
        const ratingMedianEl = document.getElementById('rating-median');
        const ratingPercentageEl = document.getElementById('rating-percentage');
        const fiveStarsEl = document.getElementById('five-stars');
        
        if (ratingAvgEl) ratingAvgEl.textContent = stats.ratings.average || '0.0';
        if (ratingMedianEl) ratingMedianEl.textContent = stats.ratings.median || '0.0';
        if (ratingPercentageEl) ratingPercentageEl.textContent = `${stats.ratings.percentageRated || '0'}%`;
        if (fiveStarsEl) fiveStarsEl.textContent = stats.ratings.distribution?.[5] || 0;
    }
    
    // Venue Analysis
    if (stats.venues) {
        const totalVenuesEl = document.getElementById('total-venues');
        const mostFrequentVenueEl = document.getElementById('most-frequent-venue');
        
        if (totalVenuesEl) totalVenuesEl.textContent = stats.venues.totalVenues || 0;
        if (mostFrequentVenueEl) mostFrequentVenueEl.textContent = stats.venues.mostFrequent?.venue || '-';
        updateTopVenues(stats.venues.venues);
    }
    
    // Show Analysis
    if (stats.shows) {
        const uniqueShowsEl = document.getElementById('unique-shows');
        const repeatPercentageEl = document.getElementById('repeat-percentage');
        
        if (uniqueShowsEl) uniqueShowsEl.textContent = stats.shows.totalShows || 0;
        if (repeatPercentageEl) repeatPercentageEl.textContent = `${stats.shows.repeatPercentage || '0'}%`;
        updateTopShows(stats.shows.shows);
    }
}

/**
 * Update top venues list
 */
function updateTopVenues(venues) {
    const container = document.getElementById('top-venues');
    if (!container || !venues) return;
    
    const topVenues = venues.slice(0, 5);
    container.innerHTML = topVenues.map(venue => `
        <div class="venue-item">
            <div class="venue-name">${venue.venue}</div>
            <div class="venue-count">${venue.count}</div>
        </div>
    `).join('');
}

/**
 * Update top shows list
 */
function updateTopShows(shows) {
    const container = document.getElementById('top-shows');
    if (!container || !shows) return;
    
    const topShows = shows.slice(0, 5);
    container.innerHTML = topShows.map(show => `
        <div class="show-item">
            <div class="show-name">${show.show}</div>
            <div class="show-count">${show.count}</div>
        </div>
    `).join('');
}

/**
 * Update year-over-year comparison
 */
function updateComparisonStats(comparisons) {
    if (!comparisons) return;
    
    // This Year
    if (comparisons.thisYear) {
        const thisYearShowsEl = document.getElementById('this-year-shows');
        const thisYearSpentEl = document.getElementById('this-year-spent');
        const thisYearRatingEl = document.getElementById('this-year-rating');
        
        if (thisYearShowsEl) thisYearShowsEl.textContent = comparisons.thisYear.count || 0;
        if (thisYearSpentEl) thisYearSpentEl.textContent = `£${comparisons.thisYear.totalSpent || '0.00'}`;
        if (thisYearRatingEl) thisYearRatingEl.textContent = comparisons.thisYear.avgRating || '0.0';
    }
    
    // Last Year
    if (comparisons.previousYear) {
        const lastYearShowsEl = document.getElementById('last-year-shows');
        const lastYearSpentEl = document.getElementById('last-year-spent');
        const lastYearRatingEl = document.getElementById('last-year-rating');
        
        if (lastYearShowsEl) lastYearShowsEl.textContent = comparisons.previousYear.count || 0;
        if (lastYearSpentEl) lastYearSpentEl.textContent = `£${comparisons.previousYear.totalSpent || '0.00'}`;
        if (lastYearRatingEl) lastYearRatingEl.textContent = comparisons.previousYear.avgRating || '0.0';
    }
    
    // Changes
    if (comparisons.yearOverYear) {
        const showsChangeEl = document.getElementById('shows-change');
        const spendingChangeEl = document.getElementById('spending-change');
        const ratingChangeEl = document.getElementById('rating-change');
        
        // Format percentage changes more nicely
        const formatChange = (change) => {
            if (change === 'Infinity' || change === 'NaN') return 'N/A';
            const num = parseFloat(change);
            if (num > 1000) return '1000%+';
            return `${change}%`;
        };
        
        if (showsChangeEl) showsChangeEl.textContent = formatChange(comparisons.yearOverYear.showsChange || '0');
        if (spendingChangeEl) spendingChangeEl.textContent = formatChange(comparisons.yearOverYear.spendingChange || '0');
        if (ratingChangeEl) ratingChangeEl.textContent = formatChange(comparisons.yearOverYear.ratingChange || '0');
    }
}

/**
 * Update rating distribution chart
 */
function updateRatingDistribution(ratings) {
    const container = document.getElementById('rating-distribution');
    if (!container || !ratings || !ratings.distribution) return;
    
    const total = ratings.totalRated || 0;
    if (total === 0) {
        container.innerHTML = '<div class="rating-bar"><div class="rating-label">No ratings yet</div></div>';
        return;
    }
    
    container.innerHTML = [5, 4, 3, 2, 1].map(rating => {
        const count = ratings.distribution[rating] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        return `
            <div class="rating-bar">
                <div class="rating-label">${rating} ⭐</div>
                <div class="rating-progress">
                    <div class="rating-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="rating-count">${count}</div>
            </div>
        `;
    }).join('');
}

/**
 * Update price range analysis
 */
function updatePriceAnalysis(spending) {
    const container = document.getElementById('price-ranges');
    if (!container || !spending || !spending.ranges) return;
    
    const total = spending.totalWithCost || 0;
    if (total === 0) {
        container.innerHTML = '<div class="price-range-card"><div class="price-range-label">No cost data</div></div>';
        return;
    }
    
    const ranges = [
        { label: 'Under £25', key: 'under25', icon: '💚' },
        { label: '£25-£50', key: 'under50', icon: '💛' },
        { label: '£50-£75', key: 'under75', icon: '🧡' },
        { label: '£75-£100', key: 'under100', icon: '❤️' },
        { label: 'Over £100', key: 'over100', icon: '💎' }
    ];
    
    container.innerHTML = ranges.map(range => {
        const count = spending.ranges[range.key] || 0;
        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
        
        return `
            <div class="price-range-card">
                <div class="price-range-label">${range.icon} ${range.label}</div>
                <div class="price-range-count">${count}</div>
                <div class="price-range-percentage">${percentage}%</div>
            </div>
        `;
    }).join('');
}

/**
 * Update cost per ticket analysis (divided by 2)
 */
function updateCostPerTicketAnalysis(spending) {
    if (!spending) return;
    
    // Calculate cost per ticket values (divide by 2)
    const avgCostPerTicket = spending.average ? (parseFloat(spending.average) / 2).toFixed(2) : '0.00';
    const medianCostPerTicket = spending.median ? (parseFloat(spending.median) / 2).toFixed(2) : '0.00';
    const maxCostPerTicket = spending.max ? (parseFloat(spending.max) / 2).toFixed(2) : '0.00';
    const minCostPerTicket = spending.min ? (parseFloat(spending.min) / 2).toFixed(2) : '0.00';
    
    // Update the DOM elements
    const avgEl = document.getElementById('avg-cost-per-ticket');
    const medianEl = document.getElementById('median-cost-per-ticket');
    const maxEl = document.getElementById('max-cost-per-ticket');
    const minEl = document.getElementById('min-cost-per-ticket');
    
    if (avgEl) avgEl.textContent = `£${avgCostPerTicket}`;
    if (medianEl) medianEl.textContent = `£${medianCostPerTicket}`;
    if (maxEl) maxEl.textContent = `£${maxCostPerTicket}`;
    if (minEl) minEl.textContent = `£${minCostPerTicket}`;
}

// Make functions globally available
window.refreshStats = refreshStats;
window.exportStats = exportStats;
window.updateStatsPage = updateStatsPage;
