/**
 * VoiceCake Widget - Standalone Voice AI Assistant Widget
 * This widget provides voice conversation functionality that can be embedded on any website
 */

class VoiceCakeWidget {
    constructor(config = {}) {
        this.config = {
            agentId: config.agentId || null,
            apiBaseUrl: config.apiBaseUrl || 'https://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net/api/v1',
            wsBaseUrl: config.wsBaseUrl || 'wss://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net',
            debug: config.debug || false,
            ...config
        };

        this.state = {
            isOpen: false,
            isConnected: false,
            isActive: false,
            isMicOn: true,
            isUserSpeaking: false,
            startTime: null,
            timerInterval: null,
            transcription: [],
            agent: null,
            loading: true,
            error: null
        };

        this.connections = {
            socket: null,
            mediaStream: null,
            mediaRecorder: null,
            audioContext: null,
            speechContext: null,
            livekitRoom: null
        };

        this.audio = {
            queue: [],
            isPlaying: false,
            shouldInterrupt: false,
            currentSource: null
        };

        this.init();
    }

    init() {
        this.log('Initializing VoiceCake Widget...');
        
        if (!this.config.agentId) {
            this.showError('Agent ID is required. Please provide a valid agent ID.');
            return;
        }

        this.bindEvents();
        this.loadAgentDetails();
        this.log('VoiceCake Widget initialized successfully');
    }

