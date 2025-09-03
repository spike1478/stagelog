// Quick debug script to check the shows per month calculation
console.log('🔍 Debugging shows per month calculation...');

// Load data
const performances = JSON.parse(localStorage.getItem('stagelog_performances') || '[]');
console.log('📊 Total performances:', performances.length);

if (performances.length > 0) {
    // Get date range
    const dates = performances.map(p => new Date(p.date_seen)).filter(d => !isNaN(d)).sort();
    const firstShow = dates[0];
    const lastShow = dates[dates.length - 1];
    const today = new Date();
    
    console.log('📅 First show:', firstShow ? firstShow.toLocaleDateString() : 'N/A');
    console.log('📅 Last show:', lastShow ? lastShow.toLocaleDateString() : 'N/A');
    console.log('📅 Today:', today.toLocaleDateString());
    
    if (firstShow) {
        const daysSinceFirst = Math.floor((today - firstShow) / (1000 * 60 * 60 * 24));
        const monthsSinceFirst = daysSinceFirst / 30.44;
        const showsPerMonth = performances.length / monthsSinceFirst;
        
        console.log('📊 Days since first show:', daysSinceFirst);
        console.log('📊 Months since first show:', monthsSinceFirst.toFixed(1));
        console.log('📊 Shows per month:', showsPerMonth.toFixed(1));
        
        // Check for future shows
        const futureShows = performances.filter(p => new Date(p.date_seen) > today);
        const pastShows = performances.filter(p => new Date(p.date_seen) <= today);
        
        console.log('📊 Future shows:', futureShows.length);
        console.log('📊 Past shows:', pastShows.length);
        
        if (pastShows.length > 0) {
            const pastShowsPerMonth = pastShows.length / monthsSinceFirst;
            console.log('📊 Past shows per month (more accurate):', pastShowsPerMonth.toFixed(1));
        }
    }
}
