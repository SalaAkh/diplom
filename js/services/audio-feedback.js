/**
 * Service for providing auditory feedback for interface actions
 * Uses Web Audio API to generate tones without requiring external assets
 */
class AudioFeedbackService {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem('access_audio') === 'true';
        this.volume = 0.2;

        // Frequencies for different types of feedback
        this.tones = {
            click: { freq: 440, type: 'sine', duration: 0.1 },      // A4
            success: { freq: 554.37, type: 'sine', duration: 0.3 }, // C#5
            error: { freq: 220, type: 'square', duration: 0.3 },    // A3
            toggleOn: { freq: 523.25, type: 'sine', duration: 0.2 }, // C5
            toggleOff: { freq: 392.00, type: 'sine', duration: 0.2 }, // G4
            nav: { freq: 349.23, type: 'sine', duration: 0.1 }      // F4
        };
    }

    init() {
        if (!this.ctx) {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API-ге қолдау көрсетілмейді (Web Audio API not supported)', e);
            }
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('access_audio', enabled);
        if (enabled) {
            this.init();
            this.play('toggleOn');
        } else {
            this.play('toggleOff');
        }
    }

    play(name) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        // Resume context if suspended (browser security policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const tone = this.tones[name];
        if (!tone) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = tone.type;
        osc.frequency.setValueAtTime(tone.freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + tone.duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + tone.duration);
    }

    // specific event helpers
    playClick() { this.play('click'); }
    playSuccess() { this.play('success'); }
    playError() { this.play('error'); }
    playNav() { this.play('nav'); }
    playToggle(state) { this.play(state ? 'toggleOn' : 'toggleOff'); }
}

// Global instance
window.audioFeedback = new AudioFeedbackService();
