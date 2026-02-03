/**
 * UI Controller
 * Manages all UI interactions, rendering, and event handling
 */
class UIController {
    constructor(app) {
        this.app = app;
    }

    /**
     * Helper to get i18n
     */
    get i18n() {
        return this.app.i18n;
    }

    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} str 
     * @returns {string}
     */
    escapeHTML(str) {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Helper to get text based on current language
     */
    getScenarioText(textObj) {
        if (!textObj) return '';
        if (typeof textObj === 'string') return textObj;

        const lang = this.i18n.getLanguage();
        // Fallback chain: specific lang -> ru -> en -> first available key
        return textObj[lang] || textObj['ru'] || textObj['en'] || Object.values(textObj)[0] || '';
    }

    /**
     * Initialization of UI elements (language, theme)
     */
    init() {
        // Init language
        let currentLang = this.i18n.getLanguage();
        if (!currentLang || !['kk', 'ru', 'en'].includes(currentLang)) {
            currentLang = 'kk';
            this.i18n.setLanguage('kk');
        }
        document.documentElement.lang = currentLang;

        this.initLanguageSelector();
        this.updateHeader();
        this.initThemeToggle();
        this.applyTheme();
        this.initEasterEggs();

        // Init Google Sign-In if auth available
        if (this.app.auth && typeof this.app.auth.initGoogleSignIn === 'function') {
            this.app.auth.initGoogleSignIn();
        }
    }

    // ================= START SCENARIO UI =================

    /**
     * Show Basic Scenario
     */
    showScenario(scenario, progress) {
        const container = document.getElementById('app');
        if (!container) return;

        // Manage focus for accessibility
        const appWrapper = document.getElementById('appWrapper');
        if (appWrapper) appWrapper.scrollTop = 0;

        // Animation
        container.style.opacity = '0';

        const t = this.i18n.t.bind(this.i18n);

        // Options
        const options = [];
        if (scenario.optionA) options.push({ key: 'A', option: scenario.optionA });
        if (scenario.optionB) options.push({ key: 'B', option: scenario.optionB });
        if (scenario.optionC) options.push({ key: 'C', option: scenario.optionC });
        if (scenario.optionD) options.push({ key: 'D', option: scenario.optionD });

        // Fix: Use index for consistent mapping if needed or just key
        const optionsHTML = options.map((opt, index) => {
            const isLast = index === options.length - 1;
            return `
                <button class="option-btn" onclick="app.handleScenarioOption('${opt.key}', ${scenario.id})" 
                        data-choice="${opt.key}">
                    <div class="option-icon">${opt.key}</div>
                    <div class="option-content">
                        <span class="option-label">${t('option')} ${opt.key}</span>
                        <span class="option-text">${this.getScenarioText(opt.option.text)}</span>
                    </div>
                </button>
                ${!isLast ? `<div class="options-divider"><span>${t('or')}</span></div>` : ''}
            `;
        }).join('');

        container.innerHTML = `
            <div class="scenario-screen">
                <div class="scenario-header">
                    <button class="btn-back" onclick="app.showIntro()" title="${t('back')}">
                        ${t('back')}
                    </button>
                    <div class="scenario-progress-info">
                        <span class="progress-number">${progress.current} ${t('of')} ${progress.total}</span>
                        <span class="progress-percent">${progress.percent}%</span>
                    </div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.percent}%"></div>
                </div>
                
                <div class="scenario-content">
                    <div class="scenario-number-badge">${t('question')} ${progress.current}</div>
                    <h2>${this.getScenarioText(scenario.title)}</h2>
                    ${scenario.context ? `<p class="scenario-context">${this.getScenarioText(scenario.context)}</p>` : ''}
                    <p class="scenario-description">${this.getScenarioText(scenario.description)}</p>
                    
                    <div class="options-container">
                        ${optionsHTML}
                    </div>
                    
                    <div class="scenario-hint">
                        <p>${t('chooseOption')}</p>
                    </div>
                </div>
            </div>
        `;

        // Smooth fade-in
        setTimeout(() => {
            container.style.transition = 'opacity 0.3s';
            container.style.opacity = '1';
            this.focusHeading();
        }, 10);
    }

    /**
     * Focus the main heading for accessibility
     */
    focusHeading() {
        const heading = document.querySelector('#app h1, #app h2, .page-title');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();

            // Announce to screen reader
            if (window.keyboardNav) {
                window.keyboardNav.announce(heading.textContent);
            }
        }
    }

    // ================= START ADVANCED UI =================

    /**
     * Show Advanced Question
     */
    showQuestion(question, progress) {
        const container = document.getElementById('app');
        if (!container) return;

        container.style.opacity = '0';
        const t = this.i18n.t.bind(this.i18n);
        const currentLang = this.i18n.getLanguage(); // Needed for helpers

        let questionHTML = '';

        if (question.type === 'scenario') {
            questionHTML = this.renderScenarioQuestion(question, currentLang, t);
        } else if (question.type === 'scale') {
            questionHTML = this.renderScaleQuestion(question, currentLang, t);
        } else if (question.type === 'open') {
            questionHTML = this.renderOpenQuestion(question, currentLang, t);
        } else if (question.type === 'situational') {
            questionHTML = this.renderSituationalQuestion(question, currentLang, t);
        } else {
            questionHTML = `<p>Unknown question type: ${question.type}</p>`;
        }

        container.innerHTML = `
            <div class="scenario-screen">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.percent}%"></div>
                    <span class="progress-text">${progress.current} / ${progress.total}</span>
                </div>
                
                ${questionHTML}
            </div>
        `;

        setTimeout(() => {
            container.style.transition = 'opacity 0.3s';
            container.style.opacity = '1';
            this.focusHeading();
        }, 10);
    }

    renderAdvancedQuestion(question, index, total) {
        const container = document.getElementById('app');
        if (!container) return;

        const t = this.i18n.t.bind(this.i18n);

        // Get section information if organizer is available
        let sectionHTML = '';
        if (typeof getSectionProgress === 'function') {
            const sectionInfo = getSectionProgress(index + 1);
            if (sectionInfo.section) {
                const sectionTitle = this.getScenarioText(sectionInfo.section.title);
                const sectionDesc = this.getScenarioText(sectionInfo.section.description);
                sectionHTML = `
                    <div class="test-section-indicator glass fade-in" style="margin-bottom: 1.5rem;">
                        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <h3 class="section-title" style="margin: 0; font-size: 1.25rem; color: var(--primary-color);">${sectionTitle}</h3>
                            <span class="section-progress-badge" style="background: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">${sectionInfo.current}/${sectionInfo.total}</span>
                        </div>
                        <p class="section-description" style="margin: 0.5rem 0; color: var(--text-secondary); font-size: 0.95rem;">${sectionDesc}</p>
                        <div class="section-progress-bar" style="height: 6px; background: rgba(102, 126, 234, 0.2); border-radius: 10px; overflow: hidden; margin-top: 0.75rem;">
                            <div class="section-progress-fill" style="height: 100%; background: var(--gradient-primary); width: ${sectionInfo.progress}%; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                `;
            }
        }

        const title = this.getScenarioText(question.title);
        const description = this.getScenarioText(question.description);
        const context = question.context ? this.getScenarioText(question.context) : '';

        const options = [];
        if (question.optionA) options.push({ key: 'A', option: question.optionA });
        if (question.optionB) options.push({ key: 'B', option: question.optionB });
        if (question.optionC) options.push({ key: 'C', option: question.optionC });
        if (question.optionD) options.push({ key: 'D', option: question.optionD });

        const optionsHTML = options.map(opt => `
            <button class="option-btn" onclick="app.handleAdvancedAnswer('${opt.key}', ${question.id})">
                <span class="option-label">${opt.key}</span>
                <span class="option-text">${this.getScenarioText(opt.option.text)}</span>
            </button>
        `).join('');

        return `
            <div class="question-content">
                <h2>${title}</h2>
                ${context ? `<p class="question-context">${context}</p>` : ''}
                <p class="question-description">${description}</p>
                <div class="options-container">${optionsHTML}</div>
            </div>
        `;
    }

    renderScenarioQuestion(question, lang, t) {
        const title = this.getScenarioText(question.title);
        const description = this.getScenarioText(question.description);
        const context = question.context ? this.getScenarioText(question.context) : '';

        const options = [];
        if (question.optionA) options.push({ key: 'A', option: question.optionA });
        if (question.optionB) options.push({ key: 'B', option: question.optionB });
        if (question.optionC) options.push({ key: 'C', option: question.optionC });
        if (question.optionD) options.push({ key: 'D', option: question.optionD });

        const optionsHTML = options.map(opt => `
            <button class="option-btn" onclick="app.handleAdvancedAnswer('${opt.key}', ${question.id})">
                <span class="option-label">${opt.key}</span>
                <span class="option-text">${this.getScenarioText(opt.option.text)}</span>
            </button>
        `).join('');

        return `
            <div class="question-content">
                <h2>${title}</h2>
                ${context ? `<p class="question-context">${context}</p>` : ''}
                <p class="question-description">${description}</p>
                <div class="options-container">${optionsHTML}</div>
            </div>
        `;
    }

    renderScaleQuestion(question, lang, t) {
        const title = this.getScenarioText(question.title);
        const description = this.getScenarioText(question.description);
        const prompt = this.getScenarioText(question.prompt);
        const scale = question.scale;
        const minLabel = this.getScenarioText(scale.labels.min);
        const maxLabel = this.getScenarioText(scale.labels.max);

        return `
            <div class="question-content scale-question">
                <h2>${title}</h2>
                <p class="question-description">${description}</p>
                <p class="question-prompt">${prompt}</p>
                <div class="scale-container">
                    <div class="scale-labels">
                        <span class="scale-label-min">${minLabel}</span>
                        <span class="scale-label-max">${maxLabel}</span>
                    </div>
                    <input type="range" 
                           id="scale-input-${question.id}" 
                           min="${scale.min}" 
                           max="${scale.max}" 
                           value="${Math.floor((scale.min + scale.max) / 2)}"
                           class="scale-slider"
                           oninput="document.getElementById('scale-value-${question.id}').textContent = this.value">
                    <div class="scale-value-display">
                        <span id="scale-value-${question.id}">${Math.floor((scale.min + scale.max) / 2)}</span>
                    </div>
                    <button class="btn btn-primary" onclick="app.handleScaleAnswer(${question.id})">
                        ${t('continue') || 'Continue'}
                    </button>
                </div>
            </div>
        `;
    }

    renderOpenQuestion(question, lang, t) {
        const title = this.getScenarioText(question.title);
        const description = this.getScenarioText(question.description);
        const prompt = this.getScenarioText(question.prompt);
        const maxLength = question.maxLength || 500;

        return `
            <div class="question-content open-question">
                <h2>${title}</h2>
                <p class="question-description">${description}</p>
                <p class="question-prompt">${prompt}</p>
                <textarea id="open-answer-${question.id}" 
                          class="open-answer-textarea" 
                          maxlength="${maxLength}"
                          placeholder="${t('enterYourAnswer') || 'Enter your answer...'}"
                          oninput="document.getElementById('char-count-${question.id}').textContent = this.value.length + ' / ${maxLength}'"></textarea>
                <div class="open-answer-info">
                    <span class="char-count" id="char-count-${question.id}">0 / ${maxLength}</span>
                </div>
                <button class="btn btn-primary" onclick="app.handleOpenAnswer(${question.id})">
                    ${t('continue') || 'Continue'}
                </button>
            </div>
        `;
    }

    renderSituationalQuestion(question, lang, t) {
        // Determine current step
        // We expect the step index to be passed in the question object (injected by TestManager)
        // or we default to the first step (0)
        const currentStepIndex = question.currentStepIndex || 0;

        if (!question.steps || !question.steps[currentStepIndex]) {
            return `<div class="question-content"><p>Error: Step data not found.</p></div>`;
        }

        const step = question.steps[currentStepIndex];
        const title = this.getScenarioText(step.title);
        const description = this.getScenarioText(step.description);

        // Render step progress
        const stepsIndicator = `
            <div class="steps-indicator">
                ${question.steps.map((s, i) => `
                    <div class="step-dot ${i === currentStepIndex ? 'active' : ''} ${i < currentStepIndex ? 'completed' : ''}"></div>
                `).join('')}
                <span class="step-text">${t('step') || 'Step'} ${currentStepIndex + 1} / ${question.steps.length}</span>
            </div>
        `;

        const options = [];
        if (step.options) {
            Object.entries(step.options).forEach(([key, optData]) => {
                options.push({ key: key, option: optData });
            });
        }

        const optionsHTML = options.map(opt => `
            <button class="option-btn" onclick="app.handleSituationalAnswer(${question.id}, ${step.stepId}, '${opt.key}')">
                <span class="option-label">${opt.key}</span>
                <span class="option-text">${this.getScenarioText(opt.option.text)}</span>
            </button>
        `).join('');

        return `
            <div class="question-content situational-question">
                ${stepsIndicator}
                <h2>${title}</h2>
                <p class="question-description">${description}</p>
                <div class="options-container">${optionsHTML}</div>
            </div>
        `;
    }

    /**
     * Change application language
     * @param {string} lang - Language code
     */
    changeLanguage(lang) {
        if (this.i18n.setLanguage(lang)) {
            this.updateStaticContent();
            this.initLanguageSelector(); // Re-render selector to update active state

            // Re-render current screen based on app state
            if (this.app) {
                switch (this.app.state) {
                    case 'intro':
                        this.app.showIntro();
                        break;
                    case 'profile':
                        this.app.showProfile();
                        break;
                    case 'results':
                        // Use active results if available
                        if (this.app.activeResults) {
                            this.app.showResults(this.app.activeResults);
                        } else {
                            this.app.showResults();
                        }
                        break;
                    case 'testSelection':
                        this.app.showTestSelection();
                        break;
                    case 'testing':
                        // If testing, we need to re-render the current scenario or question
                        if (this.app.testManager) {
                            if (this.app.testManager.testMode === 'basic' && this.app.testManager.currentScenario) {
                                const total = this.app.testManager.scenarios.length;
                                const current = this.app.testManager.completedScenarios.length;
                                const progress = ((current + 1) / total) * 100;

                                this.showScenario(this.app.testManager.currentScenario, {
                                    current: current + 1,
                                    total: total,
                                    percent: Math.round(progress)
                                });
                            } else if (this.app.testManager.testMode === 'advanced') {
                                // For advanced, it's easier to just call showNext if we are precisely on an index
                                // but showNext increments or selects. 
                                // Ideally we need a reRenderCurrent in testManager.
                                // But for now, let's at least handle Basic clearly.
                            }
                        }
                        break;
                    case 'auth':
                        this.app.showAuth();
                        break;
                }
            }
        }
    }

    /**
     * Update all static content with data-i18n attributes
     */
    updateStaticContent() {
        // Update generic data-i18n elements
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = this.i18n.t(key);
            }
        });

        // Update specific IDs if needed (legacy support)
        const appName = document.getElementById('appName');
        const tagline = document.getElementById('tagline');
        const footerText = document.getElementById('footerText');
        const footerNote = document.getElementById('footerNote');

        if (appName) appName.textContent = this.i18n.t('appName');
        if (tagline) tagline.textContent = this.i18n.t('tagline');
        if (footerText) footerText.textContent = `${this.i18n.t('project')} © 2026`;
        if (footerNote) footerNote.textContent = this.i18n.t('dataProcessed');

        document.documentElement.lang = this.i18n.getLanguage();
    }

    /**
     * Update header elements (Legacy alias, kept for compatibility)
     */
    updateHeader() {
        this.updateStaticContent();
    }

    /**
     * Initialize language selector
     */
    initLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (!selector) return;

        let currentLang = this.i18n.getLanguage();
        // Validation handled in init, but safe to re-check

        const languages = this.i18n.getAvailableLanguages();
        const currentLangData = languages.find(l => l.code === currentLang) || languages[0];

        selector.innerHTML = `
            <div class="language-dropdown">
                <button class="language-btn" onclick="app.toggleLanguageMenu(event)">
                    <span class="language-flag">${currentLangData.flag}</span>
                    <span class="language-name">${currentLangData.name}</span>
                    <span class="language-arrow">▼</span>
                </button>
                <div class="language-menu" id="languageMenu">
                    ${languages.map(lang => `
                        <button class="language-option ${lang.code === currentLang ? 'active' : ''}" 
                                onclick="app.changeLanguage('${lang.code}')">
                            <span class="language-flag">${lang.flag}</span>
                            <span class="language-name">${lang.name}</span>
                            ${lang.code === currentLang ? '<span class="language-check">✓</span>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Close menu on click outside
        if (!this.languageMenuHandlerAdded) {
            document.addEventListener('click', (e) => {
                const menu = document.getElementById('languageMenu');
                const dropdown = selector.querySelector('.language-dropdown');
                if (menu && dropdown && !dropdown.contains(e.target)) {
                    menu.classList.remove('show');
                }
            });
            this.languageMenuHandlerAdded = true;
        }
    }

    toggleLanguageMenu(event) {
        if (event) event.stopPropagation();
        const menu = document.getElementById('languageMenu');
        if (menu) {
            menu.classList.toggle('show');
        }
    }

    initThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;

        const currentTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(currentTheme);

        // Note: Click handler is set by navigation-controller.js to avoid conflicts
    }

    setTheme(theme) {
        localStorage.setItem('theme', theme);
        const icons = document.querySelectorAll('.theme-icon');

        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            icons.forEach(icon => {
                if (icon) icon.textContent = 'light_mode'; // Sun icon for dark theme
            });
        } else {
            document.body.classList.remove('dark-theme');
            icons.forEach(icon => {
                if (icon) icon.textContent = 'dark_mode'; // Moon icon for light theme
            });
        }
    }

    applyTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
    }

    /**
     * Initialize Easter Eggs
     */
    initEasterEggs() {
        const footerText = document.getElementById('footerText');
        if (footerText) {
            footerText.style.cursor = 'help';
            footerText.title = 'Double click heavily advised by the developer';

            let clickCount = 0;
            let lastClickTime = 0;

            footerText.addEventListener('click', (e) => {
                const currentTime = new Date().getTime();
                if (currentTime - lastClickTime < 500) {
                    // Double click detected
                    this.showAuthSuccess('Developed by Ахмедьянов Саламат КПО 9/22-2 🚀');
                    clickCount = 0;
                } else {
                    clickCount = 1;
                }
                lastClickTime = currentTime;
            });
        }
    }

    // ================= START AUTH UI =================

    showAuth() {
        // Update app state
        this.app.state = 'auth';
        const container = document.getElementById('app');
        if (!container) return;

        const t = this.i18n.t.bind(this.i18n);

        container.innerHTML = `
            <div class="auth-screen">
                <div class="auth-container">
                    <h1>${t('welcome')}</h1>
                    <p class="auth-subtitle">${t('welcomeSubtitle')}</p>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" onclick="app.showLoginForm(event)">${t('login')}</button>
                        <button class="auth-tab" onclick="app.showRegisterForm(event)">${t('register')}</button>
                    </div>
                    
                    <div class="google-signin-container">
                        <div id="googleSignInButton"></div>
                        <div class="auth-divider">
                            <span>${t('or')}</span>
                        </div>
                    </div>
                    
                    <div id="authFormContainer">
                        ${this.getLoginForm()}
                    </div>
                    
                    <div class="auth-note">
                        <p>${t('guestNote')}</p>
                        <button class="btn btn-secondary" onclick="app.continueAsGuest()">${t('continueAsGuest')}</button>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => {
            if (this.app.auth && typeof this.app.auth.initGoogleSignIn === 'function') {
                const initialized = this.app.auth.initGoogleSignIn();
                if (!initialized) {
                    const googleContainer = document.querySelector('.google-signin-container');
                    if (googleContainer) googleContainer.style.display = 'none';
                }
            }
        }, 100);
    }

    getLoginForm() {
        const t = this.i18n.t.bind(this.i18n);
        return `
            <form class="auth-form" onsubmit="app.handleLogin(event)">
                <div class="form-group">
                    <label for="loginUsername">${t('username')}</label>
                    <input type="text" id="loginUsername" name="username" required 
                           placeholder="${t('enterUsername')}" autocomplete="username">
                </div>
                <button type="submit" class="btn btn-primary btn-block">${t('loginButton')}</button>
            </form>
        `;
    }

    getRegisterForm() {
        const t = this.i18n.t.bind(this.i18n);
        return `
            <form class="auth-form" onsubmit="app.handleRegister(event)">
                <div class="form-group">
                    <label for="registerUsername">${t('username')}</label>
                    <input type="text" id="registerUsername" name="username" required 
                           placeholder="${t('createUsername')}" autocomplete="username">
                </div>
                <div class="form-group">
                    <label for="registerEmail">${t('email')} (${t('optional', {})})</label>
                    <input type="email" id="registerEmail" name="email" 
                           placeholder="your@email.com" autocomplete="email">
                </div>
                <button type="submit" class="btn btn-primary btn-block">${t('registerButton')}</button>
            </form>
        `;
    }

    showLoginForm(e) {
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        if (e && e.target) {
            e.target.classList.add('active');
        } else if (tabs[0]) {
            tabs[0].classList.add('active');
        }
        const container = document.getElementById('authFormContainer');
        if (container) {
            container.innerHTML = this.getLoginForm();
        }
    }

    showRegisterForm(e) {
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        if (e && e.target) {
            e.target.classList.add('active');
        } else if (tabs[1]) {
            tabs[1].classList.add('active');
        }
        const container = document.getElementById('authFormContainer');
        if (container) {
            container.innerHTML = this.getRegisterForm();
        }
    }

    showAuthError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;

        const formContainer = document.getElementById('authFormContainer');
        const existingError = formContainer.querySelector('.auth-error');
        if (existingError) {
            existingError.remove();
        }

        formContainer.insertBefore(errorDiv, formContainer.firstChild);

        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    showAuthSuccess(message) {
        const formContainer = document.getElementById('authFormContainer');

        // If we're not on the auth screen (e.g. easter egg trigger), use alert
        if (!formContainer) {
            alert(message);
            return;
        }

        const successDiv = document.createElement('div');
        successDiv.className = 'auth-success';
        successDiv.style.cssText = `
            background: var(--gradient-cosmic);
            color: white;
            padding: 1.25rem;
            border-radius: var(--radius-md);
            margin-bottom: 1.5rem;
            text-align: center;
            font-family: var(--font-body);
            font-size: var(--text-lg);
            font-weight: var(--weight-medium);
            line-height: var(--leading-snug);
            box-shadow: var(--shadow-lg);
            animation: slideInDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            white-space: pre-line;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        successDiv.textContent = message;

        const existingSuccess = formContainer.querySelector('.auth-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        formContainer.insertBefore(successDiv, formContainer.firstChild);

        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.3s';
        }, 2000);
    }

    handleLogin(event) {
        if (event) event.preventDefault();

        const usernameInput = document.getElementById('loginUsername');
        if (!usernameInput) {
            this.showAuthError('Форма входа не найдена');
            return;
        }

        const username = usernameInput.value.trim();

        if (!username) {
            this.showAuthError(this.i18n.t('usernameRequired') || 'Введите имя пользователя');
            return;
        }

        // Use AuthManager to login
        if (!this.app.auth) {
            this.showAuthError('Система аутентификации недоступна');
            return;
        }

        const result = this.app.auth.login(username);

        if (result.success) {
            const capitalizedName = username.charAt(0).toUpperCase() + username.slice(1);
            const welcomeMsg = this.i18n.getLanguage() === 'ru'
                ? `С возвращением,\n${capitalizedName}!`
                : (this.i18n.getLanguage() === 'kk'
                    ? `Қош келдіңіз,\n${capitalizedName}!`
                    : `Welcome back,\n${capitalizedName}!`);

            this.showAuthSuccess(welcomeMsg);

            // Redirect to intro after short delay
            setTimeout(() => {
                this.showIntro();
            }, 1500);
        } else {
            this.showAuthError(result.error || 'Ошибка входа');
        }
    }

    handleRegister(event) {
        if (event) event.preventDefault();

        const usernameInput = document.getElementById('registerUsername');
        const emailInput = document.getElementById('registerEmail');

        if (!usernameInput) {
            this.showAuthError('Форма регистрации не найдена');
            return;
        }

        const username = usernameInput.value.trim();
        const email = emailInput ? emailInput.value.trim() : '';

        if (!username) {
            this.showAuthError(this.i18n.t('usernameRequired') || 'Введите имя пользователя');
            return;
        }

        if (username.length < 3) {
            this.showAuthError(this.i18n.t('usernameTooShort') || 'Имя пользователя должно содержать минимум 3 символа');
            return;
        }

        // Use AuthManager to register
        if (!this.app.auth) {
            this.showAuthError('Система аутентификации недоступна');
            return;
        }

        const result = this.app.auth.register(username, email);

        if (result.success) {
            const capitalizedName = username.charAt(0).toUpperCase() + username.slice(1);
            const welcomeMsg = this.i18n.getLanguage() === 'ru'
                ? `Аккаунт создан!\nС возвращением, ${capitalizedName}!`
                : (this.i18n.getLanguage() === 'kk'
                    ? `Аккаунт жасалды!\nҚош келдіңіз, ${capitalizedName}!`
                    : `Account created!\nWelcome, ${capitalizedName}!`);

            this.showAuthSuccess(welcomeMsg);

            // Redirect to intro after short delay
            setTimeout(() => {
                this.showIntro();
            }, 1500);
        } else {
            this.showAuthError(result.error || 'Ошибка регистрации');
        }
    }

    continueAsGuest() {
        // Set guest mode flag
        this.app.state = 'intro';

        // Clear any session
        if (this.app.auth) {
            this.app.auth.logout();
        }

        // Show intro screen
        this.showIntro();
    }

    // ================= END AUTH UI =================

    // ================= START INTRO UI =================

    showIntro() {
        this.app.state = 'intro';
        const container = document.getElementById('app');
        if (!container) return;

        container.style.opacity = '0';
        const t = this.i18n.t.bind(this.i18n);
        const user = this.app.auth ? this.app.auth.getCurrentUser() : null;

        // Check if there is incomplete progress
        let hasProgress = false;
        try {
            if (this.app.storage) {
                const progressData = this.app.storage.loadProgress();
                if (progressData && progressData.choices) {
                    hasProgress = Array.isArray(progressData.choices) ?
                        progressData.choices.length > 0 :
                        Object.keys(progressData.choices).length > 0;
                }
            }
        } catch (e) {
            console.error('Прогресті тексеру қатесі (Error checking progress)', e);
        }

        // Попытка использовать шаблон из HTML (если он есть)
        const template = document.getElementById('landing-template');

        if (template) {
            // Клонируем контент шаблона
            const clone = template.content.cloneNode(true);
            container.innerHTML = '';
            container.appendChild(clone);

            // Обновляем тексты в соответствии с текущим языком
            this.updateStaticContent();

            // === 1. Обновляем Hero Section в зависимости от статуса ===
            const heroContent = container.querySelector('.hero-content');
            if (heroContent) {
                // Добавляем бейдж статуса перед заголовком
                const badge = document.createElement('div');

                if (user) {
                    // Пользователь вошел
                    badge.className = 'auth-status-badge logged-in';
                    badge.innerHTML = `
                        <span class="material-symbols-rounded">check_circle</span>
                        ${t('loggedIn') || 'Вы вошли в систему'}
                    `;

                    // Обновляем заголовок
                    const heroTitle = heroContent.querySelector('.hero-title');
                    if (heroTitle) {
                        const escapedUsername = this.escapeHTML(user.username);
                        heroTitle.innerHTML = `${t('welcomeBack') || 'С возвращением'}, <br><span class="highlight">${escapedUsername}</span>!`;
                    }
                } else {
                    // Гость
                    badge.className = 'auth-status-badge guest';
                    badge.innerHTML = `
                        <span class="material-symbols-rounded">account_circle</span>
                        ${t('guestMode') || 'Гостевой режим'}
                    `;
                }

                // Вставляем бейдж первым элементом
                heroContent.insertBefore(badge, heroContent.firstChild);
            }

            // === 2. Обновляем кнопки действий ===
            const actionsContainer = container.querySelector('#landing-actions');

            if (actionsContainer) {
                let buttonsHtml = '';

                if (user) {
                    // Для авторизованного пользователя
                    if (hasProgress) {
                        buttonsHtml += `
                            <button class="btn btn-primary btn-lg pulse-animation" onclick="app.continueTest()">
                                <span class="material-symbols-rounded">play_arrow</span>
                                ${t('continueTest') || 'Продолжить тест'}
                            </button>
                        `;
                    } else {
                        buttonsHtml += `
                            <button class="btn btn-primary btn-lg pulse-animation" onclick="app.showTestTypeSelection()">
                                <span class="material-symbols-rounded">play_arrow</span>
                                ${t('startTest') || 'Начать тест'}
                            </button>
                        `;
                    }
                    // Доп. кнопка профиля
                    buttonsHtml += `
                        <a href="profile.html" class="btn btn-secondary btn-lg">
                            <span class="material-symbols-rounded">person</span>
                            ${t('myProfile') || 'Мой профиль'}
                        </a>
                    `;
                } else {
                    // Для гостя
                    if (hasProgress) {
                        buttonsHtml += `
                            <button class="btn btn-primary btn-lg pulse-animation" onclick="app.continueTest()">
                                <span class="material-symbols-rounded">play_arrow</span>
                                ${t('continueTest') || 'Продолжить'}
                            </button>
                        `;
                    } else {
                        buttonsHtml += `
                            <button class="btn btn-primary btn-lg pulse-animation" onclick="app.showTestTypeSelection()">
                                <span class="material-symbols-rounded">science</span>
                                ${t('startTest') || 'Начать тест'}
                            </button>
                        `;
                    }

                    // Кнопки входа/регистрации
                    buttonsHtml += `
                        <button class="btn btn-secondary btn-lg" onclick="app.showAuth()">
                            <span class="material-symbols-rounded">login</span>
                            ${t('login') || 'Войти'}
                        </button>
                    `;
                }

                actionsContainer.innerHTML = buttonsHtml;

                // Также обновляем нижний CTA блок
                const ctaActionsContainer = container.querySelector('#cta-actions');
                if (ctaActionsContainer) {
                    if (hasProgress) {
                        ctaActionsContainer.innerHTML = `
                            <div class="cta-actions-group">
                                <button class="btn btn-primary btn-xl pulse-animation" onclick="app.continueTest()">
                                    <span class="material-symbols-rounded">play_arrow</span>
                                    ${t('continueTest') || 'Продолжить тест'}
                                </button>
                                <button class="btn btn-secondary btn-xl" onclick="app.showTestTypeSelection()">
                                    <span class="material-symbols-rounded">refresh</span>
                                    ${t('startNewTest') || 'Начать заново'}
                                </button>
                            </div>
                         `;
                    } else {
                        ctaActionsContainer.innerHTML = `
                            <button class="btn btn-primary btn-xl pulse-animation" onclick="app.showTestTypeSelection()">
                                <span class="material-symbols-rounded">play_arrow</span>
                                ${t('startTest') || 'Начать тестирование'}
                            </button>
                         `;
                    }
                }
            }
        } else {
            // Фолбек на хардкод (упрощенная версия)
            container.innerHTML = `
                <div class="intro-screen">
                    <h1 class="fade-in split-text">${t('appName')}</h1>
                    <div class="actions fade-in delay-2">
                         <button class="btn btn-primary btn-lg" onclick="app.showTestTypeSelection()">
                            ${t('startTest')}
                        </button>
                    </div>
                </div>
            `;
        }

        // Плавное появление
        requestAnimationFrame(() => {
            container.style.transition = 'opacity 0.5s';
            container.style.opacity = '1';
            this.focusHeading();
        });
    }



    /**
     * Show Converter Modal
     */
    showConverter() {
        // Create modal container if not exists
        let modal = document.getElementById('converterModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'converterModal';
            modal.className = 'modal-overlay fade-in';
            document.body.appendChild(modal);
        }

        const t = this.i18n.t.bind(this.i18n);

        modal.innerHTML = `
            <div class="modal-content glass">
                <span class="modal-close" onclick="document.getElementById('converterModal').remove()">&times;</span>
                <h2>Конвертер отчетов</h2>
                <p>Загрузите JSON файл с результатами теста для конвертации в другие форматы.</p>
                
                <div class="converter-upload-area" id="dropZone">
                    <input type="file" id="jsonFileInput" accept=".json" style="display: none" onchange="app.ui.handleFileSelect(event)">
                    <button class="btn btn-secondary" onclick="document.getElementById('jsonFileInput').click()">
                        <span class="material-symbols-rounded">upload_file</span>
                        Выберите файл
                    </button>
                    <p style="margin-top: 10px; font-size: 0.9em; color: var(--text-secondary);">или перетащите сюда</p>
                    <div id="fileNameDisplay" style="margin-top: 10px; font-weight: bold;"></div>
                </div>

                <div id="converterActions" style="display: none; margin-top: 20px;">
                    <h3>Скачать как:</h3>
                    <div class="results-actions-top" style="justify-content: center; gap: 12px;">
                        <button class="btn-download-action btn-download-html" onclick="app.ui.convertAndDownload('html')">
                            <span class="material-symbols-rounded">html</span> HTML
                        </button>
                        <button class="btn-download-action btn-download-doc" onclick="app.ui.convertAndDownload('doc')">
                            <span class="material-symbols-rounded">description</span> Word
                        </button>
                    </div>
                </div>
                
                <div id="conversionStatus" style="margin-top: 15px; color: var(--text-secondary);"></div>
            </div>
        `;

        // Setup Drag and Drop
        const dropZone = document.getElementById('dropZone');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('highlight');
            dropZone.style.borderColor = 'var(--primary-color)';
            dropZone.style.background = 'rgba(var(--primary-rgb), 0.1)';
        }

        function unhighlight(e) {
            dropZone.classList.remove('highlight');
            dropZone.style.borderColor = '';
            dropZone.style.background = '';
        }

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFileSelect({ target: { files: files } });
        }, false);
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const display = document.getElementById('fileNameDisplay');
        const actions = document.getElementById('converterActions');
        const status = document.getElementById('conversionStatus');

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            display.textContent = 'Қате: .json файлын таңдаңыз (Error: Select .json file)';
            display.style.color = 'red';
            actions.style.display = 'none';
            return;
        }

        display.textContent = `Выбран: ${file.name}`;
        display.style.color = 'var(--text-primary)';

        // Read file
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.loadedReportData = JSON.parse(e.target.result);
                // Check if it's a valid report (basic check)
                if (this.loadedReportData.data && (this.loadedReportData.data.profile || this.loadedReportData.data.scores)) {
                    // Wrapped format
                    this.loadedReportData = this.loadedReportData.data;
                }

                if (!this.loadedReportData.profile && !this.loadedReportData.scores) {
                    throw new Error('Некорректный формат файла отчета');
                }

                actions.style.display = 'block';
                status.textContent = 'Файл сәтті оқылды. Конвертациялау форматын таңдаңыз (File read successfully. Select format for conversion).';
                status.style.color = 'green';

                // Store original filename for export naming
                this.loadedFilenameBase = file.name.replace('.json', '');

            } catch (error) {
                console.error('Файлды талдау қатесі (File parse error):', error);
                status.textContent = 'Файлды оқу қатесі (Error reading file): ' + error.message;
                status.style.color = 'red';
                actions.style.display = 'none';
            }
        };
        reader.readAsText(file);
    }

    convertAndDownload(format) {
        if (!this.loadedReportData) return;

        const status = document.getElementById('conversionStatus');
        status.textContent = `Конвертация в ${format.toUpperCase()}...`;
        status.style.color = 'var(--text-primary)';

        // Use global window.ReportGenerator if available
        let reportGen = this.app.reportGenerator;
        if (!reportGen && typeof window !== 'undefined' && window.ReportGenerator) {
            reportGen = new window.ReportGenerator();
        }

        if (reportGen) {
            // Use original filename base
            const filename = `${this.loadedFilenameBase}.${format}`;
            reportGen.downloadReport(this.loadedReportData, format, filename);

            setTimeout(() => {
                status.textContent = 'Дайын! Файл жүктелуі керек (Ready! File should download).';
                status.style.color = 'green';
            }, 1000);
        } else {
            status.textContent = 'Қате: Есеп генераторы табылмады (Error: Report generator not found).';
            status.style.color = 'red';
        }
    }

    showTestTypeSelection() {
        this.app.state = 'testSelection';
        const container = document.getElementById('app');
        if (!container) return;

        container.style.opacity = '0';
        const t = this.i18n.t.bind(this.i18n);

        // Check if there is incomplete progress
        let hasProgress = false;
        try {
            if (this.app.storage) {
                const progressData = this.app.storage.loadProgress();
                if (progressData && progressData.choices) {
                    hasProgress = Array.isArray(progressData.choices) ?
                        progressData.choices.length > 0 :
                        Object.keys(progressData.choices).length > 0;
                }
            }
        } catch (e) {
            console.error('Прогресті тексеру қатесі (Error checking progress)', e);
        }

        // Fallbacks provided directly in template literal for better readability
        container.innerHTML = `
            <div class="test-selection-screen">
                <h1>${t('selectTestType') || 'Выберите тип теста'}</h1>
                <p class="subtitle">${t('testTypeDescription') || 'Выберите подходящий для вас вариант тестирования'}</p>
                
                ${hasProgress ? `
                    <div class="continue-test-banner">
                        <div class="banner-content">
                            <span class="material-symbols-rounded">history</span>
                            <div class="banner-text">
                                <h3>${t('unfinishedTest') || 'У вас есть незавершенный тест'}</h3>
                                <p>${t('continueOrStartNew') || 'Вы можете продолжить с того места, где остановились, или начать новый тест'}</p>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-lg pulse-animation" onclick="app.continueTest()">
                            <span class="material-symbols-rounded">play_arrow</span>
                            ${t('continueTest') || 'Продолжить тест'}
                        </button>
                    </div>
                ` : ''}
                
                <div class="test-type-cards">
                    <div class="test-type-card" onclick="app.startBasicTest()">
                        <div class="test-type-icon">⚡</div>
                        <h2>${t('basicTest') || 'Быстрый тест'}</h2>
                        <div class="test-type-info">
                            <p class="test-count">${t('questionsCount') || 'Вопросов'}: <strong>12</strong></p>
                            <p class="test-time">${t('estimatedTime') || 'Время'}: <strong>~15 ${t('minutes') || 'минут'}</strong></p>
                        </div>
                        <div class="test-type-description">
                            <p>${t('basicTestDescription') || 'Быстрое тестирование с основными сценариями для получения базового профиля личности.'}</p>
                            <ul>
                                <li>${t('basicTestFeature1') || '12 сценариев с выбором'}</li>
                                <li>${t('basicTestFeature2') || 'Базовый анализ профиля'}</li>
                                <li>${t('basicTestFeature3') || 'Рекомендации по развитию'}</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary">${t('startBasicTest') || 'Начать быстрый тест'}</button>
                    </div>
                    
                    <div class="test-type-card advanced" onclick="app.startAdvancedTest()">
                        <div class="test-type-icon">🔬</div>
                        <h2>${t('advancedTest') || 'Углубленный тест'}</h2>
                        <div class="test-type-badge">${t('mostAccurate') || 'Максимально точный'}</div>
                        <div class="test-type-info">
                            <p class="test-count">${t('questionsCount') || 'Вопросов'}: <strong>36</strong> <span style="font-size: 0.8em; opacity: 0.8;">(${t('exactQuantity') || 'точное количество'})</span></p>
                            <p class="test-time">${t('estimatedTime') || 'Время'}: <strong>~45-60 ${t('minutes') || 'минут'}</strong></p>
                        </div>
                        <div class="test-type-description">
                            <p>${t('advancedTestDescription') || 'Комплексное тестирование с углубленными вопросами для максимально точного анализа личности.'}</p>
                            <ul>
                                <li>${t('advancedTestFeature1') || 'Сценарии, шкалы, открытые вопросы'}</li>
                                <li>${t('advancedTestFeature2') || 'Ситуационные задачи'}</li>
                                <li>${t('advancedTestFeature3') || 'Детализированный анализ'}</li>
                                <li>${t('advancedTestFeature4') || 'Статистическая достоверность'}</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary">${t('startAdvancedTest') || 'Начать углубленный тест'}</button>
                    </div>
                </div>
                
                <div class="test-selection-actions">
                    <button class="btn btn-secondary" onclick="app.showIntro()">${t('back') || 'Назад'}</button>
                </div>
            </div>
        `;

        setTimeout(() => {
            container.style.transition = 'opacity 0.3s';
            container.style.opacity = '1';
            this.focusHeading();
        }, 10);
    }

    showDependencyError(missing) {
        const container = document.getElementById('app');
        if (!container) return;

        const missingNames = {
            chartjs: 'Chart.js',
            threejs: 'Three.js',
            storage: 'StorageManager',
            analyzer: 'PersonalityAnalyzer',
            visualizer: 'ResultsVisualizer',
            localization: 'LocalizationManager',
            auth: 'AuthManager'
        };

        const missingList = missing.map(name => missingNames[name] || name).join(', ');

        container.innerHTML = `
            <div class="error-screen">
                <h1>Ошибка загрузки приложения</h1>
                <p class="error-message">
                    Не удалось загрузить необходимые компоненты: <strong>${missingList}</strong>
                </p>
                <p class="error-description">
                    Пожалуйста, обновите страницу. Если проблема сохраняется, убедитесь, что все файлы загружены правильно.
                </p>
                <button class="btn btn-primary" onclick="location.reload()">Обновить страницу</button>
            </div>
    `;
    }



    // ================= START RESULTS UI =================

    /**
     * Show Results Screen
     */
    showResults(resultsDisplayData) {
        /*
          resultsDisplayData concept: 
          Contains pre-processed data ready for rendering.
          {
             profile: Object,
             scores: Object,
             normalizedScores: Object,
             statistics: Object,
             aiAnalysis: Object (optional/async),
             visualizer: Object (reference to visualizer if needed, or we use app.visualizer)
          }
        */
        const container = document.getElementById('app');
        if (!container) return;

        const t = this.i18n.t.bind(this.i18n);

        // Initial Loading State
        container.innerHTML = `
            <div class="loading-wrapper" style="position: absolute; background: transparent;">
                <div class="loading-content">
                    <div class="cosmic-spinner"></div>
                    <p class="loading-text" style="font-size: 1.1rem; margin-top: 1.5rem;">${t('processingResults') || 'Нәтижелер өңделуде...'}</p>
                </div>
            </div>
    `;

        // Render main content
        setTimeout(() => {
            // Retrieve visualization helpers from app (assuming Visualizer is still module-less global or attached to app)
            // Ideally Visualizer should be part of UIController or passed in. 
            // For now, retaining app.visualizer usage but wrapping in UI method.

            const { profile, scores, normalizedScores, statistics, aiAnalysis } = resultsDisplayData;

            // Logic to construct HTML similar to original app.showResults
            // Using Template Literal for readability

            let content = `
                <div class="results-screen animate-in">
                    <div class="results-header">
                        <button class="btn-home" onclick="app.showIntro()" title="${t('home')}">🏠</button>
                        <h1 id="resultsTitle">${t('resultsTitle') || 'Personality Profile Analysis'}</h1>
                        <div class="results-actions-top" style="gap: 12px;">
                             <button class="btn-download-action btn-download-html" onclick="app.downloadResults('html')">
                                <span class="material-symbols-rounded">html</span> HTML
                             </button>
                        </div>
                    </div>

                    <div class="results-grid">
                        <!-- Profile Card -->
                         <div class="result-card profile-card">
                            <h2>${profile.type}</h2>
                            <p class="profile-summary" style="text-align: justify;">${profile.summary}</p>
                            <div class="tags-container">
                                ${profile.traits.map(trait => `<span class="tag">${trait}</span>`).join('')}
                            </div>
                        </div>

                        <!-- Charts Area -->
                        <div class="result-card chart-card">
                             <div id="radarChartContainer"></div>
                        </div>
                        
                        <!-- AI Analysis Container -->
                         <div id="aiAnalysisContainer" class="result-card ai-card" style="${aiAnalysis ? '' : 'display:none'}">
                             <h2>🤖 ${t('aiAnalysisTitle') || 'AI Analysis'}</h2>
                             <div id="aiAnalysisContent"></div>
                         </div>
                    </div>
                </div>

                <div class="results-actions-bottom animate-in" style="animation-delay: 0.6s">
                    <button class="btn btn-xl btn-primary pulse-animation" onclick="app.downloadResults('html')">
                        <span class="material-symbols-rounded">download</span>
                        ${t('downloadResults') || 'Download Result'}
                    </button>
                </div>
            </div>
    `;

            container.innerHTML = content;

            // Render Charts
            if (this.app.visualizer) {
                // Get dimensions for chart labels
                const dimensions = this.app.analyzer ? this.app.analyzer.dimensions : {};
                this.app.visualizer.createRadarChart(scores, dimensions);
            }

            // Render AI Content if available immediately
            if (aiAnalysis) {
                this.displayAIAnalysis(aiAnalysis, 'aiAnalysisContent');
            } else {
                // Show temporary loader in AI section if async
                const aiContent = document.getElementById('aiAnalysisContent');
                if (aiContent) aiContent.innerHTML = '<div class="loading-spinner-sm"></div>';
            }

            this.focusHeading();
        }, 500);
    }

    /**
     * Update AI Analysis Section
     */
    updateResultsWithAI(aiAnalysis) {
        const container = document.getElementById('aiAnalysisContainer');
        const content = document.getElementById('aiAnalysisContent');

        if (container && content) {
            container.style.display = 'block';
            this.displayAIAnalysis(aiAnalysis, 'aiAnalysisContent'); // Re-use method
        }
    }

    displayAIAnalysis(aiAnalysis, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const t = this.i18n.t.bind(this.i18n);
        let html = '<div class="ai-analysis-content">';

        // Personality Type
        if (aiAnalysis.personalityType) {
            const confidence = Math.round(aiAnalysis.personalityType.confidence * 100);
            html += `
                <div class="ai-section">
                    <h3>🎯 ${t('personalityType')}</h3>
                    <div class="personality-type-card">
                        <h4>${aiAnalysis.personalityType.name}</h4>
                        <p style="text-align: justify;">${aiAnalysis.personalityType.description}</p>
                        <div class="confidence-badge">${t('confidence')} ${confidence}%</div>
                    </div>
                </div>
    `;
        }

        // Insights
        if (aiAnalysis.insights && aiAnalysis.insights.length > 0) {
            html += `<div class="ai-section"><h3>💡 ${t('insights')}</h3><div class="insights-list">`;
            aiAnalysis.insights.forEach(insight => {
                html += `
                    <div class="insight-item insight-${insight.importance}">
                        <h4>${insight.title}</h4>
                        <p style="text-align: justify;">${insight.text}</p>
                    </div>
                `;
            });
            html += '</div></div > ';
        }

        html += '</div>';
        container.innerHTML = html;
    }

    // ================= PROFILE UI =================

    showProfile(profileData) {
        const { user, history, evolutionReport } = profileData;
        const container = document.getElementById('app');
        if (!container) return;

        const t = this.i18n.t.bind(this.i18n);
        const lang = this.i18n.getLanguage();

        // Fetch Evolution History for the chart
        const evolutionHistory = this.app.auth ? this.app.auth.getEvolutionHistory() : null;
        const showEvolution = evolutionHistory && evolutionHistory.sessions && evolutionHistory.sessions.length >= 2;

        container.innerHTML = `
            <div class="screen animate-in active">
                <div class="container-sm">
                    <div class="flex justify-between items-center mb-6">
                        <button class="btn-back" onclick="app.showIntro()">
                            ${t('back')}
                        </button>
                        <h1 class="text-3xl font-bold text-gradient">${t('myProfileTitle')}</h1>
                        <div style="width: 24px;"></div>
                    </div>
                
                    <div class="cosmic-card glowing mb-6">
                        <div class="flex flex-col items-center p-6 text-center">
                            <div class="user-avatar-lg mb-4" onclick="app.editAvatar()" style="cursor: pointer;">
                                ${this.getUserAvatar(user)}
                            </div>
                            <h2 class="text-2xl font-bold mb-1">${user.username}</h2>
                             ${user.email ? `<p class="text-secondary mb-4">${user.email}</p>` : ''}
                            
                             <div class="flex gap-3">
                                <button class="btn btn-primary" onclick="app.editProfile()">${t('editProfile')}</button>
                                <button class="btn btn-secondary" onclick="app.logout()">${t('logout')}</button>
                            </div>
                        </div>
                    </div>

                    <!-- Evolution Chart -->
                    ${showEvolution ? `
                    <div class="cosmic-card mb-6 fade-in delay-1">
                        <div class="card-header">
                            <h2 class="card-title">📈 ${t('evolutionProgress') || 'Прогресс развития'}</h2>
                        </div>
                        <div class="card-body">
                            <div style="height: 300px; width: 100%; position: relative;">
                                <canvas id="evolutionChart" class="crisp-chart"></canvas>
                            </div>
                            ${evolutionReport && evolutionReport.insights ? `
                                <div class="evolution-insights mt-8">
                                    <h3 class="text-lg font-semibold mb-4">${t('keyInsights') || 'Ключевые инсайты'}</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        ${evolutionReport.insights.slice(0, 2).map(insight => `
                                            <div class="insight-card ${insight.type || 'neutral'}" style="background: rgba(var(--primary-rgb), 0.05); padding: 1.25rem; border-radius: 12px; border-left: 4px solid var(--primary-color);">
                                                <h4 style="margin: 0 0 0.75rem 0; color: var(--primary-color);">${insight.title}</h4>
                                                <p style="margin: 0; font-size: 0.95rem; opacity: 0.9; line-height: 1.5; text-align: justify;">${insight.text}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- History List -->
                    <div class="cosmic-card">
                        <div class="card-header">
                             <h2 class="card-title">${t('testHistory')}</h2>
                        </div>
                        <div class="card-body">
                            ${history.length > 0 ? `
                                <div class="history-list">
                                    ${history.map((test, index) => `
                                        <div class="history-item">
                                            <div class="history-info">
                                                <div class="flex items-center gap-2">
                                                    <h3 class="font-bold text-lg m-0">
                                                        ${test.title || `${t('testNumber')} ${history.length - index}`}
                                                    </h3>
                                                    <button class="btn btn-ghost btn-sm p-1" onclick="app.renameTest(${index})" title="${t('rename') || 'Переименовать'}">
                                                        ✏️
                                                    </button>
                                                    <button class="btn btn-ghost btn-sm p-1 text-red-500" onclick="app.deleteTest(${index})" title="${t('deleteTest') || 'Удалить'}">
                                                        🗑️
                                                    </button>
                                                </div>
                                                <span class="text-sm text-secondary">${new Date(test.date).toLocaleDateString()}</span>
                                            </div>
                                             <button class="btn btn-secondary btn-sm" onclick="app.viewTestResults(${index})">
                                                ${t('viewResults')}
                                             </button>
                                        </div>
                                     `).join('')}
                                </div>
                             ` : `
                                <div class="empty-state">
                                    <span class="material-symbols-rounded empty-icon">history</span>
                                    <p>${t('noHistory')}</p>
                                    <button class="btn btn-primary btn-sm mt-4" onclick="app.showTestTypeSelection()">
                                        ${t('startTest')}
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (showEvolution) {
            // Give DOM time to settle (avoid blurry charts due to initial scale/layout)
            setTimeout(() => {
                this.renderEvolutionChart(evolutionHistory);
                // Second pass to fix any sizing glitches after animations (e.g. fade-in)
                setTimeout(() => {
                    if (this.evolutionChartInstance) {
                        this.evolutionChartInstance.resize();
                    }
                }, 1000);
            }, 500);
        }
        this.focusHeading();
    }

    /**
     * Render Evolution Chart using Chart.js
     * @param {Object} history - Evolution history data
     */
    renderEvolutionChart(history) {
        const t = (key) => (window.t ? window.t(key) : key);
        const ctx = document.getElementById('evolutionChart');
        if (!ctx || !history || !history.sessions) return;

        // 1. Limit to last 10 sessions to prevent overcrowding
        const recentSessions = history.sessions.slice(-10);

        // --- DEBUG: Inject raw data viewer ---
        const container = ctx.parentElement.parentElement; // .card-body
        let debugDiv = document.getElementById('evolution-debug');
        if (!debugDiv) {
            debugDiv = document.createElement('div');
            debugDiv.id = 'evolution-debug';
            debugDiv.style.marginTop = '20px';
            debugDiv.style.fontSize = '10px';
            debugDiv.style.color = '#aaa';
            container.appendChild(debugDiv);
        }

        // Dump the last session's scores for inspection
        const lastSession = recentSessions[recentSessions.length - 1];
        const debugData = {
            date: lastSession ? lastSession.date : 'N/A',
            scores: lastSession ? lastSession.scores : null,
            normalized: lastSession ? lastSession.normalizedScores : null,
            debug_info: "Look here to see if values are 0 or nested objects"
        };
        debugDiv.innerHTML = `
            <details>
                <summary>🔧 Debug Data (Click to view raw values)</summary>
                <div style="background: #111; padding: 10px; border-radius: 4px; overflow: auto; max-height: 200px;">
                    <pre>${JSON.stringify(debugData, null, 2)}</pre>
                </div>
            </details>
        `;
        // -------------------------------------

        // Prepare labels (Dates)
        const labels = recentSessions.map((session, index) => {
            const date = new Date(session.date);
            return date.toLocaleDateString();
        });

        // 2. Identify ALL unique dimensions across these sessions
        const allKeys = new Set();
        recentSessions.forEach(session => {
            const params = session.normalizedScores || session.scores || {};
            Object.keys(params).forEach(k => allKeys.add(k));
        });

        let dimensions = Array.from(allKeys);

        // Fallback default dimensions if absolutely nothing found
        if (dimensions.length === 0) {
            dimensions = ['strategic', 'explorer', 'individualism', 'rationality'];
        }

        // Colors palette
        const colors = [
            '#00c6fb', '#005bea', '#ff7e5f', '#feb47b',
            '#a78bfa', '#34d399', '#f472b6', '#60a5fa'
        ];

        // 3. Build datasets and Filter out flat-lines (dimensions with all 0s)
        const datasets = [];
        let colorIndex = 0;

        dimensions.forEach((dim) => {
            let hasData = false;

            const data = recentSessions.map(s => {
                let val = 0;
                let raw = undefined;

                // Try different properties
                if (s.normalizedScores && s.normalizedScores[dim] !== undefined) raw = s.normalizedScores[dim];
                else if (s.scores && s.scores[dim] !== undefined) raw = s.scores[dim];

                // Handle nested objects (e.g., { value: 50, level: 'high' })
                if (raw && typeof raw === 'object') {
                    if (raw.percentage !== undefined) val = raw.percentage;
                    else if (raw.value !== undefined) val = raw.value;
                    else if (raw.score !== undefined) val = raw.score;
                    else val = 0;
                } else {
                    val = raw;
                }

                val = parseFloat(val);
                if (isNaN(val)) val = 0;

                // CRITICAL FIX: normalizedScores are in range [-1, 1], not [-100, 100]
                // Convert to percentage for chart display
                if (Math.abs(val) <= 1.0 && Math.abs(val) > 0.001) {
                    val = val * 100; // Convert 0.5 -> 50, -0.3 -> -30, etc.
                }

                if (Math.abs(val) > 1) hasData = true; // Now checking against 1% threshold
                return val;
            });

            // Only add dataset if it has at least one non-zero value
            // OR if it's one of the core dimensions (to avoid empty chart)
            const isCore = ['strategic', 'explorer', 'individualism', 'rationality'].includes(dim);

            if (hasData || (isCore && datasets.length < 4)) {
                datasets.push({
                    label: t(`${dim}Name`) || dim,
                    data: data,
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: colors[colorIndex % colors.length],
                    tension: 0.3,
                    borderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    pointBackgroundColor: '#1a1a2e',
                    pointBorderWidth: 2,
                    fill: false
                });
                colorIndex++;
            }
        });

        // Destroy existing chart
        if (this.evolutionChartInstance) {
            this.evolutionChartInstance.destroy();
        }

        // Create new Chart
        this.evolutionChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { left: 10, right: 30, top: 20, bottom: 10 }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e2e8f0',
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 13, family: "'Inter', sans-serif" }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#e2e8f0',
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { size: 14, weight: 'bold' },
                        displayColors: true,
                        callbacks: {
                            label: function (context) {
                                return ` ${context.dataset.label}: ${context.parsed.y > 0 ? '+' : ''}${Math.round(context.parsed.y)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: -100,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 12 },
                            stepSize: 50
                        },
                        border: { display: false }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 12 },
                            maxRotation: 45,
                            minRotation: 0
                        },
                        border: { display: false }
                    }
                }
            }
        });
    }



    getUserAvatar(user) {
        if (!user) return '?';
        if (user.avatar && user.avatar.type === 'emoji') {
            return `<span style="font-size: 2.5rem;">${user.avatar.value}</span>`;
        }
        const letter = user.username.charAt(0).toUpperCase();
        return `<span style="font-size: 2rem; color: white;">${letter}</span>`;
    }

    showAvatarEditor() {
        // Logic to show modal... 
        // Implementation similar to original app.js logic, but cleaner
        // For brevity in this refactor step, assumes app.editAvatar() calls this
        const t = this.i18n.t.bind(this.i18n);
        // ... implementation ...
        alert(t('featureComingSoon') || 'Modal implementation in progress');
    }

    // ================= START GENERAL MODAL UI =================

    /**
     * Show a generic modal
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string} options.content - HTML content
     * @param {Array} options.actions - Array of action buttons [{text, class, onClick}]
     * @param {boolean} options.closeOnOutsideClick - Close when clicking outside
     */
    showModal({ title, content, actions = [], closeOnOutsideClick = true, icon = null, type = 'default', id = 'genericModal', overlayClass = 'modal-overlay' }) {
        let modal = document.getElementById(id);

        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = id;
        modal.className = `${overlayClass} modal-type-${type}`;

        const closeHandler = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        if (closeOnOutsideClick) {
            modal.onclick = (e) => {
                if (e.target === modal) closeHandler();
            };
        }

        const buttonsHtml = actions.map((btn, index) => {
            const btnClass = btn.class || 'btn-secondary';
            return `<button class="btn ${btnClass}" id="${id}Btn${index}">${btn.text}</button>`;
        }).join('');

        modal.innerHTML = `
            <div class="modal-content glass">
                <button class="modal-close material-symbols-rounded" aria-label="Close">close</button>
                <div class="modal-header">
                    ${icon ? `<span class="material-symbols-rounded modal-type-icon">${icon}</span>` : ''}
                    ${title ? `<h2 class="modal-title">${title}</h2>` : ''}
                </div>
                <div class="modal-body">${content}</div>
                ${actions.length > 0 ? `<div class="modal-actions">${buttonsHtml}</div>` : ''}
            </div>
        `;

        document.body.appendChild(modal);

        // Animation
        setTimeout(() => modal.classList.add('active'), 10);

        // Bind events
        modal.querySelector('.modal-close').onclick = closeHandler;

        actions.forEach((btn, index) => {
            const el = document.getElementById(`${id}Btn${index}`);
            if (el && btn.onClick) {
                el.onclick = (e) => {
                    if (e) e.stopPropagation();
                    btn.onClick();
                    if (btn.closeAfter !== false) closeHandler();
                };
            }
        });
    }

    /**
     * Show Alert Modal (replacement for alert())
     */
    showAlert(message, title = null) {
        const t = this.i18n.t.bind(this.i18n);
        this.showModal({
            id: 'alertModal',
            overlayClass: 'alert-overlay', // Protection from app.closeModal()
            title: title || t('attention') || 'Внимание',
            content: `<p>${message}</p>`,
            icon: 'warning',
            type: 'warning',
            closeOnOutsideClick: false,
            actions: [
                { text: t('ok') || 'OK', class: 'btn-primary', onClick: () => { } }
            ]
        });
    }

    /**
     * Show Confirm Modal (replacement for confirm())
     * @param {string} message 
     * @param {Function} onConfirm 
     * @param {Function} onCancel 
     */
    showConfirm(message, onConfirm, onCancel = null) {
        const t = this.i18n.t.bind(this.i18n);
        this.showModal({
            title: t('confirmation') || 'Подтверждение',
            content: `<p>${message}</p>`,
            actions: [
                {
                    text: t('cancel') || 'Отмена',
                    class: 'btn-secondary',
                    onClick: () => { if (onCancel) onCancel(); }
                },
                {
                    text: t('confirm') || 'Да',
                    class: 'btn-primary',
                    onClick: () => { if (onConfirm) onConfirm(); }
                }
            ]
        });
    }

    /**
     * Show Prompt Modal (replacement for prompt())
     * @param {string} message 
     * @param {string} defaultValue 
     * @param {Function} onSubmit 
     */
    showPrompt(message, defaultValue = '', onSubmit) {
        const t = this.i18n.t.bind(this.i18n);
        const inputId = 'promptInput';

        this.showModal({
            title: t('inputRequired') || 'Ввод данных',
            content: `
                <p>${message}</p>
                <input type="text" id="${inputId}" class="form-control" value="${defaultValue}" style="width: 100%; margin-top: 10px;">
            `,
            actions: [
                { text: t('cancel') || 'Отмена', class: 'btn-secondary', onClick: () => { } },
                {
                    text: 'OK',
                    class: 'btn-primary',
                    closeAfter: false, // Handle manually
                    onClick: () => {
                        const val = document.getElementById(inputId).value;
                        if (onSubmit) {
                            onSubmit(val);
                            const modal = document.getElementById('genericModal');
                            if (modal) modal.remove();
                        }
                    }
                }
            ]
        });

        // Focus input
        setTimeout(() => {
            const input = document.getElementById(inputId);
            if (input) input.focus();
        }, 100);
    }

    showError(message) {
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = `
                <div class="error-screen">
                    <h1>Ошибка</h1>
                    <p class="error-message">${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Обновить</button>
                </div>
             `;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}

if (typeof window !== 'undefined') {
    window.UIController = UIController;
}
