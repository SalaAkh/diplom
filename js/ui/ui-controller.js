/**
 * UI Controller
 * Manages all UI interactions, rendering, and event handling
 */
class UIController {
    constructor(app) {
        this.app = app;
        this.selectedTests = new Set(); // Track selected tests for batch delete
        this.currentView = null; // Track dynamic view instances to prevent memory leaks
    }

    /**
     * Clears the active view by calling its destroy method if it exists
     */
    clearView() {
        if (this.currentView && typeof this.currentView.destroy === 'function') {
            this.currentView.destroy();
        }
        this.currentView = null;
    }

    /**
     * Sets a new active view and destroys the previous one
     * @param {Object} viewInstance 
     */
    setView(viewInstance) {
        this.clearView();
        this.currentView = viewInstance;
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

        this.initEasterEggs();
    }

    // ================= START SCENARIO UI =================

    /**
     * Show Basic Scenario
     */
    showScenario(scenario, progress) {
        this.clearView(); // Ensure previous views are destroyed
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
        } else if (question.type === 'cognitive') {
            questionHTML = this.renderCognitiveQuestion(question, currentLang, t);
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

    renderCognitiveQuestion(question, lang, t) {
        const questionText = this.getScenarioText(question.text);

        const optionsHTML = question.options.map(opt => `
            <button class="option-btn" onclick="app.handleCognitiveAnswer('${opt.id}', ${question.id})">
                <span class="option-text">${this.getScenarioText(opt.text)}</span>
            </button>
        `).join('');

        return `
            <div class="question-content cognitive-question">
                <h2>${questionText}</h2>
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
        if (typeof window.applyLocalizedAttributes === 'function') {
            window.applyLocalizedAttributes(document);
        } else {
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key) {
                    el.textContent = this.i18n.t(key);
                }
            });
        }

        // Update specific IDs if needed (legacy support)
        const appName = document.getElementById('appName');
        const tagline = document.getElementById('tagline');
        const footerText = document.getElementById('footerText');
        const footerNote = document.getElementById('footerNote');

        if (appName) appName.textContent = this.i18n.t('appName');
        if (tagline) tagline.textContent = this.i18n.t('tagline');
        if (footerText) footerText.innerHTML = `${this.i18n.t('project')} &copy; 2026`;
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
                    <span class="language-arrow">&#9662;</span>
                </button>
                <div class="language-menu" id="languageMenu">
                    ${languages.map(lang => `
                        <button class="language-option ${lang.code === currentLang ? 'active' : ''}" 
                                onclick="app.changeLanguage('${lang.code}')">
                            <span class="language-flag">${lang.flag}</span>
                            <span class="language-name">${lang.name}</span>
                            ${lang.code === currentLang ? '<span class="language-check">&#10003;</span>' : ''}
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
                    this.showAuthSuccess('Developed by Akhmedyanov Salamat, KPO 9/22-2');
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
            this.showAuthError(this.i18n.t('loginFormNotFound') || 'Login form not found.');
            return;
        }

        const username = usernameInput.value.trim();

        if (!username) {
            this.showAuthError(this.i18n.t('usernameRequired') || 'Enter a username');
            return;
        }

        // Use AuthManager to login
        if (!this.app.auth) {
            this.showAuthError(this.i18n.t('authSystemUnavailable') || 'Authentication system is unavailable.');
            return;
        }

        const result = this.app.auth.login(username);

        if (result.success) {
            const capitalizedName = username.charAt(0).toUpperCase() + username.slice(1);
            const welcomeMsg = `${this.i18n.t('welcomeBack') || 'Welcome back'},\n${capitalizedName}!`;

            this.showAuthSuccess(welcomeMsg);

            // Redirect to intro after short delay
            setTimeout(() => {
                this.showIntro();
            }, 1500);
        } else {
            this.showAuthError(result.error || this.i18n.t('unknownError') || 'Unknown error');
        }
    }

