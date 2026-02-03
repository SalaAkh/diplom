/**
 * IntroView - Компонент вводного экрана / лендинга
 * Отображает главную страницу с информацией о системе
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class IntroView extends BaseView {
    constructor(options = {}) {
        super(options);
        this.onStartTest = options.onStartTest || (() => { });
        this.savedProgress = options.savedProgress || null;
    }

    /**
     * Получение HTML лендинга
     * @returns {string}
     */
    getHTML() {
        const hasSavedProgress = this.savedProgress &&
            this.savedProgress.choices &&
            this.savedProgress.choices.length > 0;

        return `
            <section class="landing-hero">
                <div class="hero-content">
                    <h1 class="hero-title">${this.t('landingHeroTitle')}</h1>
                    <p class="hero-subtitle">${this.t('landingHeroSubtitle')}</p>
                    
                    ${hasSavedProgress ? this.getSavedProgressHTML() : ''}
                    
                    <div class="hero-actions">
                        <button class="btn btn-primary btn-lg" id="startTestBtn">
                            <span class="material-symbols-rounded">play_arrow</span>
                            ${this.t('startTest')}
                        </button>
                    </div>
                </div>
            </section>
            
            <section class="landing-features">
                <h2 class="section-title">${this.t('landingFeaturesTitle')}</h2>
                <div class="features-grid">
                    ${this.getFeaturesHTML()}
                </div>
            </section>
            
            <section class="landing-how-it-works">
                <h2 class="section-title">${this.t('howItWorksTitle')}</h2>
                <div class="steps-grid">
                    ${this.getStepsHTML()}
                </div>
            </section>
            
            <section class="landing-dimensions">
                <h2 class="section-title">${this.t('analysisDimensions')}</h2>
                <div class="dimensions-grid">
                    ${this.getDimensionsHTML()}
                </div>
            </section>
            
            <section class="landing-cta">
                <div class="cta-content">
                    <h2 class="cta-title">${this.t('ctaTitle')}</h2>
                    <p class="cta-text">${this.t('ctaText')}</p>
                    <button class="btn btn-primary btn-lg" id="ctaStartBtn">
                        <span class="material-symbols-rounded">psychology</span>
                        ${this.t('startTest')}
                    </button>
                </div>
            </section>
        `;
    }

    /**
     * HTML для сохранённого прогресса
     * @returns {string}
     */
    getSavedProgressHTML() {
        return `
            <div class="saved-progress-banner">
                <div class="progress-info">
                    <span class="material-symbols-rounded">schedule</span>
                    <span>${this.t('unfinishedTest')}</span>
                </div>
                <div class="progress-actions">
                    <button class="btn btn-secondary" id="continueTestBtn">
                        <span class="material-symbols-rounded">play_circle</span>
                        ${this.t('continueTest')}
                    </button>
                    <button class="btn btn-text" id="startNewBtn">
                        ${this.t('startNew')}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * HTML для блока возможностей
     * @returns {string}
     */
    getFeaturesHTML() {
        const features = [
            { icon: 'psychology', key: 'featInteractive', descKey: 'featInteractiveDesc' },
            { icon: 'analytics', key: 'featPattern', descKey: 'featPatternDesc' },
            { icon: 'hub', key: 'feat3D', descKey: 'feat3DDesc' }
        ];

        return features.map(f => `
            <div class="feature-card">
                <div class="feature-icon">
                    <span class="material-symbols-rounded">${f.icon}</span>
                </div>
                <h3 class="feature-title">${this.t(f.key)}</h3>
                <p class="feature-desc">${this.t(f.descKey)}</p>
            </div>
        `).join('');
    }

    /**
     * HTML для шагов "Как это работает"
     * @returns {string}
     */
    getStepsHTML() {
        const steps = [
            { num: 1, icon: 'quiz', titleKey: 'step1Title', descKey: 'step1Desc' },
            { num: 2, icon: 'calculate', titleKey: 'step2Title', descKey: 'step2Desc' },
            { num: 3, icon: 'person_search', titleKey: 'step3Title', descKey: 'step3Desc' }
        ];

        return steps.map(s => `
            <div class="step-card">
                <div class="step-number">${s.num}</div>
                <div class="step-icon">
                    <span class="material-symbols-rounded">${s.icon}</span>
                </div>
                <h3 class="step-title">${this.t(s.titleKey)}</h3>
                <p class="step-desc">${this.t(s.descKey)}</p>
            </div>
        `).join('');
    }

    /**
     * HTML для измерений анализа
     * @returns {string}
     */
    getDimensionsHTML() {
        const dimensions = [
            { icon: 'timeline', nameKey: 'strategicThinking', descKey: 'strategicDesc' },
            { icon: 'explore', nameKey: 'explorerThinking', descKey: 'explorerDesc' },
            { icon: 'person', nameKey: 'individualismThinking', descKey: 'individualismDesc' },
            { icon: 'psychology', nameKey: 'rationalityThinking', descKey: 'rationalityDesc' },
            { icon: 'tune', nameKey: 'controlThinking', descKey: 'controlDesc' },
            { icon: 'lightbulb', nameKey: 'meaningThinking', descKey: 'meaningDesc' }
        ];

        return dimensions.map(d => `
            <div class="dimension-card">
                <span class="material-symbols-rounded dimension-icon">${d.icon}</span>
                <h4 class="dimension-name">${this.t(d.nameKey)}</h4>
                <p class="dimension-desc">${this.t(d.descKey)}</p>
            </div>
        `).join('');
    }

    /**
     * Привязка событий после рендера
     */
    afterRender() {
        this.bindEvents();
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        // Кнопка "Начать тест"
        const startBtn = document.getElementById('startTestBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.handleStartTest());
        }

        // CTA кнопка
        const ctaBtn = document.getElementById('ctaStartBtn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => this.handleStartTest());
        }

        // Продолжить тест
        const continueBtn = document.getElementById('continueTestBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.handleContinueTest());
        }

        // Начать заново
        const startNewBtn = document.getElementById('startNewBtn');
        if (startNewBtn) {
            startNewBtn.addEventListener('click', () => this.handleStartNew());
        }
    }

    /**
     * Обработчик начала теста
     */
    handleStartTest() {
        this.emit(EventBus.Events.SCREEN_CHANGED, { screen: 'testSelection' });
        if (typeof this.onStartTest === 'function') {
            this.onStartTest();
        }
    }

    /**
     * Обработчик продолжения теста
     */
    handleContinueTest() {
        this.emit('test:continue', this.savedProgress);
        if (this.app && typeof this.app.continueTest === 'function') {
            this.app.continueTest();
        }
    }

    /**
     * Обработчик начала нового теста
     */
    handleStartNew() {
        if (confirm(this.t('confirmStartNew'))) {
            if (this.app && typeof this.app.storage === 'object') {
                this.app.storage.clearProgress();
            }
            this.handleStartTest();
        }
    }
}

// Экспорт
if (typeof window !== 'undefined') {
    window.IntroView = IntroView;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntroView;
}
