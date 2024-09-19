/**
 * Speech Recognition Service
 * 
 * This module provides a robust speech recognition service using WebSocket communication.
 * It leverages WebRTC for capturing audio and Socket.IO for real-time communication with a server.
 * 
 * Key features:
 * - Real-time speech recognition using WebRTC
 * - Configurable language, sample rate, and recognition interval
 * - Event-based architecture for easy integration
 * - Support for starting, stopping, and seeking within recognition
 * - Dynamic language and interval adjustment
 * 
 * @module SpeechRecognitionService
 */

import io, { Socket } from 'socket.io-client';
import EventEmitter from 'events';

/**
 * Configuration options for the speech recognition service.
 */
interface SpeechRecognitionOptions {
    serverUrl: string;
    language?: string;
    sampleRate?: number;
    intervalMs?: number;
    audioContext?: AudioContext;
}

/**
 * Structure of the recognition result returned by the server.
 */
interface RecognitionResult {
    text: string;
    isFinal: boolean;
}

/**
 * Main class for the speech recognition service.
 * Extends EventEmitter to provide an event-driven interface.
 */
class SpeechRecognitionService extends EventEmitter {
    private socket: Socket;
    private peerConnection: RTCPeerConnection | null = null;
    private audioContext: AudioContext;
    private stream: MediaStream | null = null;
    private options: SpeechRecognitionOptions;
    private isRecognizing: boolean = false;

    /**
     * Creates a new instance of the SpeechRecognitionService.
     * @param options Configuration options for the service.
     */
    constructor(options: SpeechRecognitionOptions) {
        super();
        this.options = {
            language: 'en-US',
            sampleRate: 16000,
            intervalMs: 1000,
            ...options
        };
        this.audioContext = options.audioContext || new AudioContext({ sampleRate: this.options.sampleRate });
        this.socket = io(this.options.serverUrl);
        this.setupSocketListeners();
    }

    /**
     * Sets up event listeners for the WebSocket connection.
     */
    private setupSocketListeners() {
        this.socket.on('connect', () => this.emit('connected'));
        this.socket.on('disconnect', () => this.emit('disconnected'));
        this.socket.on('recognitionResult', (result: RecognitionResult) => this.emit('result', result));
        this.socket.on('error', (error: any) => this.emit('error', error));
    }

    /**
     * Starts the speech recognition process.
     * Captures audio from the user's microphone using WebRTC and streams it to the server.
     */
    async start(): Promise<void> {
        if (this.isRecognizing) return;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.peerConnection = new RTCPeerConnection();

            this.stream.getTracks().forEach(track => {
                if (this.peerConnection) {
                    this.peerConnection.addTrack(track, this.stream!);
                }
            });

            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.socket.emit('iceCandidate', event.candidate);
                }
            };

            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);

            this.socket.emit('offer', offer);

            this.socket.on('answer', async (answer) => {
                if (this.peerConnection) {
                    await this.peerConnection.setRemoteDescription(answer);
                }
            });

            this.socket.on('iceCandidate', async (candidate) => {
                if (this.peerConnection) {
                    await this.peerConnection.addIceCandidate(candidate);
                }
            });

            this.isRecognizing = true;
            this.socket.emit('startRecognition', {
                language: this.options.language,
                sampleRate: this.options.sampleRate,
                intervalMs: this.options.intervalMs
            });

            this.emit('started');
        } catch (error) {
            this.emit('error', error);
        }
    }

    /**
     * Stops the speech recognition process.
     */
    stop(): void {
        if (!this.isRecognizing) return;

        this.isRecognizing = false;
        this.socket.emit('stopRecognition');
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        this.emit('stopped');
    }

    /**
     * Seeks to a specific time in the audio stream.
     * @param time The time to seek to, in milliseconds.
     */
    seek(time: number): void {
        this.socket.emit('seek', time);
    }

    /**
     * Sets the recognition language.
     * @param language The language code (e.g., 'en-US', 'fr-FR').
     */
    setLanguage(language: string): void {
        this.options.language = language;
        if (this.isRecognizing) {
            this.socket.emit('setLanguage', language);
        }
    }

    /**
     * Sets the recognition interval.
     * @param intervalMs The interval in milliseconds.
     */
    setInterval(intervalMs: number): void {
        this.options.intervalMs = intervalMs;
        if (this.isRecognizing) {
            this.socket.emit('setInterval', intervalMs);
        }
    }

    /**
     * Disconnects from the server and stops recognition.
     */
    disconnect(): void {
        this.stop();
        this.socket.disconnect();
    }
}

export { SpeechRecognitionService, SpeechRecognitionOptions, RecognitionResult };