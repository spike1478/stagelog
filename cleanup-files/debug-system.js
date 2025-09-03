/**
 * 🚀 ADVANCED DEBUGGING SYSTEM
 * Comprehensive performance monitoring, memory tracking, and error reporting
 */

class AdvancedDebugSystem {
    constructor() {
        this.startTime = performance.now();
        this.metrics = {
            pageLoads: [],
            functionCalls: [],
            memoryUsage: [],
            errors: [],
            networkRequests: [],
            userInteractions: [],
            dataValidation: [],
            performanceProfiles: [],
            storageChanges: [],
            domChanges: [],
            consoleLogs: [],
            performance: {
                domContentLoaded: 0,
                windowLoad: 0,
                firstPaint: 0,
                firstContentfulPaint: 0
            }
        };
        
        this.isEnabled = true;
        this.maxLogEntries = 1000;
        this.memoryCheckInterval = 5000; // 5 seconds
        
        this.init();
    }

    init() {
        console.log('🚀 Advanced Debug System Initialized');
        
        // Monitor page load performance
        this.monitorPageLoad();
        
        // Monitor memory usage
        this.startMemoryMonitoring();
        
        // Monitor errors
        this.monitorErrors();
        
        // Monitor function performance
        this.monitorFunctionPerformance();
        
        // Create debug dashboard
        this.createDebugDashboard();
        
        // Add network monitoring
        this.monitorNetworkRequests();
        
        // Add user interaction tracking
        this.monitorUserInteractions();
        
        // Add advanced monitoring features
        this.monitorDataValidation();
        this.monitorPerformanceProfiling();
        this.monitorStorageChanges();
        this.monitorDOMChanges();
        this.enhanceConsoleLogging();
    }

