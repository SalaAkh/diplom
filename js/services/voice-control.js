/**
 * Сервис голосового управления (Voice Control)
 * Позволяет управлять приложением с помощью голосовых команд
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 */

class VoiceControlService {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.enabled = localStorage.getItem('access_voice_control') === 'true';
        this.commands = {
            'ru': {
                'начать тест': () => this.triggerAction('start-test'),
                'далее': () => this.triggerAction('next-question'),
                'назад': () => this.triggerAction('prev-question'),
                'настройки': () => this.triggerAction('toggle-settings'),
                'закрыть': () => this.triggerAction('close-modal'),
                'темная тема': () => this.triggerAction('set-theme-dark'),
                'светлая тема': () => this.triggerAction('set-theme-light'),
                'помощь': () => this.triggerAction('show-help')
            },
            'kk': {
                'тестті бастау': () => this.triggerAction('start-test'),
                'алға': () => this.triggerAction('next-question'),
                'артқа': () => this.triggerAction('prev-question'),
                'баптаулар': () => this.triggerAction('toggle-settings'),
                'жабу': () => this.triggerAction('close-modal'),
                'көмек': () => this.triggerAction('show-help')
            },
            'en': {
                'start test': () => this.triggerAction('start-test'),
                'next': () => this.triggerAction('next-question'),
                'back': () => this.triggerAction('prev-question'),
                'settings': () => this.triggerAction('toggle-settings'),
                'close': () => this.triggerAction('close-modal'),
                'help': () => this.triggerAction('show-help')
            }
        };

        this.init();
    }

    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Сөйлеуді тану API-іне бұл браузерде қолдау көрсетілмейді (Speech Recognition API is not supported in this browser).');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;

        const lang = document.documentElement.lang || 'ru';
        this.recognition.lang = lang === 'kk' ? 'kk-KZ' : (lang === 'en' ? 'en-US' : 'ru-RU');

        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.toLowerCase().trim();
            console.log('Дауыстық команда алынды (Voice Command received):', command);
            this.handleCommand(command);
        };

        this.recognition.onerror = (event) => {
            console.error('Сөйлеуді тану қатесі (Speech recognition error):', event.error);
            if (event.error === 'not-allowed') {
                this.enabled = false;
                this.updateUI();
            }
        };

        this.recognition.onend = () => {
            if (this.isListening && this.enabled) {
                this.recognition.start(); // Keep listening if enabled
            } else {
                this.isListening = false;
            }
        };

        if (this.enabled) {
            this.start();
        }
    }

    start() {
        if (!this.recognition || this.isListening) return;
        try {
            this.recognition.start();
            this.isListening = true;
            console.log('Дауысты тану іске қосылды (Voice Recognition started)');
            if (window.toastManager) window.toastManager.info('Голосовое управление включено. Попробуйте сказать "Помощь"');
        } catch (e) {
            console.error('Сөйлеуді тануды бастау сәтсіз аяқталды (Failed to start speech recognition):', e);
        }
    }

    stop() {
        if (!this.recognition || !this.isListening) return;
        this.recognition.stop();
        this.isListening = false;
        console.log('Дауысты тану тоқтатылды (Voice Recognition stopped)');
    }

    toggle(force) {
        this.enabled = force !== undefined ? force : !this.enabled;
        localStorage.setItem('access_voice_control', this.enabled);

        if (this.enabled) {
            this.start();
        } else {
            this.stop();
        }
        this.updateUI();
    }

    handleCommand(transcript) {
        const currentLang = document.documentElement.lang || 'ru';
        const langCommands = this.commands[currentLang] || this.commands['ru'];

        // Find match
        for (const [cmd, action] of Object.entries(langCommands)) {
            if (transcript.includes(cmd)) {
                action();
                if (window.audioFeedback) window.audioFeedback.play('success');
                return;
            }
        }
    }

    triggerAction(actionName) {
        console.log('Дауыстық әрекетті іске қосу (Triggering voice action):', actionName);

        switch (actionName) {
            case 'start-test':
                const startBtn = document.querySelector('[data-i18n="startTest"], #start-test-btn');
                if (startBtn) startBtn.click();
                break;
            case 'next-question':
                const nextBtn = document.getElementById('next-btn') || document.querySelector('.btn-next');
                if (nextBtn) nextBtn.click();
                break;
            case 'prev-question':
                const prevBtn = document.getElementById('prev-btn') || document.querySelector('.btn-prev');
                if (prevBtn) prevBtn.click();
                break;
            case 'toggle-settings':
                if (window.accessibilityService) window.accessibilityService.toggleModal();
                break;
            case 'close-modal':
                const closeBtn = document.querySelector('.modal.active .modal-close');
                if (closeBtn) closeBtn.click();
                break;
            case 'set-theme-dark':
                if (!document.body.classList.contains('dark-theme')) {
                    const toggle = document.getElementById('themeToggle');
                    if (toggle) toggle.click();
                }
                break;
            case 'set-theme-light':
                if (document.body.classList.contains('dark-theme')) {
                    const toggle = document.getElementById('themeToggle');
                    if (toggle) toggle.click();
                }
                break;
            case 'show-help':
                this.showHelp();
                break;
        }
    }

    showHelp() {
        const currentLang = document.documentElement.lang || 'ru';
        const cmds = Object.keys(this.commands[currentLang] || this.commands['ru']);
        const msg = currentLang === 'ru' ? 'Доступные команды: ' : (currentLang === 'kk' ? 'Қолжетімді командалар: ' : 'Available commands: ');
        if (window.toastManager) window.toastManager.info(msg + cmds.join(', '), 8000);
    }

    updateUI() {
        const voiceCheck = document.getElementById('voiceControlCheck');
        if (voiceCheck) voiceCheck.checked = this.enabled;
    }
}

// Initialize global instance
window.voiceControl = new VoiceControlService();
