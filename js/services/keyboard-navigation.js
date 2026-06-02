/**
 * Service for handling keyboard navigation and accessibility shortcuts
 */
class KeyboardNavigationService {
    constructor() {
        this.shortcuts = {
            'Alt+1': () => window.location.href = 'index.html',
            'Alt+2': () => window.location.href = 'index.html#test',
            'Alt+3': () => window.location.href = 'profile.html',
            'Alt+4': () => window.location.href = 'about.html',
            'Alt+t': () => this.toggleTheme(),
            'Alt+l': () => this.toggleLanguage(),
            'Alt+a': () => this.toggleAccessibility(),
            'Alt+s': () => this.startTest(),
            'Escape': () => this.handleEscape()
        };

        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.setupFocusStyles();
        // console.log('Пернетақта навигациясы қызметі инициализацияланды (Keyboard Navigation Service initialized)');
    }

    handleKeyDown(e) {
        // Construct shortcut key
        if (!e.key) return;

        let key = e.key.toLowerCase();
        let shortcut = '';

        if (e.altKey) shortcut += 'Alt+';
        if (e.ctrlKey) shortcut += 'Ctrl+';
        if (e.shiftKey) shortcut += 'Shift+';

        shortcut += key;

        // Check exact match first
        if (this.shortcuts[shortcut]) {
            e.preventDefault();
            this.shortcuts[shortcut]();
            return;
        }

        // Case insensitive check for single letters combined with modifiers
        const altKeyMap = {
            'alt+1': 'Alt+1',
            'alt+2': 'Alt+2',
            'alt+3': 'Alt+3',
            'alt+4': 'Alt+4',
            'alt+t': 'Alt+t',
            'alt+l': 'Alt+l'
        };

        if (altKeyMap[shortcut.toLowerCase()]) {
            e.preventDefault();
            this.shortcuts[altKeyMap[shortcut.toLowerCase()]]();
        }
    }

    toggleTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.click();
            this.announce('Theme toggled');
        }
    }

    toggleLanguage() {
        // Find language selector logic - assuming it might be available globally or we simulate click
        // For now, we finding the next language button if available, or just log
        console.log('Language toggle shortcut pressed - implementation depends on specific UI');
        // Example: cycle languages
        if (window.localization) {
            const currentLang = window.localization.currentLang;
            const nextLang = currentLang === 'kk' ? 'ru' : (currentLang === 'ru' ? 'en' : 'kk');
            window.localization.setLanguage(nextLang);
            this.announce(`Language changed to ${nextLang}`);
        }
    }

    toggleAccessibility() {
        if (window.accessibilityService) {
            const modal = document.getElementById('accessModal');
            const isVisible = modal && modal.classList.contains('active');
            window.accessibilityService.toggleModal(!isVisible);
            this.announce(isVisible ? 'Accessibility settings closed' : 'Accessibility settings opened');
        }
    }

    startTest() {
        if (window.app && typeof window.app.showTestTypeSelection === 'function') {
            window.app.showTestTypeSelection();
            this.announce('Test type selection opened');
        } else if (window.location.hash !== '#test') {
            window.location.href = 'index.html#test';
        }
    }

    handleEscape() {
        // Close modals if open
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            const closeBtn = activeModal.querySelector('.modal-close, [aria-label="Закрыть"], [aria-label="Close"]');
            if (closeBtn) {
                closeBtn.click();
            } else {
                // Fallback: search for any button that looks like a close button
                const modal = activeModal;
                if (window.accessibilityService) {
                    window.accessibilityService.toggleModal(false);
                } else {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            }
            this.announce('Modal closed');
        }

        // Close nav if open on mobile
        const nav = document.getElementById('cosmicNav');
        if (nav && (nav.classList.contains('mobile-visible') || nav.classList.contains('active'))) {
            const navClose = document.getElementById('navCloseBtn') || document.getElementById('navToggle');
            if (navClose) navClose.click();
            this.announce('Navigation closed');
        }
    }

    setupFocusStyles() {
        // Add class to body when user hits tab, remove when they click
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('user-is-tabbing');
        });

        // Monitor for modal activation to trap focus
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('modal') && target.classList.contains('active')) {
                        this.trapFocus(target);
                        // Focus the first focusable element or the close button
                        const first = target.querySelector('button, [tabindex="0"], select, input');
                        if (first) setTimeout(() => first.focus(), 100);
                    }
                }
            });
        });

        // Watch all modals
        document.querySelectorAll('.modal').forEach(modal => {
            observer.observe(modal, { attributes: true });
        });
    }

    trapFocus(element) {
        const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusableElements = element.querySelectorAll(focusableSelectors);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Unique listener for this modal instance
        const keydownHandler = (e) => {
            if (e.key !== 'Tab') return;

            // If the element is no longer active, remove listener
            if (!element.classList.contains('active')) {
                element.removeEventListener('keydown', keydownHandler);
                return;
            }

            if (e.shiftKey) { /* shift + tab */
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { /* tab */
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        element.addEventListener('keydown', keydownHandler);
    }

    announce(message) {
        // Use standard aria-live region
        let liveRegion = document.getElementById('aria-live-announcer');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-announcer';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }

        // Small delay to ensure screen readers pick it up
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 50);

        // Clear after some time to allow repeat announcements
        setTimeout(() => {
            if (liveRegion.textContent === message) {
                liveRegion.textContent = '';
            }
        }, 3000);
    }
}

// Initialize global instance
window.keyboardNav = new KeyboardNavigationService();
