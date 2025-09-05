/**
 * VoiceCake Widget Loader
 * This script loads the VoiceCake widget on any website
 */

(function() {
    'use strict';

    // Prevent multiple initializations
    if (window.voicecakeWidgetLoaded) {
        return;
    }
    window.voicecakeWidgetLoaded = true;

    // Configuration
    const WIDGET_VERSION = '1.0.0';
    const WIDGET_BASE_URL = window.location.origin; // Use the same domain as the current page
    
    // Get configuration from script tag
    const currentScript = document.currentScript || 
        (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

    const config = {
        agentId: currentScript.getAttribute('data-agent-id'),
        apiBaseUrl: currentScript.getAttribute('data-api-url') || 'https://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net/api/v1',
        wsBaseUrl: currentScript.getAttribute('data-ws-url') || 'wss://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net',
        authToken: currentScript.getAttribute('data-auth-token'), // Optional auth token for LiveKit
        debug: currentScript.getAttribute('data-debug') === 'true',
        position: currentScript.getAttribute('data-position') || 'bottom-left',
        theme: currentScript.getAttribute('data-theme') || 'default'
    };

    // Validate required configuration
    if (!config.agentId) {
        console.error('[VoiceCake Widget] Agent ID is required. Please add data-agent-id to the script tag.');
        return;
    }

    // Load widget resources
    function loadWidget() {
        // Create widget container with full HTML structure
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'voicecake-widget-container';
        widgetContainer.innerHTML = `
            <!-- Floating Widget Button -->
            <div id="voicecake-widget-button" class="voicecake-widget-button">
                <div class="voicecake-widget-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1C13.1 1 14 1.9 14 3V11C14 12.1 13.1 13 12 13C10.9 13 10 12.1 10 11V3C10 1.9 10.9 1 12 1Z" fill="currentColor"/>
                        <path d="M19 10V11C19 15.42 15.42 19 11 19H13V21H11V19C6.58 19 3 15.42 3 11V10H5V11C5 14.31 7.69 17 11 17C14.31 17 17 14.31 17 11V10H19Z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="voicecake-widget-pulse"></div>
            </div>

            <!-- Widget Popup -->
            <div id="voicecake-widget-popup" class="voicecake-widget-popup">
                <div class="voicecake-widget-header">
                    <div class="voicecake-widget-title">
                        <div class="voicecake-widget-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div class="voicecake-widget-title-text">
                            <h3>Voice AI Assistant</h3>
                            <p>Powered by VoiceCake</p>
                        </div>
                    </div>
                    <button id="voicecake-widget-close" class="voicecake-widget-close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>

                <div class="voicecake-widget-content">
                    <!-- Initial State -->
                    <div id="voicecake-widget-initial" class="voicecake-widget-state">
                        <div class="voicecake-widget-welcome">
                            <div class="voicecake-widget-welcome-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 1C13.1 1 14 1.9 14 3V11C14 12.1 13.1 13 12 13C10.9 13 10 12.1 10 11V3C10 1.9 10.9 1 12 1Z" fill="currentColor"/>
                                    <path d="M19 10V11C19 15.42 15.42 19 11 19H13V21H11V19C6.58 19 3 15.42 3 11V10H5V11C5 14.31 7.69 17 11 17C14.31 17 17 14.31 17 11V10H19Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <h3>Start Voice Conversation</h3>
                            <p>Click the button below to begin talking with our AI assistant</p>
                            <button id="voicecake-widget-start" class="voicecake-widget-start-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                                </svg>
                                Start Chat
                            </button>
                        </div>
                    </div>

                    <!-- Connecting State -->
                    <div id="voicecake-widget-connecting" class="voicecake-widget-state voicecake-widget-hidden">
                        <div class="voicecake-widget-connecting">
                            <div class="voicecake-widget-spinner"></div>
                            <h3>Connecting...</h3>
                            <p>Setting up your voice conversation</p>
                        </div>
                    </div>

                    <!-- Active State -->
                    <div id="voicecake-widget-active" class="voicecake-widget-state voicecake-widget-hidden">
                        <div class="voicecake-widget-active">
                            <div class="voicecake-widget-status">
                                <div class="voicecake-widget-status-indicator">
                                    <div class="voicecake-widget-status-dot"></div>
                                    <span>Connected</span>
                                </div>
                                <div class="voicecake-widget-timer">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
                                    </svg>
                                    <span id="voicecake-widget-timer-text">00:00</span>
                                </div>
                            </div>

                            <div class="voicecake-widget-audio-visualizer">
                                <div class="voicecake-widget-wave">
                                    <div class="voicecake-widget-wave-bar"></div>
                                    <div class="voicecake-widget-wave-bar"></div>
                                    <div class="voicecake-widget-wave-bar"></div>
                                    <div class="voicecake-widget-wave-bar"></div>
                                    <div class="voicecake-widget-wave-bar"></div>
                                    <div class="voicecake-widget-wave-bar"></div>
                                    <div class="voicecake-widget-wave-bar"></div>
                                    <div class="voicecake-widget-wave-bar"></div>
                                </div>
                            </div>

                            <div class="voicecake-widget-controls">
                                <button id="voicecake-widget-mute" class="voicecake-widget-control-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 1C13.1 1 14 1.9 14 3V11C14 12.1 13.1 13 12 13C10.9 13 10 12.1 10 11V3C10 1.9 10.9 1 12 1Z" fill="currentColor"/>
                                        <path d="M19 10V11C19 15.42 15.42 19 11 19H13V21H11V19C6.58 19 3 15.42 3 11V10H5V11C5 14.31 7.69 17 11 17C14.31 17 17 14.31 17 11V10H19Z" fill="currentColor"/>
                                    </svg>
                                    <span>Mute</span>
                                </button>
                                <button id="voicecake-widget-stop" class="voicecake-widget-control-btn voicecake-widget-stop-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
                                    </svg>
                                    <span>End Chat</span>
                                </button>
                            </div>

                            <div class="voicecake-widget-transcription">
                                <div class="voicecake-widget-transcription-header">
                                    <h4>Conversation</h4>
                                </div>
                                <div id="voicecake-widget-transcription-content" class="voicecake-widget-transcription-content">
                                    <div class="voicecake-widget-transcription-placeholder">
                                        <p>Start speaking to see the conversation here...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div id="voicecake-widget-error" class="voicecake-widget-state voicecake-widget-hidden">
                        <div class="voicecake-widget-error">
                            <div class="voicecake-widget-error-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <h3>Connection Failed</h3>
                            <p id="voicecake-widget-error-message">Unable to connect to the voice assistant. Please try again.</p>
                            <button id="voicecake-widget-retry" class="voicecake-widget-retry-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12S7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12S8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
                                </svg>
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Widget Overlay -->
            <div id="voicecake-widget-overlay" class="voicecake-widget-overlay voicecake-widget-hidden"></div>
        `;

        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `${WIDGET_BASE_URL}/voicecake-widget.css?v=${WIDGET_VERSION}`;
        cssLink.onload = function() {
            console.log('[VoiceCake Widget] CSS loaded');
        };
        cssLink.onerror = function() {
            console.error('[VoiceCake Widget] Failed to load CSS');
        };

        // Load LiveKit client library first
        const livekitScript = document.createElement('script');
        livekitScript.src = 'https://unpkg.com/livekit-client@2.15.6/dist/livekit-client.umd.js';
        livekitScript.onload = function() {
            console.log('[VoiceCake Widget] LiveKit client loaded');
            console.log('[VoiceCake Widget] Available LiveKit objects:', Object.keys(window).filter(key => key.toLowerCase().includes('livekit')));
            loadMainScript();
        };
        livekitScript.onerror = function() {
            console.error('[VoiceCake Widget] Failed to load LiveKit client');
            loadMainScript(); // Continue anyway
        };

        function loadMainScript() {
            // Load main widget JavaScript
            const jsScript = document.createElement('script');
            jsScript.src = `${WIDGET_BASE_URL}/voicecake-widget.js?v=${WIDGET_VERSION}`;
            jsScript.onload = function() {
                console.log('[VoiceCake Widget] JavaScript loaded');
                initializeWidget();
            };
            jsScript.onerror = function() {
                console.error('[VoiceCake Widget] Failed to load JavaScript');
            };

            document.head.appendChild(jsScript);
        }

        // Add resources to page
        document.head.appendChild(cssLink);
        document.body.appendChild(widgetContainer);
        document.head.appendChild(livekitScript);
    }

    // Initialize widget after resources are loaded
    function initializeWidget() {
        if (typeof VoiceCakeWidget === 'undefined') {
            console.error('[VoiceCake Widget] VoiceCakeWidget class not found');
            return;
        }

        // Create widget instance
        window.voicecakeWidget = new VoiceCakeWidget(config);
        console.log('[VoiceCake Widget] Widget initialized successfully');
    }

    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadWidget);
    } else {
        loadWidget();
    }

})();
