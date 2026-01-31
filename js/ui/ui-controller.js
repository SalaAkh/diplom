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
        }, 10);
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

            // If in intro state, re-render to update content
            if (this.app.state === 'intro') {
                this.app.showIntro();
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            animation: slideInDown 0.3s ease-out;
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
            this.showAuthSuccess(this.i18n.t('loginSuccess') || `Добро пожаловать, ${username}!`);

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
            this.showAuthSuccess(this.i18n.t('registerSuccess') || `Аккаунт создан! Добро пожаловать, ${username}!`);

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
        const user = this.app.auth.getCurrentUser();

        // Check if there is incomplete progress
        const progressData = this.app.storage && this.app.storage.loadProgress();
        const hasProgress = progressData && progressData.choices && (Array.isArray(progressData.choices) ? progressData.choices.length > 0 : Object.keys(progressData.choices).length > 0);

        container.innerHTML = `
            <div class="intro-screen">
                <!-- Hero Section matching About page style -->
                <div class="cosmic-card glowing mb-8">
                    <div class="about-hero text-center p-6">
                        <h1 class="gradient-text text-3xl mb-4" data-i18n="aboutSystem">${t('aboutSystem')}</h1>
                        <p class="text-lg text-secondary" data-i18n="systemDescription">${t('systemDescription')}</p>
                    </div>
                </div>

                <!-- Features Grid -->
                <div class="mb-8">
                    <h2 class="text-2xl font-bold mb-6 gradient-text text-center" data-i18n="whatAwaits">${t('whatAwaits')}</h2>
                    <div class="feature-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                        <div class="feature-card cosmic-card p-6 flex flex-col items-center text-center">
                            <span class="feature-icon text-4xl mb-4">🎭</span>
                            <h3 class="text-xl font-bold mb-2" data-i18n="featInteractive">${t('featInteractive')}</h3>
                            <p class="text-sm text-secondary" data-i18n="featInteractiveDesc">${t('featInteractiveDesc')}</p>
                        </div>
                        <div class="feature-card cosmic-card p-6 flex flex-col items-center text-center">
                            <span class="feature-icon text-4xl mb-4">🧠</span>
                            <h3 class="text-xl font-bold mb-2" data-i18n="featPattern">${t('featPattern')}</h3>
                            <p class="text-sm text-secondary" data-i18n="featPatternDesc">${t('featPatternDesc')}</p>
                        </div>
                        <div class="feature-card cosmic-card p-6 flex flex-col items-center text-center">
                            <span class="feature-icon text-4xl mb-4">📊</span>
                            <h3 class="text-xl font-bold mb-2" data-i18n="feat3D">${t('feat3D')}</h3>
                            <p class="text-sm text-secondary" data-i18n="feat3DDesc">${t('feat3DDesc')}</p>
                        </div>
                    </div>
                </div>

                <!-- Dimensions Grid -->
                <div class="cosmic-card mb-8">
                    <div class="card-header p-6 border-b border-white/10">
                        <h2 class="card-title gradient-text text-xl m-0" data-i18n="dimensionsTitle">${t('dimensionsTitle')}</h2>
                    </div>
                    <div class="card-body p-6">
                        <div class="dimension-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                            <div class="dimension-card p-4 bg-white/5 rounded-lg">
                                <h4 class="font-bold text-primary mb-1" data-i18n="strategicName">${t('strategicName')}</h4>
                                <p class="text-xs text-secondary" data-i18n="dimStrategyDesc">${t('dimStrategyDesc')}</p>
                            </div>
                            <div class="dimension-card p-4 bg-white/5 rounded-lg">
                                <h4 class="font-bold text-primary mb-1" data-i18n="explorerName">${t('explorerName')}</h4>
                                <p class="text-xs text-secondary" data-i18n="dimResearchDesc">${t('dimResearchDesc')}</p>
                            </div>
                            <div class="dimension-card p-4 bg-white/5 rounded-lg">
                                <h4 class="font-bold text-primary mb-1" data-i18n="individualismName">${t('individualismName')}</h4>
                                <p class="text-xs text-secondary" data-i18n="dimIndividualismDesc">${t('dimIndividualismDesc')}</p>
                            </div>
                            <div class="dimension-card p-4 bg-white/5 rounded-lg">
                                <h4 class="font-bold text-primary mb-1" data-i18n="rationalityName">${t('rationalityName')}</h4>
                                <p class="text-xs text-secondary" data-i18n="dimRationalityDesc">${t('dimRationalityDesc')}</p>
                            </div>
                            <div class="dimension-card p-4 bg-white/5 rounded-lg">
                                <h4 class="font-bold text-primary mb-1" data-i18n="controlName">${t('controlName')}</h4>
                                <p class="text-xs text-secondary" data-i18n="dimControlDesc">${t('dimControlDesc')}</p>
                            </div>
                            <div class="dimension-card p-4 bg-white/5 rounded-lg">
                                <h4 class="font-bold text-primary mb-1" data-i18n="meaningName">${t('meaningName')}</h4>
                                <p class="text-xs text-secondary" data-i18n="dimMeaningDesc">${t('dimMeaningDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="intro-actions flex flex-col items-center gap-4 mb-12">
                    ${hasProgress ? `
                        <button class="btn btn-primary btn-lg w-full max-w-md pulse-animation flex items-center justify-center gap-4 py-4 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1" onclick="app.continueTest()">
                            <!-- Play Icon SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor">
                                <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
                            </svg>
                            <div class="flex flex-col items-start">
                                <span class="font-bold text-lg tracking-wide uppercase">${t('continueTest')}</span>
                                <span class="text-xs opacity-90 font-medium">
                                    ${progressData.currentQuestionIndex || (Array.isArray(progressData.choices) ? progressData.choices.length : Object.keys(progressData.choices || {}).length)} / ${(app.scenarios ? app.scenarios.length : '30+')} ${t('questionsCompleted')}
                                </span>
                            </div>
                        </button>
                        <button class="btn btn-secondary w-full max-w-md flex items-center justify-center gap-3 py-3 hover:bg-white/10 transition-colors" onclick="app.startNewTest()">
                            <!-- Restart Icon SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                                <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 153t144 65v100Zm80 0v-100q88 0 144-65t56-153q0-45-19.5-90T643-615l57-57q38 51 64 111.5T790-440q0 128-79.5 218.5T520-122ZM480-520 320-360h320L480-520Zm0-280q-17 0-28.5-11.5T440-840v-40q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v40q0 17-11.5 28.5T480-800Z"/>
                            </svg>
                            <span>${t('startNew')}</span>
                        </button>
                    ` : `
                        <button class="btn btn-primary btn-lg w-full max-w-md pulse-animation flex items-center justify-center gap-4 py-4 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1" onclick="app.showTestTypeSelection()">
                            <!-- Rocket Icon SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor">
                                <path d="M480-120q-150 0-255-105T120-480q0-36 10-76t30-74l62 38q-14 28-21 54t-7 58q0 116 82 198t198 82q44 0 94.5-12.5T770-158l56 46q-68 44-142 66t-204 22Zm312-140-52-44q20-22 34-45.5t18-48.5h68q-5 38-23.5 76T792-260ZM168-608 604-172l56-56-436-436-56 56Zm312-312q28 0 54 7t52 23l-36 56q-16-9-33-12.5t-37-3.5q-64 0-113 36T298-720h-74q25-87 97.5-143.5T480-920Zm356 316q0-10-1-19.5t-3-19.5l66-14q3 16 4.5 33t1.5 33h-68Zm-154-154q13 18 22.5 40t13.5 44l64-22q-7-35-22.5-66.5T724-758l-42 42Z"/>
                            </svg>
                            <span class="text-lg font-bold tracking-wide uppercase">${t('startTest')}</span>
                        </button>
                    `}
                </div>
                
                ${user ? `
                    <div class="user-info text-center mt-8">
                        <p class="mb-2 text-secondary">${t('loggedInAs')} <strong class="text-white">${user.username}</strong></p>
                        <div class="flex justify-center gap-4">
                            <button class="btn-link text-sm" onclick="app.showProfile()">${t('myProfile')}</button>
                            <button class="btn-link text-sm text-red-400" onclick="app.logout()">${t('logout')}</button>
                        </div>
                    </div>
                ` : `
                    <div class="user-info mt-8">
                        <div class="auth-section flex flex-col items-center">
                            <div id="googleSignInButton" class="google-signin-container mb-4"></div>
                            <div class="auth-divider w-full max-w-xs mb-4">
                                <span data-i18n="or">${t('or')}</span>
                            </div>
                            <button class="btn-link" onclick="app.showAuth()">${t('loginOrRegister')}</button>
                        </div>
                    </div>
                `}
            </div>
        `;

        setTimeout(() => {
            container.style.transition = 'opacity 0.5s ease-out';
            container.style.opacity = '1';

            if (!user && this.app.auth.isGoogleSignInConfigured()) {
                this.app.auth.initGoogleSignIn();
            }
        }, 100);
    }

    showTestTypeSelection() {
        this.app.state = 'testSelection';
        const container = document.getElementById('app');
        if (!container) return;

        container.style.opacity = '0';
        const t = this.i18n.t.bind(this.i18n);

        // Fallbacks provided directly in template literal for better readability
        container.innerHTML = `
            <div class="test-selection-screen">
                <h1>${t('selectTestType') || 'Выберите тип теста'}</h1>
                <p class="subtitle">${t('testTypeDescription') || 'Выберите подходящий для вас вариант тестирования'}</p>
                
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
                            <p class="test-count">${t('questionsCount') || 'Вопросов'}: <strong>30-50</strong></p>
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
            <div class="loading-results">
                <div class="loading-spinner"></div>
                <p>${t('processingResults') || 'Processing results...'}</p>
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
                        <button class="btn-home" onclick="app.showIntro()">🏠</button>
                        <h1 id="resultsTitle">${t('resultsTitle')}</h1>
                        <div class="results-actions-top">
                             <button class="btn btn-sm btn-secondary" onclick="app.downloadResults('json')">💾 JSON</button>
                             <button class="btn btn-sm btn-secondary" onclick="app.downloadResults('html')">📄 HTML</button>
                        </div>
                    </div>

                    <div class="results-grid">
                        <!-- Profile Card -->
                         <div class="result-card profile-card">
                            <h2>${profile.type}</h2>
                            <p class="profile-summary">${profile.summary}</p>
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
                        <p>${aiAnalysis.personalityType.description}</p>
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
                        <p>${insight.text}</p>
                    </div>
                `;
            });
            html += '</div></div>';
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
                    
                    <!-- History List -->
                    <div class="cosmic-card">
                        <div class="card-header">
                             <h2 class="card-title">${t('testHistory')}</h2>
                        </div>
                        <div class="card-body">
                            ${history.length > 0 ? `
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
                            ` : `<p class="text-center text-secondary">${t('noHistory')}</p>`}
                        </div>
                    </div>
                </div>
            </div>
        `;
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