    handleRegister(event) {
        if (event) event.preventDefault();

        const usernameInput = document.getElementById('registerUsername');
        const emailInput = document.getElementById('registerEmail');

        if (!usernameInput) {
            this.showAuthError(this.i18n.t('registerFormNotFound') || 'Registration form not found.');
            return;
        }

        const username = usernameInput.value.trim();
        const email = emailInput ? emailInput.value.trim() : '';

        if (!username) {
            this.showAuthError(this.i18n.t('usernameRequired') || 'Enter a username');
            return;
        }

        if (username.length < 3) {
            this.showAuthError(this.i18n.t('usernameTooShort') || 'Username must be at least 3 characters long');
            return;
        }

        // Use AuthManager to register
        if (!this.app.auth) {
            this.showAuthError(this.i18n.t('authSystemUnavailable') || 'Authentication system is unavailable.');
            return;
        }

        const result = this.app.auth.register(username, email);

        if (result.success) {
            const capitalizedName = username.charAt(0).toUpperCase() + username.slice(1);
            const welcomeMsg = `${this.i18n.t('accountCreated') || 'Account created'}!\n${this.i18n.t('welcomeBack') || 'Welcome back'}, ${capitalizedName}!`;

            this.showAuthSuccess(welcomeMsg);

            // Redirect to intro after short delay
            setTimeout(() => {
                this.showIntro();
            }, 1500);
        } else {
            this.showAuthError(result.error || this.i18n.t('unknownError') || 'Unknown error');
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

    getLandingTemplateHTML() {
        return `
            <div class="landing-page">
                <section class="hero-section" aria-labelledby="hero-title">
                    <div class="hero-content">
                        <h1 id="hero-title" class="hero-title fade-in" data-i18n="landingHeroTitle">ÐŸÐ¾Ð·Ð½Ð°Ð¹ ÑÐ²Ð¾ÑŽ Ð¸ÑÑ‚Ð¸Ð½Ð½ÑƒÑŽ Ð¿Ñ€Ð¸Ñ€Ð¾Ð´Ñƒ</h1>
                        <p class="hero-subtitle fade-in delay-1" data-i18n="landingHeroSubtitle">
                            Ð˜Ð½Ñ‚ÐµÐ»Ð»ÐµÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð°Ñ ÑÐ¸ÑÑ‚ÐµÐ¼Ð° Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð»Ð¸Ñ‡Ð½Ð¾ÑÑ‚Ð¸, Ð¾ÑÐ½Ð¾Ð²Ð°Ð½Ð½Ð°Ñ Ð½Ð° ÐºÐ¾Ð³Ð½Ð¸Ñ‚Ð¸Ð²Ð½Ð¾Ð¹ Ð¿ÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ð¸Ð¸ Ð¸ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÑÑ… Ð²Ñ‹Ð±Ð¾Ñ€Ð°.
                            ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»Ð¸Ñ‚Ðµ ÑÐ²Ð¾Ð¸ ÑÐ¸Ð»ÑŒÐ½Ñ‹Ðµ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ñ‹ Ð¸ Ð²ÐµÐºÑ‚Ð¾Ñ€Ñ‹ Ñ€Ð°Ð·Ð²Ð¸Ñ‚Ð¸Ñ.
                        </p>
                        <div class="hero-cta fade-in delay-2" id="landing-actions">
                            <!-- ÐšÐ½Ð¾Ð¿ÐºÐ¸ Ð±ÑƒÐ´ÑƒÑ‚ Ð²ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ñ‹ JS -->
                        </div>
                    </div>
                    <div class="hero-visual fade-in delay-3" aria-hidden="true">
                        <span class="material-symbols-rounded floating-icon">neurology</span>
                        <span class="material-symbols-rounded floating-icon delay-1">fingerprint</span>
                        <span class="material-symbols-rounded floating-icon delay-2">auto_graph</span>
                    </div>
                </section>

                <section class="features-section" aria-labelledby="features-title">
                    <h2 id="features-title" class="section-title" data-i18n="landingFeaturesTitle">Ð¢ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸Ð¸ ÑÐ°Ð¼Ð¾Ð¿Ð¾Ð·Ð½Ð°Ð½Ð¸Ñ</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <span class="feature-icon material-symbols-rounded" aria-hidden="true">theater_comedy</span>
                            <h3 data-i18n="featInteractive">Ð˜Ð½Ñ‚ÐµÑ€Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ðµ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ð¸</h3>
                            <p data-i18n="featInteractiveDesc">12 Ð³Ð»ÑƒÐ±Ð¾ÐºÐ¸Ñ… Ð¸Ð½Ñ‚ÐµÑ€Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÐµÐ² Ñ Ð¼Ð½Ð¾Ð¶ÐµÑÑ‚Ð²Ð¾Ð¼ Ð¿ÑƒÑ‚ÐµÐ¹ Ñ€Ð°Ð·Ð²Ð¸Ñ‚Ð¸Ñ</p>
                        </div>
                        <div class="feature-card">
                            <span class="feature-icon material-symbols-rounded" aria-hidden="true">neurology</span>
                            <h3 data-i18n="featPattern">ÐÐ½Ð°Ð»Ð¸Ð· Ð¿Ð°Ñ‚Ñ‚ÐµÑ€Ð½Ð¾Ð²</h3>
                            <p data-i18n="featPatternDesc">ÐšÐ¾Ð¼Ð¿Ð»ÐµÐºÑÐ½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· ÐºÐ¾Ð³Ð½Ð¸Ñ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð¿Ð°Ñ‚Ñ‚ÐµÑ€Ð½Ð¾Ð² Ð¸ ÑÑ‚Ð¸Ð»ÐµÐ¹ Ð¿Ñ€Ð¸Ð½ÑÑ‚Ð¸Ñ Ñ€ÐµÑˆÐµÐ½Ð¸Ð¹</p>
                        </div>
                    </div>
                </section>

                <section class="mission-section">
                    <div class="mission-content">
                        <span class="section-badge" data-i18n="missionTitle">ÐœÐ¸ÑÑÐ¸Ñ Ð¿Ñ€Ð¾ÐµÐºÑ‚Ð°</span>
                        <p class="mission-text" data-i18n="missionText">Ð’ ÑÐ¿Ð¾Ñ…Ñƒ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð³Ð¾ ÑˆÑƒÐ¼Ð° Ð»ÐµÐ³ÐºÐ¾ Ð¿Ð¾Ñ‚ÐµÑ€ÑÑ‚ÑŒ ÑÐ²ÑÐ·ÑŒ Ñ ÑÐ¾Ð±Ð¾Ð¹. ÐÐ°ÑˆÐ° Ñ†ÐµÐ»ÑŒ â€” Ð´Ð°Ñ‚ÑŒ ÐºÐ°Ð¶Ð´Ð¾Ð¼Ñƒ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚ Ð´Ð»Ñ Ð¾ÑÐ¾Ð·Ð½Ð°Ð½Ð½Ð¾Ð³Ð¾ ÑÐ°Ð¼Ð¾Ð¿Ð¾Ð·Ð½Ð°Ð½Ð¸Ñ. Ð­Ñ‚Ð¾ Ð½Ðµ Ð¿Ñ€Ð¾ÑÑ‚Ð¾ Ñ‚ÐµÑÑ‚, ÑÑ‚Ð¾ Ñ†Ð¸Ñ„Ñ€Ð¾Ð²Ð¾Ðµ Ð·ÐµÑ€ÐºÐ°Ð»Ð¾, ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ðµ Ð¾Ñ‚Ñ€Ð°Ð¶Ð°ÐµÑ‚ Ð²Ð°ÑˆÐ¸ Ð¸ÑÑ‚Ð¸Ð½Ð½Ñ‹Ðµ Ñ†ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸, ÑÐºÑ€Ñ‹Ñ‚Ñ‹Ðµ Ð¼Ð¾Ñ‚Ð¸Ð²Ñ‹ Ð¸ Ð¿Ð¾Ñ‚ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ñ‚Ð°Ð»Ð°Ð½Ñ‚Ñ‹, Ð¿Ð¾Ð¼Ð¾Ð³Ð°Ñ Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°Ñ‚ÑŒ Ð²ÐµÑ€Ð½Ñ‹Ðµ Ð¶Ð¸Ð·Ð½ÐµÐ½Ð½Ñ‹Ðµ Ñ€ÐµÑˆÐµÐ½Ð¸Ñ.</p>
                    </div>
                </section>

                <section class="methodology-section">
                    <div class="methodology-wrapper">
                        <div class="methodology-text">
                            <h2 class="section-title" data-i18n="methodologyTitle">ÐÐ°ÑƒÐºÐ° Ð²Ð½ÑƒÑ‚Ñ€Ð¸</h2>
                            <h3 class="methodology-subtitle" data-i18n="methodologySubtitle">Ð‘Ð¾Ð»ÑŒÑˆÐµ, Ñ‡ÐµÐ¼ Ð¿Ñ€Ð¾ÑÑ‚Ð¾ Ð²Ð¾Ð¿Ñ€Ð¾ÑÑ‹</h3>
                            <p data-i18n="methodologyText" style="margin-bottom: 2rem;">Ð’ Ð¾Ñ‚Ð»Ð¸Ñ‡Ð¸Ðµ Ð¾Ñ‚ ÐºÐ»Ð°ÑÑÐ¸Ñ‡ÐµÑÐºÐ¸Ñ… Ñ‚ÐµÑÑ‚Ð¾Ð², Ð³Ð´Ðµ Ð»ÐµÐ³ÐºÐ¾ 'Ð¿Ð¾Ð´Ð³Ð°Ð´Ð°Ñ‚ÑŒ' Ð¿Ñ€Ð°Ð²Ð¸Ð»ÑŒÐ½Ñ‹Ð¹ Ð¾Ñ‚Ð²ÐµÑ‚, Ð½Ð°ÑˆÐ° ÑÐ¸ÑÑ‚ÐµÐ¼Ð° Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÑ‚ Ð¸Ð½Ð°Ñ‡Ðµ:</p>
                            <div class="science-grid">
                                <div class="science-item">
                                    <h4 data-i18n="sciencePsychTitle">ÐšÐ¾Ð³Ð½Ð¸Ñ‚Ð¸Ð²Ð½Ð°Ñ Ð¿ÑÐ¸Ñ…Ð¾Ð»Ð¾Ð³Ð¸Ñ</h4>
                                    <p data-i18n="sciencePsychText">ÐÐ½Ð°Ð»Ð¸Ð· Ð¿Ñ€Ð¸Ð½ÑÑ‚Ð¸Ñ Ñ€ÐµÑˆÐµÐ½Ð¸Ð¹ Ð² ÑƒÑÐ»Ð¾Ð²Ð¸ÑÑ… Ð½ÐµÐ¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸ Ð²Ñ‹ÑÐ²Ð»ÑÐµÑ‚ Ð¸ÑÑ‚Ð¸Ð½Ð½Ñ‹Ðµ, Ð° Ð½Ðµ Ð´ÐµÐºÐ»Ð°Ñ€Ð¸Ñ€ÑƒÐµÐ¼Ñ‹Ðµ Ñ†ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸.</p>
                                </div>
                                <div class="science-item">
                                    <h4 data-i18n="scienceGameTitle">Ð¢ÐµÐ¾Ñ€Ð¸Ñ Ð¸Ð³Ñ€</h4>
                                    <p data-i18n="scienceGameText">Ð¡Ñ†ÐµÐ½Ð°Ñ€Ð½Ñ‹Ðµ Ð´Ð¸Ð»ÐµÐ¼Ð¼Ñ‹ ÑÑ‚Ð°Ð²ÑÑ‚ Ð²Ð°Ñ Ð¿ÐµÑ€ÐµÐ´ ÑÐ»Ð¾Ð¶Ð½Ñ‹Ð¼ Ð²Ñ‹Ð±Ð¾Ñ€Ð¾Ð¼, Ð¸ÑÐºÐ»ÑŽÑ‡Ð°Ñ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ Ð¾Ð¶Ð¸Ð´Ð°ÐµÐ¼Ñ‹Ðµ Ð¾Ñ‚Ð²ÐµÑ‚Ñ‹.</p>
                                </div>
                                <div class="science-item">
                                    <h4 data-i18n="scienceDataTitle">ÐÐ½Ð°Ð»Ð¸Ð· Ð´Ð°Ð½Ð½Ñ‹Ñ…</h4>
                                    <p data-i18n="scienceDataText">ÐœÐ°Ñ‚ÐµÐ¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¼Ð¾Ð´ÐµÐ»ÑŒ ÑÑ‚Ñ€Ð¾Ð¸Ñ‚ Ð¿Ñ€Ð¾Ñ„Ð¸Ð»ÑŒ Ð¿Ð¾ 6 Ð½ÐµÐ·Ð°Ð²Ð¸ÑÐ¸Ð¼Ñ‹Ð¼ Ð¾ÑÑÐ¼, ÑÐ¾Ð·Ð´Ð°Ð²Ð°Ñ ÑƒÐ½Ð¸ÐºÐ°Ð»ÑŒÐ½Ñ‹Ð¹ 'Ð¾Ñ‚Ð¿ÐµÑ‡Ð°Ñ‚Ð¾Ðº' Ð»Ð¸Ñ‡Ð½Ð¾ÑÑ‚Ð¸.</p>
                                </div>
                            </div>
                        </div>
                        <div class="methodology-visual">
                            <div class="holo-circle"></div>
                            <div class="holo-circle delayed"></div>
                        </div>
                    </div>
                </section>

                <section class="value-section">
                    <h2 class="section-title" data-i18n="valueTitle">Ð—Ð°Ñ‡ÐµÐ¼ ÑÑ‚Ð¾ Ð²Ð°Ð¼?</h2>
                    <div class="value-grid">
                        <div class="value-card">
                            <div class="value-icon"><span class="material-symbols-rounded" aria-hidden="true">rocket_launch</span></div>
                            <h3 data-i18n="valueCareerTitle">ÐšÐ°Ñ€ÑŒÐµÑ€Ð½Ñ‹Ð¹ Ð½Ð°Ð²Ð¸Ð³Ð°Ñ‚Ð¾Ñ€</h3>
                            <p data-i18n="valueCareerText">ÐŸÐ¾Ð¹Ð¼Ð¸Ñ‚Ðµ, Ð³Ð´Ðµ Ð²Ð°ÑˆÐ¸ Ð¿Ñ€Ð¸Ñ€Ð¾Ð´Ð½Ñ‹Ðµ Ñ‚Ð°Ð»Ð°Ð½Ñ‚Ñ‹ Ñ€Ð°ÑÐºÑ€Ð¾ÑŽÑ‚ÑÑ Ð¼Ð°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð¾: Ð² ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ð¸, Ñ‚Ð²Ð¾Ñ€Ñ‡ÐµÑÑ‚Ð²Ðµ, Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐµ Ð¸Ð»Ð¸ Ð¿Ñ€ÐµÐ´Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°Ñ‚ÐµÐ»ÑŒÑÑ‚Ð²Ðµ.</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon"><span class="material-symbols-rounded" aria-hidden="true">lightbulb</span></div>
                            <h3 data-i18n="valueRelTitle">ÐŸÐ¾Ð½Ð¸Ð¼Ð°Ð½Ð¸Ðµ ÑÐµÐ±Ñ</h3>
                            <p data-i18n="valueRelText">Ð£Ð·Ð½Ð°Ð¹Ñ‚Ðµ ÑÐ²Ð¾Ð¸ Ð¸ÑÑ‚Ð¸Ð½Ð½Ñ‹Ðµ Ð´Ñ€Ð°Ð¹Ð²ÐµÑ€Ñ‹: Ð¿Ð¾Ñ‡ÐµÐ¼Ñƒ Ð²Ñ‹ Ð´ÐµÐ¹ÑÑ‚Ð²ÑƒÐµÑ‚Ðµ Ð¸Ð¼ÐµÐ½Ð½Ð¾ Ñ‚Ð°Ðº? Ð§Ñ‚Ð¾ Ð²Ð°Ñ Ð¼Ð¾Ñ‚Ð¸Ð²Ð¸Ñ€ÑƒÐµÑ‚, Ð° Ñ‡Ñ‚Ð¾ Ð·Ð°Ð±Ð¸Ñ€Ð°ÐµÑ‚ ÑÐ½ÐµÑ€Ð³Ð¸ÑŽ?</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon"><span class="material-symbols-rounded" aria-hidden="true">trending_up</span></div>
                            <h3 data-i18n="valueGrowthTitle">Ð¢Ð¾Ñ‡ÐºÐ¸ Ñ€Ð¾ÑÑ‚Ð°</h3>
                            <p data-i18n="valueGrowthText">ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½ÑƒÑŽ ÐºÐ°Ñ€Ñ‚Ñƒ Ñ€Ð°Ð·Ð²Ð¸Ñ‚Ð¸Ñ Ñ ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ñ‹Ð¼Ð¸ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸ÑÐ¼Ð¸ Ð¿Ð¾ soft skills, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ ÑƒÑÐ¸Ð»ÑÑ‚ Ð²Ð°ÑˆÑƒ Ð»Ð¸Ñ‡Ð½Ð¾ÑÑ‚ÑŒ.</p>
                        </div>
                    </div>
                </section>

                <section class="how-it-works-section" aria-labelledby="how-it-works-title">
                    <h2 id="how-it-works-title" class="section-title" data-i18n="howItWorksTitle">ÐšÐ°Ðº ÑÑ‚Ð¾ Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÑ‚</h2>
                    <div class="steps-container">
                        <div class="step">
                            <div class="step-number" aria-hidden="true">1</div>
                            <h3 data-i18n="step1Title">ÐŸÑ€Ð¾Ñ…Ð¾Ð´Ð¸Ñ‚Ðµ Ñ‚ÐµÑÑ‚</h3>
                            <p data-i18n="step1Desc">ÐžÑ‚Ð²ÐµÑ‚ÑŒÑ‚Ðµ Ð½Ð° 12 ÑÑ†ÐµÐ½Ð°Ñ€Ð½Ñ‹Ñ… Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ¾Ð², Ð²Ñ‹Ð±Ð¸Ñ€Ð°Ñ Ð±Ð»Ð¸Ð·ÐºÐ¸Ðµ Ð²Ð°Ð¼ Ð²Ð°Ñ€Ð¸Ð°Ð½Ñ‚Ñ‹ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ð¹.</p>
                        </div>
                        <div class="step-arrow" aria-hidden="true">&rarr;</div>
                        <div class="step">
                            <div class="step-number" aria-hidden="true">2</div>
                            <h3 data-i18n="step2Title">ÐÐ»Ð³Ð¾Ñ€Ð¸Ñ‚Ð¼ ÑÑ‡Ð¸Ñ‚Ð°ÐµÑ‚</h3>
                            <p data-i18n="step2Desc">Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð° Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐµÑ‚ Ð²Ð°ÑˆÐ¸ Ð¾Ñ‚Ð²ÐµÑ‚Ñ‹ Ð¿Ð¾ 6 ÐºÐ»ÑŽÑ‡ÐµÐ²Ñ‹Ð¼ Ð¸Ð·Ð¼ÐµÑ€ÐµÐ½Ð¸ÑÐ¼ Ð»Ð¸Ñ‡Ð½Ð¾ÑÑ‚Ð¸.</p>
                        </div>
                        <div class="step-arrow" aria-hidden="true">&rarr;</div>
                        <div class="step">
                            <div class="step-number" aria-hidden="true">3</div>
                            <h3 data-i18n="step3Title">ÐŸÐ¾Ð»ÑƒÑ‡Ð°ÐµÑ‚Ðµ Ð¿Ñ€Ð¾Ñ„Ð¸Ð»ÑŒ</h3>
                            <p data-i18n="step3Desc">Ð”ÐµÑ‚Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð¾Ñ‚Ñ‡ÐµÑ‚ Ð¸ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸Ð¸ Ð¿Ð¾ Ñ€Ð°Ð·Ð²Ð¸Ñ‚Ð¸ÑŽ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹ Ð¼Ð³Ð½Ð¾Ð²ÐµÐ½Ð½Ð¾.</p>
                        </div>
                    </div>
                </section>

                <section class="cta-section" aria-label="${this.i18n.t('ctaTitle') || 'Call to action'}">
                    <div class="cta-content">
                        <h2 data-i18n="ctaTitle">ÐžÑ‚ÐºÑ€Ð¾Ð¹Ñ‚Ðµ ÑÐ²Ð¾Ð¹ Ð²Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½Ð¸Ð¹ Ð¼Ð¸Ñ€</h2>
                        <p data-i18n="ctaText">ÐŸÑ€Ð¾Ð¹Ð´Ð¸Ñ‚Ðµ Ñ‚ÐµÑÑ‚ Ð·Ð° 5-7 Ð¼Ð¸Ð½ÑƒÑ‚ Ð¸ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ Ð´ÐµÑ‚Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· Ð²Ð°ÑˆÐµÐ¹ Ð»Ð¸Ñ‡Ð½Ð¾ÑÑ‚Ð¸ Ñ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¼Ð¸ Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð°Ñ†Ð¸ÑÐ¼Ð¸.</p>
                        <div id="cta-actions">
                            <button class="btn btn-primary btn-xl pulse-animation" onclick="app.showTestTypeSelection()">
                                <span class="material-symbols-rounded" aria-hidden="true">play_arrow</span>
                                <span data-i18n="startTest">ÐÐ°Ñ‡Ð°Ñ‚ÑŒ Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    showIntro() {
        this.app.state = 'intro';
        this.clearView(); // Ensure previous views are destroyed
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
            console.error('ÐŸÑ€Ð¾Ð³Ñ€ÐµÑÑ‚Ñ– Ñ‚ÐµÐºÑÐµÑ€Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error checking progress)', e);
        }

        // Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ð²ÑÑ‚Ñ€Ð¾ÐµÐ½Ð½Ñ‹Ð¹ ÑˆÐ°Ð±Ð»Ð¾Ð½ (DOM Virtualization)
        container.innerHTML = this.getLandingTemplateHTML();

        // ÐžÐ±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Ñ‚ÐµÐºÑÑ‚Ñ‹ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¼ ÑÐ·Ñ‹ÐºÐ¾Ð¼
        this.updateStaticContent();

        // === 1. ÐžÐ±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Hero Section Ð² Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚Ð¸ Ð¾Ñ‚ ÑÑ‚Ð°Ñ‚ÑƒÑÐ° ===
        const heroContent = container.querySelector('.hero-content');
        if (heroContent) {
            if (user) {
                // ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ Ð²Ð¾ÑˆÐµÐ» â€” ÐµÐ´Ð¸Ð½Ñ‹Ð¹ Ð¿Ñ€Ð¸Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ð¹ Ñ‡Ð¸Ð¿
                const heroTitle = heroContent.querySelector('.hero-title');
                if (heroTitle) {
                    const escapedUsername = this.escapeHTML(user.username);
                    const welcomeEl = document.createElement('div');
                    welcomeEl.className = 'hero-welcome fade-in';
                    welcomeEl.style.cssText = 'display: inline-flex; align-items: center; gap: 0.5rem; font-size: 1.15rem; font-weight: 500; opacity: 0.8; margin-bottom: 0.75rem; padding: 0.4rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 50px; color: #10b981;';
                    welcomeEl.innerHTML = `<span class="material-symbols-rounded" style="font-size: 1.2rem;">waving_hand</span> ${t('welcomeBack') || 'Welcome back'}, <strong>${escapedUsername}</strong>!`;
                    heroTitle.parentNode.insertBefore(welcomeEl, heroTitle);
                }
            } else {
                // Ð“Ð¾ÑÑ‚ÑŒ â€” Ð±ÐµÐ¹Ð´Ð¶ ÑÑ‚Ð°Ñ‚ÑƒÑÐ°
                const badge = document.createElement('div');
                badge.className = 'auth-status-badge guest';
                badge.innerHTML = `
                        <span class="material-symbols-rounded">account_circle</span>
                        ${t('guestMode') || 'Guest mode'}
                    `;
                heroContent.insertBefore(badge, heroContent.firstChild);
            }
        }

        // === 2. ÐžÐ±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ ÐºÐ½Ð¾Ð¿ÐºÐ¸ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ð¹ ===
        const actionsContainer = container.querySelector('#landing-actions');

        if (actionsContainer) {
            let buttonsHtml = '';

            if (user) {
                // Ð”Ð»Ñ Ð°Ð²Ñ‚Ð¾Ñ€Ð¸Ð·Ð¾Ð²Ð°Ð½Ð½Ð¾Ð³Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
                if (hasProgress) {
                    buttonsHtml += `
                            <button class="btn btn-primary btn-lg pulse-animation" onclick="app.continueTest()">
                                <span class="material-symbols-rounded">play_arrow</span>
                                ${t('continueTest') || 'Continue test'}
                            </button>
                        `;
                } else {
                    buttonsHtml += `
                            <button class="btn btn-primary btn-lg pulse-animation" onclick="app.showTestTypeSelection()">
                                <span class="material-symbols-rounded">play_arrow</span>
                                ${t('startTest') || 'Start test'}
                            </button>
                        `;
                }
                // Ð”Ð¾Ð¿. ÐºÐ½Ð¾Ð¿ÐºÐ° Ð¿Ñ€Ð¾Ñ„Ð¸Ð»Ñ
                buttonsHtml += `
                        <a href="profile.html" class="btn btn-secondary btn-lg">
                            <span class="material-symbols-rounded">person</span>
                            ${t('myProfile') || 'My profile'}
                        </a>
                    `;
            } else {
                // Ð”Ð»Ñ Ð³Ð¾ÑÑ‚Ñ
                if (hasProgress) {
                    buttonsHtml += `
                            <button class="btn btn-primary btn-lg pulse-animation" onclick="app.continueTest()">
                                <span class="material-symbols-rounded">play_arrow</span>
                                ${t('continueTest') || 'Continue'}
                            </button>
                        `;
                } else {
                    buttonsHtml += `
                            <button class="btn btn-primary btn-lg pulse-animation" onclick="app.showTestTypeSelection()">
                                <span class="material-symbols-rounded">science</span>
                                ${t('startTest') || 'Start test'}
                            </button>
                        `;
                }

                // ÐšÐ½Ð¾Ð¿ÐºÐ¸ Ð²Ñ…Ð¾Ð´Ð°/Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¸
                buttonsHtml += `
                        <button class="btn btn-secondary btn-lg" onclick="app.showAuth()">
                            <span class="material-symbols-rounded">login</span>
                            ${t('login') || 'Sign in'}
                        </button>
                    `;
            }

            actionsContainer.innerHTML = buttonsHtml;

            // Ð¢Ð°ÐºÐ¶Ðµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Ð½Ð¸Ð¶Ð½Ð¸Ð¹ CTA Ð±Ð»Ð¾Ðº
            const ctaActionsContainer = container.querySelector('#cta-actions');
            if (ctaActionsContainer) {
                if (hasProgress) {
                    ctaActionsContainer.innerHTML = `
                            <div class="cta-actions-group">
                                <button class="btn btn-primary btn-xl pulse-animation" onclick="app.continueTest()">
                                    <span class="material-symbols-rounded">play_arrow</span>
                                    ${t('continueTest') || 'Continue test'}
                                </button>
                                <button class="btn btn-secondary btn-xl" onclick="app.showTestTypeSelection()">
                                    <span class="material-symbols-rounded">refresh</span>
                                    ${t('startNewTest') || 'Start over'}
                                </button>
                            </div>
                         `;
                } else {
                    ctaActionsContainer.innerHTML = `
                            <button class="btn btn-primary btn-xl pulse-animation" onclick="app.showTestTypeSelection()">
                                <span class="material-symbols-rounded">play_arrow</span>
                                ${t('startTest') || 'Start testing'}
                            </button>
                         `;
                }
            }
        }

        // ÐŸÐ»Ð°Ð²Ð½Ð¾Ðµ Ð¿Ð¾ÑÐ²Ð»ÐµÐ½Ð¸Ðµ
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
                <h2>${t('converterTitle') || 'Report Converter'}</h2>
                <p>${t('converterDescription') || 'Upload a JSON file with test results to convert it into other formats.'}</p>
                
                <div class="converter-upload-area" id="dropZone">
                    <input type="file" id="jsonFileInput" accept=".json" style="display: none" onchange="app.ui.handleFileSelect(event)">
                    <button class="btn btn-secondary" onclick="document.getElementById('jsonFileInput').click()">
                        <span class="material-symbols-rounded">upload_file</span>
                        ${t('chooseFile') || 'Choose file'}
                    </button>
                    <p style="margin-top: 10px; font-size: 0.9em; color: var(--text-secondary);">${t('orDragHere') || 'or drag it here'}</p>
                    <div id="fileNameDisplay" style="margin-top: 10px; font-weight: bold;"></div>
                </div>

                <div id="converterActions" style="display: none; margin-top: 20px;">
                    <h3>${t('downloadAs') || 'Download as:'}</h3>
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
        const t = this.i18n.t.bind(this.i18n);

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            display.textContent = t('selectJsonFile') || 'Select a .json file';
            display.style.color = 'red';
            actions.style.display = 'none';
            return;
        }

        display.textContent = `${t('selectedFile') || 'Selected'}: ${file.name}`;
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
                    throw new Error(t('invalidReportFormat') || 'Invalid report file format');
                }

                actions.style.display = 'block';
                status.textContent = t('fileReadSuccess') || 'File loaded successfully. Choose a format for conversion.';
                status.style.color = 'green';

                // Store original filename for export naming
                this.loadedFilenameBase = file.name.replace('.json', '');

            } catch (error) {
                console.error('File parse error:', error);
                status.textContent = `${t('fileReadError') || 'Error reading file'}: ${error.message}`;
                status.style.color = 'red';
                actions.style.display = 'none';
            }
        };
        reader.readAsText(file);
    }

    convertAndDownload(format) {
        if (!this.loadedReportData) return;

        const status = document.getElementById('conversionStatus');

        // ReportGenerator has been removed
        status.textContent = 'Report generation feature has been removed.';
        status.style.color = 'var(--text-secondary)';
        alert(this.i18n.t('exportNotAvailable') || 'HTML/PDF export is not available.');
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
            console.error('ÐŸÑ€Ð¾Ð³Ñ€ÐµÑÑ‚Ñ– Ñ‚ÐµÐºÑÐµÑ€Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error checking progress)', e);
        }

        // Fallbacks provided directly in template literal for better readability
        container.innerHTML = `
            <div class="test-selection-screen">
                <h1>${t('selectTestType') || 'Choose a test type'}</h1>
                <p class="subtitle">${t('testTypeDescription') || 'Choose the testing mode that fits you best'}</p>
                
                ${hasProgress ? `
                    <div class="continue-test-banner">
                        <div class="banner-content">
                            <span class="material-symbols-rounded">history</span>
                            <div class="banner-text">
                                <h3>${t('unfinishedTest') || 'You have an unfinished test'}</h3>
                                <p>${t('continueOrStartNew') || 'You can continue where you left off or start a new test'}</p>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-lg pulse-animation" onclick="app.continueTest()">
                            <span class="material-symbols-rounded">play_arrow</span>
                            ${t('continueTest') || 'Continue test'}
                        </button>
                    </div>
                ` : ''}
                
                <div class="test-type-cards">
                    <div class="test-type-card" onclick="app.startBasicTest()">
                        <div class="test-type-icon"><span class="material-symbols-rounded">bolt</span></div>
                        <h2>${t('basicTest') || 'Quick test'}</h2>
                        <div class="test-type-info">
                            <p class="test-count">${t('questionsCount') || 'Questions'}: <strong>12</strong></p>
                            <p class="test-time">${t('estimatedTime') || 'Time'}: <strong>~15 ${t('minutes') || 'minutes'}</strong></p>
                        </div>
                        <div class="test-type-description">
                            <p>${t('basicTestDescription') || 'A concise scenario-based test for a baseline personality profile.'}</p>
                            <ul>
                                <li>${t('basicTestFeature1') || '12 choice scenarios'}</li>
                                <li>${t('basicTestFeature2') || 'Baseline profile analysis'}</li>
                                <li>${t('basicTestFeature3') || 'Growth recommendations'}</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary">${t('startBasicTest') || 'Start quick test'}</button>
                    </div>
                    
                    <div class="test-type-card advanced" onclick="app.startAdvancedTest()">
                        <div class="test-type-icon"><span class="material-symbols-rounded">biotech</span></div>
                        <h2>${t('advancedTest') || 'Advanced test'}</h2>
                        <div class="test-type-badge">${t('mostAccurate') || 'Most accurate'}</div>
                        <div class="test-type-info">
                            <p class="test-count">${t('questionsCount') || 'Questions'}: <strong>36</strong> <span style="font-size: 0.8em; opacity: 0.8;">(${t('exactQuantity') || 'exact count'})</span></p>
                            <p class="test-time">${t('estimatedTime') || 'Time'}: <strong>~45-60 ${t('minutes') || 'minutes'}</strong></p>
                        </div>
                        <div class="test-type-description">
                            <p>${t('advancedTestDescription') || 'A deeper assessment with multiple question formats for maximum accuracy.'}</p>
                            <ul>
                                <li>${t('advancedTestFeature1') || 'Scenarios, scales, and open-ended questions'}</li>
                                <li>${t('advancedTestFeature2') || 'Situational tasks'}</li>
                                <li>${t('advancedTestFeature3') || 'Detailed analysis'}</li>
                                <li>${t('advancedTestFeature4') || 'Statistical reliability'}</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary">${t('startAdvancedTest') || 'Start advanced test'}</button>
                    </div>

                    <div class="test-type-card cognitive" onclick="app.startCognitiveTest()">
                        <div class="test-type-icon"><span class="material-symbols-rounded">neurology</span></div>
                        <h2>${t('cognitiveTest') || 'Cognitive style'}</h2>
                        <div class="test-type-info">
                            <p class="test-count">${t('questionsCount') || 'Questions'}: <strong>15</strong></p>
                            <p class="test-time">${t('estimatedTime') || 'Time'}: <strong>~10 ${t('minutes') || 'minutes'}</strong></p>
                        </div>
                        <div class="test-type-description">
                            <p>${t('cognitiveTestDescription') || 'Identify your preferred learning and thinking style'}</p>
                            <ul>
                                <li>${t('cognitiveFeature1') || 'Visual, auditory, and kinesthetic patterns'}</li>
                                <li>${t('cognitiveFeature2') || 'Learning tips'}</li>
                                <li>${t('cognitiveFeature3') || 'Personalized approach'}</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary">${t('startCognitiveTest') || 'Start test'}</button>
                    </div>
                </div>
                
                <div class="test-selection-actions">
                    <button class="btn btn-secondary" onclick="app.showIntro()">${t('back') || 'Back'}</button>
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
        const t = this.i18n.t.bind(this.i18n);

        container.innerHTML = `
            <div class="error-screen">
                <h1>${t('appLoadErrorTitle') || 'Application load error'}</h1>
                <p class="error-message">
                    ${t('appLoadErrorMissing', { components: missingList }) || `Failed to load the required components: ${missingList}`}
                </p>
                <p class="error-description">
                    ${t('appLoadErrorDescription') || 'Please refresh the page. If the problem persists, make sure all files loaded correctly.'}
                </p>
                <button class="btn btn-primary" onclick="location.reload()">${t('reloadPage') || 'Reload page'}</button>
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
                    <p class="loading-text" style="font-size: 1.1rem; margin-top: 1.5rem;">${t('processingResults') || 'Processing results...'}</p>
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
                        <button class="btn-home" onclick="app.showIntro()" title="${t('home')}"><span class="material-symbols-rounded">home</span></button>
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
                             <h2><span class="material-symbols-rounded">smart_toy</span> ${t('aiAnalysisTitle') || 'AI Analysis'}</h2>
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
                    <h3><span class="material-symbols-rounded">target</span> ${t('personalityType')}</h3>
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
            html += `<div class="ai-section"><h3><span class="material-symbols-rounded">lightbulb</span> ${t('insights')}</h3><div class="insights-list">`;
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

        // Initialize selected tests tracking for batch delete
        if (!this.selectedTests) {
            this.selectedTests = new Set();
        }
        this.selectedTests.clear(); // Reset selection on profile view

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
                            <h2 class="card-title"><span class="material-symbols-rounded">trending_up</span> ${t('evolutionProgress') || 'Development progress'}</h2>
                        </div>
                        <div class="card-body">
                            <div style="height: 300px; width: 100%; position: relative;">
                                <canvas id="evolutionChart" class="crisp-chart"></canvas>
                            </div>
                            ${evolutionReport && (evolutionReport.insights || evolutionReport.recommendations) ? `
                                <div class="evolution-insights mt-8">
                                    <h3 class="text-lg font-semibold mb-4">${t('keyInsights') || 'Key insights'}</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        ${evolutionReport.insights ? evolutionReport.insights.slice(0, 2).map(insight => `
                                            <div class="insight-card ${insight.type || 'neutral'}" style="background: rgba(var(--primary-rgb), 0.05); padding: 1.25rem; border-radius: 12px; border-left: 4px solid var(--primary-color);">
                                                <h4 style="margin: 0 0 0.75rem 0; color: var(--primary-color);">${insight.title}</h4>
                                                <p style="margin: 0; font-size: 0.95rem; opacity: 0.9; line-height: 1.5; text-align: justify;">${insight.text}</p>
                                            </div>
                                        `).join('') : ''}
                                        
                                        ${evolutionReport.recommendations ? evolutionReport.recommendations.slice(0, 2).map(rec => `
                                            <div class="insight-card ${rec.type === 'leverage' ? 'positive' : 'attention'}" style="background: rgba(var(--primary-rgb), 0.05); padding: 1.25rem; border-radius: 12px; border-left: 4px solid ${rec.type === 'leverage' ? '#10b981' : '#f59e0b'};">
                                                <h4 style="margin: 0 0 0.75rem 0; color: ${rec.type === 'leverage' ? '#10b981' : '#f59e0b'};">
                                                    ${rec.type === 'leverage'
                                                        ? '<span class="material-symbols-rounded" style="font-size: 1rem; vertical-align: text-bottom;">north_east</span> ' + (t('keepItUp') || 'Keep it up!')
                                                        : '<span class="material-symbols-rounded" style="font-size: 1rem; vertical-align: text-bottom;">warning</span> ' + (t('payAttention') || 'Pay attention')}
                                                </h4>
                                                <p style="margin: 0; font-size: 0.95rem; opacity: 0.9; line-height: 1.5; text-align: justify;">${rec.text}</p>
                                            </div>
                                        `).join('') : ''}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- Profile Extensions: Comparative Analysis, Goals, AI Advisor -->
                    <div id="profileExtensionsContainer">
                        ${window.profileExtensions ? window.profileExtensions.getAllSections() : ''}
                    </div>
                    
                    <!-- History List -->
                    <div class="cosmic-card">
                        <div class="card-header">
                             <h2 class="card-title">${t('testHistory')}</h2>
                        </div>
                        <div class="card-body">
                            ${(() => {
                const cogRes = this.app.storage ? this.app.storage.loadCognitiveResults() : null;
                const hasHistory = history.length > 0;
                const hasCognitive = !!cogRes;

                if (!hasHistory && !hasCognitive) {
                    return `
                                        <div class="empty-state">
                                            <span class="material-symbols-rounded empty-icon">history</span>
                                            <p>${t('noHistory')}</p>
                                            <button class="btn btn-primary btn-sm mt-4" onclick="app.showTestTypeSelection()">
                                                ${t('startTest')}
                                            </button>
                                        </div>
                                    `;
                }

                let itemsHTML = '';

                // === Unified helper: render one history item ===
                const renderItem = (id, title, dateStr, subtitle, extraInfo) => `
                    <div class="history-item" data-test-id="${id}" style="display:flex; align-items:center; gap:12px; flex-wrap:nowrap; padding: 10px 12px 10px 20px;">
                    <div class="test-checkbox-wrapper">
                        <input type="checkbox" id="history-test-${id}" name="selectedTests" class="test-checkbox" data-test-id="${id}">
                        <span class="test-checkbox-custom"></span>
                    </div>
                        <div class="history-info" style="flex:1; min-width:0;">
                            <h3 class="font-bold text-lg m-0" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${title}</h3>
                            <span class="text-sm text-secondary">${dateStr}${subtitle ? ' &bull; <span class="text-primary">' + subtitle + '</span>' : ''}</span>
                            ${extraInfo ? `<span class="text-xs" style="opacity:0.5;">${extraInfo}</span>` : ''}
                        </div>
                        <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
                            <button class="btn btn-ghost btn-sm test-rename-btn" data-test-id="${id}" title="${t('rename') || 'Rename'}" style="border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:4px 8px;"><span class="material-symbols-rounded" style="font-size: 1rem;">edit</span></button>
                            <button class="btn btn-ghost btn-sm text-red-500 test-delete-btn" data-test-id="${id}" title="${t('deleteTest') || 'Delete'}" style="border:1px solid rgba(255,80,80,0.3); border-radius:8px; padding:4px 8px;"><span class="material-symbols-rounded" style="font-size: 1rem;">delete</span></button>
                            <button class="btn btn-secondary btn-sm test-view-btn" data-test-id="${id}">${t('viewResults')}</button>
                        </div>
                    </div>`;

                // Cognitive test item
                if (hasCognitive) {
                    const cr = this.app.storage.loadCognitiveResults();
                    if (cr) {
                        const d = new Date(cr.timestamp);
                        const dateStr = isNaN(d) ? new Date().toLocaleDateString() : d.toLocaleDateString();
                        const title = cr.title || cr.dominant || `${t('testNumber')} ${history.length + 1}`;
                        const subtitle = t('cognitiveTest');
                        itemsHTML += renderItem('cognitive', title, dateStr, subtitle, null);
                    }
                }

                // Regular test items
                itemsHTML += history.map((test, index) => {
                    const title = test.title || `${t('testNumber')} ${history.length - index}`;
                    const dateStr = new Date(test.date).toLocaleDateString();
                    return renderItem(test.id || String(index), title, dateStr, null, null);
                }).join('');

                return `
                                    <!-- Batch Delete Controls -->
                                    <div class="test-history-controls" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 1rem;">
                                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                        <div class="test-checkbox-wrapper">
                                            <input type="checkbox" id="selectAllTests" class="test-checkbox-all">
                                            <span class="test-checkbox-custom"></span>
                                        </div>
                                            <span>${t('selectAll') || 'Select all'}</span>
                                        </label>
                                        <button class="btn btn-danger btn-sm" id="deleteSelectedBtn" style="display: none;">
                                            <span class="material-symbols-rounded" style="font-size: 1rem; vertical-align: text-bottom;">delete</span> ${t('deleteSelected') || 'Delete selected'} (<span id="selectedCount">0</span>)
                                        </button>
                                    </div>
                                    <div class="history-list">
                                        ${itemsHTML}
                                    </div>
                                `;
            })()
            }
                        </div >
                    </div >
                </div >
            </div >
            `;

        if (showEvolution) {
            // Use requestAnimationFrame to coordinate with browser render cycle
            requestAnimationFrame(() => {
                this.renderEvolutionChart(evolutionHistory);
                // Chart.js with responsive:true handles resize via ResizeObserver
            });
        }
        this.focusHeading();

        // Add event delegation for test history buttons
        // Reuse container variable from line 1514
        if (container) {
            // Remove existing listeners to avoid duplicates
            // Unified click handler â€” all tests use data-test-id
            this.handleTestHistoryClick = (e) => {
                const target = e.target.closest('button');
                if (!target) return;

                const id = target.dataset.testId;
                if (!id) return;
                e.preventDefault();

                if (target.classList.contains('test-delete-btn')) {
                    if (id === 'cognitive') this.app.deleteCognitiveTest(target);
                    else this.app.deleteTest(id, target);

                } else if (target.classList.contains('test-rename-btn')) {
                    if (id === 'cognitive') this.app.renameCognitiveTest(target);
                    else this.app.renameTest(id);

                } else if (target.classList.contains('test-view-btn')) {
                    if (id === 'cognitive') {
                        this.app.showCognitiveResults(this.app.storage.loadCognitiveResults());
                    } else {
                        const idx = this.app.auth
                            ? this.app.auth.getTestHistory().findIndex(t => t.id === id)
                            : parseInt(id);
                        if (idx !== -1 && !isNaN(idx)) this.app.viewTestResults(idx);
                    }
                }
            };
            container.addEventListener('click', this.handleTestHistoryClick);

            // Checkbox â€” all use data-test-id
            const testCheckboxes = document.querySelectorAll('.test-checkbox');
            testCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const id = e.target.dataset.testId;
                    if (!id) return;
                    if (e.target.checked) {
                        this.selectedTests.add(id);
                    } else {
                        this.selectedTests.delete(id);
                    }
                    this.updateBatchDeleteUI();
                });
            });

            // Batch delete controls
            const selectAllCheckbox = document.getElementById('selectAllTests');
            const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

            // Handle "Select All" checkbox
            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    console.log('Select All clicked:', checked, 'Total checkboxes:', testCheckboxes.length);
                    testCheckboxes.forEach(cb => {
                        cb.checked = checked;
                        const id = cb.dataset.testId;
                        if (checked) {
                            this.selectedTests.add(id);
                        } else {
                            this.selectedTests.delete(id);
                        }
                    });
                    this.updateBatchDeleteUI();
                });
            }

            // Handle "Delete Selected" button
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', () => {
                    const indices = Array.from(this.selectedTests);
                    console.log('Delete selected clicked:', indices);
                    this.app.deleteSelectedTests(indices, deleteSelectedBtn);
                });
            }
        }

        // Initialize batch delete UI state and Profile Extensions
        this.updateBatchDeleteUI();
    }

    /**
     * Update batch delete UI (button visibility and counter)
     */
    updateBatchDeleteUI() {
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        const selectedCount = document.getElementById('selectedCount');
        const selectAllCheckbox = document.getElementById('selectAllTests');
        const testCheckboxes = document.querySelectorAll('.test-checkbox');

        if (deleteSelectedBtn && selectedCount) {
            const count = this.selectedTests.size;
            selectedCount.textContent = count;
            deleteSelectedBtn.style.display = count > 0 ? 'block' : 'none';

            // Update history items visual state
            testCheckboxes.forEach(checkbox => {
                const id = checkbox.dataset.testId;
                const historyItem = checkbox.closest('.history-item');
                if (historyItem) {
                    if (this.selectedTests.has(id)) {
                        historyItem.classList.add('selected');
                    } else {
                        historyItem.classList.remove('selected');
                    }
                }
            });

            // Update "Select All" checkbox state
            if (selectAllCheckbox && testCheckboxes.length > 0) {
                selectAllCheckbox.checked = this.selectedTests.size === testCheckboxes.length;
                selectAllCheckbox.indeterminate = this.selectedTests.size > 0 && this.selectedTests.size < testCheckboxes.length;
            }
        }

        // Initialize profile extensions (Comparative Analysis chart, etc.)
        if (window.profileExtensions && typeof window.profileExtensions.initAfterRender === 'function') {
            window.profileExtensions.initAfterRender();
        }
    }

    /**
     * Render Evolution Chart using Chart.js
     * @param {Object} history - Evolution history data
     */
    renderEvolutionChart(history) {
        const t = (key) => (window.t ? window.t(key) : key);
        const ctx = document.getElementById('evolutionChart');

        // Retry mechanism for Chart.js
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not ready, retrying in 500ms...');
            setTimeout(() => this.renderEvolutionChart(history), 500);
            return;
        }

        if (!ctx || !history || !history.sessions) return;

        // 1. Limit to last 10 sessions to prevent overcrowding
        const recentSessions = history.sessions.slice(-10);

        // Define labels for the X-axis (Dates)
        const labels = recentSessions.map((s, i) => {
            if (s.date) {
                try {
                    return new Date(s.date).toLocaleDateString(this.i18n.currentLang || 'ru', {
                        day: 'numeric',
                        month: 'short'
                    });
                } catch (e) {
                    return `Test ${i + 1} `;
                }
            }
            return `Test ${i + 1} `;
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
                    label: t(dim + 'Name') || dim,
                    data: data,
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: colors[colorIndex % colors.length],
                    tension: 0.3,
                    borderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    pointBackgroundColor: document.body.classList.contains('dark-theme') ? '#1a1a2e' : '#ffffff',
                    pointBorderWidth: 2,
                    fill: false
                });
                colorIndex++;
            }
        });

        // Theme colors
        const isLight = !document.body.classList.contains('dark-theme');
        const textColor = isLight ? '#4b5563' : '#e2e8f0';
        const tickColor = isLight ? '#6b7280' : '#94a3b8';
        const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
        const tooltipBg = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)';
        const tooltipTitle = isLight ? '#111827' : '#fff';
        const tooltipBody = isLight ? '#374151' : '#e2e8f0';

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
                animation: { duration: 0 },
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
                            color: textColor,
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 13, family: "'Inter', sans-serif" }
                        }
                    },
                    tooltip: {
                        backgroundColor: tooltipBg,
                        titleColor: tooltipTitle,
                        bodyColor: tooltipBody,
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { size: 14, weight: 'bold' },
                        displayColors: true,
                        callbacks: {
                            label: function (context) {
                                return ` ${context.dataset.label}: ${context.parsed.y > 0 ? '+' : ''}${Math.round(context.parsed.y)}% `;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: -100,
                        max: 100,
                        grid: {
                            color: gridColor,
                        },
                        ticks: {
                            color: tickColor,
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
                            color: tickColor,
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
     * @param {HTMLElement} options.triggerElement - Element that triggered the modal (for positioning)
     */
    showModal({ title, content, actions = [], closeOnOutsideClick = true, icon = null, type = 'default', id = 'genericModal', overlayClass = 'modal-overlay', triggerElement = null }) {
        let modal = document.getElementById(id);

        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = id;
        modal.className = `${overlayClass} modal-type-${type} active`;

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

        // Calculate position if trigger element is provided
        let positionStyle = '';
        if (triggerElement) {
            const rect = triggerElement.getBoundingClientRect();
            const modalWidth = 500; // max-width from CSS
            const modalHeight = 250; // approximate modal height
            const spacing = 15; // spacing from button

            // Calculate initial position next to the button
            let top = rect.top + window.scrollY;
            let left = rect.right + spacing + window.scrollX;

            // Check if modal would go off-screen to the right
            if (left + modalWidth > window.innerWidth) {
                // Try positioning to the left of the button
                left = rect.left + window.scrollX - modalWidth - spacing;

                // If still doesn't fit, center it horizontally
                if (left < 0) {
                    left = Math.max(10, (window.innerWidth - modalWidth) / 2);
                }
            }

            // Vertical positioning: center modal vertically relative to the button
            top = rect.top + window.scrollY + (rect.height / 2) - (modalHeight / 2);

            // Make sure modal doesn't go above viewport
            if (top < window.scrollY + 10) {
                top = window.scrollY + 10;
            }

            // Make sure modal doesn't go below viewport
            if (top + modalHeight > window.scrollY + window.innerHeight - 10) {
                top = window.scrollY + window.innerHeight - modalHeight - 10;
            }

            console.log('ðŸŽ¯ Modal positioning:', {
                buttonRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                calculatedTop: top,
                calculatedLeft: left,
                scrollY: window.scrollY,
                scrollX: window.scrollX,
                windowSize: { width: window.innerWidth, height: window.innerHeight }
            });

            modal.classList.add('modal-positioned');
            // Apply position directly as inline styles instead of CSS variables
            positionStyle = `style = "position: absolute !important; top: ${top}px !important; left: ${left}px !important; transform: translate(0, 0) !important; margin: 0 !important;"`;
        }

        modal.innerHTML = `
            <div class="modal-content glass" ${positionStyle}>
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
            title: title || t('attention') || 'Attention',
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
     * @param {HTMLElement} triggerElement - Element that triggered this confirmation
     */
    showConfirm(message, onConfirm, onCancel = null, triggerElement = null) {
        const t = this.i18n.t.bind(this.i18n);
        this.showModal({
            title: t('confirmation') || 'Confirmation',
            content: `<p>${message}</p>`,
            triggerElement: triggerElement,
            actions: [
                {
                    text: t('cancel') || 'Cancel',
                    class: 'btn-secondary',
                    onClick: () => { if (onCancel) onCancel(); }
                },
                {
                    text: t('confirm') || 'Confirm',
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
     * @param {string} title - Optional title
     */
    showPrompt(message, defaultValue = '', onSubmit, title = null) {
        const t = this.i18n.t.bind(this.i18n);
        const inputId = 'promptInput';

        let displayTitle = title;

        // Ð•ÑÐ»Ð¸ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²Ð¾Ðº - ÑÑ‚Ð¾ ÐºÐ»ÑŽÑ‡ Ð»Ð¾ÐºÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸ (Ð±ÐµÐ· Ð¿Ñ€Ð¾Ð±ÐµÐ»Ð¾Ð²), Ð¿Ñ€Ð¾Ð±ÑƒÐµÐ¼ Ð¿ÐµÑ€ÐµÐ²ÐµÑÑ‚Ð¸
        if (title && !title.includes(' ') && !title.includes('<')) {
            const translated = t(title);
            // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼, Ð²ÐµÑ€Ð½ÑƒÐ»ÑÑ Ð»Ð¸ ÐºÐ»ÑŽÑ‡ Ð¸Ð»Ð¸ Ð¿ÐµÑ€ÐµÐ²Ð¾Ð´
            if (!translated || translated === title) {
                // Ð•ÑÐ»Ð¸ Ð¿ÐµÑ€ÐµÐ²Ð¾Ð´ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½ (Ð²ÐµÑ€Ð½ÑƒÐ»ÑÑ ÐºÐ»ÑŽÑ‡), Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ð´ÐµÑ„Ð¾Ð»Ñ‚
                displayTitle = t('inputRequired');
            } else {
                displayTitle = translated;
            }
        }

        this.showModal({
            title: `<span class="text-gradient">${displayTitle}</span>`,
            content: `
                <div style="padding: 0.5rem 0;">
                    <p style="margin-bottom: 1rem; opacity: 0.9;">${message}</p>
                    <div class="input-wrapper" style="position: relative;">
                        <input type="text" id="${inputId}" class="form-control cosmic-input" 
                            value="${defaultValue}" 
                            style="width: 100%; padding: 0.8rem 1rem; border-radius: 12px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: white; font-size: 1rem; outline: none; transition: all 0.3s ease;">
                        <div style="position: absolute; bottom: -2px; left: 0; width: 0%; height: 2px; background: var(--primary-color); transition: width 0.3s ease;" id="inputFocusLine"></div>
                    </div>
                </div>
            `,
            actions: [
                { text: t('cancel') || 'Cancel', class: 'btn-ghost', onClick: () => { } },
                {
                    text: t('save') || 'Save',
                    class: 'btn-primary',
                    closeAfter: false,
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

        // Initialize input behavior manually since <script> tags in innerHTML are not executed
        setTimeout(() => {
            const input = document.getElementById(inputId);
            const line = document.getElementById('inputFocusLine');
            if (input) {
                input.focus();
                input.select();
                input.addEventListener('focus', () => line && (line.style.width = '100%'));
                input.addEventListener('blur', () => line && (line.style.width = '0%'));
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const btn = document.querySelector('#genericModal .btn-primary');
                        if (btn) btn.click();
                    }
                });
            }
        }, 100);
    }

    showTestTypeSelection() {
        this.clearView(); // Ensure previous views are destroyed
        const container = document.getElementById('app');
        if (!container) return;

        container.style.opacity = '0';

        if (typeof TestSelectionView !== 'undefined' || typeof window.TestSelectionView !== 'undefined') {
            const ViewClass = window.TestSelectionView || TestSelectionView;
            const view = new ViewClass({
                app: this.app,
                container: container,
                i18n: this.i18n,
                onSelectBasic: () => this.app.startTest ? this.app.startTest('basic') : this.app.startBasicTest(),
                onSelectAdvanced: () => this.app.startTest ? this.app.startTest('advanced') : this.app.startAdvancedTest(),
                onSelectCognitive: () => this.app.startTest ? this.app.startTest('cognitive') : this.app.startCognitiveTest(),
                onBack: () => this.app.showIntro()
            });

            this.setView(view);

            if (typeof view.render === 'function') {
                view.renderContainer = container; // set explicitly if needed
                view.render();
            } else {
                container.innerHTML = view.getHTML();
                if (typeof view.afterRender === 'function') {
                    view.afterRender();
                }
            }

            setTimeout(() => {
                container.style.opacity = '1';
            }, 50);
        } else {
            console.error('TestSelectionView not loaded. Make sure js/ui/views/TestSelectionView.js is included.');
            this.showError(this.i18n.t('testSelectionViewError') || 'Test selection view failed to load. Please refresh the page.');
        }
    }

    showError(message) {
        const container = document.getElementById('app');
        if (container) {
            const t = this.i18n.t.bind(this.i18n);
            container.innerHTML = `
                <div class="error-screen">
                    <h1>${t('error') || 'Error'}</h1>
                    <p class="error-message">${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">${t('reloadPage') || 'Reload page'}</button>
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

