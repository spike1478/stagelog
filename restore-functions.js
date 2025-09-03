// Placeholder restore function to replace Google Drive restore
function showRestoreModal() {
    alert('To restore data:\n\n1. Click "Import JSON" to select your backup file\n2. Choose the .json backup file you downloaded earlier\n3. Click import to restore your data\n\nThis will replace all current data with the backup.');
}

// Placeholder import modal function  
function showImportModal() {
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate the backup file
                    if (!data.stagelog_performances && !data.stagelog_shows) {
                        alert('❌ Invalid backup file. Please select a valid StageLog backup.');
                        return;
                    }
                    
                    // Confirm restore
                    const confirmRestore = confirm(`This will replace all current data with the backup from ${file.name}.\n\nAre you sure you want to continue?`);
                    
                    if (confirmRestore) {
                        // Restore data to localStorage
                        if (data.stagelog_shows) {
                            localStorage.setItem('stagelog_shows', JSON.stringify(data.stagelog_shows));
                        }
                        if (data.stagelog_performances) {
                            localStorage.setItem('stagelog_performances', JSON.stringify(data.stagelog_performances));
                        }
                        if (data.stagelog_access_schemes) {
                            localStorage.setItem('stagelog_access_schemes', JSON.stringify(data.stagelog_access_schemes));
                        }
                        if (data.user_preferences && data.user_preferences.theme) {
                            localStorage.setItem('theme', data.user_preferences.theme);
                        }
                        
                        alert(`✅ Data restored successfully from ${file.name}!\n\nThe page will now reload to show your restored data.`);
                        
                        // Reload the page to show restored data
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('❌ Import error:', error);
                    alert('❌ Error reading backup file. Please check the file and try again.');
                }
            };
            reader.readAsText(file);
        }
    };
    
    // Trigger file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}
