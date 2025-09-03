// CSV Import functionality for Access Schemes
// This file handles importing access scheme data from CSV files

class CSVImporter {
    constructor() {
        this.supportedTypes = ['text/csv', 'application/vnd.ms-excel'];
    }

    // Parse CSV content
    parseCSV(csvContent) {
        const lines = csvContent.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file must contain at least a header row and one data row');
        }

        const headers = this.parseCSVLine(lines[0]);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header.toLowerCase().replace(/\s+/g, '_')] = values[index];
                });
                data.push(row);
            }
        }

        return data;
    }

    // Parse a single CSV line handling quoted values
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    // Import performance data from CSV
    async importPerformances(file) {
        try {
            const content = await this.readFile(file);
            const performances = this.parseCSV(content);
            
            let imported = 0;
            let skipped = 0;

            for (const rawPerformance of performances) {
                const mappedPerformance = this.mapPerformanceFields(rawPerformance);
                if (this.validatePerformance(mappedPerformance)) {
                    // Create or find the show first
                    const show = await this.findOrCreateShow(mappedPerformance.show_title);
                    mappedPerformance.show_id = show.id;
                    
                    // Add the performance
                    window.db.addPerformance(mappedPerformance);
                    imported++;
                } else {
                    skipped++;
                    console.warn('Skipped invalid performance:', rawPerformance);
                }
            }

            return { imported, skipped, total: performances.length };
        } catch (error) {
            console.error('Performance CSV import error:', error);
            throw error;
        }
    }

    // Map performance CSV fields to database format
    mapPerformanceFields(perf) {
        // Parse date from DD/MM/YYYY format
        const dateParts = (perf['Date Seen'] || '').split('/');
        let dateFormatted = '';
        if (dateParts.length === 3) {
            // Convert DD/MM/YYYY to YYYY-MM-DD
            dateFormatted = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
        }

        return {
            show_title: perf['Musical Title'] || perf['Show Title'] || '',
            date_seen: dateFormatted,
            theatre_name: perf['Theatre'] || '',
            city: perf['City'] || '',
            production_type: perf['Type of Production'] || '',
            notes_on_access: perf['Notes on Access'] || '',
            general_notes: perf['Notes'] || '',
            rating: {
                music_songs: parseFloat(perf['Music / Songs (1-5)']) || 0,
                story_plot: parseFloat(perf['Story / Plot (1-5)']) || 0,
                performance_cast: parseFloat(perf['Performance (1-5)']) || 0,
                stage_visuals: parseFloat(perf['Stage & Visuals (1-5)']) || 0,
                rewatch_value: parseFloat(perf['Rewatch Value (1-5)']) || 0,
                theatre_experience: parseFloat(perf['Theatre Experience']) || 0,
                programme: parseFloat(perf['Programme']) || 0,
                atmosphere: parseFloat(perf['Atmosphere']) || 0
            }
        };
    }

    // Find or create a show in the database
    async findOrCreateShow(title) {
        if (!title) return null;
        
        let show = window.db.findShowByTitle(title);
        if (!show) {
            // Create a basic show entry
            show = window.db.addShow({
                title: title,
                synopsis: '',
                composer: '',
                lyricist: '',
                poster_image_url: ''
            });
        }
        return show;
    }

    // Validate performance data
    validatePerformance(perf) {
        return perf.show_title && perf.date_seen && perf.theatre_name && perf.city;
    }

    // Import access schemes from CSV
    async importAccessSchemes(file) {
        try {
            const content = await this.readFile(file);
            const schemes = this.parseCSV(content);
            
            let imported = 0;
            let skipped = 0;

            for (const rawScheme of schemes) {
                const mappedScheme = this.mapSchemeFields(rawScheme);
                if (this.validateAccessScheme(mappedScheme)) {
                    window.db.addAccessScheme(mappedScheme);
                    imported++;
                } else {
                    skipped++;
                    console.warn('Skipped invalid scheme:', rawScheme);
                }
            }

            return { imported, skipped, total: schemes.length };
        } catch (error) {
            console.error('CSV import error:', error);
            throw error;
        }
    }

    // Map different CSV column formats to standardized database fields
    mapSchemeFields(scheme) {
        // Handle different column name variations
        const mapped = {
            venue_name: scheme.venue_name || scheme['Venue Name'] || scheme.venue || '',
            location: scheme.location || scheme.Location || 'London', // Default to London for this dataset
            companion_policy: scheme.companion_policy || scheme['Carer / Companion Policy'] || scheme['Companion Policy'] || '',
            conditions_proof: scheme.conditions_proof || scheme['Eligibility / Proof'] || scheme['Conditions Proof'] || '',
            how_to_book: scheme.how_to_book || scheme['How to Book'] || scheme['How To Book'] || ''
        };

        // Handle venues covered field - add it to venue name if present
        if (scheme['Venues Covered'] && scheme['Venues Covered'].trim()) {
            mapped.venue_name += ` (${scheme['Venues Covered']})`;
        }

        return mapped;
    }

    // Validate access scheme data
    validateAccessScheme(scheme) {
        const required = ['venue_name'];
        return required.every(field => scheme[field] && scheme[field].trim());
    }

    // Read file content
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Create sample CSV files
    createSampleCSV() {
        const londonData = [
            ['venue_name', 'location', 'companion_policy', 'conditions_proof', 'how_to_book'],
            ['ATG Theatres', 'London', 'Companion tickets available for Essential Companion Cardholders', 'Access Card, PIP letter, or medical professional letter required', 'Call box office directly. Online booking available with Access Card number'],
            ['National Theatre', 'London', 'Free companion ticket for wheelchair users and essential companions', 'Access Card, benefit letter, or medical professional confirmation', 'Book online or call Access Booking Line: 020 7452 3000'],
            ['Royal Opera House', 'London', 'Free companion tickets for disabled patrons', 'Disabled person\'s railcard, Access Card, or benefit letter', 'Call access line: 020 7304 4000'],
            ['Shakespeare\'s Globe', 'London', 'Companion goes free with proof of disability', 'Access Card, blue badge, or benefit letter', 'Email access@shakespearesglobe.com or call 020 7401 9919'],
            ['Old Vic Theatre', 'London', 'Free companion ticket available', 'Valid disability documentation required', 'Call box office: 0844 871 7628']
        ];

        const yorkshireData = [
            ['venue_name', 'location', 'companion_policy', 'conditions_proof', 'how_to_book'],
            ['Leeds Playhouse', 'Leeds', 'Free companion tickets for essential companions', 'Access Card, benefits letter, or medical evidence', 'Call 0113 213 7700 or email access@leedsplayhouse.org.uk'],
            ['York Theatre Royal', 'York', 'Free companion ticket available', 'Valid disability benefit letter or Access Card', 'Call 01904 623568 or visit box office in person'],
            ['Sheffield Theatres', 'Sheffield', 'Companion goes free for disabled patrons', 'Access Card, PIP/DLA letter, or blue badge', 'Call 0114 249 6000 or book online'],
            ['Hull Truck Theatre', 'Hull', 'Free companion ticket with proof of disability', 'Benefit letter, Access Card, or medical documentation', 'Call 01482 323638'],
            ['Stephen Joseph Theatre', 'Scarborough', 'Companion ticket available at concession rate', 'Disability evidence required', 'Call 01723 370541'],
            ['Bradford Alhambra', 'Bradford', 'Free companion for wheelchair users', 'Access Card or benefit letter', 'Call 01274 432000']
        ];

        return {
            london: this.arrayToCSV(londonData),
            yorkshire: this.arrayToCSV(yorkshireData)
        };
    }

    // Convert array to CSV string
    arrayToCSV(data) {
        return data.map(row => 
            row.map(cell => 
                typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
                    ? `"${cell.replace(/"/g, '""')}"` 
                    : cell
            ).join(',')
        ).join('\n');
    }

    // Download sample CSV files
    downloadSampleCSV(type = 'london') {
        const samples = this.createSampleCSV();
        const csvContent = samples[type];
        const filename = `Access Schemes ${type === 'london' ? 'for London' : 'Yorkshire and fu'}.csv`;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Add CSV import functionality to the main app
if (typeof window !== 'undefined') {
    window.csvImporter = new CSVImporter();
    
    // Add CSV import button functionality
    document.addEventListener('DOMContentLoaded', () => {
        // Add import button to access schemes page
        const accessPage = document.getElementById('access-schemes');
        if (accessPage) {
            const header = accessPage.querySelector('.page-header');
            if (header) {
                const importSection = document.createElement('div');
                importSection.className = 'import-section';
                importSection.innerHTML = `
                    <div class="import-controls">
                        <input type="file" id="csv-file-input" accept=".csv" style="display: none;">
                        <button class="btn btn-secondary" onclick="document.getElementById('csv-file-input').click()">
                            <i class="fas fa-upload"></i> Import CSV
                        </button>
                        <button class="btn btn-secondary" onclick="window.csvImporter.downloadSampleCSV('london')">
                            <i class="fas fa-download"></i> Download London Sample
                        </button>
                        <button class="btn btn-secondary" onclick="window.csvImporter.downloadSampleCSV('yorkshire')">
                            <i class="fas fa-download"></i> Download Yorkshire Sample
                        </button>
                    </div>
                `;
                header.appendChild(importSection);

                // Handle file selection
                document.getElementById('csv-file-input').addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    try {
                        const result = await window.csvImporter.importAccessSchemes(file);
                        window.app.showMessage(
                            `Successfully imported ${result.imported} access schemes. ${result.skipped} entries were skipped.`,
                            'success'
                        );
                        window.app.loadAccessSchemes();
                    } catch (error) {
                        console.error('Import failed:', error);
                        window.app.showMessage(
                            `Import failed: ${error.message}`,
                            'error'
                        );
                    }
                    
                    // Reset file input
                    e.target.value = '';
                });
            }
        }
    });
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVImporter;
}