    monitorPageLoad() {
        const startTime = performance.now();
        
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.performance.domContentLoaded = performance.now() - startTime;
            console.log(`📊 DOM Content Loaded: ${this.metrics.performance.domContentLoaded.toFixed(2)}ms`);
        });

        // Window Load
        window.addEventListener('load', () => {
            this.metrics.performance.windowLoad = performance.now() - startTime;
            console.log(`📊 Window Load Complete: ${this.metrics.performance.windowLoad.toFixed(2)}ms`);
            
            // Record page load metrics
            this.metrics.pageLoads.push({
                timestamp: Date.now(),
                domContentLoaded: this.metrics.performance.domContentLoaded,
                windowLoad: this.metrics.performance.windowLoad,
                url: window.location.href
            });
        });

        // Performance Observer for paint metrics
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-paint') {
                        this.metrics.performance.firstPaint = entry.startTime;
                        console.log(`🎨 First Paint: ${entry.startTime.toFixed(2)}ms`);
                    }
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.performance.firstContentfulPaint = entry.startTime;
                        console.log(`🎨 First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    startMemoryMonitoring() {
        if (!('memory' in performance)) {
            console.log('⚠️ Memory API not available in this browser');
            return;
        }

        const checkMemory = () => {
            const memory = performance.memory;
            const memoryData = {
                timestamp: Date.now(),
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
                usedMB: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
                totalMB: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
                limitMB: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
            };

            this.metrics.memoryUsage.push(memoryData);
            
            // Keep only recent entries
            if (this.metrics.memoryUsage.length > this.maxLogEntries) {
                this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-this.maxLogEntries);
            }

            console.log(`🧠 Memory: ${memoryData.usedMB}MB / ${memoryData.totalMB}MB (Limit: ${memoryData.limitMB}MB)`);
        };

        // Initial check
        checkMemory();
        
        // Regular monitoring
        setInterval(checkMemory, this.memoryCheckInterval);
    }

    monitorErrors() {
        // Global error handler
        window.addEventListener('error', (event) => {
            const errorData = {
                timestamp: Date.now(),
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error ? event.error.stack : null,
                type: 'JavaScript Error'
            };

            this.metrics.errors.push(errorData);
            console.error('🚨 JavaScript Error:', errorData);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            const errorData = {
                timestamp: Date.now(),
                message: event.reason ? event.reason.toString() : 'Unknown promise rejection',
                error: event.reason,
                type: 'Unhandled Promise Rejection'
            };

            this.metrics.errors.push(errorData);
            console.error('🚨 Unhandled Promise Rejection:', errorData);
        });
    }

    monitorFunctionPerformance() {
        // Wrap console.log to track function calls
        const originalLog = console.log;
        console.log = (...args) => {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('🔍 DEBUG:')) {
                this.metrics.functionCalls.push({
                    timestamp: Date.now(),
                    function: args[0].split(' ')[2] || 'Unknown',
                    message: args.join(' '),
                    type: 'Debug Log'
                });
            }
            originalLog.apply(console, args);
        };
    }

    createDebugDashboard() {
        // Create debug panel HTML
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.classList.add('debug-hidden'); // Hidden by default
        debugPanel.innerHTML = `
            <div class="debug-header">
                <h3>🚀 Debug Dashboard</h3>
                <div class="debug-shortcut-hint">Press <kbd>Ctrl+Shift+D</kbd> to toggle</div>
                <button id="debug-toggle">Hide</button>
                <button id="debug-clear">Clear</button>
                <button id="debug-export">Export</button>
            </div>
            <div class="debug-content">
                <div class="debug-section">
                    <h4>📊 Performance Metrics</h4>
                    <div id="performance-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>🧠 Memory Usage</h4>
                    <div id="memory-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>🚨 Recent Errors</h4>
                    <div id="error-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>🔍 Function Calls</h4>
                    <div id="function-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>🌐 Network Requests</h4>
                    <div id="network-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>👆 User Interactions</h4>
                    <div id="interaction-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>🔍 Data Validation</h4>
                    <div id="validation-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>⚡ Performance Profiles</h4>
                    <div id="profile-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>💾 Storage Changes</h4>
                    <div id="storage-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>🌐 DOM Changes</h4>
                    <div id="dom-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>📝 Console Logs</h4>
                    <div id="console-metrics"></div>
                </div>
            </div>
        `;

        // Add debug panel styles
        const debugStyles = document.createElement('style');
        debugStyles.textContent = `
            #debug-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 400px;
                max-height: 80vh;
                background: #1a1a1a;
                color: #00ff00;
                border: 2px solid #00ff00;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                z-index: 10000;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
            }
            
            .debug-header {
                background: #00ff00;
                color: #000;
                padding: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .debug-shortcut-hint {
                font-size: 11px;
                color: #333;
                margin: 0 8px;
            }
            
            .debug-shortcut-hint kbd {
                background: #1a1a1a;
                color: #00ff00;
                padding: 2px 4px;
                border-radius: 3px;
                font-family: monospace;
                font-size: 10px;
                border: 1px solid #333;
            }
            
            .debug-header h3 {
                margin: 0;
                font-size: 14px;
            }
            
            .debug-header button {
                background: #000;
                color: #00ff00;
                border: 1px solid #00ff00;
                padding: 4px 8px;
                margin-left: 4px;
                cursor: pointer;
                font-size: 10px;
            }
            
            .debug-header button:hover {
                background: #00ff00;
                color: #000;
            }
            
            .debug-content {
                padding: 8px;
            }
            
            .debug-section {
                margin-bottom: 16px;
                border-bottom: 1px solid #333;
                padding-bottom: 8px;
            }
            
            .debug-section h4 {
                margin: 0 0 8px 0;
                color: #00ff00;
                font-size: 12px;
            }
            
            .debug-metric {
                display: flex;
                justify-content: space-between;
                margin: 2px 0;
                font-size: 11px;
            }
            
            .debug-metric .label {
                color: #888;
            }
            
            .debug-metric .value {
                color: #00ff00;
                font-weight: bold;
            }
            
            .debug-log {
                background: #222;
                padding: 4px;
                margin: 2px 0;
                border-left: 3px solid #00ff00;
                font-size: 10px;
                max-height: 100px;
                overflow-y: auto;
            }
            
            .debug-error {
                border-left-color: #ff0000;
                color: #ff6666;
            }
            
            .debug-log.success {
                border-left-color: #28a745;
                color: #90ee90;
            }
            
            .debug-log.error {
                border-left-color: #dc3545;
                color: #ff6666;
            }
            
            .debug-log.warn {
                border-left-color: #ffc107;
                color: #ffeb3b;
            }
            
            .debug-log.log {
                border-left-color: #17a2b8;
                color: #87ceeb;
            }
            
            .debug-hidden {
                display: none !important;
            }
            
            #debug-panel.debug-hidden {
                display: none !important;
            }
        `;

        document.head.appendChild(debugStyles);
        document.body.appendChild(debugPanel);

        // Add event listeners
        document.getElementById('debug-toggle').addEventListener('click', () => {
            this.toggleDebugPanel();
        });

        document.getElementById('debug-clear').addEventListener('click', () => {
            this.clearMetrics();
        });

        document.getElementById('debug-export').addEventListener('click', () => {
            this.exportMetrics();
        });

        // Update dashboard every second
        setInterval(() => {
            this.updateDashboard();
        }, 1000);

        // Add keyboard shortcut listener
        this.addKeyboardShortcut();
    }

    addKeyboardShortcut() {
        document.addEventListener('keydown', (event) => {
            // Ctrl+Shift+D to toggle debug panel
            if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                this.toggleDebugPanel();
                console.log('🚀 Debug panel toggled via keyboard shortcut (Ctrl+Shift+D)');
            }
        });
    }

    toggleDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        const button = document.getElementById('debug-toggle');
        
        if (debugPanel.classList.contains('debug-hidden')) {
            debugPanel.classList.remove('debug-hidden');
            button.textContent = 'Hide';
            console.log('🚀 Debug panel shown');
        } else {
            debugPanel.classList.add('debug-hidden');
            button.textContent = 'Show';
            console.log('🚀 Debug panel hidden');
        }
    }

    updateDashboard() {
        if (!this.isEnabled) return;

        // Update performance metrics
        const perfDiv = document.getElementById('performance-metrics');
        if (perfDiv) {
            perfDiv.innerHTML = `
                <div class="debug-metric">
                    <span class="label">DOM Ready:</span>
                    <span class="value">${this.metrics.performance.domContentLoaded.toFixed(2)}ms</span>
                </div>
                <div class="debug-metric">
                    <span class="label">Window Load:</span>
                    <span class="value">${this.metrics.performance.windowLoad.toFixed(2)}ms</span>
                </div>
                <div class="debug-metric">
                    <span class="label">First Paint:</span>
                    <span class="value">${this.metrics.performance.firstPaint.toFixed(2)}ms</span>
                </div>
                <div class="debug-metric">
                    <span class="label">FCP:</span>
                    <span class="value">${this.metrics.performance.firstContentfulPaint.toFixed(2)}ms</span>
                </div>
            `;
        }

        // Update memory metrics
        const memoryDiv = document.getElementById('memory-metrics');
        if (memoryDiv && this.metrics.memoryUsage.length > 0) {
            const latest = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
            memoryDiv.innerHTML = `
                <div class="debug-metric">
                    <span class="label">Used:</span>
                    <span class="value">${latest.usedMB}MB</span>
                </div>
                <div class="debug-metric">
                    <span class="label">Total:</span>
                    <span class="value">${latest.totalMB}MB</span>
                </div>
                <div class="debug-metric">
                    <span class="label">Limit:</span>
                    <span class="value">${latest.limitMB}MB</span>
                </div>
            `;
        }

        // Update error metrics
        const errorDiv = document.getElementById('error-metrics');
        if (errorDiv) {
            const recentErrors = this.metrics.errors.slice(-5);
            errorDiv.innerHTML = recentErrors.map(error => `
                <div class="debug-log debug-error">
                    <strong>${error.type}</strong><br>
                    ${error.message}<br>
                    <small>${new Date(error.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('');
        }

        // Update function call metrics
        const functionDiv = document.getElementById('function-metrics');
        if (functionDiv) {
            const recentCalls = this.metrics.functionCalls.slice(-5);
            functionDiv.innerHTML = recentCalls.map(call => `
                <div class="debug-log">
                    <strong>${call.function}</strong><br>
                    ${call.message}<br>
                    <small>${new Date(call.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('');
        }

        // Update network request metrics
        const networkDiv = document.getElementById('network-metrics');
        if (networkDiv) {
            const recentRequests = this.metrics.networkRequests.slice(-5);
            networkDiv.innerHTML = recentRequests.map(req => `
                <div class="debug-log">
                    <strong>${req.method} ${req.url}</strong><br>
                    Status: ${req.status} | Duration: ${req.duration.toFixed(2)}ms<br>
                    <small>${new Date(req.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('');
        }

        // Update user interaction metrics
        const interactionDiv = document.getElementById('interaction-metrics');
        if (interactionDiv) {
            const recentInteractions = this.metrics.userInteractions.slice(-5);
            interactionDiv.innerHTML = recentInteractions.map(interaction => `
                <div class="debug-log">
                    <strong>${interaction.type}</strong><br>
                    Target: ${interaction.target}${interaction.key ? ` | Key: ${interaction.key}` : ''}<br>
                    <small>${new Date(interaction.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('');
        }

        // Update data validation metrics
        const validationDiv = document.getElementById('validation-metrics');
        if (validationDiv) {
            const recentValidation = this.metrics.dataValidation.slice(-5);
            validationDiv.innerHTML = recentValidation.map(validation => `
                <div class="debug-log ${validation.isValid ? 'success' : 'error'}">
                    <strong>${validation.type}</strong><br>
                    ${validation.message}<br>
                    <small>${new Date(validation.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('');
        }

        // Update performance profile metrics
        const profileDiv = document.getElementById('profile-metrics');
        if (profileDiv) {
            const recentProfiles = this.metrics.performanceProfiles.slice(-5);
            profileDiv.innerHTML = recentProfiles.map(profile => `
                <div class="debug-log">
                    <strong>${profile.function}</strong><br>
                    ${profile.message}<br>
                    <small>${new Date(profile.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('');
        }

        // Update storage change metrics
        const storageDiv = document.getElementById('storage-metrics');
        if (storageDiv) {
            const recentStorage = this.metrics.storageChanges.slice(-5);
            storageDiv.innerHTML = recentStorage.map(storage => `
                <div class="debug-log">
                    <strong>${storage.type}</strong><br>
                    ${storage.message}<br>
                    <small>${new Date(storage.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('');
        }

        // Update DOM change metrics
        const domDiv = document.getElementById('dom-metrics');
        if (domDiv) {
            const recentDOM = this.metrics.domChanges.slice(-5);
            domDiv.innerHTML = recentDOM.map(dom => `
                <div class="debug-log">
                    <strong>${dom.type}</strong><br>
                    ${dom.message}<br>
                    <small>${new Date(dom.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('');
        }

        // Update console log metrics
        const consoleDiv = document.getElementById('console-metrics');
        if (consoleDiv) {
            const recentConsole = this.metrics.consoleLogs.slice(-5);
            consoleDiv.innerHTML = recentConsole.map(log => `
                <div class="debug-log ${log.level}">
                    <strong>[${log.level.toUpperCase()}]</strong><br>
                    ${log.message}<br>
                    <small>${new Date(log.timestamp).toLocaleTimeString()}</small>
                </div>
            `).join('');
        }
    }

    clearMetrics() {
        this.metrics = {
            pageLoads: [],
            functionCalls: [],
            memoryUsage: [],
            errors: [],
            networkRequests: [],
            userInteractions: [],
            dataValidation: [],
            performanceProfiles: [],
            storageChanges: [],
            domChanges: [],
            consoleLogs: [],
            performance: {
                domContentLoaded: 0,
                windowLoad: 0,
                firstPaint: 0,
                firstContentfulPaint: 0
            }
        };
        console.log('🧹 Debug metrics cleared');
    }

    exportMetrics() {
        const data = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-metrics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('📤 Debug metrics exported');
    }

    // Public methods for manual tracking
    trackFunctionCall(functionName, duration, args = []) {
        this.metrics.functionCalls.push({
            timestamp: Date.now(),
            function: functionName,
            duration: duration,
            args: args,
            type: 'Manual Track'
        });
    }

    trackError(error, context = '') {
        this.metrics.errors.push({
            timestamp: Date.now(),
            message: error.message || error.toString(),
            error: error.stack || error,
            context: context,
            type: 'Manual Error'
        });
    }

    getMetrics() {
        return this.metrics;
    }

    enable() {
        this.isEnabled = true;
        console.log('🚀 Debug system enabled');
    }

    disable() {
        this.isEnabled = false;
        console.log('🚀 Debug system disabled');
    }

    monitorNetworkRequests() {
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const startTime = performance.now();
            const url = args[0];
            
            return originalFetch.apply(this, args)
                .then(response => {
                    const duration = performance.now() - startTime;
                    this.metrics.networkRequests.push({
                        timestamp: Date.now(),
                        url: url,
                        method: 'GET',
                        status: response.status,
                        duration: duration,
                        type: 'fetch'
                    });
                    return response;
                })
                .catch(error => {
                    const duration = performance.now() - startTime;
                    this.metrics.networkRequests.push({
                        timestamp: Date.now(),
                        url: url,
                        method: 'GET',
                        status: 'error',
                        duration: duration,
                        error: error.message,
                        type: 'fetch'
                    });
                    throw error;
                });
        };

        // Monitor XMLHttpRequest
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const startTime = performance.now();
            
            xhr.addEventListener('loadend', () => {
                const duration = performance.now() - startTime;
                this.metrics.networkRequests.push({
                    timestamp: Date.now(),
                    url: xhr.responseURL,
                    method: xhr._method || 'GET',
                    status: xhr.status,
                    duration: duration,
                    type: 'xhr'
                });
            });
            
            const originalOpen = xhr.open;
            xhr.open = function(method, url) {
                xhr._method = method;
                return originalOpen.apply(this, arguments);
            };
            
            return xhr;
        };
    }

    monitorUserInteractions() {
        const interactionTypes = ['click', 'keydown', 'scroll', 'resize', 'focus', 'blur'];
        
        interactionTypes.forEach(type => {
            document.addEventListener(type, (event) => {
                this.metrics.userInteractions.push({
                    timestamp: Date.now(),
                    type: type,
                    target: event.target.tagName || 'unknown',
                    x: event.clientX || 0,
                    y: event.clientY || 0,
                    key: event.key || null
                });
                
                // Keep only recent interactions
                if (this.metrics.userInteractions.length > this.maxLogEntries) {
                    this.metrics.userInteractions = this.metrics.userInteractions.slice(-this.maxLogEntries);
                }
            });
        });
    }

    // Advanced Data Validation Monitoring
    monitorDataValidation() {
        // Monitor localStorage data integrity
        const originalSetItem = localStorage.setItem;
        const originalRemoveItem = localStorage.removeItem;
        
        localStorage.setItem = (key, value) => {
            // Only validate StageLog-related keys to avoid false positives
            const shouldTrack = /^(stagelog_|performances$|shows$|accessSchemes$|stagelog_performances$|stagelog_shows$|stagelog_access_schemes$)/.test(key);
            if (!shouldTrack) {
                return originalSetItem.call(localStorage, key, value);
            }

            const stringValue = String(value ?? '');
            const trimmed = stringValue.trim();
            const looksJson = trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('"');

            if (looksJson) {
                try {
                    JSON.parse(stringValue);
                    this.metrics.dataValidation.push({
                        timestamp: Date.now(),
                        type: 'localStorage_set',
                        key: key,
                        dataSize: stringValue.length,
                        isValid: true,
                        message: `JSON stored successfully: ${key}`
                    });
                } catch (e) {
                    this.metrics.dataValidation.push({
                        timestamp: Date.now(),
                        type: 'localStorage_set',
                        key: key,
                        dataSize: stringValue.length,
                        isValid: false,
                        message: `Invalid JSON stored: ${key} - ${e.message}`
                    });
                }
            } else {
                // Plain strings/numbers are allowed; mark as valid
                this.metrics.dataValidation.push({
                    timestamp: Date.now(),
                    type: 'localStorage_set',
                    key: key,
                    dataSize: stringValue.length,
                    isValid: true,
                    message: `String value stored: ${key}`
                });
            }

            return originalSetItem.call(localStorage, key, value);
        };

        localStorage.removeItem = (key) => {
            const shouldTrack = /^(stagelog_|performances$|shows$|accessSchemes$|stagelog_performances$|stagelog_shows$|stagelog_access_schemes$)/.test(key);
            if (shouldTrack) {
                this.metrics.dataValidation.push({
                    timestamp: Date.now(),
                    type: 'localStorage_remove',
                    key: key,
                    message: `Data removed: ${key}`
                });
            }
            return originalRemoveItem.call(localStorage, key);
        };
    }

    // Performance Profiling
    monitorPerformanceProfiling() {
        // Profile function execution times
        const functionsToProfile = ['renderPerformances', 'updateBasicStats', 'filterPerformances'];
        
        functionsToProfile.forEach(funcName => {
            if (window[funcName]) {
                const originalFunc = window[funcName];
                window[funcName] = (...args) => {
                    const startTime = performance.now();
                    const result = originalFunc.apply(this, args);
                    const endTime = performance.now();
                    
                    this.metrics.performanceProfiles.push({
                        timestamp: Date.now(),
                        function: funcName,
                        duration: endTime - startTime,
                        argsCount: args.length,
                        message: `${funcName} executed in ${(endTime - startTime).toFixed(2)}ms`
                    });
                    
                    return result;
                };
            }
        });
    }

    // Storage Monitoring
    monitorStorageChanges() {
        // Monitor localStorage changes
        window.addEventListener('storage', (e) => {
            this.metrics.storageChanges.push({
                timestamp: Date.now(),
                type: 'storage_change',
                key: e.key,
                oldValue: e.oldValue,
                newValue: e.newValue,
                url: e.url,
                message: `Storage changed: ${e.key}`
            });
        });

        // Monitor sessionStorage changes
        const originalSessionSetItem = sessionStorage.setItem;
        const originalSessionRemoveItem = sessionStorage.removeItem;
        
        sessionStorage.setItem = (key, value) => {
            this.metrics.storageChanges.push({
                timestamp: Date.now(),
                type: 'sessionStorage_set',
                key: key,
                value: value,
                message: `Session storage set: ${key}`
            });
            return originalSessionSetItem.call(sessionStorage, key, value);
        };

        sessionStorage.removeItem = (key) => {
            this.metrics.storageChanges.push({
                timestamp: Date.now(),
                type: 'sessionStorage_remove',
                key: key,
                message: `Session storage removed: ${key}`
            });
            return originalSessionRemoveItem.call(sessionStorage, key);
        };
    }

    // DOM Change Monitoring
    monitorDOMChanges() {
        // Monitor DOM mutations
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                this.metrics.domChanges.push({
                    timestamp: Date.now(),
                    type: mutation.type,
                    target: mutation.target.tagName || 'Unknown',
                    addedNodes: mutation.addedNodes.length,
                    removedNodes: mutation.removedNodes.length,
                    attributeName: mutation.attributeName,
                    message: `DOM ${mutation.type}: ${mutation.target.tagName || 'element'}`
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true
        });
    }

    // Enhanced Console Logging
    enhanceConsoleLogging() {
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };

        ['log', 'warn', 'error', 'info'].forEach(method => {
            console[method] = (...args) => {
                this.metrics.consoleLogs.push({
                    timestamp: Date.now(),
                    level: method,
                    message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
                    stack: new Error().stack
                });
                
                // Keep only last 100 console logs
                if (this.metrics.consoleLogs.length > 100) {
                    this.metrics.consoleLogs = this.metrics.consoleLogs.slice(-100);
                }
                
                return originalConsole[method].apply(console, args);
            };
        });
    }
}

// Initialize debug system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.debugSystem = new AdvancedDebugSystem();
    console.log('🚀 Advanced Debug System Ready!');
    console.log('💡 Press Ctrl+Shift+D to toggle the debug dashboard');
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedDebugSystem;
}
