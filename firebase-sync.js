/**
 * 🔥 FIREBASE SYNC SYSTEM
 * Real-time synchronization between devices using Firebase Realtime Database
 */

class FirebaseSync {
    constructor() {
        this.isInitialized = false;
        this.isConnected = false;
        this.currentRoom = null;
        this.userId = null;
        this.database = null;
        this.auth = null;
        this.syncListeners = [];
        this.heartbeatInterval = null;
        
        // Firebase configuration
        // NOTE: API keys should be stored securely, not hardcoded
        this.firebaseConfig = {
            apiKey: "REPLACE_WITH_YOUR_FIREBASE_API_KEY",
            authDomain: "stagelog-sync.firebaseapp.com",
            databaseURL: "https://stagelog-sync-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "stagelog-sync",
            storageBucket: "stagelog-sync.firebasestorage.app",
            messagingSenderId: "431694953672",
            appId: "1:431694953672:web:3d4356d04371df4ad239fd"
        };
    }

    async init() {
        try {
            console.log('🔥 Initializing Firebase Sync...');
            
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(this.firebaseConfig);
            }
            
            this.database = firebase.database();
            this.auth = firebase.auth();
            
            // Sign in anonymously
            const userCredential = await this.auth.signInAnonymously();
            this.userId = userCredential.user.uid;
            
            console.log('🔥 Firebase initialized, User ID:', this.userId);
            this.isInitialized = true;
            this.updateSyncStatus('connected', 'Connected to Firebase');
            
            // Check if we have a saved room
            const savedRoom = localStorage.getItem('stagelog_sync_room');
            if (savedRoom) {
                await this.joinRoom(savedRoom);
            }
            
        } catch (error) {
            console.error('🔥 Firebase initialization error:', error);
            this.updateSyncStatus('error', 'Connection failed: ' + error.message);
        }
    }

    updateSyncStatus(status, message) {
        this.isConnected = status === 'connected';
        
        const statusIcon = document.getElementById('sync-status-icon');
        const statusText = document.getElementById('sync-status-text');
        
        if (statusIcon && statusText) {
            statusIcon.className = `fas fa-circle ${status}`;
            statusText.textContent = message;
        }
        
        // Update settings page sync status
        if (typeof updateSettingsSyncStatus === 'function') {
            updateSettingsSyncStatus();
        }
        
        // Announce sync status changes to screen readers
        this.announceSyncStatus(status, message);
        
        console.log('🔥 Sync Status:', status, message);
    }

    announceSyncStatus(status, message) {
        const announcementContainer = document.getElementById('sync-announcements');
        if (announcementContainer) {
            announcementContainer.textContent = '';
            let announcement = '';
            
            switch (status) {
                case 'connected':
                    announcement = `Sync connected: ${message}`;
                    break;
                case 'connecting':
                    announcement = `Sync connecting: ${message}`;
                    break;
                case 'error':
                    announcement = `Sync error: ${message}`;
                    break;
                case 'disconnected':
                    announcement = `Sync disconnected: ${message}`;
                    break;
                default:
                    announcement = `Sync status: ${message}`;
            }
            
            announcementContainer.textContent = announcement;
            setTimeout(() => { announcementContainer.textContent = ''; }, 5000);
        }
    }

    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'THEATRE-';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async createRoom() {
        try {
            const roomCode = this.generateRoomCode();
            console.log('🔥 Creating room:', roomCode);
            
            // Create room in Firebase
            const roomRef = this.database.ref(`rooms/${roomCode}`);
            await roomRef.set({
                created: firebase.database.ServerValue.TIMESTAMP,
                createdBy: this.userId,
                devices: {
                    [this.userId]: {
                        joined: firebase.database.ServerValue.TIMESTAMP,
                        lastSeen: firebase.database.ServerValue.TIMESTAMP
                    }
                }
            });
            
            // Save room to localStorage
            localStorage.setItem('stagelog_sync_room', roomCode);
            this.currentRoom = roomCode;
            
            // Upload current data to the room
            await this.uploadData();
            
            // Set up real-time listeners
            this.setupRoomListeners(roomCode);
            
            console.log('🔥 Room created successfully:', roomCode);
            return roomCode;
            
        } catch (error) {
            console.error('🔥 Error creating room:', error);
            throw error;
        }
    }

    async joinRoom(roomCode) {
        try {
            console.log('🔥 Joining room:', roomCode);
            
            // Check if room exists
            const roomRef = this.database.ref(`rooms/${roomCode}`);
            const snapshot = await roomRef.once('value');
            
            if (!snapshot.exists()) {
                throw new Error('Room not found. Please check the room code.');
            }
            
            const roomData = snapshot.val();
            
            // Check if room already has too many devices (optional limit)
            const deviceCount = Object.keys(roomData.devices || {}).length;
            const maxDevices = 10; // Configurable limit - set to 10 for now
            if (deviceCount >= maxDevices) {
                throw new Error(`Room is full. Maximum ${maxDevices} devices allowed.`);
            }
            
            // Add this device to the room
            await roomRef.child(`devices/${this.userId}`).set({
                joined: firebase.database.ServerValue.TIMESTAMP,
                lastSeen: firebase.database.ServerValue.TIMESTAMP
            });
            
            // Save room to localStorage
            localStorage.setItem('stagelog_sync_room', roomCode);
            this.currentRoom = roomCode;
            
            // Download existing data from the room
            await this.downloadData();
            
            // Set up real-time listeners
            this.setupRoomListeners(roomCode);
            
            console.log('🔥 Joined room successfully:', roomCode);
            return roomCode;
            
        } catch (error) {
            console.error('🔥 Error joining room:', error);
            throw error;
        }
    }

    setupRoomListeners(roomCode) {
        // Clean up any existing listeners first
        this.cleanupListeners();
        
        // Listen for data changes
        const dataRef = this.database.ref(`rooms/${roomCode}/data`);
        const dataListener = dataRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                this.handleDataUpdate(snapshot.val());
            }
        });
        this.syncListeners.push({ ref: dataRef, listener: dataListener });
        
        // Listen for device updates
        const devicesRef = this.database.ref(`rooms/${roomCode}/devices`);
        const devicesListener = devicesRef.on('value', (snapshot) => {
            this.handleDeviceUpdate(snapshot.val());
        });
        this.syncListeners.push({ ref: devicesRef, listener: devicesListener });
        
        // Update last seen timestamp periodically
        this.heartbeatInterval = setInterval(() => {
            if (this.currentRoom) {
                this.database.ref(`rooms/${this.currentRoom}/devices/${this.userId}/lastSeen`)
                    .set(firebase.database.ServerValue.TIMESTAMP);
            }
        }, 30000); // Every 30 seconds
        
        console.log('🔥 Room listeners setup for room:', roomCode);
    }

    cleanupListeners() {
        // Clear Firebase event listeners
        this.syncListeners.forEach(({ ref, listener }) => {
            try {
                ref.off('value', listener);
            } catch (error) {
                console.warn('🔥 Error removing listener:', error);
            }
        });
        this.syncListeners = [];
        
        // Clear heartbeat interval
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        console.log('🔥 Listeners cleaned up');
    }

    async uploadData() {
        if (!this.currentRoom) return;
        
        try {
            console.log('🔥 Uploading data to room:', this.currentRoom);
            
            const data = {
                performances: window.db.getPerformances(),
                shows: window.db.getShows(),
                accessSchemes: window.db.getAccessSchemes(),
                lastModified: firebase.database.ServerValue.TIMESTAMP,
                modifiedBy: this.userId
            };
            
            await this.database.ref(`rooms/${this.currentRoom}/data`).set(data);
            console.log('🔥 Data uploaded successfully');
            
            // Announce successful upload
            this.announceSyncStatus('connected', 'Data synchronized with other devices');
            
        } catch (error) {
            console.error('🔥 Error uploading data:', error);
            this.announceSyncStatus('error', 'Failed to sync data: ' + error.message);
        }
    }

    async downloadData() {
        if (!this.currentRoom) return;
        
        try {
            console.log('🔥 Downloading data from room:', this.currentRoom);
            
            const snapshot = await this.database.ref(`rooms/${this.currentRoom}/data`).once('value');
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                
                // Only update if data is newer or from different device
                if (data.modifiedBy !== this.userId) {
                    console.log('🔥 Merging data from other device');
                    await this.mergeData(data);
                }
            }
            
        } catch (error) {
            console.error('🔥 Error downloading data:', error);
        }
    }

    async mergeData(remoteData) {
        try {
            // Simple merge strategy: remote data wins for now
            // TODO: Implement more sophisticated conflict resolution
            
            if (remoteData.performances) {
                localStorage.setItem('stagelog_performances', JSON.stringify(remoteData.performances));
            }
            
            if (remoteData.shows) {
                localStorage.setItem('stagelog_shows', JSON.stringify(remoteData.shows));
            }
            
            if (remoteData.accessSchemes) {
                localStorage.setItem('stagelog_access_schemes', JSON.stringify(remoteData.accessSchemes));
            }
            
            // Refresh the app
            if (window.app) {
                window.app.loadDashboard();
                window.app.loadAccessSchemes();
            }
            
            console.log('🔥 Data merged successfully');
            
            // Announce successful data merge
            this.announceSyncStatus('connected', 'Data updated from other device');
            
        } catch (error) {
            console.error('🔥 Error merging data:', error);
            this.announceSyncStatus('error', 'Failed to merge data: ' + error.message);
        }
    }

    handleDataUpdate(data) {
        // Only process updates from other devices
        if (data.modifiedBy !== this.userId) {
            console.log('🔥 Received data update from other device');
            this.mergeData(data);
        }
    }

    handleDeviceUpdate(devices) {
        const deviceCount = Object.keys(devices || {}).length;
        console.log('🔥 Room has', deviceCount, 'devices connected');
        
        // Update UI to show connected devices
        this.updateDeviceStatus(devices);
        
        // Update settings page device list
        if (typeof updateDeviceList === 'function') {
            updateDeviceList();
        }
    }

    updateDeviceStatus(devices) {
        // Update last sync time
        const lastSyncTime = document.getElementById('last-sync-time');
        if (lastSyncTime) {
            lastSyncTime.textContent = new Date().toLocaleTimeString();
        }
    }

    async disconnect() {
        try {
            if (this.currentRoom) {
                // Remove this device from the room
                await this.database.ref(`rooms/${this.currentRoom}/devices/${this.userId}`).remove();
                
                // Clear local storage
                localStorage.removeItem('stagelog_sync_room');
                this.currentRoom = null;
            }
            
            // Clear listeners and intervals
            this.cleanupListeners();
            
            console.log('🔥 Disconnected from sync');
            this.updateSyncStatus('disconnected', 'Disconnected');
            
        } catch (error) {
            console.error('🔥 Error disconnecting:', error);
        }
    }

    // Hook into database operations to auto-sync
    setupAutoSync() {
        // Override database methods to trigger sync
        const originalAddPerformance = window.db.addPerformance;
        const originalUpdatePerformance = window.db.updatePerformance;
        const originalDeletePerformance = window.db.deletePerformance;
        
        window.db.addPerformance = async (performanceData) => {
            const result = originalAddPerformance.call(window.db, performanceData);
            if (this.currentRoom) {
                await this.uploadData();
            }
            return result;
        };
        
        window.db.updatePerformance = async (id, performanceData) => {
            const result = originalUpdatePerformance.call(window.db, id, performanceData);
            if (this.currentRoom) {
                await this.uploadData();
            }
            return result;
        };
        
        window.db.deletePerformance = async (id) => {
            const result = originalDeletePerformance.call(window.db, id);
            if (this.currentRoom) {
                await this.uploadData();
            }
            return result;
        };
    }
}

// Global sync instance
window.firebaseSync = new FirebaseSync();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.firebaseSync.init().then(() => {
        window.firebaseSync.setupAutoSync();
    });
});

// Clean up on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
    if (window.firebaseSync) {
        window.firebaseSync.cleanupListeners();
    }
});

// Clean up on page visibility change (when tab becomes hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.firebaseSync) {
        // Pause heartbeat when tab is hidden to save resources
        if (window.firebaseSync.heartbeatInterval) {
            clearInterval(window.firebaseSync.heartbeatInterval);
            window.firebaseSync.heartbeatInterval = null;
        }
    } else if (!document.hidden && window.firebaseSync && window.firebaseSync.currentRoom) {
        // Resume heartbeat when tab becomes visible again
        window.firebaseSync.heartbeatInterval = setInterval(() => {
            if (window.firebaseSync.currentRoom) {
                window.firebaseSync.database.ref(`rooms/${window.firebaseSync.currentRoom}/devices/${window.firebaseSync.userId}/lastSeen`)
                    .set(firebase.database.ServerValue.TIMESTAMP);
            }
        }, 30000);
    }
});
