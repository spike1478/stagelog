// Direct import script for user's performance data
async function importUserPerformanceData() {
    const performanceData = [
        {
            show_title: "Matilda The Musical",
            date_seen: "2025-06-14",
            theatre_name: "Cambridge Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "Mic Pack!!!, Did work",
            general_notes: "",
            rating: {
                music_songs: 4.25,
                story_plot: 5,
                performance_cast: 4.5,
                stage_visuals: 5,
                rewatch_value: 3,
                theatre_experience: 4,
                programme: 5,
                atmosphere: 4
            }
        },
        {
            show_title: "Operation Mincemeat",
            date_seen: "2025-08-12",
            theatre_name: "Fortune Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "Mic Pack!!!, Did work",
            general_notes: "",
            rating: {
                music_songs: 5,
                story_plot: 5,
                performance_cast: 5,
                stage_visuals: 3,
                rewatch_value: 5,
                theatre_experience: 3,
                programme: 3,
                atmosphere: 5
            }
        },
        {
            show_title: "Joseph and the Technicolor Dreamcoat",
            date_seen: "2025-07-18",
            theatre_name: "Liverpool Empire",
            city: "Liverpool",
            production_type: "UK Tour",
            notes_on_access: "Uses in Ear, Did work",
            general_notes: "",
            rating: {
                music_songs: 4.75,
                story_plot: 3.5,
                performance_cast: 5,
                stage_visuals: 3.5,
                rewatch_value: 5,
                theatre_experience: 5,
                programme: 4,
                atmosphere: 5
            }
        },
        {
            show_title: "Joseph and the Technicolor Dreamcoat",
            date_seen: "2025-07-19",
            theatre_name: "Liverpool Empire",
            city: "Liverpool",
            production_type: "UK Tour",
            notes_on_access: "Uses in Ear, Did work",
            general_notes: "",
            rating: {
                music_songs: 4.75,
                story_plot: 3.5,
                performance_cast: 5,
                stage_visuals: 3.5,
                rewatch_value: 5,
                theatre_experience: 5,
                programme: 4,
                atmosphere: 5
            }
        },
        {
            show_title: "Oliver!",
            date_seen: "2025-08-13",
            theatre_name: "Gielgud Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "Uses In Ear, Did work",
            general_notes: "",
            rating: {
                music_songs: 4,
                story_plot: 3.5,
                performance_cast: 5,
                stage_visuals: 5,
                rewatch_value: 3,
                theatre_experience: 4,
                programme: 4,
                atmosphere: 5
            }
        },
        {
            show_title: "SIX The Musical",
            date_seen: "2025-04-08",
            theatre_name: "Everyman Leeds",
            city: "Leeds",
            production_type: "Pro Shot",
            notes_on_access: "N/A",
            general_notes: "",
            rating: {
                music_songs: 4.5,
                story_plot: 3,
                performance_cast: 5,
                stage_visuals: 3,
                rewatch_value: 5,
                theatre_experience: 0,
                programme: 0,
                atmosphere: 0
            }
        },
        {
            show_title: "SIX The Musical",
            date_seen: "2025-08-13",
            theatre_name: "Vaudeville Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "Uses in Ear, Did work",
            general_notes: "",
            rating: {
                music_songs: 4.5,
                story_plot: 3,
                performance_cast: 4.75,
                stage_visuals: 3,
                rewatch_value: 5,
                theatre_experience: 3.5,
                programme: 4,
                atmosphere: 5
            }
        },
        {
            show_title: "& Juliet",
            date_seen: "2025-05-29",
            theatre_name: "Lyceum Theatre",
            city: "Sheffield",
            production_type: "UK Tour",
            notes_on_access: "Uses in Ear, Did work",
            general_notes: "",
            rating: {
                music_songs: 3.5,
                story_plot: 4,
                performance_cast: 5,
                stage_visuals: 4,
                rewatch_value: 2,
                theatre_experience: 3,
                programme: 1,
                atmosphere: 4
            }
        },
        {
            show_title: "SIX The Musical",
            date_seen: "2025-07-11",
            theatre_name: "Vaudeville Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "Uses in Ear, Didn't work",
            general_notes: "",
            rating: {
                music_songs: 4.5,
                story_plot: 3,
                performance_cast: 4,
                stage_visuals: 3,
                rewatch_value: 5,
                theatre_experience: 3.5,
                programme: 4,
                atmosphere: 5
            }
        },
        {
            show_title: "Titanique",
            date_seen: "2025-06-13",
            theatre_name: "Criterion Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "Uses in Ear, Did work",
            general_notes: "",
            rating: {
                music_songs: 3.75,
                story_plot: 5,
                performance_cast: 4,
                stage_visuals: 3,
                rewatch_value: 4,
                theatre_experience: 2.5,
                programme: 3,
                atmosphere: 5
            }
        },
        {
            show_title: "Mamma Mia!",
            date_seen: "2025-08-04",
            theatre_name: "Novello Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "Uses in Ear, Didn't work",
            general_notes: "",
            rating: {
                music_songs: 5,
                story_plot: 4,
                performance_cast: 3.5,
                stage_visuals: 2.5,
                rewatch_value: 3.5,
                theatre_experience: 4,
                programme: 4,
                atmosphere: 5
            }
        },
        {
            show_title: "Cruel Intentions",
            date_seen: "2025-05-10",
            theatre_name: "The Grand Theatre & Opera House",
            city: "Leeds",
            production_type: "UK Tour",
            notes_on_access: "Uses in Ear, Did work",
            general_notes: "",
            rating: {
                music_songs: 3.5,
                story_plot: 2,
                performance_cast: 5,
                stage_visuals: 3,
                rewatch_value: 1,
                theatre_experience: 3,
                programme: 4,
                atmosphere: 4
            }
        },
        {
            show_title: "Dear Evan Hansen",
            date_seen: "2025-04-24",
            theatre_name: "Hull New Theatre",
            city: "Hull",
            production_type: "UK Tour",
            notes_on_access: "Uses in Ear, Did work",
            general_notes: "",
            rating: {
                music_songs: 4,
                story_plot: 1,
                performance_cast: 4,
                stage_visuals: 3,
                rewatch_value: 1,
                theatre_experience: 4,
                programme: 4,
                atmosphere: 2.5
            }
        },
        {
            show_title: "Dear Evan Hansen",
            date_seen: "2025-06-25",
            theatre_name: "Grand Opera House",
            city: "York",
            production_type: "UK Tour",
            notes_on_access: "Uses in Ear, Did work",
            general_notes: "",
            rating: {
                music_songs: 4,
                story_plot: 1,
                performance_cast: 2.5,
                stage_visuals: 3,
                rewatch_value: 1,
                theatre_experience: 1,
                programme: 4,
                atmosphere: 1
            }
        },
        // Future bookings (upcoming performances)
        {
            show_title: "Fun Home",
            date_seen: "2025-09-11",
            theatre_name: "York Medical Society",
            city: "York",
            production_type: "Community",
            notes_on_access: "",
            general_notes: "",
            rating: {
                music_songs: 0,
                story_plot: 0,
                performance_cast: 0,
                stage_visuals: 0,
                rewatch_value: 0,
                theatre_experience: 0,
                programme: 0,
                atmosphere: 0
            }
        },
        {
            show_title: "Operation Mincemeat",
            date_seen: "2025-09-13",
            theatre_name: "Fortune Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "Mic Pack!!!, Did work",
            general_notes: "",
            rating: {
                music_songs: 0,
                story_plot: 0,
                performance_cast: 0,
                stage_visuals: 0,
                rewatch_value: 0,
                theatre_experience: 0,
                programme: 0,
                atmosphere: 0
            }
        },
        {
            show_title: "Moulin Rouge",
            date_seen: "2025-09-13",
            theatre_name: "Piccadilly Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "",
            general_notes: "",
            rating: {
                music_songs: 0,
                story_plot: 0,
                performance_cast: 0,
                stage_visuals: 0,
                rewatch_value: 0,
                theatre_experience: 0,
                programme: 0,
                atmosphere: 0
            }
        },
        {
            show_title: "The Play That Goes Wrong",
            date_seen: "2025-09-14",
            theatre_name: "Duchess Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "",
            general_notes: "",
            rating: {
                music_songs: 0,
                story_plot: 0,
                performance_cast: 0,
                stage_visuals: 0,
                rewatch_value: 0,
                theatre_experience: 0,
                programme: 0,
                atmosphere: 0
            }
        },
        {
            show_title: "Titanique",
            date_seen: "2025-09-14",
            theatre_name: "Criterion Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "",
            general_notes: "",
            rating: {
                music_songs: 0,
                story_plot: 0,
                performance_cast: 0,
                stage_visuals: 0,
                rewatch_value: 0,
                theatre_experience: 0,
                programme: 0,
                atmosphere: 0
            }
        },
        {
            show_title: "Operation Mincemeat",
            date_seen: "2025-09-16",
            theatre_name: "Fortune Theatre",
            city: "London",
            production_type: "West End",
            notes_on_access: "Mic Pack!!!, Did work",
            general_notes: "",
            rating: {
                music_songs: 0,
                story_plot: 0,
                performance_cast: 0,
                stage_visuals: 0,
                rewatch_value: 0,
                theatre_experience: 0,
                programme: 0,
                atmosphere: 0
            }
        },
        {
            show_title: "Every Brilliant Thing",
            date_seen: "2025-09-16",
            theatre_name: "sohoplace",
            city: "London",
            production_type: "West End",
            notes_on_access: "",
            general_notes: "",
            rating: {
                music_songs: 0,
                story_plot: 0,
                performance_cast: 0,
                stage_visuals: 0,
                rewatch_value: 0,
                theatre_experience: 0,
                programme: 0,
                atmosphere: 0
            }
        },
        {
            show_title: "The Lightning Thief",
            date_seen: "2025-09-20",
            theatre_name: "Liverpool Empire",
            city: "Liverpool",
            production_type: "UK Tour",
            notes_on_access: "",
            general_notes: "",
            rating: {
                music_songs: 0,
                story_plot: 0,
                performance_cast: 0,
                stage_visuals: 0,
                rewatch_value: 0,
                theatre_experience: 0,
                programme: 0,
                atmosphere: 0
            }
        }
    ];

    let imported = 0;
    let skipped = 0;

    for (const performance of performanceData) {
        try {
            // Find or create the show
            let show = window.db.findShowByTitle(performance.show_title);
            if (!show) {
                show = window.db.addShow({
                    title: performance.show_title,
                    synopsis: '',
                    composer: '',
                    lyricist: '',
                    poster_image_url: ''
                });
            }

            // Check for duplicate performance
            const existingPerformances = window.db.getPerformances();
            const isDuplicate = existingPerformances.some(existing => 
                existing.show_id === show.id &&
                existing.date_seen === performance.date_seen &&
                existing.theatre_name === performance.theatre_name &&
                existing.city === performance.city
            );

            if (isDuplicate) {
                console.log('Skipping duplicate performance:', performance.show_title, performance.date_seen);
                skipped++;
                continue;
            }

            // Add the performance
            const performanceToAdd = {
                ...performance,
                show_id: show.id
            };
            delete performanceToAdd.show_title; // Remove title since we have show_id

            window.db.addPerformance(performanceToAdd);
            imported++;
        } catch (error) {
            console.error('Error importing performance:', error);
            skipped++;
        }
    }

    return { imported, skipped, total: performanceData.length };
}