    bindEvents() {
        // Widget button click
        const widgetButton = document.getElementById('voicecake-widget-button');
        if (widgetButton) {
            widgetButton.addEventListener('click', () => this.toggleWidget());
        }

        // Close button
        const closeButton = document.getElementById('voicecake-widget-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeWidget());
        }

        // Overlay click
        const overlay = document.getElementById('voicecake-widget-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeWidget());
        }

        // Start button
        const startButton = document.getElementById('voicecake-widget-start');
        if (startButton) {
            startButton.addEventListener('click', () => this.startConversation());
        }

        // Mute button
        const muteButton = document.getElementById('voicecake-widget-mute');
        if (muteButton) {
            muteButton.addEventListener('click', () => this.toggleMic());
        }

        // Stop button
        const stopButton = document.getElementById('voicecake-widget-stop');
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopConversation());
        }

        // Retry button
        const retryButton = document.getElementById('voicecake-widget-retry');
        if (retryButton) {
            retryButton.addEventListener('click', () => this.startConversation());
        }

        // Reload button
        const reloadButton = document.getElementById('voicecake-widget-reload');
        if (reloadButton) {
            reloadButton.addEventListener('click', () => this.loadAgentDetails());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isOpen) {
                this.closeWidget();
            }
        });
    }

    toggleWidget() {
        if (this.state.isOpen) {
            this.closeWidget();
        } else {
            this.openWidget();
        }
    }

    openWidget() {
        this.log('Opening widget...');
        this.state.isOpen = true;
        
        const popup = document.getElementById('voicecake-widget-popup');
        const overlay = document.getElementById('voicecake-widget-overlay');
        
        if (popup && overlay) {
            popup.classList.add('voicecake-widget-show');
            overlay.classList.add('voicecake-widget-show');
        }
    }

    closeWidget() {
        this.log('Closing widget...');
        this.state.isOpen = false;
        
        const popup = document.getElementById('voicecake-widget-popup');
        const overlay = document.getElementById('voicecake-widget-overlay');
        
        if (popup && overlay) {
            popup.classList.remove('voicecake-widget-show');
            overlay.classList.remove('voicecake-widget-show');
        }

        // Stop conversation if active
        if (this.state.isActive) {
            this.stopConversation();
        }
    }

    showState(stateName) {
        this.log(`Showing state: ${stateName}`);
        
        // Hide all states
        const states = ['loading', 'initial', 'connecting', 'active', 'error'];
        states.forEach(state => {
            const element = document.getElementById(`voicecake-widget-${state}`);
            if (element) {
                element.classList.add('voicecake-widget-hidden');
            }
        });

        // Show target state
        const targetElement = document.getElementById(`voicecake-widget-${stateName}`);
        if (targetElement) {
            targetElement.classList.remove('voicecake-widget-hidden');
        }
    }

    showError(message) {
        this.log(`Showing error: ${message}`);
        this.showState('error');
        
        const errorMessage = document.getElementById('voicecake-widget-error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    async loadAgentDetails() {
        try {
            this.state.loading = true;
            this.showState('loading');
            
            // For test agent, create mock data
            if (this.config.agentId === 'test-agent-123' || this.config.agentId.startsWith('test-')) {
                this.log('Test agent ID detected - creating mock agent data');
                const mockAgent = {
                    id: this.config.agentId,
                    name: 'VoiceCake Test Assistant',
                    description: 'A test AI assistant for demonstrating the widget functionality',
                    agent_type: 'SPEECH',
                    type: 'SPEECH',
                    status: 'active',
                    is_active: true,
                    is_public: true,
                    total_sessions: 0,
                    last_used: null
                };
                
                this.state.agent = mockAgent;
                this.state.loading = false;
                this.updateAgentDisplay(mockAgent);
                this.showState('initial');
                return;
            }
            
            const agent = await this.fetchAgentDetails();
            this.state.agent = agent;
            this.state.loading = false;
            
            this.updateAgentDisplay(agent);
            this.showState('initial');
            
        } catch (error) {
            this.log(`Error loading agent details: ${error.message}`);
            this.state.loading = false;
            this.state.error = error.message;
            this.showError(error.message);
        }
    }

    updateAgentDisplay(agent) {
        // Update agent name
        const agentName = document.getElementById('voicecake-widget-agent-name');
        const agentNameInline = document.getElementById('voicecake-widget-agent-name-inline');
        if (agentName) agentName.textContent = agent.name || 'Voice AI Assistant';
        if (agentNameInline) agentNameInline.textContent = agent.name || 'our AI assistant';

        // Update agent description
        const agentDescription = document.getElementById('voicecake-widget-agent-description');
        if (agentDescription) {
            agentDescription.textContent = agent.description || 'Powered by VoiceCake';
        }

        // Update agent type badge
        const agentType = document.getElementById('voicecake-widget-agent-type');
        if (agentType) {
            const agentTypeValue = agent.agent_type || agent.type || 'SPEECH';
            if (agentTypeValue === 'TEXT') {
                agentType.textContent = 'Text-to-Speech';
            } else {
                agentType.textContent = 'Speech-to-Speech';
            }
        }

        // Update agent status badge
        const agentStatus = document.getElementById('voicecake-widget-agent-status');
        if (agentStatus) {
            const status = agent.status || agent.is_active ? 'active' : 'inactive';
            agentStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            agentStatus.className = `voicecake-widget-badge voicecake-widget-badge-status ${status}`;
        }

        // Update widget title
        const widgetTitle = document.querySelector('.voicecake-widget-title-text h3');
        if (widgetTitle) {
            widgetTitle.textContent = agent.name || 'Voice AI Assistant';
        }
    }

    async startConversation() {
        this.log('Starting conversation...');
        this.showState('connecting');
        
        try {
            // Check if this is a test agent ID
            if (this.config.agentId === 'test-agent-123' || this.config.agentId.startsWith('test-')) {
                this.log('Test agent ID detected - starting test mode');
                await this.startTestMode();
                return;
            }

            // Use already loaded agent details
            if (!this.state.agent) {
                throw new Error('Agent details not loaded. Please try again.');
            }
            
            const agentInfo = this.state.agent;
            this.log(`Agent type detected: ${agentInfo.agent_type || agentInfo.type || 'SPEECH'}`);
            this.log('Agent details:', {
                id: agentInfo.id,
                name: agentInfo.name,
                agent_type: agentInfo.agent_type,
                is_active: agentInfo.is_active,
                is_public: agentInfo.is_public,
                fullAgentInfo: agentInfo
            });

            const agentType = (agentInfo.agent_type || agentInfo.type || 'SPEECH')?.toString()?.trim();

            // Get microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 48000,
                    sampleSize: 16,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false
                }
            });

            this.connections.mediaStream = stream;
            this.log('Microphone access granted');

            // Start speech detection
            this.startSpeechDetection(stream);

            // Connect based on agent type
            if (agentType?.toUpperCase() === 'TEXT') {
                this.log('TEXT agent detected - using LiveKit session');
                await this.connectToLiveKitSession();
            } else {
                this.log('SPEECH agent detected - using Hume WebSocket');
                await this.connectWebSocket();
                this.setupMediaRecorder(stream);
            }

            // Update UI to active state
            this.state.isActive = true;
            this.state.isConnected = true;
            this.state.startTime = Date.now();
            this.showState('active');
            this.startTimer();

            this.log('Conversation started successfully');

        } catch (error) {
            this.log(`Error starting conversation: ${error.message}`);
            this.log('Error details:', error);
            
            // Clean up any partial connections
            this.cleanupConnections();
            
            // Show user-friendly error message
            let errorMessage = 'Failed to start conversation';
            if (error.message.includes('timeout')) {
                errorMessage = 'Connection timed out. Please check your internet connection and try again.';
            } else if (error.message.includes('not found') || error.message.includes('404')) {
                errorMessage = 'Agent not found or not publicly accessible. Please check the agent ID.';
            } else if (error.message.includes('permission') || error.message.includes('microphone')) {
                errorMessage = 'Microphone permission denied. Please allow microphone access and try again.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else {
                errorMessage = `Failed to start conversation: ${error.message}`;
            }
            
            this.showError(errorMessage);
        }
    }

    async connectWebSocket() {
        return new Promise((resolve, reject) => {
            // Check if this is a test agent ID
            if (this.config.agentId === 'test-agent-123' || this.config.agentId.startsWith('test-')) {
                this.log('Test agent ID detected - simulating connection');
                // Simulate a successful connection for testing
                setTimeout(() => {
                    this.log('Test WebSocket connection simulated');
                    resolve();
                }, 1000);
                return;
            }

            const wsUrl = `${this.config.wsBaseUrl}/api/v1/hume/ws/inference/${this.config.agentId}`;
            this.log(`Connecting to WebSocket: ${wsUrl}`);

            const socket = new WebSocket(wsUrl);
            this.connections.socket = socket;

            // Set a timeout for connection
            const connectionTimeout = setTimeout(() => {
                if (socket.readyState === WebSocket.CONNECTING) {
                    this.log('WebSocket connection timeout - closing connection');
                    try {
                        socket.close();
                    } catch (error) {
                        this.log(`Error closing timed out socket: ${error.message}`);
                    }
                    reject(new Error('Connection timeout - please check your agent ID and network connection'));
                }
            }, 10000); // 10 second timeout

            socket.onopen = () => {
                clearTimeout(connectionTimeout);
                this.log('WebSocket connected');
                resolve();
            };

            socket.onerror = (error) => {
                clearTimeout(connectionTimeout);
                this.log(`WebSocket error: ${error}`);
                this.log('WebSocket error details:', error);
                reject(new Error('Failed to connect to voice service. Please check your agent ID and network connection.'));
            };

            socket.onmessage = (event) => {
                this.handleWebSocketMessage(event);
            };

            socket.onclose = (event) => {
                clearTimeout(connectionTimeout);
                this.log(`WebSocket closed: ${event.code} ${event.reason}`);
                this.log('WebSocket close details:', {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean
                });
                
                // Only stop conversation if it was active and this wasn't a clean close
                if (this.state.isActive && !event.wasClean) {
                    this.log('WebSocket closed unexpectedly - stopping conversation');
                    this.stopConversation();
                }
            };
        });
    }

    handleWebSocketMessage(event) {
        try {
            // Handle binary data (audio)
            if (event.data instanceof Blob) {
                this.addAudioToQueue(event.data);
                return;
            }

            if (event.data instanceof ArrayBuffer) {
                const audioBlob = new Blob([event.data], { type: 'audio/webm;codecs=opus' });
                this.addAudioToQueue(audioBlob);
                return;
            }

            // Handle JSON messages
            const data = JSON.parse(event.data);

            // Handle interruption
            if (data.interrupt || data.type === "interruption") {
                this.log('Server interruption received');
                this.executeImmediateInterruption();
                return;
            }

            // Handle audio chunks
            if (data.audio) {
                const audioFormat = data.audio_format || data.format || 'audio/wav';
                const audioBlob = this.base64ToBlob(data.audio, audioFormat);
                
                if (audioBlob) {
                    this.addAudioToQueue(audioBlob);
                }
                return;
            }

        } catch (error) {
            this.log(`Error processing WebSocket message: ${error.message}`);
        }
    }

    setupMediaRecorder(stream) {
        // Check if this is a test agent ID
        if (this.config.agentId === 'test-agent-123' || this.config.agentId.startsWith('test-')) {
            this.log('Test mode - MediaRecorder setup skipped');
            return;
        }

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm;codecs=opus",
            audioBitsPerSecond: 256000
        });

        this.connections.mediaRecorder = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && this.connections.socket && this.connections.socket.readyState === WebSocket.OPEN) {
                this.connections.socket.send(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            this.log('MediaRecorder stopped');
            if (this.connections.socket && this.connections.socket.readyState === WebSocket.OPEN) {
                this.connections.socket.close();
            }
        };

        mediaRecorder.start(100); // 100ms chunks
        this.log('MediaRecorder started');
    }

    startSpeechDetection(stream) {
        try {
            if (!this.connections.speechContext || this.connections.speechContext.state === 'closed') {
                this.connections.speechContext = new (window.AudioContext || window.webkitAudioContext)({
                    latencyHint: 'interactive'
                });
            }
            
            // Ensure AudioContext is running
            if (this.connections.speechContext.state === 'suspended') {
                this.connections.speechContext.resume().then(() => {
                    this.log('AudioContext resumed for speech detection');
                });
            }

            const sourceNode = this.connections.speechContext.createMediaStreamSource(stream);
            const analyser = this.connections.speechContext.createAnalyser();
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.8;

            sourceNode.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            let frameCount = 0;
            const checkAudioLevel = () => {
                if (this.connections.speechContext?.state !== 'running') return;

                analyser.getByteFrequencyData(dataArray);

                // Calculate RMS for speech detection
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i] * dataArray[i];
                }
                const rms = Math.sqrt(sum / bufferLength);

                // Log audio levels every 60 frames (about once per second) for debugging
                frameCount++;
                if (frameCount % 60 === 0) {
                    this.log(`Audio level: RMS=${rms.toFixed(2)}, threshold=35, speaking=${this.state.isUserSpeaking}`);
                }

                // Speech detection threshold
                if (rms > 35 && !this.state.isUserSpeaking) {
                    this.state.isUserSpeaking = true;
                    this.log('User started speaking - RMS:', rms.toFixed(2));
                    this.updateConversationStatus('listening', 'You are speaking...');
                    
                    // Check if agent joined when user started speaking
                    if (this.connections.livekitRoom && this.connections.livekitRoom.participants) {
                        this.log('Participants when user started speaking:', this.connections.livekitRoom.participants.size);
                        this.connections.livekitRoom.participants.forEach((participant, sid) => {
                            this.log('Participant when speaking:', participant.identity);
                        });
                    }
                } else if (rms < 20 && this.state.isUserSpeaking) {
                    this.state.isUserSpeaking = false;
                    this.log('User stopped speaking - RMS:', rms.toFixed(2));
                    this.updateConversationStatus('processing', 'Processing your message...');
                }

                requestAnimationFrame(checkAudioLevel);
            };

            checkAudioLevel();
            this.log('Speech detection started');

        } catch (error) {
            this.log(`Speech detection setup failed: ${error.message}`);
        }
    }

    toggleMic() {
        if (this.connections.mediaStream) {
            this.connections.mediaStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            this.state.isMicOn = !this.state.isMicOn;
            
            const muteButton = document.getElementById('voicecake-widget-mute');
            if (muteButton) {
                const span = muteButton.querySelector('span');
                if (span) {
                    span.textContent = this.state.isMicOn ? 'Mute' : 'Unmute';
                }
            }
            
            this.log(`Microphone ${this.state.isMicOn ? 'unmuted' : 'muted'}`);
        }
    }

    cleanupConnections() {
        this.log('Cleaning up connections...');
        
        // Clear timer
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }

        // Stop media recorder
        if (this.connections.mediaRecorder && this.connections.mediaRecorder.state !== 'inactive') {
            try {
                this.connections.mediaRecorder.stop();
            } catch (error) {
                this.log(`Error stopping media recorder: ${error.message}`);
            }
        }

        // Stop media stream
        if (this.connections.mediaStream) {
            try {
                this.connections.mediaStream.getTracks().forEach(track => track.stop());
            } catch (error) {
                this.log(`Error stopping media stream: ${error.message}`);
            }
        }

        // Close WebSocket
        if (this.connections.socket && this.connections.socket.readyState === WebSocket.OPEN) {
            try {
                this.connections.socket.close();
            } catch (error) {
                this.log(`Error closing WebSocket: ${error.message}`);
            }
        }

        // Disconnect LiveKit room
        if (this.connections.livekitRoom) {
            try {
                // Clean up any audio elements created for LiveKit
                const audioElements = document.querySelectorAll('audio[data-livekit-track]');
                audioElements.forEach((element, index) => {
                    this.log(`Cleaning up LiveKit audio element ${index}`);
                    
                    // Remove the media source connection flag
                    if (element instanceof HTMLAudioElement) {
                        delete element.dataset.mediaSourceConnected;
                    }
                    
                    // Pause and remove the element
                    if (element instanceof HTMLAudioElement) {
                        element.pause();
                        element.src = '';
                        element.load();
                    }
                    
                    element.remove();
                });
                
                this.connections.livekitRoom.disconnect();
            } catch (error) {
                this.log(`Error disconnecting LiveKit room: ${error.message}`);
            }
            this.connections.livekitRoom = null;
        }

        // Close audio contexts
        if (this.connections.audioContext && this.connections.audioContext.state !== 'closed') {
            try {
                this.connections.audioContext.close();
            } catch (error) {
                this.log(`Error closing audio context: ${error.message}`);
            }
        }

        if (this.connections.speechContext && this.connections.speechContext.state !== 'closed') {
            try {
                this.connections.speechContext.close();
            } catch (error) {
                this.log(`Error closing speech context: ${error.message}`);
            }
        }

        // Reset connections
        this.connections = {
            socket: null,
            mediaStream: null,
            mediaRecorder: null,
            audioContext: null,
            speechContext: null,
            livekitRoom: null
        };

        // Reset audio state
        this.audio.queue = [];
        this.audio.isPlaying = false;
        this.audio.shouldInterrupt = false;
        this.audio.currentSource = null;
    }

    stopConversation() {
        this.log('Stopping conversation...');
        
        this.cleanupConnections();

        // Reset state
        this.state.isActive = false;
        this.state.isConnected = false;
        this.state.isUserSpeaking = false;
        this.state.startTime = null;

        // Reset UI
        this.showState('initial');
        this.log('Conversation stopped');
    }

    startTimer() {
        this.state.timerInterval = setInterval(() => {
            if (this.state.startTime) {
                const elapsed = Math.floor((Date.now() - this.state.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                const timerElement = document.getElementById('voicecake-widget-timer-text');
                if (timerElement) {
                    timerElement.textContent = timeString;
                }
            }
        }, 1000);
    }

    addAudioToQueue(audioBlob) {
        this.audio.queue.push(audioBlob);
        if (!this.audio.isPlaying) {
            this.playNextAudio();
        }
    }

    async playNextAudio() {
        if (this.audio.shouldInterrupt || this.audio.queue.length === 0) {
            return;
        }

        const audioBlob = this.audio.queue.shift();
        if (!audioBlob) return;

        this.audio.isPlaying = true;

        try {
            await this.initializeAudioContext();
            
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await this.connections.audioContext.decodeAudioData(arrayBuffer);
            
            const source = this.connections.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.connections.audioContext.destination);
            
            this.audio.currentSource = source;
            
            source.onended = () => {
                this.audio.isPlaying = false;
                this.audio.currentSource = null;
                this.audio.shouldInterrupt = false;
                this.updateConversationStatus('ready', 'Ready to listen');
                setTimeout(() => this.playNextAudio(), 1);
            };
            
            source.start(0);
            this.log('Audio playback started');
            this.updateConversationStatus('speaking', 'AI is responding...');

        } catch (error) {
            this.log(`Audio playback failed: ${error.message}`);
            this.audio.isPlaying = false;
            this.audio.shouldInterrupt = false;
            setTimeout(() => this.playNextAudio(), 1);
        }
    }

    async initializeAudioContext() {
        if (!this.connections.audioContext || this.connections.audioContext.state === 'closed') {
            this.connections.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                latencyHint: 'interactive',
                sampleRate: 48000
            });
        }
        
        if (this.connections.audioContext.state === 'suspended') {
            await this.connections.audioContext.resume();
        }
    }

    executeImmediateInterruption() {
        this.log('Executing immediate interruption');
        this.audio.shouldInterrupt = true;
        this.audio.queue = [];
        
        if (this.audio.currentSource) {
            try {
                this.audio.currentSource.stop(0);
                this.audio.currentSource.disconnect();
                this.audio.currentSource = null;
            } catch (error) {
                this.log(`Error stopping audio source: ${error.message}`);
            }
        }
        
        this.audio.isPlaying = false;
    }

    base64ToBlob(base64, mime = 'audio/wav') {
        try {
            const base64Data = base64.replace(/^data:audio\/[^;]+;base64,/, '');
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            return new Blob([bytes], { 
                type: mime.includes('webm') ? mime : 'audio/wav'
            });
        } catch (error) {
            this.log(`Error converting base64 to blob: ${error.message}`);
            return null;
        }
    }

    updateConversationStatus(status, message) {
        const content = document.getElementById('voicecake-widget-conversation-content');
        if (!content) return;

        const statusDot = content.querySelector('.voicecake-widget-status-dot');
        const statusText = content.querySelector('.voicecake-widget-status-indicator span');
        
        if (statusDot && statusText) {
            // Update status dot color based on status
            statusDot.className = 'voicecake-widget-status-dot';
            if (status === 'listening') {
                statusDot.style.background = '#007bff';
                statusDot.style.animation = 'voicecake-status-pulse 1s infinite';
            } else if (status === 'speaking') {
                statusDot.style.background = '#ffc107';
                statusDot.style.animation = 'voicecake-status-pulse 0.5s infinite';
            } else if (status === 'processing') {
                statusDot.style.background = '#6f42c1';
                statusDot.style.animation = 'voicecake-status-pulse 0.8s infinite';
            } else {
                statusDot.style.background = '#28a745';
                statusDot.style.animation = 'voicecake-status-pulse 2s infinite';
            }
            
            statusText.textContent = message;
        }
    }

    addTranscriptionEntry(speaker, text, isFinal = true) {
        if (!text || !text.trim()) return;

        const entry = {
            id: `${speaker}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            speaker,
            text: text.trim(),
            isFinal
        };

        this.state.transcription.push(entry);
        
        // Update conversation status based on who's speaking
        if (speaker === 'user') {
            this.updateConversationStatus('listening', 'You are speaking...');
        } else {
            this.updateConversationStatus('speaking', 'AI is responding...');
        }
    }

    async fetchAgentDetails() {
        try {
            this.log('Fetching agent details...');
            
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );
            
            // For public widget, always try public endpoint first
            this.log('Trying public API endpoint...');
            const publicApiPromise = fetch(`${this.config.apiBaseUrl}/agents/${this.config.agentId}/public`);
            const response = await Promise.race([publicApiPromise, timeoutPromise]);
            
            if (response.ok) {
                const data = await response.json();
                this.log('Agent data received from public API:', data);
                
                // Handle standardized response format
                if (data.success === true && data.data) {
                    return data.data;
                } else if (data.data) {
                    return data.data;
                } else {
                    return data;
                }
            }
            
            // If public API fails with 404, the agent is not publicly accessible
            if (response.status === 404) {
                throw new Error('Agent not found or not publicly accessible. Please check the agent ID or contact the agent owner to make it public.');
            }
            
            // If public API fails with 401, the agent requires authentication
            if (response.status === 401) {
                throw new Error('This agent requires authentication and cannot be used in public mode.');
            }
            
            // For other errors, try regular API as fallback (but this will likely fail for public widget)
            this.log('Public API failed, trying regular API as fallback...');
            const regularApiPromise = fetch(`${this.config.apiBaseUrl}/agents/${this.config.agentId}`);
            const response2 = await Promise.race([regularApiPromise, timeoutPromise]);
            
            if (response2.ok) {
                const data = await response2.json();
                this.log('Agent data received from regular API:', data);
                
                // Handle standardized response format
                if (data.success === true && data.data) {
                    return data.data;
                } else if (data.data) {
                    return data.data;
                } else {
                    return data;
                }
            }
            
            // If both fail, provide specific error message
            if (response2.status === 404) {
                throw new Error('Agent not found. Please check the agent ID.');
            } else if (response2.status === 401) {
                throw new Error('Agent requires authentication and cannot be used in public mode.');
            }
            
            throw new Error('Failed to fetch agent details from both public and regular endpoints.');
            
        } catch (error) {
            this.log(`Error fetching agent details: ${error.message}`);
            
            let errorMessage = "Failed to fetch agent details";
            if (error.message === 'Request timeout') {
                errorMessage = "Request timed out. Please check your internet connection and try again.";
            } else if (error.message.includes('not found') || error.message.includes('404')) {
                errorMessage = "Agent not found or not publicly accessible. Please check the agent ID or contact the agent owner to make it public.";
            } else if (error.message.includes('authentication') || error.message.includes('401')) {
                errorMessage = "This agent requires authentication and cannot be used in public mode.";
            } else if (error.message.includes('publicly accessible')) {
                errorMessage = error.message;
            } else if (error.message.includes('public mode')) {
                errorMessage = error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            throw new Error(errorMessage);
        }
    }

    async connectToLiveKitSession() {
        try {
            this.log('Creating LiveKit session...');
            
            // Prepare headers
            const headers = {
                'Content-Type': 'application/json',
            };
            
            // For public widget, always use public endpoint first
            this.log('Trying public LiveKit endpoint...');
            this.log('Request URL:', `${this.config.apiBaseUrl}/livekit/session/start/public`);
            this.log('Request payload:', {
                agent_id: this.config.agentId,
                participant_name: `PublicUser_${Date.now()}`
            });
            
            const requestStartTime = Date.now();
            
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(`${this.config.apiBaseUrl}/livekit/session/start/public`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    agent_id: this.config.agentId,
                    participant_name: `PublicUser_${Date.now()}`
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            const requestDuration = Date.now() - requestStartTime;
            this.log(`Public endpoint response received in ${requestDuration}ms:`, {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });
            
            if (!response.ok) {
                // Log response body for debugging
                const responseText = await response.text();
                this.log('Public endpoint error response:', responseText);
                this.log(`Public endpoint failed: ${response.status} ${response.statusText}`);
                
                // Provide specific error messages for public widget
                if (response.status === 404) {
                    throw new Error('LiveKit session endpoint not found. This agent may not support voice conversations or may not be publicly accessible.');
                } else if (response.status === 401) {
                    throw new Error('This agent requires authentication for voice conversations and cannot be used in public mode.');
                } else if (response.status === 403) {
                    throw new Error('Access denied. This agent may not be publicly accessible for voice conversations.');
                } else {
                    throw new Error(`Failed to create voice session: ${response.status} - ${responseText}`);
                }
            }

            const sessionData = await response.json();
            this.log('LiveKit session created:', sessionData);
            this.log('Session data structure:', {
                hasData: !!sessionData.data,
                hasUrl: !!sessionData.url,
                hasToken: !!sessionData.token,
                hasSessionId: !!sessionData.session_id,
                keys: Object.keys(sessionData),
                fullData: sessionData
            });
            
            // Handle standardized response format
            let finalSessionData = sessionData;
            if (sessionData.success === true && sessionData.data) {
                finalSessionData = sessionData.data;
                this.log('Using data from standardized response:', finalSessionData);
            } else if (sessionData.data) {
                finalSessionData = sessionData.data;
                this.log('Using data from response:', finalSessionData);
            }

            // Connect to LiveKit room
            await this.connectToLiveKitRoom(finalSessionData);
            
        } catch (error) {
            this.log(`Error connecting to LiveKit: ${error.message}`);
            
            // Provide user-friendly error messages
            if (error.message.includes('not found') || error.message.includes('404')) {
                throw new Error('Voice conversation not available for this agent. The agent may not support voice mode or may not be publicly accessible.');
            } else if (error.message.includes('authentication') || error.message.includes('401')) {
                throw new Error('This agent requires authentication for voice conversations and cannot be used in public mode.');
            } else if (error.message.includes('Access denied') || error.message.includes('403')) {
                throw new Error('Access denied. This agent may not be publicly accessible for voice conversations.');
            } else if (error.message.includes('timeout')) {
                throw new Error('Connection timeout. Please check your internet connection and try again.');
            } else {
                throw error;
            }
        }
    }

    async connectToLiveKitRoom(sessionData) {
        return new Promise((resolve, reject) => {
            this.log('Connecting to LiveKit room...');
            this.log('Session data:', sessionData);
            
            // Wait a bit for LiveKit to be fully loaded
            setTimeout(() => {
                this.connectToLiveKitRoomInternal(sessionData, resolve, reject);
            }, 100);
        });
    }

    connectToLiveKitRoomInternal(sessionData, resolve, reject) {
        this.log('Available on window:', Object.keys(window).filter(key => key.toLowerCase().includes('livekit')));
        this.log('window.LiveKit:', typeof window.LiveKit);
        
        // Check if LiveKit client is available
        if (typeof window.LiveKit === 'undefined') {
            this.log('LiveKit client not available, loading...');
            
            // Try to load LiveKit dynamically
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/livekit-client@latest/dist/livekit-client.umd.js';
            script.onload = () => {
                this.log('LiveKit client loaded dynamically');
                this.connectToLiveKitRoomInternal(sessionData, resolve, reject);
            };
            script.onerror = () => {
                this.log('Failed to load LiveKit client');
                reject(new Error('LiveKit client not available'));
            };
            document.head.appendChild(script);
            return;
        }
    
        try {
            const { Room, RoomEvent, Track } = window.LiveKit;
            const room = new Room();
            this.connections.livekitRoom = room;
    
            // Set up transcription event listener
            room.on(RoomEvent.TranscriptionReceived, (segments, participant, publication) => {
                this.log('LiveKit transcription received:', {
                    segmentsCount: segments.length,
                    participantId: participant?.identity,
                    trackId: publication?.trackSid
                });
    
                segments.forEach(segment => {
                    const speaker = participant?.identity?.includes('agent') || participant?.identity?.includes('ai') ? 'ai' : 'user';
                    this.addTranscriptionEntry(speaker, segment.text, segment.final);
                });
            });
    
            // Set up connection event
            room.on(RoomEvent.Connected, async () => {
                this.log('LiveKit room connected');
                
                // Enable microphone for user input
                try {
                    await room.localParticipant.setMicrophoneEnabled(true);
                    this.log('Microphone enabled for LiveKit room');
                } catch (error) {
                    this.log(`Failed to enable microphone: ${error.message}`);
                }
                
                resolve();
            });
    
            room.on(RoomEvent.Disconnected, () => {
                this.log('LiveKit room disconnected');
                if (this.state.isActive) {
                    this.stopConversation();
                }
            });
    
            // Handle participant connections
            room.on(RoomEvent.ParticipantConnected, (participant) => {
                this.log('Participant joined:', participant.identity);
                
                if (participant.identity.includes('agent') || participant.identity.includes('ai')) {
                    this.log('Agent joined!');
                }
            });
    
            // Handle audio tracks from agent (TEXT-to-Speech output)
            room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
                this.log('Track subscribed:', {
                    participantId: participant.identity,
                    trackSid: publication.trackSid,
                    trackName: publication.trackName,
                    kind: track.kind,
                    muted: publication.isMuted,
                    enabled: publication.isEnabled
                });
                
                // Check if this is an agent audio track
                const isAgentTrack = track.kind === Track.Kind.Audio && (
                    participant.identity.includes('agent') ||
                    participant.identity.includes('ai') ||
                    participant.identity.includes('assistant') ||
                    participant.identity !== room.localParticipant.identity
                );
                
                if (isAgentTrack) {
                    this.log('Agent audio track received, setting up playback');
                    
                    // Create audio element for playback
                    const audioElement = track.attach();
                    audioElement.autoplay = true;
                    audioElement.volume = 1.0;
                    audioElement.setAttribute('data-livekit-track', 'agent-audio');
                    
                    // Set up audio event handlers
                    audioElement.onplay = () => {
                        this.log('Agent audio started playing');
                        this.updateConversationStatus('speaking', 'AI is responding...');
                    };
                    
                    audioElement.onended = () => {
                        this.log('Agent audio ended');
                        this.updateConversationStatus('ready', 'Ready to listen');
                    };
                    
                    audioElement.onerror = (error) => {
                        this.log(`Agent audio error: ${error}`);
                        this.updateConversationStatus('ready', 'Ready to listen');
                    };
                    
                    // Add to DOM for playback
                    document.body.appendChild(audioElement);
                    this.log('Agent audio element attached to DOM');
                }
            });
    
            // Connect to room
            this.log('Connecting to LiveKit room with URL:', sessionData.url);
            room.connect(sessionData.url, sessionData.token);
            
        } catch (error) {
            this.log(`Error connecting to LiveKit room: ${error.message}`);
            reject(error);
        }
    }

    async startTestMode() {
        // Get microphone permission for test mode
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 48000,
                sampleSize: 16,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false
            }
        });

        this.connections.mediaStream = stream;
        this.log('Microphone access granted for test mode');

        // Start speech detection
        this.startSpeechDetection(stream);

        // Update UI to active state
        this.state.isActive = true;
        this.state.isConnected = true;
        this.state.startTime = Date.now();
        this.showState('active');
        this.startTimer();

        // Start simulated conversation
        this.simulateTestConversation();
    }

    simulateTestConversation() {
        this.log('Starting test conversation simulation');
        this.updateConversationStatus('ready', 'Ready to listen');
        
        // Simulate user speaking after 3 seconds
        setTimeout(() => {
            this.updateConversationStatus('listening', 'You are speaking...');
            this.addTranscriptionEntry('user', 'Hello, this is a test message from the user.', true);
        }, 3000);

        // Simulate AI processing and response after 5 seconds
        setTimeout(() => {
            this.updateConversationStatus('processing', 'Processing your message...');
        }, 5000);

        // Simulate AI speaking after 6 seconds
        setTimeout(() => {
            this.updateConversationStatus('speaking', 'AI is responding...');
            this.addTranscriptionEntry('ai', 'Hello! I\'m the VoiceCake AI assistant. This is a test response to demonstrate the widget functionality.', true);
        }, 6000);

        // Simulate AI finished speaking after 8 seconds
        setTimeout(() => {
            this.updateConversationStatus('ready', 'Ready to listen');
        }, 8000);

        // Simulate another user message after 10 seconds
        setTimeout(() => {
            this.updateConversationStatus('listening', 'You are speaking...');
            this.addTranscriptionEntry('user', 'How does the voice conversation work?', true);
        }, 10000);

        // Simulate AI processing after 12 seconds
        setTimeout(() => {
            this.updateConversationStatus('processing', 'Processing your message...');
        }, 12000);

        // Simulate AI response after 13 seconds
        setTimeout(() => {
            this.updateConversationStatus('speaking', 'AI is responding...');
            this.addTranscriptionEntry('ai', 'The widget connects to VoiceCake\'s AI service through WebSocket for real-time voice conversations. You can speak naturally and I\'ll respond with voice and text.', true);
        }, 13000);

        // Simulate AI finished speaking after 15 seconds
        setTimeout(() => {
            this.updateConversationStatus('ready', 'Ready to listen');
        }, 15000);
    }

    log(message) {
        if (this.config.debug) {
            console.log(`[VoiceCake Widget] ${message}`);
        }
    }
}

// Auto-initialize widget when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if widget is already initialized
    if (window.voicecakeWidget) {
        return;
    }

    // Get configuration from script tag data attributes
    const script = document.querySelector('script[data-voicecake-agent-id]');
    if (!script) {
        console.error('[VoiceCake Widget] No agent ID provided. Please add data-voicecake-agent-id to the script tag.');
        return;
    }

    const config = {
        agentId: script.getAttribute('data-voicecake-agent-id'),
        apiBaseUrl: script.getAttribute('data-voicecake-api-url') || 'https://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net/api/v1',
        wsBaseUrl: script.getAttribute('data-voicecake-ws-url') || 'wss://voicecake-ame5ascacvgrgde6.canadacentral-01.azurewebsites.net',
        debug: script.getAttribute('data-voicecake-debug') === 'true'
    };

    // Initialize widget
    window.voicecakeWidget = new VoiceCakeWidget(config);
});

// Export for manual initialization
window.VoiceCakeWidget = VoiceCakeWidget;
