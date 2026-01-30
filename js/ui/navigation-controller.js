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
        // Initialize navigation listeners
        this.setupEventListeners();
        this.updateNavigation();

        // Initialize UI components if they exist on the page
        if (typeof LocalizationManager !== 'undefined' && !window.i18n) {
            window.i18n = new LocalizationManager();
        }

        this.initTheme();
        this.initLanguage();

        // Handle initial state
        if (window.innerWidth <= 768) {
            // Mobile: Ensure 'collapsed' is REMOVED so we don't get 80px width from desktop styles
            this.navElement.classList.remove('collapsed');
        } else {
            // Desktop: Load saved state from localStorage
            const savedState = localStorage.getItem('navCollapsed');
            if (savedState === 'true') {
                this.collapseNav();
            }
        }
    }

    initTheme() {
        // Toggle theme
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            // Set initial state
            const currentTheme = localStorage.getItem('theme') || 'dark';
            if (currentTheme === 'light') {
                document.body.classList.remove('dark-theme');
                const icon = themeToggle.querySelector('.theme-icon');
                if (icon) icon.textContent = '🌙';
            }

            themeToggle.onclick = () => {
                const isDark = document.body.classList.contains('dark-theme');
                if (isDark) {
                    document.body.classList.remove('dark-theme');
                    localStorage.setItem('theme', 'light');
                    const icon = themeToggle.querySelector('.theme-icon');
                    if (icon) icon.textContent = '🌙';
                } else {
                    document.body.classList.add('dark-theme');
                    localStorage.setItem('theme', 'dark');
                    const icon = themeToggle.querySelector('.theme-icon');
                    if (icon) icon.textContent = '☀️';
                }
            };
        }
    }

    initLanguage() {
        const selector = document.getElementById('languageSelector');
        if (selector && window.i18n) {
            this.renderLanguageSelector(selector);
        }

        // Translate page content
        if (window.i18n) {
            this.translatePage();
        }
    }

    renderLanguageSelector(container) {
        if (!window.i18n) return;

        const currentLang = window.i18n.getLanguage();
        const languages = window.i18n.getAvailableLanguages();
        const currentLangData = languages.find(l => l.code === currentLang) || languages[0];

        container.innerHTML = `
            <div class="language-dropdown">
                <button class="language-btn" onclick="document.getElementById('languageMenu').classList.toggle('show')">
                    <span class="language-flag">${currentLangData.flag}</span>
                    <span class="language-name">${currentLangData.name}</span>
                    <span class="language-arrow">▼</span>
                </button>
                <div class="language-menu" id="languageMenu">
                    ${languages.map(lang => `
                        <button class="language-option ${lang.code === currentLang ? 'active' : ''}" 
                                onclick="window.navigationController.changeLanguage('${lang.code}')">
                            <span class="language-flag">${lang.flag}</span>
                            <span class="language-name">${lang.name}</span>
                            ${lang.code === currentLang ? '<span class="language-check">✓</span>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('languageMenu');
            const dropdown = container.querySelector('.language-dropdown');
            if (menu && dropdown && !dropdown.contains(e.target)) {
                menu.classList.remove('show');
            }
        });
    }

    changeLanguage(lang) {
        if (window.i18n && window.i18n.setLanguage(lang)) {
            this.translatePage();
            this.renderLanguageSelector(document.getElementById('languageSelector'));
        }
    }

    translatePage() {
        if (!window.i18n) return;

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = window.i18n.t(key);
            }
        });

        // Update footer date if needed
        // Update footer date if needed
        const footerText = document.getElementById('footerText');

        if (footerText && window.i18n) {
            footerText.innerHTML = `${window.i18n.t('project')} &copy; 2026`;
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
                    if (window.innerWidth <= 768) {
                        this.closeNav();
                    }
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

        // Mobile toggle (Hamburger)
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNav();
            });
        }

        // Close button (Inside Drawer)
        const closeBtn = document.getElementById('navCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeNav();
            });
        }

        // Close nav on mobile when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // If nav is open (active) and click is NOT inside nav and NOT on toggle
                if (this.navElement.classList.contains('active') &&
                    !this.navElement.contains(e.target) &&
                    !this.navToggle.contains(e.target)) {
                    this.closeNav();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.navElement.classList.remove('active'); // Remove mobile active class
                this.navElement.classList.remove('collapsed'); // Reset desktop collapsed if needed (optional)
                this.navToggle.classList.remove('active');
                this.appWrapper.classList.remove('nav-collapsed');
            }
        });



        // Populate Mobile Settings if needed
        this.populateMobileSettings();
    }

    populateMobileSettings() {
        // Clone Language Selector to Mobile Menu if empty
        const mobileLang = document.getElementById('mobileLangContainer');
        const desktopLang = document.getElementById('languageSelector');

        if (mobileLang && desktopLang && mobileLang.children.length === 0) {
            // We can't just move it, because we need it in both places or specific style.
            // For now, let's just create a simple clone of the button logic
            // Or better, let UIController handle rendering both.
            // But as a quick fix, let's clone the innerHTML and re-attach events? 
            // Better: trigger UIController to render it there.

            // Actually, let's rely on UIController to render to *all* .language-selector compatible containers
            // but since ID is unique, we might need a class based approach.
            // Let's manually trigger a re-render if window.app.ui exists
            if (window.app && window.app.ui) {
                // We'll add a helper in UIController or just manually invoke render here
                // for simplicity, let's just rely on the main UIController handling 'languageSelector' 
                // and we might need to add a new method there or just copy the HTML.

                // Let's try to copy HTML and fix IDs
                const clone = desktopLang.cloneNode(true);
                clone.id = 'mobileLangSelectorClone';
                mobileLang.appendChild(clone);

                // Re-attach simple toggle event for the clone
                const btn = clone.querySelector('.language-btn');
                if (btn) {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        const menu = clone.querySelector('.language-menu');
                        if (menu) menu.classList.toggle('show');
                    };
                }

                // Re-attach option clicks
                const opts = clone.querySelectorAll('.language-option');
                opts.forEach(opt => {
                    // Extract lang code from onclick attribute string is messy.
                    // Better: assume order is same or read from some data attribute?
                    // The original rendered HTML has onclick="window.navigationController.changeLanguage..."
                    // So it should work!
                });
            }
        }

        // Clone Theme Toggle
        const mobileTheme = document.getElementById('mobileThemeContainer');
        const desktopTheme = document.getElementById('themeToggle');

        if (mobileTheme && desktopTheme && mobileTheme.children.length === 0) {
            const clone = desktopTheme.cloneNode(true);
            clone.id = 'mobileThemeToggleClone';
            mobileTheme.appendChild(clone);

            clone.onclick = () => {
                const isDark = document.body.classList.contains('dark-theme');
                const newTheme = isDark ? 'light' : 'dark';
                if (window.app && window.app.ui) {
                    window.app.ui.setTheme(newTheme);
                }
                // Sync original button icon manually if needed, or let UI observer handle it
                // UIController.setTheme updates body class, so generic styling works.
                // We just need to update icons.
                const icon = clone.querySelector('.theme-icon');
                if (icon) icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
                const desktopIcon = desktopTheme.querySelector('.theme-icon');
                if (desktopIcon) desktopIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            };
        }
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
                    break;
                case 'about':
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
        if (window.innerWidth <= 768) {
            // Mobile: Toggle 'active' class
            this.navElement.classList.toggle('active');
            // Toggle hamburger icon animation
            this.navToggle.classList.toggle('active');
        } else {
            // Desktop: Collapse logic (keep existing)
            this.navElement.classList.toggle('collapsed');
            this.navToggle.classList.toggle('active');
            this.appWrapper.classList.toggle('nav-collapsed');
        }
    }

    closeNav() {
        if (window.innerWidth <= 768) {
            this.navElement.classList.remove('active');
            this.navToggle.classList.remove('active');
        } else {
            this.navElement.classList.add('collapsed');
            this.navToggle.classList.remove('active');
            this.appWrapper.classList.add('nav-collapsed');
        }
    }

    openNav() {
        if (window.innerWidth <= 768) {
            this.navElement.classList.add('active');
            this.navToggle.classList.add('active');
        } else {
            this.navElement.classList.remove('collapsed');
            this.navToggle.classList.add('active');
            this.appWrapper.classList.remove('nav-collapsed');
        }
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
        const authCard = document.querySelector('.nav-auth-card');
        const profileLink = document.querySelector('.nav-item[data-screen="profile"]');

        if (username) {
            // User is logged in
            if (navUser) navUser.style.display = 'flex';
            if (navUsername) navUsername.textContent = username;
            if (navAvatar) navAvatar.textContent = avatar || username.charAt(0).toUpperCase();

            // Hide Auth Card
            if (authCard) authCard.style.display = 'none';

            // Ensure profile link is visible if needed (or keep it always visible)
            // if (profileLink) profileLink.style.display = 'flex';
        } else {
            // User is logged out
            if (navUser) navUser.style.display = 'none';

            // Show Auth Card
            if (authCard) authCard.style.display = 'block';
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
