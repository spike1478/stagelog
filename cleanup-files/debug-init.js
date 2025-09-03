// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DEBUG: DOMContentLoaded event fired');
    
    // Initialize the app
    console.log('🔍 DEBUG: Creating StageLogApp instance');
    window.app = new StageLogApp();
    console.log('🔍 DEBUG: App instance created:', !!window.app);
    
    // Set up event listeners for dashboard filters
    console.log('🔍 DEBUG: Setting up dashboard filter event listeners');
    const searchFilter = document.getElementById('search-filter');
    const sortFilter = document.getElementById('sort-filter');
    const cityFilter = document.getElementById('city-filter');
    const expenseFilter = document.getElementById('expense-filter');
    
    console.log('🔍 DEBUG: Dashboard filter elements found:', {
        searchFilter: !!searchFilter,
        sortFilter: !!sortFilter,
        cityFilter: !!cityFilter,
        expenseFilter: !!expenseFilter
    });
    
    if (searchFilter) {
        searchFilter.addEventListener('input', () => window.app.filterPerformances());
        console.log('🔍 DEBUG: Search filter event listener added');
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', () => window.app.filterPerformances());
        console.log('🔍 DEBUG: Sort filter event listener added');
    }
    if (cityFilter) {
        cityFilter.addEventListener('change', () => window.app.filterPerformances());
        console.log('🔍 DEBUG: City filter event listener added');
    }
    if (expenseFilter) {
        expenseFilter.addEventListener('change', () => window.app.filterPerformances());
        console.log('🔍 DEBUG: Expense filter event listener added');
    }
    
    // Set up event listeners for My Shows filters
    console.log('🔍 DEBUG: Setting up My Shows filter event listeners');
    const myShowsSearchFilter = document.getElementById('my-shows-search-filter');
    const myShowsSortFilter = document.getElementById('my-shows-sort-filter');
    const myShowsCityFilter = document.getElementById('my-shows-city-filter');
    const myShowsExpenseFilter = document.getElementById('my-shows-expense-filter');
    
    console.log('🔍 DEBUG: My Shows filter elements found:', {
        myShowsSearchFilter: !!myShowsSearchFilter,
        myShowsSortFilter: !!myShowsSortFilter,
        myShowsCityFilter: !!myShowsCityFilter,
        myShowsExpenseFilter: !!myShowsExpenseFilter
    });
    
    if (myShowsSearchFilter) {
        myShowsSearchFilter.addEventListener('input', () => window.app.filterMyShowsPerformances());
        console.log('🔍 DEBUG: My Shows search filter event listener added');
    }
    if (myShowsSortFilter) {
        myShowsSortFilter.addEventListener('change', () => window.app.filterMyShowsPerformances());
        console.log('🔍 DEBUG: My Shows sort filter event listener added');
    }
    if (myShowsCityFilter) {
        myShowsCityFilter.addEventListener('change', () => window.app.filterMyShowsPerformances());
        console.log('🔍 DEBUG: My Shows city filter event listener added');
    }
    if (myShowsExpenseFilter) {
        myShowsExpenseFilter.addEventListener('change', () => window.app.filterMyShowsPerformances());
        console.log('🔍 DEBUG: My Shows expense filter event listener added');
    }
    
    // Set up navigation button event listeners
    console.log('🔍 DEBUG: Setting up navigation button event listeners');
    const navButtons = document.querySelectorAll('.nav-btn');
    console.log('🔍 DEBUG: Found', navButtons.length, 'navigation buttons');
    
    navButtons.forEach((btn, index) => {
        const pageId = btn.getAttribute('data-page');
        console.log(`🔍 DEBUG: Nav button ${index}: data-page="${pageId}"`);
        btn.addEventListener('click', () => {
            console.log('🔍 DEBUG: Nav button clicked for page:', pageId);
            if (pageId) {
                switchPage(pageId);
            }
        });
    });
    
    // Load initial dashboard
    console.log('🔍 DEBUG: Loading initial dashboard');
    window.app.loadDashboard();
    
    console.log('🎭 DEBUG: StageLog application initialized successfully');
});
