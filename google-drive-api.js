/**
 * StageLog Google Drive API Integration
 * Provides direct backup and restore functionality with Google Drive
 */

// Google Drive API Configuration
const DRIVE_CONFIG = {
    // You'll need to add your credentials here after setup
    apiKey: '', // Your Google Cloud API Key
    clientId: '', // Your OAuth 2.0 Client ID
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    scopes: 'https://www.googleapis.com/auth/drive.file'
};

let isGoogleApiLoaded = false;
let isGoogleSignedIn = false;

// Initialize Google Drive API
async function initializeGoogleDrive() {
    try {
        if (!DRIVE_CONFIG.apiKey || !DRIVE_CONFIG.clientId) {
            throw new Error('Google Drive API credentials not configured');
        }

        return new Promise((resolve, reject) => {
            gapi.load('auth2', async () => {
                try {
                    await gapi.auth2.init({
                        client_id: DRIVE_CONFIG.clientId
                    });

                    await gapi.client.init({
                        apiKey: DRIVE_CONFIG.apiKey,
                        discoveryDocs: [DRIVE_CONFIG.discoveryDoc]
                    });

                    isGoogleApiLoaded = true;
                    console.log('🌩️ Google Drive API initialized');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
        
    } catch (error) {
        console.error('❌ Google Drive API initialization failed:', error);
        isGoogleApiLoaded = false;
        throw error;
    }
}

// Sign in to Google Drive
async function signInToGoogleDrive() {
    try {
        if (!isGoogleApiLoaded) {
            await initializeGoogleDrive();
        }

        const authInstance = gapi.auth2.getAuthInstance();
        const user = await authInstance.signIn();
        isGoogleSignedIn = authInstance.isSignedIn.get();
        
        console.log('✅ Signed in to Google Drive');
        return true;
        
    } catch (error) {
        console.error('❌ Google Drive sign-in failed:', error);
        return false;
    }
}

// Upload file to Google Drive
async function uploadToGoogleDrive(filename, data) {
    try {
        const metadata = {
            name: filename,
            parents: [] // Will be stored in root, or you can specify a folder ID
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', new Blob([data], {type: 'application/json'}));

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({
                'Authorization': `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
            }),
            body: form
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📤 File uploaded to Google Drive:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Upload to Google Drive failed:', error);
        throw error;
    }
}

// List StageLog backup files from Google Drive
async function listDriveBackups() {
    try {
        if (!isGoogleSignedIn) {
            throw new Error('Not signed in to Google Drive');
        }

        const response = await gapi.client.drive.files.list({
            q: "name contains 'stagelog-backup' and mimeType = 'application/json'",
            orderBy: 'createdTime desc',
            pageSize: 10
        });

        return response.result.files || [];
        
    } catch (error) {
        console.error('❌ Failed to list Drive backups:', error);
        throw error;
    }
}

// Download and restore from Google Drive
async function restoreFromDrive(fileId) {
    try {
        if (!isGoogleSignedIn) {
            throw new Error('Not signed in to Google Drive');
        }

        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        });

        const backupData = JSON.parse(response.body);
        
        // Restore to localStorage
        if (backupData.stagelog_shows) {
            localStorage.setItem('stagelog_shows', JSON.stringify(backupData.stagelog_shows));
        }
        if (backupData.stagelog_performances) {
            localStorage.setItem('stagelog_performances', JSON.stringify(backupData.stagelog_performances));
        }
        if (backupData.stagelog_access_schemes) {
            localStorage.setItem('stagelog_access_schemes', JSON.stringify(backupData.stagelog_access_schemes));
        }
        if (backupData.user_preferences) {
            if (backupData.user_preferences.theme) {
                localStorage.setItem('theme', backupData.user_preferences.theme);
            }
        }

        console.log('🔄 Data restored from Google Drive');
        return backupData;
        
    } catch (error) {
        console.error('❌ Failed to restore from Drive:', error);
        throw error;
    }
}

// Enhanced Export to Drive function (replaces the simple one)
async function exportToDrive() {
    const button = event?.target;
    let originalText = '';
    
    try {
        // Update button state
        if (button) {
            originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            button.disabled = true;
        }

        // Check if API credentials are configured
        if (!DRIVE_CONFIG.apiKey || !DRIVE_CONFIG.clientId) {
            showGoogleDriveSetup();
            return;
        }

        // Initialize and sign in if needed
        if (!isGoogleSignedIn) {
            const signedIn = await signInToGoogleDrive();
            if (!signedIn) {
                throw new Error('Failed to sign in to Google Drive');
            }
        }

        // Prepare data
        const stagelogData = {
            exportDate: new Date().toISOString(),
            exportType: "StageLog Drive Backup",
            version: "2.0.0",
            stagelog_shows: JSON.parse(localStorage.getItem('stagelog_shows') || '[]'),
            stagelog_performances: JSON.parse(localStorage.getItem('stagelog_performances') || '[]'),
            stagelog_access_schemes: JSON.parse(localStorage.getItem('stagelog_access_schemes') || '[]'),
            user_preferences: {
                theme: localStorage.getItem('theme') || 'light',
                lastBackup: new Date().toISOString()
            }
        };

        // Create filename
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:.]/g, '-');
        const filename = `stagelog-backup-${timestamp}.json`;
        const dataStr = JSON.stringify(stagelogData, null, 2);

        if (button) {
            button.innerHTML = '<i class="fas fa-cloud-upload-alt fa-spin"></i> Uploading...';
        }

        // Upload to Google Drive
        const result = await uploadToGoogleDrive(filename, dataStr);

        // Success!
        const count = stagelogData.stagelog_performances.length;
        alert(`🎉 StageLog backed up to Google Drive!\n\n📁 File: ${filename}\n🎭 ${count} performances backed up\n🆔 Drive File ID: ${result.id}\n\n✅ Your data is safely stored in the cloud!`);
        
        console.log('🌩️ Google Drive backup completed:', result);

        // Store last backup info
        localStorage.setItem('lastDriveBackup', JSON.stringify({
            date: new Date().toISOString(),
            fileId: result.id,
            filename: filename
        }));

    } catch (error) {
        console.error('❌ Google Drive export error:', error);
        
        if (error.message.includes('credentials not configured')) {
            showGoogleDriveSetup();
        } else {
            alert(`❌ Google Drive backup failed: ${error.message}\n\nTrying fallback download method...`);
            exportToDownload();
        }
    } finally {
        // Restore button
        if (button) {
            button.innerHTML = originalText || '<i class="fas fa-cloud-upload-alt"></i> Export to Drive';
            button.disabled = false;
        }
    }
}

// Fallback download function
function exportToDownload() {
    try {
        const stagelogData = {
            exportDate: new Date().toISOString(),
            exportType: "StageLog Drive Backup",
            version: "2.0.0",
            stagelog_shows: JSON.parse(localStorage.getItem('stagelog_shows') || '[]'),
            stagelog_performances: JSON.parse(localStorage.getItem('stagelog_performances') || '[]'),
            stagelog_access_schemes: JSON.parse(localStorage.getItem('stagelog_access_schemes') || '[]'),
            user_preferences: {
                theme: localStorage.getItem('theme') || 'light',
                lastBackup: new Date().toISOString()
            }
        };

        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:.]/g, '-');
        const filename = `stagelog-backup-${timestamp}.json`;
        const dataStr = JSON.stringify(stagelogData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        const count = stagelogData.stagelog_performances.length;
        alert(`✅ StageLog backup downloaded!\n\n📁 File: ${filename}\n🎭 ${count} performances backed up\n\n💡 Save this file to your Google Drive folder for cloud backup!`);
        
    } catch (error) {
        console.error('❌ Download export error:', error);
        alert('❌ Error creating backup. Please try again or check the console for details.');
    }
}

// Show Google Drive setup instructions
function showGoogleDriveSetup() {
    const setupInstructions = `🔧 Google Drive API Setup Required

To enable direct Google Drive backup, you need to:

1️⃣ Go to Google Cloud Console (console.cloud.google.com)
2️⃣ Create a new project or select existing one  
3️⃣ Enable Google Drive API
4️⃣ Create credentials:
   • API Key (for file operations)
   • OAuth 2.0 Client ID (for authentication)
5️⃣ Add credentials to google-drive-api.js file

📋 For now, I'll download the backup file that you can manually save to Google Drive.

Would you like detailed setup instructions?`;
    
    if (confirm(setupInstructions + '\n\nClick OK to see detailed setup guide, or Cancel to just download backup.')) {
        showDetailedSetupGuide();
    } else {
        exportToDownload();
    }
}

// Show detailed setup guide
function showDetailedSetupGuide() {
    const detailedGuide = `🔧 Detailed Google Drive API Setup

STEP 1: Google Cloud Console Setup
• Go to console.cloud.google.com
• Click "Select a project" → "New Project"
• Name it "StageLog" → Create

STEP 2: Enable Drive API  
• Go to "APIs & Services" → "Library"
• Search "Google Drive API" → Enable

STEP 3: Create Credentials
• Go to "APIs & Services" → "Credentials"
• Click "Create Credentials" → "API Key"
• Copy the API Key

STEP 4: OAuth Setup
• Click "Create Credentials" → "OAuth 2.0 Client ID"
• Choose "Web application"
• Add authorized origins: 
  - http://localhost
  - file://
• Copy the Client ID

STEP 5: Update StageLog
• Open google-drive-api.js
• Add your API Key and Client ID to DRIVE_CONFIG

Need help with any step? Check the browser console for more details.`;

    alert(detailedGuide);
    exportToDownload();
}

// Show restore modal with available backups
async function showDriveRestoreModal() {
    try {
        if (!DRIVE_CONFIG.apiKey || !DRIVE_CONFIG.clientId) {
            alert('❌ Google Drive API not configured. Please set up API credentials first.');
            return;
        }

        if (!isGoogleSignedIn) {
            const signedIn = await signInToGoogleDrive();
            if (!signedIn) {
                alert('❌ Failed to sign in to Google Drive');
                return;
            }
        }

        const backups = await listDriveBackups();
        
        if (backups.length === 0) {
            alert('📂 No StageLog backups found in your Google Drive.\n\nCreate a backup first using "Export to Drive".');
            return;
        }

        // Create modal content
        let modalContent = '<h3>🌩️ Restore from Google Drive</h3>\n<p>Select a backup to restore:</p>\n<div style="max-height: 300px; overflow-y: auto;">';
        
        backups.forEach((backup, index) => {
            const date = new Date(backup.createdTime).toLocaleString();
            modalContent += `
                <div style="border: 1px solid #ddd; margin: 5px 0; padding: 10px; border-radius: 5px;">
                    <strong>${backup.name}</strong><br>
                    <small>Created: ${date}</small><br>
                    <button onclick="restoreFromDriveFile('${backup.id}', '${backup.name}')" 
                            style="margin-top: 5px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        Restore This Backup
                    </button>
                </div>
            `;
        });
        
        modalContent += '</div>';
        
        // Show in browser alert (you could enhance this with a proper modal)
        const proceed = confirm(modalContent.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n'));
        
        if (proceed && backups.length > 0) {
            // For now, restore the most recent backup
            await restoreFromDriveFile(backups[0].id, backups[0].name);
        }
        
    } catch (error) {
        console.error('❌ Error showing restore modal:', error);
        alert(`❌ Error loading backups: ${error.message}`);
    }
}

// Restore from specific Drive file
async function restoreFromDriveFile(fileId, filename) {
    try {
        const confirmRestore = confirm(`⚠️ This will replace your current StageLog data with the backup:\n\n📁 ${filename}\n\nAre you sure you want to continue?`);
        
        if (!confirmRestore) {
            return;
        }

        const backupData = await restoreFromDrive(fileId);
        
        // Refresh the current page to load restored data
        const performanceCount = backupData.stagelog_performances?.length || 0;
        alert(`✅ StageLog data restored successfully!\n\n🎭 ${performanceCount} performances restored\n📁 From: ${filename}\n\nThe page will refresh to load your restored data.`);
        
        // Reload the page to show restored data
        window.location.reload();
        
    } catch (error) {
        console.error('❌ Error restoring from Drive:', error);
        alert(`❌ Failed to restore backup: ${error.message}`);
    }
}

// Show import modal for JSON files
function showImportModal() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importData = JSON.parse(e.target.result);
                importFromJSON(importData, file.name);
            } catch (error) {
                console.error('❌ JSON parse error:', error);
                alert(`❌ Invalid JSON file: ${error.message}\n\nPlease ensure the file is a valid StageLog backup.`);
            }
        };
        reader.readAsText(file);
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

// Import data from JSON backup
function importFromJSON(importData, filename) {
    try {
        // Validate the import data structure
        if (!importData || typeof importData !== 'object') {
            throw new Error('Invalid data structure');
        }

        let importCount = 0;
        let showCount = 0;
        let performanceCount = 0;
        let schemeCount = 0;

        // Show confirmation dialog with preview
        const preview = `📁 Import Preview: ${filename}

📊 Data found:
${importData.stagelog_shows ? `• Shows: ${importData.stagelog_shows.length}` : '• No shows data'}
${importData.stagelog_performances ? `• Performances: ${importData.stagelog_performances.length}` : '• No performances data'}  
${importData.stagelog_access_schemes ? `• Access Schemes: ${importData.stagelog_access_schemes.length}` : '• No access schemes data'}

⚠️ This will MERGE with your existing data.
Duplicate shows/performances will be skipped.

Continue with import?`;

        if (!confirm(preview)) {
            return;
        }

        // Import shows
        if (importData.stagelog_shows && Array.isArray(importData.stagelog_shows)) {
            const existingShows = JSON.parse(localStorage.getItem('stagelog_shows') || '[]');
            const existingIds = new Set(existingShows.map(s => s.id));
            
            const newShows = importData.stagelog_shows.filter(show => !existingIds.has(show.id));
            const mergedShows = [...existingShows, ...newShows];
            
            localStorage.setItem('stagelog_shows', JSON.stringify(mergedShows));
            showCount = newShows.length;
            importCount += showCount;
        }

        // Import performances
        if (importData.stagelog_performances && Array.isArray(importData.stagelog_performances)) {
            const existingPerformances = JSON.parse(localStorage.getItem('stagelog_performances') || '[]');
            const existingIds = new Set(existingPerformances.map(p => p.id));
            
            const newPerformances = importData.stagelog_performances.filter(perf => !existingIds.has(perf.id));
            const mergedPerformances = [...existingPerformances, ...newPerformances];
            
            localStorage.setItem('stagelog_performances', JSON.stringify(mergedPerformances));
            performanceCount = newPerformances.length;
            importCount += performanceCount;
        }

        // Import access schemes  
        if (importData.stagelog_access_schemes && Array.isArray(importData.stagelog_access_schemes)) {
            const existingSchemes = JSON.parse(localStorage.getItem('stagelog_access_schemes') || '[]');
            const existingIds = new Set(existingSchemes.map(s => s.id));
            
            const newSchemes = importData.stagelog_access_schemes.filter(scheme => !existingIds.has(scheme.id));
            const mergedSchemes = [...existingSchemes, ...newSchemes];
            
            localStorage.setItem('stagelog_access_schemes', JSON.stringify(mergedSchemes));
            schemeCount = newSchemes.length;
            importCount += schemeCount;
        }

        // Import user preferences
        if (importData.user_preferences) {
            if (importData.user_preferences.theme) {
                localStorage.setItem('theme', importData.user_preferences.theme);
            }
        }

        // Show success message
        const successMessage = `✅ Import completed successfully!

📁 File: ${filename}
📊 Imported:
• ${showCount} new shows
• ${performanceCount} new performances  
• ${schemeCount} new access schemes

${importCount === 0 ? '⚠️ No new data was imported (all items already existed)' : '🎉 ' + importCount + ' items imported total'}

The page will refresh to show your updated data.`;

        alert(successMessage);
        
        // Store import info
        localStorage.setItem('lastImport', JSON.stringify({
            date: new Date().toISOString(),
            filename: filename,
            importCount: importCount
        }));

        // Reload page to show imported data
        window.location.reload();

    } catch (error) {
        console.error('❌ Import error:', error);
        alert(`❌ Import failed: ${error.message}\n\nPlease check that this is a valid StageLog backup file.`);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Auto-initialize Google Drive API if credentials are available
    if (DRIVE_CONFIG.apiKey && DRIVE_CONFIG.clientId) {
        initializeGoogleDrive().catch(console.error);
    }
});
