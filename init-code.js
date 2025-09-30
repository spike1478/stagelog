// Page switching function
function switchPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Load page-specific content
    if (pageId === 'dashboard') {
        window.app.loadDashboard();
    } else if (pageId === 'my-shows') {
        loadMyShows();
    } else if (pageId === 'analytics') {
        window.app.loadAnalytics();
    } else if (pageId === 'analytics-enhanced') {
        loadEnhancedAnalytics();
    }
}

// Load My Shows page
function loadMyShows() {
    try {
        // Load city filter for My Shows page
        loadMyShowsCityFilter();
        // Filter and render performances
        window.app.filterMyShowsPerformances();
        console.log('📋 My Shows page loaded successfully');
    } catch (error) {
        console.error('❌ Error loading My Shows page:', error);
    }
}

// Load city filter for My Shows page
function loadMyShowsCityFilter() {
    const cityFilter = document.getElementById('my-shows-city-filter');
    if (!cityFilter) return;
    
    const performances = window.db.getPerformances();
    const cities = [...new Set(performances.map(p => p.city))].sort();
    
    cityFilter.innerHTML = '<option value="">All Cities</option>' + 
        cities.map(city => `<option value="${city}">${city}</option>`).join('');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    window.app = new StageLogApp();
    
    // Set up event listeners for dashboard filters
    const searchFilter = document.getElementById('search-filter');
    const sortFilter = document.getElementById('sort-filter');
    const cityFilter = document.getElementById('city-filter');
    const expenseFilter = document.getElementById('expense-filter');
    
    if (searchFilter) {
        searchFilter.addEventListener('input', () => window.app.filterPerformances());
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', () => window.app.filterPerformances());
    }
    if (cityFilter) {
        cityFilter.addEventListener('change', () => window.app.filterPerformances());
    }
    if (expenseFilter) {
        expenseFilter.addEventListener('change', () => window.app.filterPerformances());
    }
    
    // Set up event listeners for My Shows filters
    const myShowsSearchFilter = document.getElementById('my-shows-search-filter');
    const myShowsSortFilter = document.getElementById('my-shows-sort-filter');
    const myShowsCityFilter = document.getElementById('my-shows-city-filter');
    const myShowsExpenseFilter = document.getElementById('my-shows-expense-filter');
    
    if (myShowsSearchFilter) {
        myShowsSearchFilter.addEventListener('input', () => window.app.filterMyShowsPerformances());
    }
    if (myShowsSortFilter) {
        myShowsSortFilter.addEventListener('change', () => window.app.filterMyShowsPerformances());
    }
    if (myShowsCityFilter) {
        myShowsCityFilter.addEventListener('change', () => window.app.filterMyShowsPerformances());
    }
    if (myShowsExpenseFilter) {
        myShowsExpenseFilter.addEventListener('change', () => window.app.filterMyShowsPerformances());
    }
    
    // Set up navigation button event listeners
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageId = btn.getAttribute('data-page');
            if (pageId) {
                switchPage(pageId);
            }
        });
    });
    
    // Load initial dashboard
    window.app.loadDashboard();
    
    console.log('🎭 StageLog application initialized successfully');
});
