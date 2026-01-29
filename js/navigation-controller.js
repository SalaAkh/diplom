/**
 * Navigation Controller
 * Handles navigation interactions and screen routing
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class NavigationController {
    constructor() {
        this.currentScreen = 'intro';
        this.navElement = document.getElementById('cosmicNav');
        this.navToggle = document.getElementById('navToggle');
        this.navCollapseBtn = document.getElementById('navCollapseBtn');
        this.navItems = document.querySelectorAll('.nav-item');
        this.appWrapper = document.getElementById('appWrapper');
        this.isCollapsed = false;

        this.init();
    }

    init() {
        // Load saved state from localStorage
        const savedState = localStorage.getItem('navCollapsed');
        if (savedState === 'true' && window.innerWidth > 768) {
            this.collapseNav();
        }

        // Initialize navigation
        this.setupEventListeners();
        this.updateNavigation();

        // Handle mobile toggle
        if (window.innerWidth <= 768) {
            this.navElement.classList.add('collapsed');
        }
    }

    setupEventListeners() {
        // Nav item clicks
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = item.dataset.screen;
                const href = item.getAttribute('href');

                // If it's a real link (not #), let the browser handle it
                if (href && href !== '#' && !href.startsWith('#')) {
                    return;
                }

                e.preventDefault();
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        // Desktop collapse button
        if (this.navCollapseBtn) {
            this.navCollapseBtn.addEventListener('click', () => {
                this.toggleCollapse();
            });
        }

        // Mobile toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleNav();
            });
        }

        // Close nav on mobile when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.navElement.contains(e.target) &&
                    !this.navToggle.contains(e.target) &&
                    !this.navElement.classList.contains('collapsed')) {
                    this.closeNav();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.navElement.classList.remove('collapsed');
                this.navToggle.classList.remove('active');
                this.appWrapper.classList.remove('nav-collapsed');
            }
        });
    }

    navigateToScreen(screenName) {
        this.currentScreen = screenName;

        // Update active state
        this.navItems.forEach(item => {
            if (item.dataset.screen === screenName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Call app methods based on screen name
        if (window.app) {
            switch (screenName) {
                case 'intro':
                    if (typeof window.app.showIntro === 'function') {
                        window.app.showIntro();
                    }
                    break;
                case 'test-selection':
                    if (typeof window.app.showTestSelection === 'function') {
                        window.app.showTestSelection();
                    }
                    break;
                case 'results':
                    if (typeof window.app.showResults === 'function') {
                        window.app.showResults();
                    }
                    break;
                case 'profile':
                    // Profile management (TODO: implement if needed)
                    // Removed debug log
                    break;
                case 'about':
                    // About screen (TODO: implement if needed)
                    // Removed debug log
                    break;
                default:
                    console.warn(`Unknown screen: ${screenName}`);
            }
        }

        // Also trigger event for custom handlers
        window.dispatchEvent(new CustomEvent('screenChange', {
            detail: { screen: screenName }
        }));

        // Close nav on mobile after navigation
        if (window.innerWidth <= 768) {
            this.closeNav();
        }
    }

    toggleNav() {
        this.navElement.classList.toggle('collapsed');
        this.navToggle.classList.toggle('active');
        this.appWrapper.classList.toggle('nav-collapsed');
    }

    closeNav() {
        this.navElement.classList.add('collapsed');
        this.navToggle.classList.remove('active');
        this.appWrapper.classList.add('nav-collapsed');
    }

    openNav() {
        this.navElement.classList.remove('collapsed');
        this.navToggle.classList.add('active');
        this.appWrapper.classList.remove('nav-collapsed');
    }


    toggleCollapse() {
        if (this.isCollapsed) {
            this.expandNav();
        } else {
            this.collapseNav();
        }
    }

    collapseNav() {
        this.navElement.classList.add('collapsed');
        this.appWrapper.classList.add('nav-collapsed');
        this.isCollapsed = true;
        localStorage.setItem('navCollapsed', 'true');

        // Update button tooltip
        if (this.navCollapseBtn) {
            this.navCollapseBtn.title = 'Развернуть панель';
            this.navCollapseBtn.setAttribute('aria-label', 'Expand Navigation');
        }
    }

    expandNav() {
        this.navElement.classList.remove('collapsed');
        this.appWrapper.classList.remove('nav-collapsed');
        this.isCollapsed = false;
        localStorage.setItem('navCollapsed', 'false');

        // Update button tooltip
        if (this.navCollapseBtn) {
            this.navCollapseBtn.title = 'Свернуть панель';
            this.navCollapseBtn.setAttribute('aria-label', 'Collapse Navigation');
        }
    }

    updateNavigation() {
        // Update nav text with localization if available
        if (window.i18n) {
            document.getElementById('navLogo').textContent = window.i18n.t('appName') || '◈';
            document.getElementById('navTagline').textContent = window.i18n.t('tagline') || 'Neural Constellation';
        }
    }

    updateUserInfo(username, avatar) {
        const navUser = document.getElementById('navUser');
        const navUsername = document.getElementById('navUsername');
        const navAvatar = document.getElementById('navAvatar');

        if (username) {
            navUser.style.display = 'flex';
            navUsername.textContent = username;
            navAvatar.textContent = avatar || username.charAt(0).toUpperCase();
        } else {
            navUser.style.display = 'none';
        }
    }

    setActiveScreen(screenName) {
        this.navigateToScreen(screenName);
    }
}

// Initialize navigation when DOM is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        window.navigationController = new NavigationController();
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationController;
}