// Function to clear all existing data
function clearAllData() {
    if (confirm('This will delete ALL existing performances and shows. Are you sure?')) {
        localStorage.removeItem('stagelog_performances');
        localStorage.removeItem('stagelog_shows');
        // Reinitialize storage
        localStorage.setItem('stagelog_performances', JSON.stringify([]));
        localStorage.setItem('stagelog_shows', JSON.stringify([]));
        
        window.app.showMessage('All data cleared successfully!', 'success');
        window.app.loadDashboard();
        return true;
    }
    return false;
}

// Global function to import user's performance data
async function importUserPerformances() {
    try {
        // Ensure database is initialized
        if (!window.db) {
            window.db = new StageLogDB();
        }
        
        console.log('Starting import...');
        console.log('Database available?', !!window.db);
        console.log('Current performances:', window.db.getPerformances().length);
        
        const result = await importUserPerformanceData();
        console.log('Import result:', result);
        
        window.app.showMessage(
            `Successfully imported ${result.imported} performances! ${result.skipped} entries were skipped.`,
            'success'
        );
        // Refresh the dashboard to show the new data
        window.app.loadDashboard();
    } catch (error) {
        console.error('Import failed:', error);
        window.app.showMessage(
            `Import failed: ${error.message}`,
            'error'
        );
    }
}
