/**
 * StageLog Main Application - Theatre Performance Tracking System
 * 
 * A comprehensive web application for tracking theatre performances, ratings,
 * expenses, and analytics. Features include dark mode, expense tracking,
 * advanced analytics, and mobile-responsive design.
 * 
 * @class StageLogApp
 * @version 2.7.0
 * @author StageLog Development Team
 * @since 2024
 */
class StageLogApp {
    /**
     * Initialize the StageLog application
     * @constructor
     */
    constructor() {
        /** @type {string} Current active page identifier */
        this.currentPage = 'dashboard';
        
        /** @type {Object|null} Currently selected show object */
        this.currentShow = null;
        
        /** @type {number|null} Timeout ID for search debouncing */
        this.searchTimeout = null;
        
        /** @type {string|null} ID of performance being edited */
        this.editingPerformanceId = null;
        
    }
    
    // Convert technical field names to user-friendly names
    getFieldDisplayName(fieldName) {
        const fieldNameMap = {
            'music_songs': 'Music/Songs',
            'story_plot': 'Story/Plot',
            'performance_cast': 'Performance/Cast',
            'stage_visuals': 'Stage/Visuals',
            'rewatch_value': 'Rewatch Value',
            'theatre_experience': 'Theatre Experience',
            'programme': 'Programme',
            'atmosphere': 'Atmosphere',
            'show_title': 'Show Title',
            'venue': 'Venue',
            'performance_date': 'Performance Date',
            'ticket_price': 'Ticket Price',
            'production_type': 'Production Type',
            'is_musical': 'Musical',
            'notes': 'Notes'
        };
        
        return fieldNameMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Load and initialize the dashboard with performance data
     * Uses caching for improved performance on repeated loads
     * @memberof StageLogApp
     * @performance Uses cached statistics when available
     */
    loadDashboard() {
        try {
            this.loadCityFilter();
            this.filterPerformances();
            this.loadDashboardAnalytics(); // Use dashboard-specific analytics
        } catch (error) {
            console.error('❌ Error loading dashboard:', error);
        }
    }

    /**
     * Calculate the most frequent city from performances
     * @param {Array} performances - Array of performance objects
     * @returns {string} Most frequent city name or '-' if none found
     */
    calculateFavouriteCity(performances) {
        if (!performances || performances.length === 0) return '-';
        
        const cityCounts = {};
        performances.forEach(p => {
            if (p.city) {
                cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
            }
        });
        
        return Object.keys(cityCounts).length > 0 
            ? Object.keys(cityCounts).reduce((a, b) => cityCounts[a] > cityCounts[b] ? a : b)
            : '-';
    }

    /**
     * Load dashboard analytics using the new stats system
     * Falls back to basic stats if stats system is not ready
     * @memberof StageLogApp
     */
    loadDashboardAnalytics() {
        try {
            // Check if stats system is ready
            if (window.statsSystem && window.statsSystem.isInitialized) {
                // Stats system is ready, refresh with latest data
                window.statsSystem.loadData().then(() => {
                    window.statsSystem.calculateAllStats();
                    this.updateDashboardFromStats();
                }).catch(error => {
                    console.error('❌ Error refreshing dashboard stats:', error);
                    // Fallback to basic stats
                    this.updateBasicDashboardStats();
                });
            } else {
                // Stats system not ready, use basic stats
                this.updateBasicDashboardStats();
            }
        } catch (error) {
            console.error('❌ Error loading dashboard analytics:', error);
            this.updateBasicDashboardStats();
        }
    }

    /**
     * Update dashboard from stats system data
     * @param {Object} stats - Stats object from stats system
     * @memberof StageLogApp
     */
    updateDashboardFromStats() {
        const stats = window.statsSystem.stats;
        if (!stats || !stats.overview) {
            this.updateBasicDashboardStats();
            return;
        }

        // Update quick stats from stats system
        const totalElement = document.getElementById('total-performances');
        const avgElement = document.getElementById('average-rating');
        const cityElement = document.getElementById('favourite-city');
        const upcomingElement = document.getElementById('upcoming-shows');

        if (totalElement) totalElement.textContent = stats.overview.totalShows || 0;
        if (avgElement) avgElement.textContent = stats.overview.avgRating || '0.00';
        if (upcomingElement) {
            // Calculate upcoming shows from performances
            const performances = window.db.getPerformances();
            const today = new Date();
            const upcoming = performances.filter(p => new Date(p.date_seen) > today);
            upcomingElement.textContent = upcoming.length;
        }
        if (cityElement) {
            // Get favorite city from performances data
            const performances = window.db.getPerformances();
            const favouriteCity = this.calculateFavouriteCity(performances);
            cityElement.textContent = favouriteCity;
        }
    }

    /**
     * Fallback method for basic dashboard stats
     * Used when stats system is not available
     * @memberof StageLogApp
     */
    updateBasicDashboardStats() {
        try {
            const performances = window.db.getPerformances();
            
            // Total performances (completed only)
            const totalElement = document.getElementById('total-performances');
            if (totalElement) {
                const completed = performances.filter(p => p.weighted_rating > 0);
                totalElement.textContent = completed.length;

            }

            // Average rating
            const avgRatingElement = document.getElementById('average-rating');
            if (avgRatingElement && performances.length > 0) {
                const completed = performances.filter(p => p.weighted_rating > 0);
                if (completed.length > 0) {
                    const totalRating = completed.reduce((sum, p) => sum + (p.weighted_rating || 0), 0);
                    const averageRating = totalRating / completed.length;
                    avgRatingElement.textContent = averageRating.toFixed(2);

                } else {
                    avgRatingElement.textContent = '0.00';
                }
            }

            // Upcoming shows
            const upcomingElement = document.getElementById('upcoming-shows');
            if (upcomingElement) {
                const today = new Date();
                const upcoming = performances.filter(p => new Date(p.date_seen) > today);
                upcomingElement.textContent = upcoming.length;

            }

            // Favourite city
            const cityElement = document.getElementById('favourite-city');
            if (cityElement) {
                const favouriteCity = this.calculateFavouriteCity(performances);
                cityElement.textContent = favouriteCity;

            }
        } catch (error) {
            console.error('❌ Error updating basic dashboard stats:', error);
        }
    }

    // Load and update analytics data
    loadAnalytics() {
        try {
            // Debug: Check what data is available
            this.debugDataCheck();
            
            const performances = window.db.getPerformances();
            const shows = window.db.getShows();
            
            console.log('📊 Analytics loading with', performances.length, 'performances and', shows.length, 'shows');
            
            // Update basic performance stats
            this.updateBasicStats(performances);
            
            // Update expense stats
            this.updateExpenseStats(performances);
            
            // Update charts
            this.updateCharts(performances);
            
            console.log('📊 Analytics loaded successfully');
        } catch (error) {
            console.error('❌ Error loading analytics:', error);
        }
    }

    // Debug function to check localStorage data
    debugDataCheck() {
        try {
            const performances = JSON.parse(localStorage.getItem('stagelog_performances') || '[]');
            const shows = JSON.parse(localStorage.getItem('stagelog_shows') || '[]');
            
            console.log('🔍 Debug: localStorage data check:');
            console.log('  - Performances in localStorage:', performances.length);
            console.log('  - Shows in localStorage:', shows.length);
            
            if (performances.length > 0) {
                console.log('  - First performance:', performances[0]);
            }
            
            if (performances.length === 0) {
                console.warn('⚠️ No performance data found in localStorage!');
                console.log('💡 Try using Import JSON to restore your data');
            }
        } catch (error) {
            console.error('❌ Error checking localStorage:', error);
        }
    }



    // Refresh analytics data (alias for compatibility)
    refreshAnalytics() {
        try {
            console.log('🔄 Refreshing analytics...');
            this.loadAnalytics();
            
            // Announce analytics refresh to screen readers
            this.announceToScreenReader('Analytics data has been refreshed with the latest information.', 'info');
        } catch (error) {
            console.error('❌ Error refreshing analytics:', error);
        }
    }

    // Load analytics page specifically
    loadAnalyticsPage() {
        try {
            this.loadAnalytics();
            console.log('📊 Analytics page loaded');
        } catch (error) {
            console.error('❌ Error loading analytics page:', error);
        }
    }

    // Update basic performance statistics
    updateBasicStats(performances) {
        try {
            console.log('🔍 Updating basic stats with', performances.length, 'performances');
            
            // Total performances
            const totalElement = document.getElementById('total-performances');
            if (totalElement) {
                totalElement.textContent = performances.length;
                console.log('✅ Set total performances to:', performances.length);
            } else {
                console.error('❌ total-performances element not found');
            }

            // Average rating
            const avgRatingElement = document.getElementById('average-rating');
            if (avgRatingElement && performances.length > 0) {
                const totalRating = performances.reduce((sum, p) => sum + (p.weighted_rating || 0), 0);
                const averageRating = totalRating / performances.length;
                avgRatingElement.textContent = averageRating.toFixed(2);
                console.log('✅ Set average rating to:', averageRating.toFixed(2));
            } else {
                console.error('❌ average-rating element not found or no performances');
            }

            // Upcoming shows
            const upcomingElement = document.getElementById('upcoming-shows');
            if (upcomingElement) {
                const today = new Date();
                const upcoming = performances.filter(p => new Date(p.date_seen) > today);
                upcomingElement.textContent = upcoming.length;

            } else {
                console.error('❌ upcoming-shows element not found');
            }

            // Favourite city
            const cityElement = document.getElementById('favourite-city');
            if (cityElement && performances.length > 0) {
                const cityCounts = {};
                performances.forEach(p => {
                    cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
                });
                const favouriteCity = Object.entries(cityCounts)
                    .sort(([,a], [,b]) => b - a)[0][0];
                cityElement.textContent = favouriteCity;

            } else {
                console.error('❌ favourite-city element not found or no performances');
            }
        } catch (error) {
            console.error('❌ Error updating basic stats:', error);
        }
    }

    // Update expense statistics
    updateExpenseStats(performances) {
        try {
            // Filter out Pro Shots for expense calculations
            const livePerformances = performances.filter(p => p.production_type !== 'Pro Shot');
            
            const performancesWithCosts = livePerformances.filter(p => 
                (p.ticket_price && parseFloat(p.ticket_price) > 0) ||
                (p.booking_fee && parseFloat(p.booking_fee) > 0) ||
                (p.travel_cost && parseFloat(p.travel_cost) > 0) ||
                (p.other_expenses && parseFloat(p.other_expenses) > 0)
            );

            // Total spent
            const totalSpentElement = document.getElementById('total-spent');
            if (totalSpentElement) {
                const totalSpent = performancesWithCosts.reduce((sum, p) => {
                    return sum + (parseFloat(p.ticket_price) || 0) + 
                           (parseFloat(p.booking_fee) || 0) + 
                           (parseFloat(p.travel_cost) || 0) + 
                           (parseFloat(p.other_expenses) || 0);
                }, 0);
                totalSpentElement.textContent = `£${totalSpent.toFixed(2)}`;
            }

            // Average ticket price (divided by 2 for carer tickets)
            const avgTicketElement = document.getElementById('avg-ticket-price');
            if (avgTicketElement && performancesWithCosts.length > 0) {
                const totalTickets = performancesWithCosts.reduce((sum, p) => 
                    sum + (parseFloat(p.ticket_price) || 0), 0);
                const avgTicket = (totalTickets / performancesWithCosts.length) / 2;
                avgTicketElement.textContent = `£${avgTicket.toFixed(2)}`;
            }

            // Highest ticket (divided by 2 for carer tickets)
            const highestTicketElement = document.getElementById('highest-ticket');
            if (highestTicketElement && performancesWithCosts.length > 0) {
                const highestTicket = Math.max(...performancesWithCosts.map(p => 
                    parseFloat(p.ticket_price) || 0)) / 2;
                highestTicketElement.textContent = `£${highestTicket.toFixed(2)}`;
            }

            // Performances with costs
            const withCostsElement = document.getElementById('performances-with-costs');
            if (withCostsElement) {
                withCostsElement.textContent = performancesWithCosts.length;
            }
        } catch (error) {
            console.error('❌ Error updating expense stats:', error);
        }
    }

    // Update charts
    updateCharts(performances) {
        try {
            // Spending by city
            this.updateSpendingByCityChart(performances);
            
            // Monthly spending
            this.updateMonthlySpendingChart(performances);
            
            // Expense breakdown
            this.updateExpenseBreakdownChart(performances);
        } catch (error) {
            console.error('❌ Error updating charts:', error);
        }
    }

    // Update spending by city chart
    updateSpendingByCityChart(performances) {
        try {
            const citySpending = {};
            
            performances.forEach(p => {
                const totalCost = (parseFloat(p.ticket_price) || 0) + 
                                (parseFloat(p.booking_fee) || 0) + 
                                (parseFloat(p.travel_cost) || 0) + 
                                (parseFloat(p.other_expenses) || 0);
                
                if (totalCost > 0) {
                    citySpending[p.city] = (citySpending[p.city] || 0) + totalCost;
                }
            });

            const chartContainer = document.getElementById('spending-by-city-chart');
            if (chartContainer) {
                chartContainer.innerHTML = '';
                
                Object.entries(citySpending)
                    .sort(([,a], [,b]) => b - a)
                    .forEach(([city, amount]) => {
                        const cityDiv = document.createElement('div');
                        cityDiv.className = 'city-spending-item';
                        cityDiv.innerHTML = `
                            <div class="city-name">${city}</div>
                            <div class="city-amount">£${amount.toFixed(2)}</div>
                            <div class="city-bar" style="width: ${(amount / Math.max(...Object.values(citySpending)) * 100)}%"></div>
                        `;
                        chartContainer.appendChild(cityDiv);
                    });
            }
        } catch (error) {
            console.error('❌ Error updating city spending chart:', error);
        }
    }

    // Update monthly spending chart
    updateMonthlySpendingChart(performances) {
        try {
            const monthlySpending = {};
            
            performances.forEach(p => {
                const date = new Date(p.date_seen);
                const month = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
                const totalCost = (parseFloat(p.ticket_price) || 0) + 
                                (parseFloat(p.booking_fee) || 0) + 
                                (parseFloat(p.travel_cost) || 0) + 
                                (parseFloat(p.other_expenses) || 0);
                
                if (totalCost > 0) {
                    monthlySpending[month] = (monthlySpending[month] || 0) + totalCost;
                }
            });

            const chartContainer = document.getElementById('monthly-spending-chart');
            if (chartContainer) {
                chartContainer.innerHTML = '';
                
                // Get last 12 months
                const months = [];
                const today = new Date();
                for (let i = 11; i >= 0; i--) {
                    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    months.push(month.getFullYear() + '-' + String(month.getMonth() + 1).padStart(2, '0'));
                }
                
                months.forEach(month => {
                    const amount = monthlySpending[month] || 0;
                    const monthDiv = document.createElement('div');
                    monthDiv.className = 'month-spending-item';
                    monthDiv.innerHTML = `
                        <div class="month-name">${month}</div>
                        <div class="month-amount">£${amount.toFixed(0)}</div>
                        <div class="month-bar" style="width: ${amount > 0 ? (amount / Math.max(...Object.values(monthlySpending)) * 100) : 5}%"></div>
                    `;
                    chartContainer.appendChild(monthDiv);
                });
            }
        } catch (error) {
            console.error('❌ Error updating monthly spending chart:', error);
        }
    }

    // Update expense breakdown chart
    updateExpenseBreakdownChart(performances) {
        try {
            let totalTickets = 0;
            let totalBookingFees = 0;
            let totalOther = 0;
            
            performances.forEach(p => {
                totalTickets += parseFloat(p.ticket_price) || 0;
                totalBookingFees += parseFloat(p.booking_fee) || 0;
                totalOther += (parseFloat(p.travel_cost) || 0) + (parseFloat(p.other_expenses) || 0);
            });
            
            const total = totalTickets + totalBookingFees + totalOther;
            
            const chartContainer = document.getElementById('expense-breakdown-chart');
            if (chartContainer && total > 0) {
                chartContainer.innerHTML = `
                    <div class="expense-breakdown-item">
                        <span class="expense-category">Tickets</span>
                        <span class="expense-amount">£${totalTickets.toFixed(2)}</span>
                        <span class="expense-percentage">${((totalTickets / total) * 100).toFixed(1)}%</span>
                    </div>
                    <div class="expense-breakdown-item">
                        <span class="expense-category">Booking Fees</span>
                        <span class="expense-amount">£${totalBookingFees.toFixed(2)}</span>
                        <span class="expense-percentage">${((totalBookingFees / total) * 100).toFixed(1)}%</span>
                    </div>
                    <div class="expense-breakdown-item">
                        <span class="expense-category">Other</span>
                        <span class="expense-amount">£${totalOther.toFixed(2)}</span>
                        <span class="expense-percentage">${((totalOther / total) * 100).toFixed(1)}%</span>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Error updating expense breakdown chart:', error);
        }
    }

    // Refresh analytics when data changes
    refreshAnalytics() {
        try {
            this.loadAnalytics();
            console.log('🔄 Analytics refreshed');
        } catch (error) {
            console.error('❌ Error refreshing analytics:', error);
        }
    }

    // Switch between pages
    switchPage(pageName) {
        try {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Remove active class from all nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected page
            const selectedPage = document.getElementById(pageName);
            if (selectedPage) {
                selectedPage.classList.add('active');
            }
            
            // Add active class to selected nav button
            const selectedBtn = document.querySelector(`[data-page="${pageName}"]`);
            if (selectedBtn) {
                selectedBtn.classList.add('active');
            }
            
            // Load page-specific content
            switch (pageName) {
                case 'dashboard':
                    this.loadDashboard();
                    break;
                case 'my-shows':
                    console.log('🎯 Switching to My Shows page - calling loadMyShows()');
                    loadMyShows();
                    break;
                case 'analytics':
                    this.loadAnalytics();
                    break;
                case 'access-schemes':
                    this.loadAccessSchemes();
                    break;
                case 'add-performance':
                    // Form is already loaded, just clear if needed
                    // Enhance keyboard navigation for rating dropdowns
                    setTimeout(() => {
                        this.enhanceRatingDropdowns();
                    }, 100);
                    break;
            }
            
            console.log(`📄 Switched to ${pageName} page`);
            
        } catch (error) {
            console.error('❌ Error switching pages:', error);
        }
    }

    loadAnalytics() {
        console.log('🎯 Loading analytics page');
        
        // Check if stats system is ready
        if (window.statsSystem && window.statsSystem.isInitialized) {
            // Stats system is ready, refresh with latest data
            window.statsSystem.loadData().then(() => {
                window.statsSystem.calculateAllStats();
                if (window.updateStatsPage) {
                    window.updateStatsPage();
                    console.log('📊 Analytics refreshed with latest data');
                }
                
                // Also call the old rating distribution function as backup
                const performances = window.db ? window.db.getPerformances() : [];
                this.renderRatingDistribution(performances);
            }).catch(error => {
                console.error('❌ Error refreshing stats:', error);
                // Fallback to just updating the page
                if (window.updateStatsPage) {
                    window.updateStatsPage();
                }
                
                // Also call the old rating distribution function as backup
                const performances = window.db ? window.db.getPerformances() : [];
                this.renderRatingDistribution(performances);
            });
        } else if (window.statsSystem && !window.statsSystem.isInitialized) {
            // Stats system exists but not initialized yet, wait for it
            console.log('📊 Stats system not ready yet, waiting...');
            const checkReady = () => {
                if (window.statsSystem.isInitialized) {
                    this.loadAnalytics(); // Recursive call now that it's ready
                } else {
                    setTimeout(checkReady, 100); // Check again in 100ms
                }
            };
            checkReady();
        } else {
            // Stats system doesn't exist, try to initialize it
            console.log('📊 Stats system not found, initializing...');
            if (typeof StatsSystem !== 'undefined') {
                window.statsSystem = new StatsSystem();
                window.statsSystem.init().then(() => {
                    this.loadAnalytics(); // Recursive call now that it's initialized
                }).catch(error => {
                    console.error('❌ Error initializing stats system:', error);
                });
            } else {
                console.warn('📊 StatsSystem class not available');
            }
        }
    }

    loadCityFilter() {
        const performances = window.db.getPerformances();
        const cities = [...new Set(performances.map(p => p.city))].sort();
        const cityFilter = document.getElementById('city-filter');
        
        if (cityFilter) {
            // Clear existing options except "All Cities"
            while (cityFilter.children.length > 1) {
                cityFilter.removeChild(cityFilter.lastChild);
            }

            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                cityFilter.appendChild(option);
            });
        }
    }

    filterPerformances() {
        const searchFilter = document.getElementById('search-filter');
        const sortFilter = document.getElementById('sort-filter');
        const cityFilter = document.getElementById('city-filter');
        const expenseFilter = document.getElementById('expense-filter');
        
        if (!searchFilter || !sortFilter || !cityFilter || !expenseFilter) return;
        
        const filters = {
            search: searchFilter.value.toLowerCase(),
            sort: sortFilter.value,
            city: cityFilter.value,
            expense: expenseFilter.value
        };

        let performances = window.db.getPerformances();

        // Apply filters
        if (filters.search) {
            performances = performances.filter(p => {
                const show = window.db.getShowById(p.show_id);
                const showTitle = show ? show.title.toLowerCase() : '';
                return showTitle.includes(filters.search) ||
                       p.theatre_name.toLowerCase().includes(filters.search) ||
                       p.city.toLowerCase().includes(filters.search);
            });
        }

        if (filters.city) {
            performances = performances.filter(p => p.city === filters.city);
        }

        // Apply expense filter
        if (filters.expense) {
            performances = performances.filter(p => {
                const totalCost = (parseFloat(p.ticket_price) || 0) + 
                                (parseFloat(p.booking_fee) || 0) + 
                                (parseFloat(p.travel_cost) || 0) + 
                                (parseFloat(p.other_expenses) || 0);
                
                if (filters.expense === 'with-expenses') {
                    return totalCost > 0;
                } else if (filters.expense === 'missing-expenses') {
                    return totalCost === 0;
                }
                return true;
            });
        }

        // Sort performances
        performances.sort((a, b) => {
            switch (filters.sort) {
                case 'date-asc':
                    return new Date(a.date_seen) - new Date(b.date_seen);
                case 'date-desc':
                    return new Date(b.date_seen) - new Date(a.date_seen);
                case 'rating-asc':
                    return a.weighted_rating - b.weighted_rating;
                case 'rating-desc':
                    return b.weighted_rating - a.weighted_rating;
                case 'title-asc':
                    const showA = window.db.getShowById(a.show_id);
                    const showB = window.db.getShowById(b.show_id);
                    return (showA?.title || '').localeCompare(showB?.title || '');
                case 'title-desc':
                    const showC = window.db.getShowById(a.show_id);
                    const showD = window.db.getShowById(b.show_id);
                    return (showD?.title || '').localeCompare(showC?.title || '');
                default:
                    return new Date(b.date_seen) - new Date(a.date_seen);
            }
        });

        this.renderPerformances(performances);
    }

    // Filter performances for My Shows page
    filterMyShowsPerformances() {
        
        const searchFilter = document.getElementById('my-shows-search-filter');
        const sortFilter = document.getElementById('my-shows-sort-filter');
        const cityFilter = document.getElementById('my-shows-city-filter');
        const expenseFilter = document.getElementById('my-shows-expense-filter');
        
        if (!searchFilter || !sortFilter || !cityFilter || !expenseFilter) {
            return;
        }
        
        const filters = {
            search: searchFilter.value.toLowerCase(),
            sort: sortFilter.value,
            city: cityFilter.value,
            expense: expenseFilter.value
        };


        let performances = window.db.getPerformances();

        // Apply filters (same logic as filterPerformances)
        if (filters.search) {
            performances = performances.filter(p => {
                const show = window.db.getShowById(p.show_id);
                const showTitle = show ? show.title.toLowerCase() : '';
                return showTitle.includes(filters.search) ||
                       p.theatre_name.toLowerCase().includes(filters.search) ||
                       p.city.toLowerCase().includes(filters.search);
            });
        }

        if (filters.city) {
            performances = performances.filter(p => p.city === filters.city);
        }

        // Apply expense filter
        if (filters.expense) {
            performances = performances.filter(p => {
                const totalCost = (parseFloat(p.ticket_price) || 0) + 
                                (parseFloat(p.booking_fee) || 0) + 
                                (parseFloat(p.travel_cost) || 0) + 
                                (parseFloat(p.other_expenses) || 0);
                
                if (filters.expense === 'with-expenses') {
                    return totalCost > 0;
                } else if (filters.expense === 'missing-expenses') {
                    return totalCost === 0;
                }
                return true;
            });
        }

        // Sort performances (same logic as filterPerformances)
        performances.sort((a, b) => {
            switch (filters.sort) {
                case 'date-asc':
                    return new Date(a.date_seen) - new Date(b.date_seen);
                case 'date-desc':
                    return new Date(b.date_seen) - new Date(a.date_seen);
                case 'rating-asc':
                    return a.weighted_rating - b.weighted_rating;
                case 'rating-desc':
                    return b.weighted_rating - a.weighted_rating;
                case 'title-asc':
                    const showA = window.db.getShowById(a.show_id);
                    const showB = window.db.getShowById(b.show_id);
                    return (showA?.title || '').localeCompare(showB?.title || '');
                case 'title-desc':
                    const showC = window.db.getShowById(a.show_id);
                    const showD = window.db.getShowById(b.show_id);
                    return (showD?.title || '').localeCompare(showC?.title || '');
                default:
                    return new Date(b.date_seen) - new Date(a.date_seen);
            }
        });

        this.renderMyShowsPerformances(performances);
    }

    // Render all performances for My Shows page
    renderMyShowsPerformances(performances) {
        
        const container = document.getElementById('my-shows-all-performances');
        
        if (container) {
            if (performances.length === 0) {
                container.innerHTML = '<p class="empty-state">No performances found. <a href="#" onclick="switchPage(\'add-performance\')">Add your first performance!</a></p>';
            } else {
                const cards = performances.map(p => this.generatePerformanceCard(p));
                container.innerHTML = cards.join('');
            }
        } else {
            console.error('❌ Container element not found!');
        }
    }

    // Generate HTML for a performance card
    generatePerformanceCard(performance) {
        console.log('🔍 DEBUG: generatePerformanceCard called for performance:', performance.id);
        
        const show = window.db.getShowById(performance.show_id);
        const showTitle = show ? show.title : 'Unknown Show';
        console.log('🔍 DEBUG: Show found:', showTitle);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const performanceDate = new Date(performance.date_seen);
        const isUpcoming = performanceDate >= today;
        
        // Calculate total cost
        const totalCost = (parseFloat(performance.ticket_price) || 0) + 
                         (parseFloat(performance.booking_fee) || 0) + 
                         (parseFloat(performance.travel_cost) || 0) + 
                         (parseFloat(performance.other_expenses) || 0);
        
        // Format date
        const formattedDate = performanceDate.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        // Generate rating display
        let ratingDisplay = '';
        if (performance.weighted_rating && performance.weighted_rating > 0) {
            const rating = parseFloat(performance.weighted_rating);
            const stars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            
            ratingDisplay = `
                <div class="rating-display">
                    <div class="stars">
                        ${'★'.repeat(stars)}${hasHalfStar ? '☆' : ''}${'☆'.repeat(5 - stars - (hasHalfStar ? 1 : 0))}
                    </div>
                    <span class="rating-number">${rating.toFixed(1)}</span>
                </div>
            `;
        } else {
            ratingDisplay = '<span class="no-rating">Not rated</span>';
        }
        
        // Generate cost display
        let costDisplay = '';
        if (performance.production_type === 'Pro Shot') {
            costDisplay = '<span class="cost-exempt">Expenses Exempt</span>';
        } else if (totalCost > 0) {
            costDisplay = `<span class="cost">£${totalCost.toFixed(2)}</span>`;
        } else {
            costDisplay = '<span class="no-cost">No cost data</span>';
        }
        
        return `
            <div class="performance-card" data-performance-id="${performance.id}">
                <div class="performance-header">
                    <h4>${showTitle}</h4>
                    ${ratingDisplay}
                </div>
                <div class="performance-details">
                    <span class="performance-date">${formattedDate}</span>
                    <span class="performance-theatre">${performance.theatre_name}</span>
                    <span class="performance-city">${performance.city}</span>
                    <span class="performance-seat">${performance.seat_location || 'N/A'}</span>
                </div>
                <div class="performance-costs">
                    ${costDisplay}
                </div>
                <div class="performance-actions">
                    <button class="btn btn-sm btn-secondary" onclick="showPerformanceDetail('${performance.id}')">View Details</button>
                    <button class="btn btn-sm btn-primary" onclick="editPerformance('${performance.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePerformance('${performance.id}')">Delete</button>
                </div>
            </div>
        `;
    }

    renderPerformances(performances) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter upcoming and past performances
        let upcoming = performances.filter(p => new Date(p.date_seen) >= today);
        let past = performances.filter(p => new Date(p.date_seen) < today);

        // Sort upcoming by date (earliest first) and take only next 3
        upcoming = upcoming.sort((a, b) => new Date(a.date_seen) - new Date(b.date_seen)).slice(0, 3);
        
        // Sort past by date (most recent first) and take only last 3
        past = past.sort((a, b) => new Date(b.date_seen) - new Date(a.date_seen)).slice(0, 3);

        const upcomingContainer = document.getElementById('upcoming-performances');
        const pastContainer = document.getElementById('past-performances');

        if (upcomingContainer) {
            if (upcoming.length === 0) {
                upcomingContainer.innerHTML = '<p class="empty-state">No upcoming performances scheduled.</p>';
            } else {
                upcomingContainer.innerHTML = upcoming.map(p => this.generatePerformanceCard(p)).join('');
            }
        }

        if (pastContainer) {
            if (past.length === 0) {
                pastContainer.innerHTML = '<p class="empty-state">No past performances recorded. <a href="#" onclick="switchPage(\'add-performance\')">Add your first performance!</a></p>';
            } else {
                pastContainer.innerHTML = past.map(p => this.generatePerformanceCard(p)).join('');
            }
        }
    }

    generatePerformanceCard(performance) {
        const show = window.db.getShowById(performance.show_id);
        const formattedDate = this.formatDate(performance.date_seen);
        const ratingDisplay = performance.weighted_rating > 0 
            ? `<div class="rating-display">
                   <span class="rating-stars">${this.generateStars(performance.weighted_rating)}</span>
                   <span class="rating-value">${performance.weighted_rating.toFixed(2)}</span>
               </div>`
            : '<div class="rating-display"><span class="rating-value">Not rated</span></div>';

        return `
            <div class="performance-card">
                <div class="performance-header">
                    <h3>${show ? show.title : 'Unknown Show'}</h3>
                    ${ratingDisplay}
                </div>
                <div class="performance-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar" aria-hidden="true"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-building" aria-hidden="true"></i>
                        <span>${performance.theatre_name}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                        <span>${performance.city}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-tag" aria-hidden="true"></i>
                        <span>${performance.production_type}</span>
                    </div>
                    ${this.generateCostDisplay(performance)}
                </div>
                ${performance.general_notes ? `
                    <div class="performance-notes">
                        <p><i class="fas fa-sticky-note" aria-hidden="true"></i> ${performance.general_notes}</p>
                    </div>
                ` : ''}
                <div class="performance-actions">
                    <button class="btn btn-secondary" onclick="showPerformanceDetail('${performance.id}')">
                        <i class="fas fa-eye" aria-hidden="true"></i> View Details
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.editPerformance('${performance.id}')">
                        <i class="fas fa-edit" aria-hidden="true"></i> Edit
                    </button>
                    <button class="btn btn-secondary" onclick="window.app.deletePerformance('${performance.id}')">
                        <i class="fas fa-trash" aria-hidden="true"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    generateCostDisplay(performance) {
        // Check if this is a Pro Shot performance first
        if (performance.production_type === 'Pro Shot') {
            return `
                <div class="detail-item cost-exempt">
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                    <span>Expenses Exempt</span>
                </div>
            `;
        }
        
        // Calculate total cost
        const ticketPrice = parseFloat(performance.ticket_price) || 0;
        const bookingFee = parseFloat(performance.booking_fee) || 0;
        const travelCost = parseFloat(performance.travel_cost) || 0;
        const otherExpenses = parseFloat(performance.other_expenses) || 0;
        const totalCost = ticketPrice + bookingFee + travelCost + otherExpenses;
        
        if (totalCost > 0) {
            const currency = performance.currency || 'GBP';
            const currencySymbol = this.getCurrencySymbol(currency);
            return `
                <div class="detail-item cost-display">
                    <i class="fas fa-pound-sign"></i>
                    <span>${currencySymbol}${totalCost.toFixed(2)}</span>
                </div>
            `;
        } else {
            // Show indicator for missing expense data
            return `
                <div class="detail-item cost-missing">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>No expense data</span>
                </div>
            `;
        }
    }

    getCurrencySymbol(currency) {
        const symbols = {
            'GBP': '£',
            'USD': '$',
            'EUR': '€',
            'CAD': 'C$',
            'AUD': 'A$'
        };
        return symbols[currency] || currency + ' ';
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const remainder = rating % 1;
        let stars = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star" style="color: #ffd700; margin-right: 1px;"></i>';
        }

        // Partial star
        if (remainder >= 0.75) {
            stars += `<span style="position: relative; display: inline-block; margin-right: 1px;">
                <i class="far fa-star" style="color: #ddd;"></i>
                <span style="position: absolute; left: 0; top: 0; width: 75%; overflow: hidden;">
                    <i class="fas fa-star" style="color: #ffd700;"></i>
                </span>
            </span>`;
        } else if (remainder >= 0.5) {
            stars += '<i class="fas fa-star-half-alt" style="color: #ffd700; margin-right: 1px;"></i>';
        } else if (remainder >= 0.25) {
            stars += `<span style="position: relative; display: inline-block; margin-right: 1px;">
                <i class="far fa-star" style="color: #ddd;"></i>
                <span style="position: absolute; left: 0; top: 0; width: 25%; overflow: hidden;">
                    <i class="fas fa-star" style="color: #ffd700;"></i>
                </span>
            </span>`;
        }

        // Empty stars
        const partialStars = remainder >= 0.25 ? 1 : 0;
        for (let i = fullStars + partialStars; i < 5; i++) {
            stars += '<i class="far fa-star" style="color: #ddd; margin-right: 1px;"></i>';
        }

        return stars;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Access schemes functionality
    loadAccessSchemes() {
        try {
            this.loadLocationFilter();
            this.filterAccessSchemes();
            console.log('Access schemes loaded');
        } catch (error) {
            console.error('Error loading access schemes:', error);
        }
    }

    loadLocationFilter() {
        const locations = window.db.getUniqueLocations();
        const locationFilter = document.getElementById('location-filter');
        
        if (locationFilter) {
            // Clear existing options except "All Locations"
            while (locationFilter.children.length > 1) {
                locationFilter.removeChild(locationFilter.lastChild);
            }

            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationFilter.appendChild(option);
            });
        }
    }

    filterAccessSchemes() {
        const venueSearch = document.getElementById('venue-search');
        const locationFilter = document.getElementById('location-filter');
        
        if (!venueSearch || !locationFilter) return;
        
        const filters = {
            venue: venueSearch.value.toLowerCase(),
            location: locationFilter.value
        };

        let schemes = window.db.getAccessSchemes();

        // Apply filters
        if (filters.venue) {
            schemes = schemes.filter(scheme =>
                scheme.venue_name.toLowerCase().includes(filters.venue)
            );
        }

        if (filters.location) {
            schemes = schemes.filter(scheme => scheme.location === filters.location);
        }

        this.renderAccessSchemes(schemes);
    }

    renderAccessSchemes(schemes) {
        const container = document.getElementById('access-schemes-list');
        if (!container) return;

        console.log(`Rendering ${schemes.length} access schemes`);

        if (schemes.length === 0) {
            container.innerHTML = '<p class="empty-state">No access schemes found matching your criteria.</p>';
            return;
        }

        container.innerHTML = `
            <div style="margin-bottom: 1rem; font-weight: bold; color: #666;">
                Showing ${schemes.length} access scheme${schemes.length !== 1 ? 's' : ''}
            </div>
            ${schemes.map(scheme => this.generateAccessSchemeCard(scheme)).join('')}
        `;
    }

    generateAccessSchemeCard(scheme) {
        return `
            <div class="access-scheme-card">
                <div class="scheme-header">
                    <h3 class="venue-name">${scheme.venue_name}</h3>
                    <span class="location-badge">${scheme.location}</span>
                </div>
                <div class="scheme-details">
                    ${scheme.companion_policy ? `
                        <div class="scheme-detail">
                            <h4>Companion Policy</h4>
                            <p>${scheme.companion_policy}</p>
                        </div>
                    ` : ''}
                    ${scheme.conditions_proof ? `
                        <div class="scheme-detail">
                            <h4>Proof Required</h4>
                            <p>${scheme.conditions_proof}</p>
                        </div>
                    ` : ''}
                    ${scheme.how_to_book ? `
                        <div class="scheme-detail">
                            <h4>How to Book</h4>
                            <p>${scheme.how_to_book}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Old loadAnalytics method removed - now using new stats system

    updateBasicStats(completed, upcoming) {
        const totalElement = document.getElementById('total-performances');
        const avgElement = document.getElementById('average-rating');
        const favCityElement = document.getElementById('favourite-city');
        const upcomingElement = document.getElementById('upcoming-shows');

        if (totalElement) totalElement.textContent = completed.length;
        
        if (avgElement) {
            const avgRating = completed.length > 0 
                ? (completed.reduce((sum, p) => sum + p.weighted_rating, 0) / completed.length).toFixed(2)
                : '0.00';
            avgElement.textContent = avgRating;
        }
        
        if (favCityElement) {
            const allPerformances = window.db.getPerformances();
            const cityCount = {};
            allPerformances.forEach(p => {
                if (p.city) {
                    cityCount[p.city] = (cityCount[p.city] || 0) + 1;
                }
            });
            const favCity = Object.keys(cityCount).length > 0 
                ? Object.keys(cityCount).reduce((a, b) => cityCount[a] > cityCount[b] ? a : b)
                : 'London';
            favCityElement.textContent = favCity;
        }
        
        if (upcomingElement) upcomingElement.textContent = upcoming.length;
        
        // Update Best Overall Show
        this.updateBestOverallShow(completed);
        
        // Update Worst Rated Performance
        this.updateWorstRatedPerformance(completed);
    }

    updateBestOverallShow(completedPerformances) {
        console.log('🔍 updateBestOverallShow called with:', completedPerformances?.length, 'performances');
        
        if (!completedPerformances || completedPerformances.length === 0) {
            console.log('❌ No completed performances found');
            this.updateBestShowDisplay('-', '-', '-');
            return;
        }

        // Get shows data to look up show names
        const shows = window.db.getShows();
        console.log('🎭 Available shows:', shows.length);

        // Find the performance with the highest weighted rating
        let bestPerformance = null;
        let highestRating = -1;

        completedPerformances.forEach(performance => {
            console.log('🎭 Checking performance ID:', performance.id, 'show_id:', performance.show_id);
            
            // Use weighted_rating field (this is what the database actually stores)
            const rating = parseFloat(performance.weighted_rating) || 0;
            
            console.log('📊 Rating from weighted_rating:', rating);
            
            if (rating > highestRating) {
                highestRating = rating;
                bestPerformance = performance;
                console.log('🏆 New best performance found with rating:', rating);
            }
        });

        if (bestPerformance && highestRating > 0) {
            // Get show name from show_id
            const show = shows.find(s => s.id === bestPerformance.show_id);
            const showName = show ? show.title : 'Unknown Show';
            
            // Use correct field names from database
            const date = bestPerformance.date_seen ? new Date(bestPerformance.date_seen).toLocaleDateString('en-GB') : 'Unknown Date';
            const theatre = bestPerformance.theatre_name || 'Unknown Theatre';
            
            console.log('✅ Best show found:', showName, 'Date:', date, 'Theatre:', theatre, 'Rating:', highestRating);
            this.updateBestShowDisplay(showName, date, theatre);
        } else {
            console.log('❌ No valid rating found in any performance');
            this.updateBestShowDisplay('-', '-', '-');
        }
    }

    updateBestShowDisplay(showName, date, theatre) {
        const nameElement = document.getElementById('best-show-name');
        const dateElement = document.getElementById('best-show-date');
        const theatreElement = document.getElementById('best-show-theatre');

        if (nameElement) nameElement.textContent = showName;
        if (dateElement) dateElement.textContent = date;
        if (theatreElement) theatreElement.textContent = theatre;
    }

    updateWorstRatedPerformance(completedPerformances) {
        console.log('🔍 updateWorstRatedPerformance called with:', completedPerformances?.length, 'performances');
        
        if (!completedPerformances || completedPerformances.length === 0) {
            console.log('❌ No completed performances found');
            this.updateWorstShowDisplay('-', '-', '-');
            return;
        }

        // Get shows data to look up show names
        const shows = window.db.getShows();
        console.log('🎭 Available shows for worst performance:', shows.length);

        // Find the performance with the lowest weighted rating
        let worstPerformance = null;
        let lowestRating = Infinity;

        completedPerformances.forEach(performance => {
            console.log('🎭 Checking performance ID:', performance.id, 'show_id:', performance.show_id);
            
            // Use weighted_rating field (this is what the database actually stores)
            const rating = parseFloat(performance.weighted_rating) || 0;
            
            console.log('📊 Rating from weighted_rating:', rating);
            
            if (rating > 0 && rating < lowestRating) {
                lowestRating = rating;
                worstPerformance = performance;
                console.log('💔 New worst performance found with rating:', rating);
            }
        });

        if (worstPerformance && lowestRating < Infinity) {
            // Get show name from show_id
            const show = shows.find(s => s.id === worstPerformance.show_id);
            const showName = show ? show.title : 'Unknown Show';
            
            // Use correct field names from database
            const date = worstPerformance.date_seen ? new Date(worstPerformance.date_seen).toLocaleDateString('en-GB') : 'Unknown Date';
            const theatre = worstPerformance.theatre_name || 'Unknown Theatre';
            
            console.log('✅ Worst performance found:', showName, 'Date:', date, 'Theatre:', theatre, 'Rating:', lowestRating);
            this.updateWorstShowDisplay(showName, date, theatre);
        } else {
            console.log('❌ No valid rating found in any performance');
            this.updateWorstShowDisplay('-', '-', '-');
        }
    }

    updateWorstShowDisplay(showName, date, theatre) {
        const nameElement = document.getElementById('worst-show-name');
        const dateElement = document.getElementById('worst-show-date');
        const theatreElement = document.getElementById('worst-show-theatre');

        if (nameElement) nameElement.textContent = showName;
        if (dateElement) dateElement.textContent = date;
        if (theatreElement) theatreElement.textContent = theatre;
    }

    // Expense Analytics Methods
    // DISABLED: updateExpenseStats(expenseStats) - using live data calculation instead
    // This function was using cached stats which caused deleted performances to still show in expenses
    /*
    updateExpenseStats(expenseStats) {
        console.log('updateExpenseStats called with:', expenseStats);
        
        if (!expenseStats) {
            console.log('No expense stats provided');
            return;
        }

        // Handle both nested and flat structure
        const stats = expenseStats.expense_stats || expenseStats;
        console.log('Using stats:', stats);

        // Update expense summary cards
        const totalSpentElement = document.getElementById('total-spent');
        const avgTicketElement = document.getElementById('avg-ticket-price');
        const highestTicketElement = document.getElementById('highest-ticket');
        const totalPerformancesWithCosts = document.getElementById('performances-with-costs');

        if (totalSpentElement && stats.total_spent !== undefined) {
            totalSpentElement.textContent = `£${stats.total_spent.toFixed(2)}`;
            console.log('Updated total spent:', stats.total_spent);
        }
        if (avgTicketElement && stats.average_ticket_price !== undefined) {
            const avgTicketPerPerson = stats.average_ticket_price / 2; // Divide by 2 for carer tickets
            avgTicketElement.textContent = `£${avgTicketPerPerson.toFixed(2)}`;
            console.log('Updated avg ticket price (per person):', avgTicketPerPerson);
        }
        if (highestTicketElement && stats.highest_ticket_price !== undefined) {
            const highestTicketPerPerson = stats.highest_ticket_price / 2; // Divide by 2 for carer tickets
            highestTicketElement.textContent = `£${highestTicketPerPerson.toFixed(2)}`;
            console.log('Updated highest ticket (per person):', highestTicketPerPerson);
        }
        if (totalPerformancesWithCosts && stats.performances_with_costs !== undefined) {
            totalPerformancesWithCosts.textContent = stats.performances_with_costs;
            console.log('Updated performances with costs:', stats.performances_with_costs);
        }
    }
    */

    renderExpenseCharts(expenseStats) {
        console.log('renderExpenseCharts called with:', expenseStats);
        
        if (!expenseStats) {
            console.log('No expense stats for charts');
            return;
        }

        // Handle both nested and flat structure
        const stats = expenseStats.expense_stats || expenseStats;
        console.log('Using stats for charts:', stats);

        // Render spending by city chart
        this.renderSpendingByCity(stats.spending_by_city);
        
        // Render monthly spending for current year
        this.renderMonthlySpending();
        
        // Render expense breakdown
        this.renderExpenseBreakdown(stats);
    }

    renderSpendingByCity(spendingByCity) {
        const container = document.getElementById('spending-by-city-chart');
        if (!container || !spendingByCity) return;

        const cities = Object.keys(spendingByCity);
        if (cities.length === 0) {
            container.innerHTML = '<p class="empty-state">No expense data available</p>';
            return;
        }

        const maxSpending = Math.max(...Object.values(spendingByCity));
        
        container.innerHTML = `
            <h4><i class="fas fa-map-marker-alt"></i> Spending by City</h4>
            <div class="chart-bars">
                ${cities.map(city => {
                    const amount = spendingByCity[city];
                    const percentage = (amount / maxSpending) * 100;
                    return `
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">${city}</div>
                            <div class="chart-bar-container">
                                <div class="chart-bar" style="width: ${percentage}%; background: var(--primary-color);"></div>
                                <span class="chart-bar-value">£${amount.toFixed(2)}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderMonthlySpending() {
        const container = document.getElementById('monthly-spending-chart');
        if (!container) return;

        const currentYear = new Date().getFullYear();
        const monthlyData = window.db.getMonthlySpending(currentYear);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const maxSpending = Math.max(...monthlyData, 1);
        
        container.innerHTML = `
            <h4><i class="fas fa-calendar-alt"></i> Monthly Spending ${currentYear}</h4>
            <div class="chart-bars">
                ${monthlyData.map((amount, index) => {
                    const percentage = (amount / maxSpending) * 100;
                    return `
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">${months[index]}</div>
                            <div class="chart-bar-container">
                                <div class="chart-bar" style="width: ${percentage}%; background: var(--success-color);"></div>
                                <span class="chart-bar-value">£${amount.toFixed(0)}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderExpenseBreakdown(expenseStats) {
        const container = document.getElementById('expense-breakdown-chart');
        if (!container) return;

        const breakdown = [
            { label: 'Tickets', amount: expenseStats.total_tickets, color: 'var(--primary-color)' },
            { label: 'Booking Fees', amount: expenseStats.total_booking_fees, color: 'var(--warning-color)' },
            { label: 'Travel', amount: expenseStats.total_travel, color: 'var(--info-color)' },
            { label: 'Other', amount: expenseStats.total_other, color: 'var(--secondary-color)' }
        ].filter(item => item.amount > 0);

        const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
        
        if (total === 0) {
            container.innerHTML = '<p class="empty-state">No expense breakdown available</p>';
            return;
        }

        container.innerHTML = `
            <h4><i class="fas fa-chart-pie"></i> Expense Breakdown</h4>
            <div class="pie-chart-legend">
                ${breakdown.map(item => {
                    const percentage = ((item.amount / total) * 100).toFixed(1);
                    return `
                        <div class="legend-item">
                            <div class="legend-color" style="background: ${item.color};"></div>
                            <span class="legend-label">${item.label}</span>
                            <span class="legend-value">£${item.amount.toFixed(2)} (${percentage}%)</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderBestByCategory(performances) {
        const container = document.getElementById('best-categories');
        if (!container || performances.length === 0) {
            if (container) container.innerHTML = '<p>No rated performances yet.</p>';
            return;
        }

        const categories = [
            { key: 'music_songs', label: 'Music/Songs' },
            { key: 'story_plot', label: 'Story/Plot' },
            { key: 'performance_cast', label: 'Performance' },
            { key: 'stage_visuals', label: 'Stage & Visuals' },
            { key: 'rewatch_value', label: 'Rewatch Value' }
        ];

        let html = '';
        categories.forEach(category => {
            const best = performances.reduce((prev, current) => 
                current.rating[category.key] > prev.rating[category.key] ? current : prev
            );
            const show = window.db.getShowById(best.show_id);
            
            html += `
                <div class="category-item">
                    <span class="category-show">${category.label}: ${show ? show.title : 'Unknown'}</span>
                    <div class="category-rating">
                        <span class="category-score">${parseFloat(best.rating[category.key]).toFixed(2)}</span>
                        ${this.generateStars(best.rating[category.key])}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    renderProductionTypes(performances) {
        const container = document.getElementById('production-types');
        if (!container) return;

        const typeCount = {};
        performances.forEach(p => {
            typeCount[p.production_type] = (typeCount[p.production_type] || 0) + 1;
        });

        const total = performances.length;
        let html = '<div class="bar-chart">';
        
        Object.entries(typeCount)
            .sort(([,a], [,b]) => b - a)
            .forEach(([type, count]) => {
                const percentage = (count / total * 100).toFixed(2);
                html += `
                    <div class="bar-item">
                        <div class="bar-label">${type}</div>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="bar-value">${count}</div>
                    </div>
                `;
            });
        
        html += '</div>';
        container.innerHTML = html;
    }

    renderRatingDistribution(performances) {
        const container = document.getElementById('rating-distribution');
        if (!container) return;

        // Filter to only rated performances
        const ratedPerformances = performances.filter(p => (p.weighted_rating || 0) > 0);
        
        if (ratedPerformances.length === 0) {
            container.innerHTML = '<div class="rating-bar"><div class="rating-label">No ratings yet</div></div>';
            return;
        }

        // Create distribution based on star ratings (like the new system)
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratedPerformances.forEach(p => {
            const rating = parseFloat(p.weighted_rating) || 0;
            if (rating >= 4.5) distribution[5]++;
            else if (rating >= 3.5) distribution[4]++;
            else if (rating >= 2.5) distribution[3]++;
            else if (rating >= 1.5) distribution[2]++;
            else if (rating >= 0.5) distribution[1]++;
        });

        const total = ratedPerformances.length;
        
        // Generate HTML using the same structure as the new system
        const distributionText = [5, 4, 3, 2, 1].map(rating => {
            const count = distribution[rating] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return `${count} performances rated ${rating} stars (${percentage.toFixed(1)}%)`;
        }).join(', ');
        
        container.innerHTML = `
            <div class="sr-only" aria-live="polite" id="rating-distribution-description">
                Rating distribution: ${distributionText}. Total performances rated: ${total}.
            </div>
            ${[5, 4, 3, 2, 1].map(rating => {
                const count = distribution[rating] || 0;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return `
                    <div class="rating-bar" role="img" aria-label="${count} performances rated ${rating} stars, ${percentage.toFixed(1)}% of total">
                        <div class="rating-label">${rating} ⭐</div>
                        <div class="rating-progress">
                            <div class="rating-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="rating-count">${count}</div>
                    </div>
                `;
            }).join('')}
        `;
    }

    renderMonthlyActivity(performances) {
        const container = document.getElementById('monthly-activity');
        if (!container) return;

        const monthlyCount = {};
        performances.forEach(p => {
            const month = new Date(p.date_seen).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            });
            monthlyCount[month] = (monthlyCount[month] || 0) + 1;
        });

        const maxCount = Math.max(...Object.values(monthlyCount));
        let html = '<div class="bar-chart">';
        
        Object.entries(monthlyCount)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .forEach(([month, count]) => {
                const percentage = maxCount > 0 ? (count / maxCount * 100).toFixed(2) : 0;
                html += `
                    <div class="bar-item">
                        <div class="bar-label">${month}</div>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="bar-value">${count}</div>
                    </div>
                `;
            });
        
        html += '</div>';
        container.innerHTML = html;
    }

    // Edit and delete functionality
    editPerformance(performanceId) {
        console.log('🔧 === EDIT PERFORMANCE CALLED ===');
        console.log('🔧 Performance ID:', performanceId);
        
        const performance = window.db.getPerformanceById(performanceId);
        if (!performance) {
            console.error('❌ Performance not found for ID:', performanceId);
            this.showMessage('Performance not found!', 'error');
            return;
        }

        console.log('✅ Performance found:', performance);
        
        // Store the editing ID
        this.editingPerformanceId = performanceId;
        console.log('🔧 Set editingPerformanceId to:', this.editingPerformanceId);
        
        // Switch to add-performance page
        switchPage('add-performance');
        
        // Wait a moment for page to load, then populate form
        setTimeout(() => {
            this.populateEditForm(performance);
        }, 200);
    }

    populateEditForm(performance) {
        try {
            const show = window.db.getShowById(performance.show_id);
            
            // Update page title and button
            const pageTitle = document.querySelector('#add-performance h2');
            const submitButton = document.querySelector('#add-performance .btn-primary');
            console.log('🔧 Page title element:', pageTitle);
            console.log('🔧 Submit button element:', submitButton);
            if (pageTitle) {
                pageTitle.textContent = 'Edit Performance';
                console.log('✅ Updated page title to "Edit Performance"');
            }
            if (submitButton) {
                submitButton.textContent = 'Update Performance';
                console.log('✅ Updated button text to "Update Performance"');
            } else {
                console.error('❌ Submit button not found!');
            }
            
            // Find and select the show
            if (show) {
                const showSearch = document.getElementById('show-search');
                if (showSearch) {
                    showSearch.value = show.title;
                    // Simulate show selection
                    this.selectShow(show.id, 'local');
                }
            }
            
            // Populate basic fields
            const dateField = document.getElementById('date-seen');
            const theatreField = document.getElementById('theatre-name');
            const cityField = document.getElementById('city');
            const productionTypeField = document.getElementById('production-type');
            const notesAccessField = document.getElementById('notes-access');
            const generalNotesField = document.getElementById('general-notes');
            
            if (dateField) {
                dateField.value = performance.date_seen;
                // Trigger date change to handle future vs past performance logic
                this.handleDateChange();
            }
            if (theatreField) theatreField.value = performance.theatre_name;
            if (cityField) cityField.value = performance.city;
            if (productionTypeField) {
                productionTypeField.value = performance.production_type;
                // Trigger production type change to show/hide fields
                this.handleProductionTypeChange(performance.production_type);
            }
            
            // Populate musical checkbox
            const isMusicalField = document.getElementById('is-musical');
            if (isMusicalField) {
                isMusicalField.checked = performance.is_musical !== false; // Default to true if undefined
                // Trigger musical change to show/hide music rating
                this.handleMusicalChange(isMusicalField.checked);
            }
            if (notesAccessField) notesAccessField.value = performance.notes_on_access || '';
            if (generalNotesField) generalNotesField.value = performance.general_notes || '';
            
            // Populate ratings
            const ratingFields = [
                'music-songs', 'story-plot', 'performance-cast', 'stage-visuals',
                'rewatch-value', 'theatre-experience', 'programme', 'atmosphere'
            ];
            
            // Check if this is a future performance to determine rating handling
            const performanceDate = new Date(performance.date_seen);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            performanceDate.setHours(0, 0, 0, 0);
            const isFuturePerformance = performanceDate >= today;
            
            ratingFields.forEach(fieldId => {
                const element = document.getElementById(fieldId);
                const ratingKey = fieldId.replace(/-/g, '_'); // Replace ALL hyphens with underscores
                if (element && performance.rating[ratingKey] !== undefined) {
                    let ratingValue = performance.rating[ratingKey];
                    
                    // Only set 0 ratings to 1 for PAST performances (for editing purposes)
                    // Future performances should keep 0 ratings as empty/0
                    if (ratingValue === 0 && !isFuturePerformance) {
                        ratingValue = 1;
                    }
                    
                    // For future performances with 0 ratings, set to empty string
                    if (ratingValue === 0 && isFuturePerformance) {
                        element.value = '';
                    } else {
                        element.value = ratingValue;
                    }
                    
                    // If the value wasn't set (maybe the option doesn't exist), log it
                    if (element.value !== ratingValue.toString() && !isFuturePerformance) {
                        console.warn(`Could not set ${fieldId} to ${ratingValue}, closest available:`, element.value);
                    }
                }
            });
            
            // Populate expense fields
            const ticketPriceField = document.getElementById('ticket-price');
            const currencyField = document.getElementById('currency');
            const seatLocationField = document.getElementById('seat-location');
            const bookingFeeField = document.getElementById('booking-fee');
            const travelCostField = document.getElementById('travel-cost');
            const otherExpensesField = document.getElementById('other-expenses');
            
            if (ticketPriceField) ticketPriceField.value = performance.ticket_price || 0;
            if (currencyField) currencyField.value = performance.currency || 'GBP';
            if (seatLocationField) seatLocationField.value = performance.seat_location || '';
            if (bookingFeeField) bookingFeeField.value = performance.booking_fee || 0;
            if (travelCostField) travelCostField.value = performance.travel_cost || 0;
            if (otherExpensesField) otherExpensesField.value = performance.other_expenses || 0;
            
            // Update total cost display
            setTimeout(() => {
                calculateTotalCost();
            }, 100);
            
            // Show a summary of the current ratings for user reference
            const ratingSummary = ratingFields.map(fieldId => {
                const ratingKey = fieldId.replace(/-/g, '_'); // Replace ALL hyphens with underscores
                const value = performance.rating[ratingKey] || 0;
                return `${fieldId.replace(/-/g, ' ')}: ${value}`; // Replace ALL hyphens with spaces for display
            }).join(', ');
            
            console.log('Form populated successfully with expense data');
            console.log('Current ratings:', ratingSummary);
            console.log('Expense data:', {
                ticket_price: performance.ticket_price || 0,
                currency: performance.currency || 'GBP',
                booking_fee: performance.booking_fee || 0,
                travel_cost: performance.travel_cost || 0,
                other_expenses: performance.other_expenses || 0
            });
            
            // Show a message with current ratings
            setTimeout(() => {
                this.showMessage(`Editing: ${show ? show.title : 'Unknown Show'} - Current ratings loaded`, 'info');
            }, 500);
            
        } catch (error) {
            console.error('Error populating edit form:', error);
            this.showMessage('Error loading performance data for editing', 'error');
        }
    }

    async selectShow(showId, source = 'local') {
        console.log('=== SELECT SHOW CALLED ===');
        console.log('Show ID:', showId, 'Source:', source);
        
        let show = window.db.getShowById(showId);
        console.log('Found show in DB:', show);
        
        // If show is not in local database, we need to add it
        if (!show) {
            if (source === 'wikidata' && showId.startsWith('wikidata-')) {
                // Get the show data from the search results
                const wikidataId = showId.replace('wikidata-', '');
                
                // Search again to get the full data (this is cached in modern browsers)
                try {
                    const searchQuery = document.getElementById('show-search')?.value || '';
                    const searchResults = await window.api.searchShows(searchQuery);
                    const wikidataShow = searchResults.find(s => s.id === showId);
                    
                    if (wikidataShow) {
                        // Convert Wikidata format to local database format
                        const showData = {
                            title: wikidataShow.title,
                            synopsis: wikidataShow.synopsis || '',
                            composer: wikidataShow.composer || '',
                            lyricist: wikidataShow.lyricist || '',
                            poster_image_url: wikidataShow.poster_image_url || '',
                            wikidata_id: wikidataShow.wikidata_id,
                            premiere_date: wikidataShow.premiere_date,
                            genre: wikidataShow.genre,
                            based_on: wikidataShow.based_on,
                            external_url: wikidataShow.external_url
                        };
                        
                        show = window.db.addShow(showData);
                        console.log('Created show from Wikidata:', show);
                        
                        // Show success message
                        this.showMessage(`Added "${show.title}" from Wikidata with rich details!`, 'success');
                    }
                } catch (error) {
                    console.error('Error fetching Wikidata show details:', error);
                }
            } else if ((source === 'demo' && showId.startsWith('demo_')) || 
                       (source === 'musical-db' && showId.startsWith('musical_'))) {
                // Handle demo shows or musical database shows
                let sourceShow = null;
                
                if (showId.startsWith('musical_') && window.MusicalDatabase) {
                    const allMusicals = window.MusicalDatabase.getMusicals();
                    sourceShow = allMusicals.find(s => s.id === showId);
                    console.log('Found musical database show:', sourceShow);
                } else {
                    const demoShows = window.api.getDemoShows();
                    sourceShow = demoShows.find(s => s.id === showId);
                    console.log('Found demo show:', sourceShow);
                }
                
                if (sourceShow) {
                    const { id, source: srcType, ...showData } = sourceShow; // Remove ID and source fields
                    show = window.db.addShow(showData);
                    console.log('Created show from source:', show);
                }
            }
        }
        
        if (!show) {
            console.log('Show not found and could not be created!');
            this.showMessage('Could not select show. Please try again.', 'error');
            return;
        }
        
        this.currentShow = show;
        console.log('Current show set to:', this.currentShow);
        
        // Update show details display with rich information
        const showDetails = document.getElementById('show-details');
        
        if (showDetails) {
            showDetails.classList.remove('hidden');
            
            // Create rich show details HTML
            let detailsHTML = `
                <div style="display: flex; gap: 1rem; align-items: flex-start; padding: 1rem; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                    ${show.poster_image_url ? `
                        <img src="${show.poster_image_url}" alt="${show.title}" 
                             style="width: 120px; height: 160px; object-fit: cover; border-radius: 6px; flex-shrink: 0;"
                             onerror="this.style.display='none'">
                    ` : ''}
                    <div style="flex-grow: 1;">
                        <h3 style="margin: 0 0 0.5rem 0; color: #2c5aa0; font-size: 1.3rem;">${show.title}</h3>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-bottom: 0.75rem;">
                            <div><strong>Composer:</strong> ${show.composer || 'Unknown'}</div>
                            <div><strong>Lyricist:</strong> ${show.lyricist || 'Unknown'}</div>
                            ${show.premiere_date ? `<div><strong>Premiered:</strong> ${new Date(show.premiere_date).getFullYear()}</div>` : ''}
                            ${show.genre ? `<div><strong>Genre:</strong> ${show.genre}</div>` : ''}
                        </div>
                        
                        ${show.based_on ? `<div style="margin-bottom: 0.5rem;"><strong>Based on:</strong> ${show.based_on}</div>` : ''}
                        
                        <p style="margin: 0; line-height: 1.4; color: #444;">
                            ${show.synopsis || 'No synopsis available.'}
                        </p>
                        
                        ${show.wikidata_id ? `
                            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #dee2e6;">
                                <small style="color: #666;">
                                    <i class="fas fa-globe"></i> Enhanced with data from 
                                    <a href="https://www.wikidata.org/wiki/${show.wikidata_id}" target="_blank" style="color: #2c5aa0;">Wikidata</a>
                                </small>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            showDetails.innerHTML = detailsHTML;
        }
        
        // Hide search results after selection
        this.hideSearchResults();
        
        console.log('Show selected with enhanced details:', show.title);
    }

         handleProductionTypeChange(productionType) {
         console.log('Production type changed to:', productionType);
         
         const experienceGroups = [
             'theatre-experience-group',
             'programme-group', 
             'atmosphere-group'
         ];

         experienceGroups.forEach(groupId => {
             const group = document.getElementById(groupId);
             if (group) {
                 const select = group.querySelector('select');
                 if (productionType === 'Pro Shot') {
                     group.classList.add('pro-shot-hidden');
                     // Set ARIA attributes for hidden state
                     group.setAttribute('aria-hidden', 'true');
                     if (select) {
                         select.setAttribute('aria-hidden', 'true');
                         select.setAttribute('aria-disabled', 'true');
                         select.value = '';
                         // Remove required attribute for Pro Shot
                         select.removeAttribute('required');
                     }
                 } else {
                     group.classList.remove('pro-shot-hidden');
                     // Set ARIA attributes for visible state
                     group.setAttribute('aria-hidden', 'false');
                     if (select) {
                         select.setAttribute('aria-hidden', 'false');
                         select.removeAttribute('aria-disabled');
                         // Add required attribute back for non-Pro Shot
                         select.setAttribute('required', 'required');
                     }
                 }
             }
         });
     }

     handleMusicalChange(isMusical) {
         console.log('Musical status changed to:', isMusical);
         
         const musicGroup = document.getElementById('music-songs-group');
         const musicSelect = document.getElementById('music-songs');
         
         if (musicGroup && musicSelect) {
             if (!isMusical) {
                 musicGroup.classList.add('non-musical-hidden');
                 // Set ARIA attributes for hidden state
                 musicGroup.setAttribute('aria-hidden', 'true');
                 musicSelect.setAttribute('aria-hidden', 'true');
                 musicSelect.setAttribute('aria-disabled', 'true');
                 
                 // Only clear the music rating for non-musicals if we're not editing an existing performance
                 if (!this.editingPerformanceId) {
                     musicSelect.value = '';
                 }
                 // Remove required attribute for non-musicals
                 musicSelect.removeAttribute('required');
                 console.log('✅ Removed required attribute from music-songs (non-musical)');
                 
                 // Announce the change to screen readers
                 this.announceToScreenReader('Music/Songs rating field hidden for non-musical performance', 'info');
             } else {
                 musicGroup.classList.remove('non-musical-hidden');
                 // Reset ARIA attributes for visible state
                 musicGroup.setAttribute('aria-hidden', 'false');
                 musicSelect.setAttribute('aria-hidden', 'false');
                 musicSelect.removeAttribute('aria-disabled');
                 
                 // Add required attribute for musicals
                 musicSelect.setAttribute('required', 'required');
                 console.log('✅ Added required attribute to music-songs (musical)');
                 
                 // Announce the change to screen readers
                 this.announceToScreenReader('Music/Songs rating field shown for musical performance', 'info');
             }
         }
     }

     handleDateChange() {
         const dateField = document.getElementById('date-seen');
         if (!dateField || !dateField.value) return;
         
         const performanceDate = new Date(dateField.value);
         const today = new Date();
         today.setHours(0, 0, 0, 0);
         performanceDate.setHours(0, 0, 0, 0);
         
         const isFuturePerformance = performanceDate >= today;
         
         // Update rating labels and required attributes
         const ratingGroups = document.querySelectorAll('.rating-group');
         ratingGroups.forEach(group => {
             const label = group.querySelector('label');
             const select = group.querySelector('select');
             
             if (label && select) {
                 const baseText = label.textContent.replace(' *', '').replace(' (optional)', '');
                 
                 if (isFuturePerformance) {
                     label.textContent = baseText + ' (optional)';
                     label.style.color = '#666';
                     label.style.fontStyle = 'italic';
                     
                     // Remove required attribute for future performances
                     select.removeAttribute('required');
                 } else {
                     label.textContent = baseText + ' *';
                     label.style.color = '';
                     label.style.fontStyle = '';
                     
                     // Add required attribute for past performances
                     select.setAttribute('required', 'required');
                 }
             }
         });
         
         // Show message about rating requirements
         if (isFuturePerformance) {
             this.showMessage('This is an upcoming performance - ratings are optional and can be added later.', 'info');
         }
     }

         resetForm() {
         try {
             console.log('Resetting form - current editingPerformanceId:', this.editingPerformanceId);
             
             // Reset state first
             this.currentShow = null;
             this.editingPerformanceId = null;
             
             // Reset the form
             const form = document.getElementById('performance-form');
             if (form) form.reset();
             
             // Clear show search field
             const showSearch = document.getElementById('show-search');
             if (showSearch) showSearch.value = '';
             
             // Hide show details
             const showDetails = document.getElementById('show-details');
             if (showDetails) showDetails.classList.add('hidden');
             
             // Hide search results
             this.hideSearchResults();
             
             // Reset all form fields explicitly
             const formFields = [
                 'date-seen', 'theatre-name', 'city', 'production-type', 
                 'notes-access', 'general-notes'
             ];
             
             formFields.forEach(fieldId => {
                 const field = document.getElementById(fieldId);
                 if (field) {
                     field.value = '';
                     if (field.tagName === 'SELECT') {
                         field.selectedIndex = 0;
                     }
                 }
             });
             
             // Reset rating selects explicitly
             const ratingSelects = [
                 'music-songs', 'story-plot', 'performance-cast', 
                 'stage-visuals', 'rewatch-value', 'theatre-experience', 
                 'programme', 'atmosphere'
             ];
             
             ratingSelects.forEach(selectId => {
                 const select = document.getElementById(selectId);
                 if (select) {
                     select.selectedIndex = 0;
                     select.value = '';
                 }
             });

             // Show all rating groups (remove Pro Shot and non-musical hiding) and reset labels
             document.querySelectorAll('.rating-group').forEach(group => {
                 group.classList.remove('pro-shot-hidden');
                 group.classList.remove('non-musical-hidden');
                 // Reset ARIA attributes for visible state
                 group.setAttribute('aria-hidden', 'false');
                 const select = group.querySelector('select');
                 if (select) {
                     select.setAttribute('aria-hidden', 'false');
                     select.removeAttribute('aria-disabled');
                 }
                 
                 // Reset rating labels to required state
                 const label = group.querySelector('label');
                 
                 if (label) {
                     const baseText = label.textContent.replace(' *', '').replace(' (optional)', '');
                     label.textContent = baseText + ' *';
                     label.style.color = '';
                     label.style.fontStyle = '';
                 }
                 
                 // Restore required attribute
                 if (select) {
                     select.setAttribute('required', 'required');
                 }
             });
             
             // Reset musical checkbox to checked (default)
             const isMusicalField = document.getElementById('is-musical');
             if (isMusicalField) {
                 isMusicalField.checked = true;
             }
             
            // Reset form title and button text
            const pageTitle = document.querySelector('#add-performance h2');
            const submitButton = document.querySelector('#add-performance .btn-primary');
            if (pageTitle) pageTitle.textContent = 'Add New Performance';
            if (submitButton) submitButton.textContent = 'Save Performance';
            
            // Call handleDateChange to properly set rating requirements based on current date
            this.handleDateChange();
            
            console.log('Form reset successfully - ready for new performance');
             
         } catch (error) {
             console.error('Error resetting form:', error);
         }
     }

    // Form handling
    savePerformance() {
        console.log('🎭 === SAVE PERFORMANCE FUNCTION CALLED ===');
        console.log('🎭 Current show:', this.currentShow);
        console.log('🎭 Editing performance ID:', this.editingPerformanceId);
        console.log('🎭 Function context (this):', this);
        
        if (!this.currentShow) {
            console.log('No show selected, showing error message');
            this.showMessage('Please select a show first.', 'error');
            return;
        }

        // Collect form data
        const dateField = document.getElementById('date-seen');
        const theatreField = document.getElementById('theatre-name');
        const cityField = document.getElementById('city');
        const productionTypeField = document.getElementById('production-type');
        const notesAccessField = document.getElementById('notes-access');
        const generalNotesField = document.getElementById('general-notes');
        
        // Collect expense data
        const ticketPriceField = document.getElementById('ticket-price');
        const currencyField = document.getElementById('currency');
        const seatLocationField = document.getElementById('seat-location');
        const bookingFeeField = document.getElementById('booking-fee');
        const travelCostField = document.getElementById('travel-cost');
        const otherExpensesField = document.getElementById('other-expenses');
        
        if (!dateField?.value || !theatreField?.value || !cityField?.value || !productionTypeField?.value) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Collect rating data - handle empty strings properly
        const getRatingValue = (elementId) => {
            const value = document.getElementById(elementId)?.value;
            return value && value !== '' ? parseFloat(value) : 0;
        };
        
        const rating = {
            music_songs: getRatingValue('music-songs'),
            story_plot: getRatingValue('story-plot'),
            performance_cast: getRatingValue('performance-cast'),
            stage_visuals: getRatingValue('stage-visuals'),
            rewatch_value: getRatingValue('rewatch-value')
        };

        // Add experience ratings for non-Pro Shot productions
        if (productionTypeField.value !== 'Pro Shot') {
            rating.theatre_experience = getRatingValue('theatre-experience');
            rating.programme = getRatingValue('programme');
            rating.atmosphere = getRatingValue('atmosphere');
        } else {
            rating.theatre_experience = 0;
            rating.programme = 0;
            rating.atmosphere = 0;
        }

                 // Check if this is a future performance
         const performanceDate = new Date(dateField.value);
         const today = new Date();
         today.setHours(0, 0, 0, 0);
         performanceDate.setHours(0, 0, 0, 0);
         
         const isFuturePerformance = performanceDate >= today;
         
         console.log('Performance date validation:', {
             dateString: dateField.value,
             performanceDate: performanceDate,
             today: today,
             isFuturePerformance: isFuturePerformance,
             ratings: rating
         });
         
        // Validate ratings (only required for past performances)
        if (!isFuturePerformance) {
            const requiredRatings = ['music_songs', 'story_plot', 'performance_cast', 'stage_visuals', 'rewatch_value'];
            for (const ratingType of requiredRatings) {
                const ratingValue = rating[ratingType];
                const displayName = this.getFieldDisplayName(ratingType);
                if (ratingValue === 0) {
                    this.showMessage(`Please provide a rating for ${displayName} for past performances.`, 'error');
                    return;
                }
                if (ratingValue > 0 && (ratingValue < 0.25 || ratingValue > 5.0)) {
                    this.showMessage(`Please provide a valid rating for ${displayName} (0.25 - 5.0).`, 'error');
                    return;
                }
            }
        } else {
             // For future performances, just validate range if ratings are provided
             const allRatings = ['music_songs', 'story_plot', 'performance_cast', 'stage_visuals', 'rewatch_value'];
             if (productionTypeField.value !== 'Pro Shot') {
                 allRatings.push('theatre_experience', 'programme', 'atmosphere');
             }
             
             for (const ratingType of allRatings) {
                 const ratingValue = rating[ratingType];
                 if (ratingValue > 0 && (ratingValue < 0.25 || ratingValue > 5.0)) {
                     const displayName = this.getFieldDisplayName(ratingType);
                     this.showMessage(`Please provide a valid rating for ${displayName} (0.25 - 5.0).`, 'error');
                     return;
                 }
             }
         }

        // Get musical status
        const isMusicalField = document.getElementById('is-musical');
        const isMusical = isMusicalField ? isMusicalField.checked : true;

        const performanceData = {
            show_id: this.currentShow.id,
            date_seen: dateField.value,
            theatre_name: theatreField.value,
            city: cityField.value,
            production_type: productionTypeField.value,
            is_musical: isMusical,
            notes_on_access: notesAccessField?.value || '',
            general_notes: generalNotesField?.value || '',
            // Expense tracking
            ticket_price: parseFloat(ticketPriceField?.value || 0),
            currency: currencyField?.value || 'GBP',
            seat_location: seatLocationField?.value || '',
            booking_fee: parseFloat(bookingFeeField?.value || 0),
            travel_cost: parseFloat(travelCostField?.value || 0),
            other_expenses: parseFloat(otherExpensesField?.value || 0),
            rating: rating
        };

        try {
            if (this.editingPerformanceId) {
                // Update existing performance
                window.db.updatePerformance(this.editingPerformanceId, performanceData);
                this.showMessage('Performance updated successfully!', 'success');
                this.editingPerformanceId = null;
            } else {
                // Add new performance
                window.db.addPerformance(performanceData);
                this.showMessage('Performance saved successfully!', 'success');
            }
            
            // Refresh analytics automatically
            this.loadAnalytics();
            
            this.resetForm();
            switchPage('dashboard');
        } catch (error) {
            console.error('❌ Error saving performance:', error);
            console.error('❌ Error stack:', error.stack);
            this.showMessage('Error saving performance: ' + error.message, 'error');
        }
    }

    async searchShows(query) {
        console.log('=== SEARCHING FOR SHOWS ===', query);
        
        try {
            // Search local database first
            const localShows = window.db.searchShows(query);
            console.log('Local shows found:', localShows.length, localShows);
            
            // Search external APIs (Wikidata) for more results
            console.log('Starting external API search...');
            const externalShows = await window.api.searchShows(query);
            console.log('External shows found:', externalShows.length, externalShows);
            
            // Combine results, prioritizing local shows
            const allShows = [...localShows, ...externalShows];
            console.log('Combined shows:', allShows.length);
            
            // Remove duplicates based on title similarity
            const uniqueShows = this.deduplicateShows(allShows);
            console.log('Unique shows after deduplication:', uniqueShows.length);
            
            if (uniqueShows.length > 0) {
                console.log('Displaying search results...');
                this.displaySearchResults(uniqueShows.slice(0, 8), 'mixed');
            } else {
                console.log('No shows found, showing empty state');
                this.displaySearchResults([], 'empty');
            }
        } catch (error) {
            console.error('Error in show search:', error);
            console.error('Error details:', error.message, error.stack);
            
            // Fallback to local search only
            const localShows = window.db.searchShows(query);
            console.log('Fallback to local shows only:', localShows.length);
            this.displaySearchResults(localShows, 'local');
        }
    }
    
    // Remove duplicate shows based on title similarity
    deduplicateShows(shows) {
        const seen = new Map();
        const result = [];
        
        for (const show of shows) {
            // Create a normalized title for comparison
            const normalizedTitle = show.title.toLowerCase()
                .replace(/[^\w\s]/g, '')  // Remove punctuation
                .replace(/\s+/g, ' ')     // Normalize whitespace
                .trim();
            
            if (!seen.has(normalizedTitle)) {
                seen.set(normalizedTitle, true);
                result.push(show);
            }
        }
        
        return result;
    }

    displaySearchResults(shows, source) {
        const resultsContainer = document.getElementById('show-suggestions');
        if (!resultsContainer) {
            console.log('Search results container not found');
            return;
        }
        
        console.log('Displaying search results:', shows.length, 'shows');
        
        // Get search query for announcements
        const searchValue = document.getElementById('show-search')?.value || '';
        
        // Announce search results to screen readers
        this.announceSearchResults(shows.length, searchValue);
        
        if (shows.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-result" style="padding: 1rem; text-align: center; border: 1px dashed #ccc; background: #f9f9f9;">
                    <p style="margin: 0 0 0.5rem 0;">No shows found for "${searchValue}"</p>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="window.app.createCustomShow()">
                        <i class="fas fa-plus"></i> Create "${searchValue}"
                    </button>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = shows.map(show => {
                const sourceIcon = this.getSourceIcon(show.source);
                const genreIcon = this.getGenreIcon(show.genre);
                const additionalInfo = this.getAdditionalShowInfo(show);
                
                console.log('Displaying show:', show.title, 'Composer:', show.composer, 'Source:', show.source);
                
                // Handle different composer field formats and N/A values
                let composerDisplay = show.composer || 'Unknown';
                if (composerDisplay === 'N/A') {
                    composerDisplay = (show.genre === 'Play') ? 'Playwright' : 'Unknown';
                }
                
                let lyricistDisplay = '';
                if (show.lyricist && show.lyricist !== 'N/A' && show.lyricist !== show.composer && show.lyricist !== 'Unknown') {
                    if (show.genre === 'Play') {
                        lyricistDisplay = ` | <strong>Playwright:</strong> ${show.lyricist}`;
                    } else {
                        lyricistDisplay = ` | <strong>Lyricist:</strong> ${show.lyricist}`;
                    }
                }
                
                return `
                    <div class="search-result" onclick="window.app.selectShow('${show.id}', '${show.source || source}')" 
                         style="cursor: pointer; padding: 0.75rem; border: 1px solid #ddd; margin: 0.25rem 0; border-radius: 6px; background: #fff; transition: all 0.2s;">
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                            ${show.poster_image_url ? `
                                <img src="${show.poster_image_url}" alt="${show.title}" 
                                     style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px; flex-shrink: 0;"
                                     onerror="this.style.display='none'">
                            ` : ''}
                            <div style="flex-grow: 1; min-width: 0;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                    <h4 style="margin: 0; color: #2c5aa0; font-size: 1.1rem;">${show.title}</h4>
                                    <span style="font-size: 0.8rem; color: #666;">${genreIcon}</span>
                                    <span style="font-size: 0.8rem; color: #666;">${sourceIcon}</span>
                                </div>
                                <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem; color: #444; line-height: 1.3;">
                                    ${(show.synopsis || 'No description available').substring(0, 120)}${(show.synopsis || '').length > 120 ? '...' : ''}
                                </p>
                                <div style="font-size: 0.8rem; color: #666;">
                                    ${show.genre === 'Play' ? 
                                        `<span><strong>Playwright:</strong> ${show.lyricist || 'Unknown'}</span>` :
                                        `<span><strong>Composer:</strong> ${composerDisplay}</span>${lyricistDisplay}`
                                    }
                                </div>
                                ${additionalInfo}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        resultsContainer.classList.remove('hidden');
        
        // Add hover effects with JavaScript
        setTimeout(() => {
            document.querySelectorAll('.search-result[onclick]').forEach(result => {
                result.addEventListener('mouseenter', () => {
                    result.style.borderColor = '#2c5aa0';
                    result.style.boxShadow = '0 2px 8px rgba(44, 90, 160, 0.15)';
                });
                result.addEventListener('mouseleave', () => {
                    result.style.borderColor = '#ddd';
                    result.style.boxShadow = 'none';
                });
            });
        }, 100);
    }
    
    getSourceIcon(source) {
        switch (source) {
            case 'wikidata':
                return '<i class="fas fa-globe" title="From Wikidata"></i>';
            case 'local':
                return '<i class="fas fa-database" title="From your collection"></i>';
            case 'demo':
                return '<i class="fas fa-star" title="Popular show"></i>';
            case 'musical-db':
                return '<i class="fas fa-theater-masks" title="From theatre database"></i>';
            default:
                return '<i class="fas fa-question-circle" title="Unknown source"></i>';
        }
    }
    
    getGenreIcon(genre) {
        switch (genre) {
            case 'Musical':
                return '<i class="fas fa-music" title="Musical"></i>';
            case 'Play':
                return '<i class="fas fa-masks-theater" title="Play"></i>';
            case 'Opera':
                return '<i class="fas fa-volume-up" title="Opera"></i>';
            case 'Ballet':
                return '<i class="fas fa-running" title="Ballet"></i>';
            default:
                return '<i class="fas fa-theater-masks" title="Theatre"></i>';
        }
    }
    
    getAdditionalShowInfo(show) {
        const info = [];
        
        if (show.premiere_date) {
            info.push(`<strong>Premiered:</strong> ${new Date(show.premiere_date).getFullYear()}`);
        }
        
        if (show.genre) {
            info.push(`<strong>Genre:</strong> ${show.genre}`);
        }
        
        if (show.based_on) {
            info.push(`<strong>Based on:</strong> ${show.based_on}`);
        }
        
        if (info.length > 0) {
            return `<div style="font-size: 0.75rem; color: #888; margin-top: 0.25rem;">${info.join(' | ')}</div>`;
        }
        
        return '';
    }

    hideSearchResults() {
        const resultsContainer = document.getElementById('show-suggestions');
        if (resultsContainer) {
            resultsContainer.classList.add('hidden');
        }
    }

    createCustomShow() {
        const showSearch = document.getElementById('show-search');
        if (!showSearch) return;
        
        const title = showSearch.value.trim();
        if (!title) {
            this.showMessage('Please enter a show title first.', 'error');
            return;
        }

        const customShow = {
            title: title,
            synopsis: '',
            composer: '',
            lyricist: '',
            poster_image_url: ''
        };

        const savedShow = window.db.addShow(customShow);
        this.selectShow(savedShow.id, 'local');
        this.showMessage('Custom show created successfully!', 'success');
        this.hideSearchResults();
    }

    deletePerformance(performanceId) {
        if (confirm('Are you sure you want to delete this performance? This cannot be undone.')) {
            try {
                window.db.deletePerformance(performanceId);
                this.showMessage('Performance deleted successfully.', 'success');
                
                // Refresh analytics automatically
                console.log('🔄 Auto-refreshing analytics after delete...');
                this.loadAnalytics();
                
                this.loadDashboard();
            } catch (error) {
                console.error('Error deleting performance:', error);
                this.showMessage('Error deleting performance. Please try again.', 'error');
            }
        }
    }

    // Utility functions
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        if (type === 'error') { messageDiv.setAttribute('role', 'alert'); }
        messageDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 1.2rem; cursor: pointer;">&times;</button>
        `;

        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(messageDiv, mainContent.firstChild);
        }

        // Announce message to screen readers
        this.announceToScreenReader(message, type);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Announce messages to screen readers
    announceToScreenReader(message, type = 'info') {
        const announcementContainer = document.getElementById('message-announcements');
        if (announcementContainer) {
            // Clear previous announcement
            announcementContainer.textContent = '';
            
            // Add type prefix for context
            const typePrefix = type === 'error' ? 'Error: ' : 
                              type === 'success' ? 'Success: ' : 
                              type === 'info' ? 'Information: ' : '';
            
            // Set the announcement text
            announcementContainer.textContent = typePrefix + message;
            
            // Clear after a short delay to allow for re-announcement
            setTimeout(() => {
                announcementContainer.textContent = '';
            }, 1000);
        }
    }

    // Announce search results to screen readers
    announceSearchResults(count, query) {
        const searchAnnouncementContainer = document.getElementById('search-announcements');
        if (searchAnnouncementContainer) {
            // Clear previous announcement
            searchAnnouncementContainer.textContent = '';
            
            let announcement = '';
            if (count === 0) {
                announcement = `No shows found for "${query}". You can create a custom show if needed.`;
            } else if (count === 1) {
                announcement = `1 show found for "${query}".`;
            } else {
                announcement = `${count} shows found for "${query}".`;
            }
            
            // Set the announcement text
            searchAnnouncementContainer.textContent = announcement;
            
            // Clear after a short delay
            setTimeout(() => {
                searchAnnouncementContainer.textContent = '';
            }, 2000);
        }
    }

    // Enhanced keyboard navigation for rating dropdowns
    enhanceRatingDropdowns() {
        const ratingFields = [
            'music-songs', 'story-plot', 'performance-cast', 
            'stage-visuals', 'rewatch-value', 'theatre-experience', 
            'programme', 'atmosphere'
        ];

        ratingFields.forEach(fieldId => {
            const select = document.getElementById(fieldId);
            if (select) {
                // Add keyboard event listeners
                select.addEventListener('keydown', (e) => {
                    this.handleRatingKeyboardNavigation(e, select);
                });

                // Add focus event for better UX
                select.addEventListener('focus', () => {
                    select.setAttribute('aria-describedby', `${fieldId}-keyboard-help`);
                });
            }
        });
    }

    // Handle keyboard navigation for rating dropdowns
    handleRatingKeyboardNavigation(event, select) {
        const currentValue = parseFloat(select.value) || 0;
        const ratingOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0];
        
        switch (event.key) {
            case '1':
                event.preventDefault();
                select.value = '1.0';
                this.announceRatingChange(select, '1.0');
                break;
            case '2':
                event.preventDefault();
                select.value = '2.0';
                this.announceRatingChange(select, '2.0');
                break;
            case '3':
                event.preventDefault();
                select.value = '3.0';
                this.announceRatingChange(select, '3.0');
                break;
            case '4':
                event.preventDefault();
                select.value = '4.0';
                this.announceRatingChange(select, '4.0');
                break;
            case '5':
                event.preventDefault();
                select.value = '5.0';
                this.announceRatingChange(select, '5.0');
                break;
            case 'ArrowUp':
                event.preventDefault();
                const nextRating = this.getNextRating(currentValue, ratingOptions, 'up');
                if (nextRating !== null) {
                    select.value = nextRating.toString();
                    this.announceRatingChange(select, nextRating.toString());
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                const prevRating = this.getNextRating(currentValue, ratingOptions, 'down');
                if (prevRating !== null) {
                    select.value = prevRating.toString();
                    this.announceRatingChange(select, prevRating.toString());
                }
                break;
            case 'Home':
                event.preventDefault();
                select.value = '0.25';
                this.announceRatingChange(select, '0.25');
                break;
            case 'End':
                event.preventDefault();
                select.value = '5.0';
                this.announceRatingChange(select, '5.0');
                break;
            case 'Escape':
                event.preventDefault();
                select.value = '';
                this.announceRatingChange(select, 'no rating');
                break;
        }
    }

    // Get next rating value for arrow key navigation
    getNextRating(currentValue, ratingOptions, direction) {
        const currentIndex = ratingOptions.indexOf(currentValue);
        
        if (direction === 'up') {
            // Move to next higher rating
            if (currentIndex < ratingOptions.length - 1) {
                return ratingOptions[currentIndex + 1];
            } else if (currentValue === 0) {
                return ratingOptions[0]; // Start from 0.25 if no rating selected
            }
        } else if (direction === 'down') {
            // Move to next lower rating
            if (currentIndex > 0) {
                return ratingOptions[currentIndex - 1];
            } else if (currentValue === 0) {
                return ratingOptions[ratingOptions.length - 1]; // Go to 5.0 if no rating selected
            }
        }
        
        return null;
    }

    // Announce rating changes to screen readers
    announceRatingChange(select, newValue) {
        const fieldName = this.getFieldDisplayName(select.name);
        const announcement = `${fieldName} rating set to ${newValue}`;
        this.announceToScreenReader(announcement, 'info');
    }
}

// Load My Shows page
function loadMyShows() {
    try {
        // Load city filter for My Shows page
        loadMyShowsCityFilter();
        // Filter and render performances
        window.app.filterMyShowsPerformances();
    } catch (error) {
        console.error('❌ Error loading My Shows page:', error);
    }
}

// Load city filter for My Shows page
function loadMyShowsCityFilter() {
    console.log('🔍 DEBUG: loadMyShowsCityFilter called');
    const cityFilter = document.getElementById('my-shows-city-filter');
    console.log('🔍 DEBUG: City filter element found:', !!cityFilter);
    if (!cityFilter) return;
    
    const performances = window.db.getPerformances();
    console.log('🔍 DEBUG: Performances for city filter:', performances.length);
    const cities = [...new Set(performances.map(p => p.city))].sort();
    console.log('🔍 DEBUG: Unique cities found:', cities);
    
    cityFilter.innerHTML = '<option value="">All Cities</option>' + 
        cities.map(city => `<option value="${city}">${city}</option>`).join('');
    console.log('🔍 DEBUG: City filter populated');
}

// Global functions
function switchPage(pageId) {
    console.log('🔍 DEBUG: switchPage called with pageId:', pageId);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    console.log('🔍 DEBUG: Found', pages.length, 'pages');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    console.log('🔍 DEBUG: Found', navButtons.length, 'nav buttons');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    console.log('🔍 DEBUG: Target page found:', !!targetPage);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('🔍 DEBUG: Added active class to', pageId);
    }
    
    // Add active class to corresponding nav button
    const targetBtn = document.querySelector(`[data-page="${pageId}"]`);
    console.log('🔍 DEBUG: Target nav button found:', !!targetBtn);
    if (targetBtn) {
        targetBtn.classList.add('active');
        console.log('🔍 DEBUG: Added active class to nav button for', pageId);
    }
    
    // Load appropriate data
    if (pageId === 'dashboard') {
        console.log('🔍 DEBUG: Loading dashboard');
        window.app.loadDashboard();
    } else if (pageId === 'my-shows') {
        console.log('🔍 DEBUG: Loading My Shows page');
        loadMyShows();
    } else if (pageId === 'access-schemes') {
        window.app.loadAccessSchemes();
    } else if (pageId === 'analytics') {
        window.app.loadAnalytics();
         } else if (pageId === 'add-performance') {
         // Always reset form when navigating to add performance
         // The edit flow sets editingPerformanceId and then immediately calls populateEditForm
         // But direct navigation should always reset
         setTimeout(() => {
             if (!window.app.editingPerformanceId) {
                 window.app.resetForm();
             }
         }, 50);
     }
}

function showPerformanceDetail(performanceId) {
    const performance = window.db.getPerformanceById(performanceId);
    if (!performance) return;
    
    // Store the currently focused element
    window.lastFocusedElement = document.activeElement;
    
    const show = window.db.getShowById(performance.show_id);
    const modal = document.getElementById('performance-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = show ? show.title : 'Performance Details';
    
    const ratingCategories = [
        { key: 'music_songs', label: 'Music / Songs' },
        { key: 'story_plot', label: 'Story / Plot' },
        { key: 'performance_cast', label: 'Performance / Cast' },
        { key: 'stage_visuals', label: 'Stage & Visuals' },
        { key: 'rewatch_value', label: 'Rewatch Value' },
        { key: 'theatre_experience', label: 'Theatre Experience' },
        { key: 'programme', label: 'Programme' },
        { key: 'atmosphere', label: 'Atmosphere' }
    ];
    
    let ratingHtml = '<div class="rating-breakdown">';
    ratingCategories.forEach(category => {
        const rating = performance.rating[category.key] || 0;
        if (performance.production_type === 'Pro Shot' && 
            ['theatre_experience', 'programme', 'atmosphere'].includes(category.key)) {
            return; // Skip these for Pro Shot
        }
        if (!performance.is_musical && category.key === 'music_songs') {
            return; // Skip music/songs for non-musicals
        }
        
        ratingHtml += `
            <div class="rating-category">
                <h4>${category.label}</h4>
                <div class="rating-value">
                    <span class="rating-score">${parseFloat(rating).toFixed(2)}</span>
                    ${window.app.generateStars(rating)}
                </div>
            </div>
        `;
    });
    ratingHtml += '</div>';
    
    modalBody.innerHTML = `
        ${ratingHtml}
        <div class="performance-info">
            <div class="info-section">
                <h3>Performance Details</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Date Seen</span>
                        <span class="info-value">${window.app.formatDate(performance.date_seen)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Theatre</span>
                        <span class="info-value">${performance.theatre_name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">City</span>
                        <span class="info-value">${performance.city}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Production Type</span>
                        <span class="info-value">${performance.production_type}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Overall Rating</span>
                        <span class="info-value">${performance.weighted_rating.toFixed(2)} / 5.0</span>
                    </div>
                </div>
            </div>
            ${performance.notes_on_access ? `
                <div class="info-section">
                    <h3>Access Notes</h3>
                    <p>${performance.notes_on_access}</p>
                </div>
            ` : ''}
            ${performance.general_notes ? `
                <div class="info-section">
                    <h3>General Notes</h3>
                    <p>${performance.general_notes}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    modal.style.display = 'block';
}

function closePerformanceModal() {
    const modal = document.getElementById('performance-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Return focus to the trigger element
        if (window.lastFocusedElement) {
            window.lastFocusedElement.focus();
            window.lastFocusedElement = null;
        }
    }
}

// Data Export Function
function exportData() {
    try {
        // Get all StageLog data from localStorage
        const stagelogData = {
            exportDate: new Date().toISOString(),
            exportType: "StageLog Data Backup",
            version: "2.5.0",
            stagelog_shows: JSON.parse(localStorage.getItem('stagelog_shows') || '[]'),
            stagelog_performances: JSON.parse(localStorage.getItem('stagelog_performances') || '[]'),
            stagelog_access_schemes: JSON.parse(localStorage.getItem('stagelog_access_schemes') || '[]'),
            user_preferences: {
                theme: localStorage.getItem('theme') || 'light',
                lastBackup: new Date().toISOString()
            }
        };

        // Create filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:.]/g, '-');
        const filename = `stagelog-backup-${timestamp}.json`;

        // Create and download file
        const dataStr = JSON.stringify(stagelogData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        const count = stagelogData.stagelog_performances.length;
        alert(`✅ StageLog backup exported successfully!\n\n📁 File: ${filename}\n🎭 ${count} performances backed up\n\n💡 Save this file somewhere safe for backup!`);
        
        console.log('📁 Data export completed:', filename);
        
    } catch (error) {
        console.error('❌ Export error:', error);
        alert('❌ Error creating backup. Please try again or check the console for details.');
    }
}

function refreshAccessData() {
    window.db.refreshAccessSchemes();
    window.app.loadAccessSchemes();
    window.app.showMessage('Access schemes data refreshed successfully!', 'success');
}

// Global function to update shows with latest data
function updateShowsData() {
    console.log('Updating shows with latest data...');
    
    if (!window.db) {
        alert('Database not available!');
        return;
    }
    
    const updatedCount = window.db.updateShowsWithLatestData();
    
    // Refresh the dashboard to show updated data
    if (window.app && window.app.loadDashboard) {
        window.app.loadDashboard();
    }
    
    alert(`Updated ${updatedCount} shows with latest database information! Composer and other details should now be correctly displayed.`);
}

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log('Toggling theme from', currentTheme, 'to', newTheme);
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('preferred-theme', newTheme);
    
    // Update theme icons
    const themeIcon = document.getElementById('theme-icon');
    const settingsThemeIcon = document.getElementById('settings-theme-icon');
    
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    if (settingsThemeIcon) {
        settingsThemeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Debug: check computed styles
    const testCard = document.querySelector('.performance-card');
    if (testCard) {
        const styles = getComputedStyle(testCard);
        console.log('Card background after theme change:', styles.backgroundColor);
    }
}

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('preferred-theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = savedTheme || (systemDarkMode ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', defaultTheme);
    
    const themeIcon = document.getElementById('theme-icon');
    const settingsThemeIcon = document.getElementById('settings-theme-icon');
    
    if (themeIcon) {
        themeIcon.className = defaultTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    if (settingsThemeIcon) {
        settingsThemeIcon.className = defaultTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Expense Calculation Functions
function calculateTotalCost() {
    const ticketPrice = parseFloat(document.getElementById('ticket-price')?.value || 0);
    const bookingFee = parseFloat(document.getElementById('booking-fee')?.value || 0);
    const travelCost = parseFloat(document.getElementById('travel-cost')?.value || 0);
    const otherExpenses = parseFloat(document.getElementById('other-expenses')?.value || 0);
    const currency = document.getElementById('currency')?.value || 'GBP';
    
    const total = ticketPrice + bookingFee + travelCost + otherExpenses;
    const currencySymbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    
    const totalDisplay = document.getElementById('total-cost-display');
    if (totalDisplay) {
        totalDisplay.textContent = `${currencySymbol}${total.toFixed(2)}`;
    }
    
    return total;
}

// Format currency for display
function formatCurrency(amount, currency = 'GBP') {
    const currencySymbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
    return `${currencySymbol}${parseFloat(amount || 0).toFixed(2)}`;
}

// Performance Optimization - Caching Manager
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes
    }
    
    /**
     * Set cache value with optional TTL
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    set(key, value, ttl = this.defaultTTL) {
        this.cache.set(key, value);
        this.cacheExpiry.set(key, Date.now() + ttl);
    }
    
    /**
     * Get cached value if not expired
     * @param {string} key - Cache key
     * @returns {any|null} Cached value or null if expired/not found
     */
    get(key) {
        const expiry = this.cacheExpiry.get(key);
        if (!expiry || Date.now() > expiry) {
            this.delete(key);
            return null;
        }
        return this.cache.get(key);
    }
    
    /**
     * Delete cache entry
     * @param {string} key - Cache key
     */
    delete(key) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
    }
    
    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }
    
    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Batch Operations Manager
class BatchOperations {
    constructor() {
        this.pendingWrites = [];
        this.batchTimeout = null;
        this.batchDelay = 100; // 100ms delay for batching
    }
    
    /**
     * Add operation to batch
     * @param {Function} operation - Operation to batch
     */
    addOperation(operation) {
        this.pendingWrites.push(operation);
        this.scheduleBatch();
    }
    
    /**
     * Schedule batch execution
     */
    scheduleBatch() {
        if (this.batchTimeout) {
            clearTimeout(this.batchTimeout);
        }
        
        this.batchTimeout = setTimeout(() => {
            this.executeBatch();
        }, this.batchDelay);
    }
    
    /**
     * Execute all pending operations
     */
    executeBatch() {
        if (this.pendingWrites.length === 0) return;
        
        console.log(`Executing batch of ${this.pendingWrites.length} operations`);
        
        try {
            // Execute all operations
            this.pendingWrites.forEach(operation => operation());
            
            // Clear batch
            this.pendingWrites = [];
            this.batchTimeout = null;
            
        } catch (error) {
            console.error('Batch operation failed:', error);
            this.pendingWrites = [];
        }
    }
    
    /**
     * Force immediate execution of pending operations
     */
    flush() {
        if (this.batchTimeout) {
            clearTimeout(this.batchTimeout);
            this.batchTimeout = null;
        }
        this.executeBatch();
    }
}

// Performance Monitoring Utility
class PerformanceMonitor {
    /**
     * Monitor performance of database operations
     * @param {string} operation - Operation name
     * @param {Function} fn - Function to monitor
     * @returns {any} Result of the function
     */
    static monitor(operation, fn) {
        const startTime = performance.now();
        const result = fn();
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        
        if (duration > 10) { // Log operations taking longer than 10ms
            console.log(`⚡ ${operation} took ${duration}ms`);
        }
        
        return result;
    }
    
    /**
     * Get performance statistics
     * @returns {Object} Performance stats
     */
    static getStats() {
        return {
            cacheStats: window.cacheManager?.getStats() || { size: 0, keys: [] },
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null
        };
    }
}

// Initialize global performance managers
window.cacheManager = new CacheManager();
window.batchOperations = new BatchOperations();
window.performanceMonitor = PerformanceMonitor;

// Performance stats logging moved to app-init.js

// Enhanced Form Validation
class FormValidator {
    constructor() {
        this.errors = [];
    }
    
    // Convert technical field names to user-friendly names
    getFieldDisplayName(fieldName) {
        const fieldNameMap = {
            'music_songs': 'Music/Songs',
            'story_plot': 'Story/Plot',
            'performance_cast': 'Performance/Cast',
            'stage_visuals': 'Stage/Visuals',
            'rewatch_value': 'Rewatch Value',
            'theatre_experience': 'Theatre Experience',
            'programme': 'Programme',
            'atmosphere': 'Atmosphere',
            'show_title': 'Show Title',
            'venue': 'Venue',
            'performance_date': 'Performance Date',
            'ticket_price': 'Ticket Price',
            'production_type': 'Production Type',
            'is_musical': 'Musical',
            'notes': 'Notes'
        };
        
        return fieldNameMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    validateRequired(value, fieldName) {
        if (!value || value.trim() === '') {
            const displayName = this.getFieldDisplayName(fieldName);
            this.errors.push(`${displayName} is required.`);
            return false;
        }
        return true;
    }
    
    validateDate(dateString, fieldName) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            const displayName = this.getFieldDisplayName(fieldName);
            this.errors.push(`${displayName} must be a valid date.`);
            return false;
        }
        return true;
    }
    
    validateRating(rating, fieldName, isRequired = true) {
        const numRating = parseFloat(rating);
        const displayName = this.getFieldDisplayName(fieldName);
        
        if (isRequired && (!rating || rating === '')) {
            this.errors.push(`${displayName} is required.`);
            return false;
        }
        
        if (rating && (numRating < 0.25 || numRating > 5.0)) {
            this.errors.push(`${displayName} must be between 0.25 and 5.0.`);
            return false;
        }
        
        return true;
    }
    
    validateCurrency(amount, fieldName, allowZero = true) {
        const numAmount = parseFloat(amount);
        
        if (isNaN(numAmount)) {
            this.errors.push(`${fieldName} must be a valid number.`);
            return false;
        }
        
        if (!allowZero && numAmount <= 0) {
            this.errors.push(`${fieldName} must be greater than zero.`);
            return false;
        }
        
        if (numAmount < 0) {
            this.errors.push(`${fieldName} cannot be negative.`);
            return false;
        }
        
        return true;
    }
    
    validateLength(value, fieldName, minLength = 0, maxLength = 1000) {
        if (value && (value.length < minLength || value.length > maxLength)) {
            this.errors.push(`${fieldName} must be between ${minLength} and ${maxLength} characters.`);
            return false;
        }
        return true;
    }
    
    showErrors(app) {
        if (this.errors.length > 0) {
            const errorMessage = this.errors.join(' ');
            app.showMessage(errorMessage, 'error');
            return false;
        }
        return true;
    }
    
    reset() {
        this.errors = [];
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('performance-modal');
    if (event.target === modal) {
        closePerformanceModal();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing StageLog...');
        
        // Initialize classes
        window.db = new StageLogDB();
        window.api = new ShowAPI();
        
        // Initialize CSVImporter safely
        if (typeof CSVImporter !== 'undefined') {
            window.csvImporter = new CSVImporter();
        } else {
            console.warn('CSVImporter not available - CSV import features disabled');
            window.csvImporter = null;
        }
        
        window.app = new StageLogApp();
        
        console.log('Classes initialized');
        
                 // Set up navigation
         document.querySelectorAll('.nav-btn').forEach(btn => {
             btn.addEventListener('click', (e) => {
                 e.preventDefault();
                 const page = btn.dataset.page;
                 
                 // Clear editing state when navigating via nav buttons
                 if (page === 'add-performance') {
                     console.log('Nav button clicked for add-performance - clearing edit state');
                     window.app.editingPerformanceId = null;
                     window.app.currentShow = null;
                 }
                 
                 // Switch to the selected page
                 window.app.switchPage(page);
             });
         });
        
        // Set up event listeners
        const searchFilter = document.getElementById('search-filter');
        if (searchFilter) {
            searchFilter.addEventListener('input', () => window.app.filterPerformances());
        }
        
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => window.app.filterPerformances());
        }
        
        const cityFilter = document.getElementById('city-filter');
        if (cityFilter) {
            cityFilter.addEventListener('change', () => window.app.filterPerformances());
        }
        
        const expenseFilter = document.getElementById('expense-filter');
        if (expenseFilter) {
            expenseFilter.addEventListener('change', () => window.app.filterPerformances());
        }
        
        const venueSearch = document.getElementById('venue-search');
        if (venueSearch) {
            venueSearch.addEventListener('input', () => window.app.filterAccessSchemes());
        }
        
        const locationFilter = document.getElementById('location-filter');
        if (locationFilter) {
            locationFilter.addEventListener('change', () => window.app.filterAccessSchemes());
        }
        
        // Set up form submission
        const performanceForm = document.getElementById('performance-form');
        if (performanceForm) {
            console.log('✅ Form found, adding submit listener');
            performanceForm.addEventListener('submit', (e) => {
                console.log('🔥 FORM SUBMIT EVENT TRIGGERED');
                console.log('Event details:', e);
                e.preventDefault();
                console.log('🔄 Calling savePerformance...');
                console.log('window.app exists:', !!window.app);
                console.log('window.app.savePerformance exists:', !!(window.app && window.app.savePerformance));
                
                if (!window.app) {
                    console.error('❌ window.app is not defined!');
                    alert('Error: App not initialized. Please refresh the page.');
                    return;
                }
                
                if (!window.app.savePerformance) {
                    console.error('❌ window.app.savePerformance is not defined!');
                    alert('Error: Save function not available. Please refresh the page.');
                    return;
                }
                
                try {
                    console.log('🚀 About to call savePerformance...');
                    window.app.savePerformance();
                    console.log('✅ savePerformance call completed');
                } catch (error) {
                    console.error('❌ Error in savePerformance:', error);
                    console.error('Error stack:', error.stack);
                    alert('Error saving performance: ' + error.message);
                }
            });
            
            // Also add click listener to the submit button as backup
            const submitButton = document.querySelector('#performance-form .btn-primary');
            if (submitButton) {
                console.log('✅ Submit button found, adding click listener as backup');
                submitButton.addEventListener('click', (e) => {
                    console.log('🖱️ SUBMIT BUTTON CLICKED');
                    console.log('Button element:', e.target);
                    console.log('Button type:', e.target.type);
                    
                    // If it's not a submit button, manually trigger form submission
                    if (e.target.type !== 'submit') {
                        console.log('⚠️ Button is not type="submit", manually triggering form submission');
                        e.preventDefault();
                        performanceForm.dispatchEvent(new Event('submit'));
                    }
                });
            } else {
                console.error('❌ Submit button not found!');
            }
        } else {
            console.error('❌ Performance form not found!');
        }
        
        // Set up show search
        const showSearch = document.getElementById('show-search');
        if (showSearch) {
            showSearch.addEventListener('input', (e) => {
                console.log('Show search input:', e.target.value);
                if (e.target.value.length >= 2) {
                    window.app.searchShows(e.target.value);
                } else {
                    window.app.hideSearchResults();
                }
            });
        }
        
                 // Set up production type change
         const productionType = document.getElementById('production-type');
         if (productionType) {
             productionType.addEventListener('change', (e) => {
                 window.app.handleProductionTypeChange(e.target.value);
             });
         }
         
        // Set up musical checkbox change
        const isMusical = document.getElementById('is-musical');
        if (isMusical) {
            isMusical.addEventListener('change', (e) => {
                window.app.handleMusicalChange(e.target.checked);
            });
            
            // Set initial required attribute based on checkbox state
            window.app.handleMusicalChange(isMusical.checked);
        }
         
         // Set up date change to handle rating requirements
         const dateField = document.getElementById('date-seen');
         if (dateField) {
             dateField.addEventListener('change', () => {
                 window.app.handleDateChange();
             });
         }
         
         // Set up expense calculation
         const expenseFields = ['ticket-price', 'booking-fee', 'travel-cost', 'other-expenses', 'currency'];
         expenseFields.forEach(fieldId => {
             const field = document.getElementById(fieldId);
             if (field) {
                 field.addEventListener('input', calculateTotalCost);
                 field.addEventListener('change', calculateTotalCost);
             }
         });
         
        // Initialize theme
        initializeTheme();
        
        // Update settings sync status on load
        setTimeout(() => {
            if (typeof updateSettingsSyncStatus === 'function') {
                updateSettingsSyncStatus();
            }
        }, 1000);
        
        // Initialize with dashboard
        window.app.loadDashboard();
        window.app.loadAccessSchemes();
        
        console.log('StageLog initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error initializing StageLog: ' + error.message);
    }
});

// Global functions for modal handling
window.showSyncModal = function() {
    const modal = document.getElementById('sync-modal');
    if (modal) {
        // Store the currently focused element
        window.lastFocusedElement = document.activeElement;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Initialize sync status
        if (window.firebaseSync) {
            if (window.firebaseSync.isConnected) {
                window.firebaseSync.updateSyncStatus('connected', 'Connected to Firebase');
            } else {
                window.firebaseSync.updateSyncStatus('connecting', 'Connecting...');
            }
        }
    }
}

window.closeSyncModal = function() {
    const modal = document.getElementById('sync-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Return focus to the trigger element
        if (window.lastFocusedElement) {
            window.lastFocusedElement.focus();
            window.lastFocusedElement = null;
        }
    }
}

window.closeModal = function(event) {
    // Close modal when clicking outside the modal content
    if (event.target === event.currentTarget) {
        const modal = event.target;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.createSyncRoom = function() {
    if (!window.firebaseSync) {
        alert('Firebase sync not initialized. Please refresh the page.');
        return;
    }
    
    window.firebaseSync.createRoom().then(roomCode => {
        // Show room created UI first
        document.getElementById('sync-setup').classList.add('hidden');
        document.getElementById('sync-room-created').classList.remove('hidden');
        document.getElementById('room-code-display').value = roomCode;
        
        // Update active room display for when sync becomes active
        document.getElementById('active-room-code').textContent = roomCode;
        
        // Show sync active UI after a short delay
        setTimeout(() => {
            document.getElementById('sync-room-created').classList.add('hidden');
            document.getElementById('sync-active').classList.remove('hidden');
        }, 2000); // 2 second delay to show the room code
        
    }).catch(error => {
        alert('Error creating room: ' + error.message);
    });
}

window.showJoinRoom = function() {
    document.getElementById('sync-setup').classList.add('hidden');
    document.getElementById('sync-join-room').classList.remove('hidden');
}

window.joinSyncRoom = function() {
    const roomCode = document.getElementById('room-code-input').value.trim().toUpperCase();
    
    if (!roomCode) {
        alert('Please enter a room code.');
        return;
    }
    
    if (!window.firebaseSync) {
        alert('Firebase sync not initialized. Please refresh the page.');
        return;
    }
    
    window.firebaseSync.joinRoom(roomCode).then(() => {
        // Show sync active UI
        document.getElementById('sync-join-room').classList.add('hidden');
        document.getElementById('active-room-code').textContent = roomCode;
        document.getElementById('sync-active').classList.remove('hidden');
        
    }).catch(error => {
        alert('Error joining room: ' + error.message);
    });
}

window.copyRoomCode = function() {
    const roomCodeInput = document.getElementById('room-code-display');
    roomCodeInput.select();
    roomCodeInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        // Show feedback
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy room code:', err);
    }
}

window.disconnectSync = function() {
    if (window.firebaseSync) {
        window.firebaseSync.disconnect().then(() => {
            // Reset UI
            document.getElementById('sync-active').classList.add('hidden');
            document.getElementById('sync-setup').classList.remove('hidden');
            document.getElementById('room-code-input').value = '';
            
            // Update settings page sync status
            updateSettingsSyncStatus();
        });
    }
}

// New function to disconnect from settings page
window.disconnectSyncFromSettings = function() {
    if (window.firebaseSync) {
        window.firebaseSync.disconnect().then(() => {
            updateSettingsSyncStatus();
            showFeedback('disconnect-feedback', 'Disconnected from sync successfully', 'success');
        }).catch(error => {
            console.error('Error disconnecting:', error);
            showFeedback('disconnect-feedback', 'Error disconnecting: ' + error.message, 'error');
        });
    }
}

// Feedback system for settings actions
function showFeedback(elementId, message, type = 'info') {
    const feedbackElement = document.getElementById(elementId);
    if (!feedbackElement) return;
    
    feedbackElement.textContent = message;
    feedbackElement.className = `action-feedback ${type} show`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        feedbackElement.classList.remove('show');
    }, 3000);
}

// Enhanced export function with feedback
function exportDataWithFeedback() {
    try {
        exportData();
        showFeedback('export-feedback', 'Data exported successfully!', 'success');
    } catch (error) {
        showFeedback('export-feedback', 'Export failed: ' + error.message, 'error');
    }
}

// Enhanced refresh function with feedback
function refreshAccessDataWithFeedback() {
    try {
        refreshAccessData();
        showFeedback('refresh-feedback', 'Data refreshed successfully!', 'success');
    } catch (error) {
        showFeedback('refresh-feedback', 'Refresh failed: ' + error.message, 'error');
    }
}

// Enhanced analytics refresh function with feedback
function refreshStatsWithFeedback() {
    try {
        refreshStats();
        showFeedback('analytics-refresh-feedback', 'Analytics refreshed! 📊', 'success');
    } catch (error) {
        showFeedback('analytics-refresh-feedback', 'Refresh failed: ' + error.message, 'error');
    }
}

// Update sync status in settings page
function updateSettingsSyncStatus() {
    const statusIcon = document.getElementById('sync-status-icon');
    const statusText = document.getElementById('sync-status-text');
    const deviceCount = document.getElementById('device-count');
    const connectedDevices = document.getElementById('connected-devices');
    const connectedDevicesList = document.getElementById('connected-devices-list');
    const disconnectBtn = document.getElementById('disconnect-btn');
    
    if (!window.firebaseSync || !window.firebaseSync.isConnected) {
        // Not connected
        if (statusIcon) statusIcon.className = 'fas fa-circle disconnected';
        if (statusText) statusText.textContent = 'Not connected';
        if (deviceCount) deviceCount.style.display = 'none';
        if (connectedDevicesList) connectedDevicesList.style.display = 'none';
        if (disconnectBtn) disconnectBtn.style.display = 'none';
        return;
    }
    
    // Connected
    if (statusIcon) statusIcon.className = 'fas fa-circle connected';
    if (statusText) statusText.textContent = 'Connected to sync';
    
    // Update device count and list
    if (window.firebaseSync.currentRoom) {
        updateDeviceList();
    }
}

// Update device list in settings
function updateDeviceList() {
    if (!window.firebaseSync || !window.firebaseSync.currentRoom) return;
    
    const deviceCount = document.getElementById('device-count');
    const connectedDevices = document.getElementById('connected-devices');
    const connectedDevicesList = document.getElementById('connected-devices-list');
    const disconnectBtn = document.getElementById('disconnect-btn');
    
    // Get device info from Firebase
    const roomRef = window.firebaseSync.database.ref(`rooms/${window.firebaseSync.currentRoom}/devices`);
    roomRef.once('value').then(snapshot => {
        const devices = snapshot.val() || {};
        const deviceCountNum = Object.keys(devices).length;
        
        if (deviceCount && connectedDevices) {
            connectedDevices.textContent = deviceCountNum;
            deviceCount.style.display = deviceCountNum > 0 ? 'flex' : 'none';
        }
        
        if (disconnectBtn) {
            disconnectBtn.style.display = deviceCountNum > 0 ? 'block' : 'none';
        }
        
        // Update device list
        if (connectedDevicesList) {
            connectedDevicesList.innerHTML = '';
            connectedDevicesList.style.display = deviceCountNum > 0 ? 'block' : 'none';
            
            Object.entries(devices).forEach(([deviceId, deviceData]) => {
                const deviceItem = document.createElement('div');
                deviceItem.className = 'device-item';
                
                const deviceType = getDeviceType();
                const isCurrentDevice = deviceId === window.firebaseSync.userId;
                
                deviceItem.innerHTML = `
                    <div class="device-info">
                        <i class="fas fa-${getDeviceIcon(deviceType)}"></i>
                        <span>${isCurrentDevice ? 'This Device' : 'Other Device'}</span>
                        <span class="device-type">${deviceType}</span>
                    </div>
                    <div class="device-actions">
                        ${!isCurrentDevice ? `<button class="btn btn-danger btn-sm" onclick="disconnectDevice('${deviceId}')" title="Disconnect this device">
                            <i class="fas fa-times"></i> Disconnect
                        </button>` : ''}
                    </div>
                `;
                
                connectedDevicesList.appendChild(deviceItem);
            });
        }
    });
}

// Get device type based on user agent
function getDeviceType() {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        return /iPad/.test(userAgent) ? 'Tablet' : 'Mobile';
    }
    return 'Desktop';
}

// Get device icon based on type
function getDeviceIcon(deviceType) {
    switch (deviceType) {
        case 'Mobile': return 'mobile-alt';
        case 'Tablet': return 'tablet-alt';
        case 'Desktop': return 'desktop';
        default: return 'device';
    }
}

// Disconnect specific device (admin function)
function disconnectDevice(deviceId) {
    if (!window.firebaseSync || !window.firebaseSync.currentRoom) return;
    
    const roomRef = window.firebaseSync.database.ref(`rooms/${window.firebaseSync.currentRoom}/devices/${deviceId}`);
    roomRef.remove().then(() => {
        showFeedback('disconnect-feedback', 'Device disconnected successfully', 'success');
        updateDeviceList();
    }).catch(error => {
        showFeedback('disconnect-feedback', 'Failed to disconnect device: ' + error.message, 'error');
    });
}

function showPerformanceDetail(performanceId) {
    const performance = window.db.getPerformanceById(performanceId);
    if (!performance) return;
    
    const show = window.db.getShowById(performance.show_id);
    const modal = document.getElementById('performance-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    
    if (modalTitle) {
        modalTitle.textContent = show ? show.title : 'Unknown Show';
    }
    
    // Generate expense breakdown
    const ticketPrice = parseFloat(performance.ticket_price) || 0;
    const bookingFee = parseFloat(performance.booking_fee) || 0;
    const travelCost = parseFloat(performance.travel_cost) || 0;
    const otherExpenses = parseFloat(performance.other_expenses) || 0;
    const totalCost = ticketPrice + bookingFee + travelCost + otherExpenses;
    
    const currency = performance.currency || 'GBP';
    const currencySymbol = window.app.getCurrencySymbol(currency);
    
    // Generate expense HTML
    let expenseHTML = '';
    if (performance.production_type === 'Pro Shot') {
        expenseHTML = `
            <div class="modal-section">
                <h3><i class="fas fa-pound-sign"></i> Expense Information</h3>
                <div class="expense-breakdown">
                    <div class="expense-item expense-exempt"><span><strong>Expenses Exempt</strong></span> <span>Pro Shot performances do not require expense tracking</span></div>
                </div>
            </div>
        `;
    } else if (totalCost > 0) {
        expenseHTML = `
            <div class="modal-section">
                <h3><i class="fas fa-pound-sign"></i> Expense Breakdown</h3>
                <div class="expense-breakdown">
                    ${ticketPrice > 0 ? `<div class="expense-item"><span>Ticket Price:</span> <span>${currencySymbol}${ticketPrice.toFixed(2)}</span></div>` : ''}
                    ${performance.seat_location ? `<div class="expense-item"><span>Seat Location:</span> <span>${performance.seat_location}</span></div>` : ''}
                    ${bookingFee > 0 ? `<div class="expense-item"><span>Booking Fee:</span> <span>${currencySymbol}${bookingFee.toFixed(2)}</span></div>` : ''}
                    ${travelCost > 0 ? `<div class="expense-item"><span>Travel Cost:</span> <span>${currencySymbol}${travelCost.toFixed(2)}</span></div>` : ''}
                    ${otherExpenses > 0 ? `<div class="expense-item"><span>Other Expenses:</span> <span>${currencySymbol}${otherExpenses.toFixed(2)}</span></div>` : ''}
                    <div class="expense-item expense-total"><span><strong>Total Cost:</strong></span> <span><strong>${currencySymbol}${totalCost.toFixed(2)}</strong></span></div>
                </div>
            </div>
        `;
    }
    
    // Generate ratings breakdown
    let ratingsHTML = '';
    if (performance.weighted_rating > 0) {
        ratingsHTML = `
            <div class="modal-section">
                <h3><i class="fas fa-star"></i> Rating Breakdown</h3>
                <div class="rating-breakdown">
                    <div class="rating-item"><span>Music/Songs:</span> <span>${performance.rating.music_songs.toFixed(2)}</span></div>
                    <div class="rating-item"><span>Story/Plot:</span> <span>${performance.rating.story_plot.toFixed(2)}</span></div>
                    <div class="rating-item"><span>Performance/Cast:</span> <span>${performance.rating.performance_cast.toFixed(2)}</span></div>
                    <div class="rating-item"><span>Stage/Visuals:</span> <span>${performance.rating.stage_visuals.toFixed(2)}</span></div>
                    <div class="rating-item"><span>Rewatch Value:</span> <span>${performance.rating.rewatch_value.toFixed(2)}</span></div>
                    ${performance.production_type !== 'Pro Shot' ? `
                        <div class="rating-item"><span>Theatre Experience:</span> <span>${performance.rating.theatre_experience.toFixed(2)}</span></div>
                        <div class="rating-item"><span>Programme:</span> <span>${performance.rating.programme.toFixed(2)}</span></div>
                        <div class="rating-item"><span>Atmosphere:</span> <span>${performance.rating.atmosphere.toFixed(2)}</span></div>
                    ` : ''}
                    <div class="rating-item rating-total"><span><strong>Weighted Average:</strong></span> <span><strong>${performance.weighted_rating.toFixed(2)}</strong></span></div>
                </div>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="modal-section">
            <h3><i class="fas fa-info-circle"></i> Performance Details</h3>
            <div class="performance-info">
                <div class="info-item"><span><strong>Date:</strong></span> <span>${window.app.formatDate(performance.date_seen)}</span></div>
                <div class="info-item"><span><strong>Theatre:</strong></span> <span>${performance.theatre_name}</span></div>
                <div class="info-item"><span><strong>City:</strong></span> <span>${performance.city}</span></div>
                <div class="info-item"><span><strong>Production Type:</strong></span> <span>${performance.production_type}</span></div>
            </div>
        </div>
        
        ${expenseHTML}
        ${ratingsHTML}
        
        ${performance.notes_on_access ? `
            <div class="modal-section">
                <h3><i class="fas fa-universal-access"></i> Access Notes</h3>
                <p>${performance.notes_on_access}</p>
            </div>
        ` : ''}
        
        ${performance.general_notes ? `
            <div class="modal-section">
                <h3><i class="fas fa-sticky-note"></i> General Notes</h3>
                <p>${performance.general_notes}</p>
            </div>
        ` : ''}
    `;
    
    modal.style.display = 'block';
}

function closePerformanceModal() {
    const modal = document.getElementById('performance-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Return focus to the trigger element
        if (window.lastFocusedElement) {
            window.lastFocusedElement.focus();
            window.lastFocusedElement = null;
        }
    }
}

// Data Export Function
function exportData() {
    try {
        // Get all StageLog data from localStorage
        const stagelogData = {
            exportDate: new Date().toISOString(),
            exportType: "StageLog Data Backup",
            version: "2.5.0",
            stagelog_shows: JSON.parse(localStorage.getItem('stagelog_shows') || '[]'),
            stagelog_performances: JSON.parse(localStorage.getItem('stagelog_performances') || '[]'),
            stagelog_access_schemes: JSON.parse(localStorage.getItem('stagelog_access_schemes') || '[]'),
            user_preferences: {
                theme: localStorage.getItem('theme') || 'light',
                lastBackup: new Date().toISOString()
            }
        };

        // Create filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:.]/g, '-');
        const filename = `stagelog-backup-${timestamp}.json`;

        // Create and download file
        const dataStr = JSON.stringify(stagelogData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        const count = stagelogData.stagelog_performances.length;
        alert(`✅ StageLog backup exported successfully!\n\n📁 File: ${filename}\n🎭 ${count} performances backed up\n\n💡 Save this file somewhere safe for backup!`);
        
        console.log('📁 Data export completed:', filename);
        
    } catch (error) {
        console.error('❌ Export error:', error);
        alert('❌ Error creating backup. Please try again or check the console for details.');
    }
}
