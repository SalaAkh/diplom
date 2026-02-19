/**
 * Service for managing accessibility settings like contrast and text size.
 */
class AccessibilityService {
    constructor() {
        this.settings = {
            contrast: localStorage.getItem('access_contrast') || 'normal', // normal, high
            textSize: localStorage.getItem('access_textSize') || 'normal', // normal, large, extra-large
            animations: localStorage.getItem('access_animations') !== 'false', // true by default
            audio: localStorage.getItem('access_audio') === 'true', // false by default
            simplified: localStorage.getItem('access_simplified') === 'true', // false by default
            reading: localStorage.getItem('access_reading') === 'true' // false by default
        };

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.applySettings();
        this.setupUI();
        console.log('Арнайы мүмкіндіктер қызметі инициализацияланды (Accessibility Service initialized)', this.settings);
    }

    setupUI() {
        // Setup Button
        const btn = document.getElementById('accessBtn');
        if (btn) {
            btn.addEventListener('click', () => this.toggleModal(true));
        }

        // Setup Modal Inputs
        const contrastSelect = document.getElementById('contrastSelect');
        if (contrastSelect) contrastSelect.value = this.settings.contrast;

        const textSizeSelect = document.getElementById('textSizeSelect');
        if (textSizeSelect) textSizeSelect.value = this.settings.textSize;

        const animCheck = document.getElementById('animCheck');
        if (animCheck) animCheck.checked = this.settings.animations;

        const audioCheck = document.getElementById('audioCheck');
        if (audioCheck) audioCheck.checked = this.settings.audio;

        const simplifiedCheck = document.getElementById('simplifiedCheck');
        if (simplifiedCheck) simplifiedCheck.checked = this.settings.simplified;

        const readingCheck = document.getElementById('readingCheck');
        if (readingCheck) readingCheck.checked = this.settings.reading;
    }

    applySettings() {
        // Contrast
        if (this.settings.contrast === 'high') {
            document.documentElement.classList.add('high-contrast-mode');
        } else {
            document.documentElement.classList.remove('high-contrast-mode');
        }

        // Text Size
        document.documentElement.classList.remove('small-text', 'large-text', 'extra-large-text');
        if (this.settings.textSize === 'small') {
            document.documentElement.classList.add('small-text');
        } else if (this.settings.textSize === 'large') {
            document.documentElement.classList.add('large-text');
        } else if (this.settings.textSize === 'extra-large') {
            document.documentElement.classList.add('extra-large-text');
        }

        // Animations (Reduced Motion)
        if (!this.settings.animations) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }

        // Audio Feedback
        if (window.audioFeedback) {
            window.audioFeedback.enabled = this.settings.audio;
        }

        // Sync Checkboxes
        const animCheck = document.getElementById('animCheck');
        if (animCheck) animCheck.checked = this.settings.animations;

        const audioCheck = document.getElementById('audioCheck');
        if (audioCheck) audioCheck.checked = this.settings.audio;

        const simplifiedCheck = document.getElementById('simplifiedCheck');
        if (simplifiedCheck) simplifiedCheck.checked = this.settings.simplified;

        const readingCheck = document.getElementById('readingCheck');
        if (readingCheck) readingCheck.checked = this.settings.reading;

        const voiceCheck = document.getElementById('voiceControlCheck');
        if (voiceCheck && window.voiceControl) voiceCheck.checked = window.voiceControl.enabled;

        // Simplified Mode
        if (this.settings.simplified) {
            document.documentElement.classList.add('simplified-mode');
        } else {
            document.documentElement.classList.remove('simplified-mode');
        }

        // Reading Mode (TTS) is handled dynamically in speak()
    }

    setContrast(mode) {
        this.settings.contrast = mode;
        localStorage.setItem('access_contrast', mode);
        this.applySettings();
        const msg = mode === 'high' ? 'Высокая контрастность включена' : 'Обычная контрастность';
        this.announce(msg);
    }

    setTextSize(size) {
        this.settings.textSize = size;
        localStorage.setItem('access_textSize', size);
        this.applySettings();
        const labels = { small: 'мелкий', normal: 'обычный', large: 'крупный', 'extra-large': 'очень крупный' };
        this.announce(`Размер текста изменен на ${labels[size]}`);
    }

    toggleAnimations() {
        this.settings.animations = !this.settings.animations;
        localStorage.setItem('access_animations', this.settings.animations);
        this.applySettings();
        this.announce(this.settings.animations ? 'Анимации включены' : 'Анимации отключены');
    }

    toggleAudio() {
        this.settings.audio = !this.settings.audio;
        localStorage.setItem('access_audio', this.settings.audio);
        this.applySettings();
        if (window.audioFeedback) {
            window.audioFeedback.setEnabled(this.settings.audio);
        }
        const msg = this.settings.audio ? 'Звуковое сопровождение включено' : 'Звуковое сопровождение отключено';
        this.announce(msg);
    }

    toggleSimplified() {
        this.settings.simplified = !this.settings.simplified;
        localStorage.setItem('access_simplified', this.settings.simplified);
        this.applySettings();
        const msg = this.settings.simplified ? 'Упрощенный режим включен' : 'Упрощенный режим выключен';
        this.announce(msg);
    }

    toggleReading() {
        this.settings.reading = !this.settings.reading;
        localStorage.setItem('access_reading', this.settings.reading);
        this.applySettings();
        const msg = this.settings.reading ? 'Режим чтения результатов включен' : 'Режим чтения результатов выключен';
        this.announce(msg);

        if (this.settings.reading) {
            this.speak(msg);
        } else {
            window.speechSynthesis.cancel();
        }
    }

    speak(text) {
        if (!this.settings.reading || !window.speechSynthesis) return;

        // Cancel previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find a matching voice for the current language
        const lang = document.documentElement.lang || 'ru';
        utterance.lang = lang;

        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(v => v.lang.startsWith(lang));
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
    }

    toggleModal(show) {
        console.log('toggleModal called with:', show);
        const modal = document.getElementById('accessModal');
        if (!modal) {
            console.error('Modal element #accessModal not found!');
            return;
        }

        if (show) {
            modal.style.display = 'flex'; // Ensure flex display
            // Small delay to allow display:flex to apply before transition
            setTimeout(() => {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                modal.setAttribute('aria-modal', 'true');

                // Trap focus or focus first element - AFTER aria-hidden is removed
                const firstInput = modal.querySelector('select, input, button');
                if (firstInput) firstInput.focus();

                // Call trapFocus from keyboard navigation service
                if (window.keyboardNav && typeof window.keyboardNav.trapFocus === 'function') {
                    window.keyboardNav.trapFocus(modal);
                }
            }, 10);
        } else {
            // Return focus to button BEFORE setting aria-hidden to prevent violation
            const btn = document.getElementById('accessBtn');
            if (btn) btn.focus();

            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');

            // Wait for animation to finish before hiding
            setTimeout(() => {
                if (!modal.classList.contains('active')) {
                    modal.style.display = '';
                }
            }, 300);
        }
    }

    announce(message) {
        if (window.keyboardNav) {
            window.keyboardNav.announce(message);
        } else {
            console.log('Accessibility Announcement:', message);
        }
    }
}

// Initialize global instance
window.accessibilityService = new AccessibilityService();
