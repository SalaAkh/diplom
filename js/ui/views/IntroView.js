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
                <style>
                    .landing-cta {
                        margin: 6rem 0;
                        padding: 0 2rem;
                    }
                    .cta-content {
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 4rem 3rem;
                        background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(192, 38, 211, 0.15));
                        border: 2px solid rgba(147, 51, 234, 0.3);
                        border-radius: 32px;
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                    }
                    .cta-content::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%);
                        animation: rotate 20s linear infinite;
                    }
                    @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .cta-content > * {
                        position: relative;
                        z-index: 1;
                    }
                    .cta-title {
                        font-size: 2.5rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #9333ea, #c026d3, #9333ea);
                        background-size: 200% auto;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 1.5rem;
                        animation: shimmer 3s linear infinite;
                    }
                    @keyframes shimmer {
                        to { background-position: 200% center; }
                    }
                    .cta-text {
                        font-size: 1.2rem;
                        line-height: 1.8;
                        opacity: 0.9;
                        margin-bottom: 2.5rem;
                        max-width: 700px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .cta-content .btn {
                        padding: 1.25rem 3rem;
                        font-size: 1.2rem;
                        font-weight: 600;
                        background: linear-gradient(135deg, #9333ea, #c026d3);
                        border: none;
                        border-radius: 16px;
                        color: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.75rem;
                        box-shadow: 0 10px 40px rgba(147, 51, 234, 0.3);
                    }
                    .cta-content .btn:hover {
                        transform: translateY(-4px) scale(1.02);
                        box-shadow: 0 15px 50px rgba(147, 51, 234, 0.5);
                    }
                    .cta-content .btn .material-symbols-rounded {
                        font-size: 1.5rem;
                        animation: pulse 2s ease-in-out infinite;
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    .cta-decorative-icons {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        pointer-events: none;
                        opacity: 0.1;
                    }
                    .cta-decorative-icons .material-symbols-rounded {
                        position: absolute;
                        font-size: 3rem;
                        color: #9333ea;
                    }
                    .cta-decorative-icons .icon-1 {
                        top: 10%;
                        left: 10%;
                        animation: float 6s ease-in-out infinite;
                    }
                    .cta-decorative-icons .icon-2 {
                        top: 20%;
                        right: 15%;
                        animation: float 7s ease-in-out infinite 1s;
                    }
                    .cta-decorative-icons .icon-3 {
                        bottom: 15%;
                        left: 15%;
                        animation: float 8s ease-in-out infinite 2s;
                    }
                    .cta-decorative-icons .icon-4 {
                        bottom: 10%;
                        right: 10%;
                        animation: float 9s ease-in-out infinite 3s;
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(10deg); }
                    }
                </style>
                <div class="cta-content">
                    <div class="cta-decorative-icons">
                        <span class="material-symbols-rounded icon-1">neurology</span>
                        <span class="material-symbols-rounded icon-2">auto_awesome</span>
                        <span class="material-symbols-rounded icon-3">insights</span>
                        <span class="material-symbols-rounded icon-4">stars</span>
                    </div>
                    <h2 class="cta-title">${this.t('ctaTitle')}</h2>
                    <p class="cta-text">${this.t('ctaText')}</p>
                    <button class="btn btn-primary btn-lg" id="ctaStartBtn">
                        <span class="material-symbols-rounded">rocket_launch</span>
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
            { icon: 'neurology', key: 'featInteractive', descKey: 'featInteractiveDesc' },
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
            { icon: 'neurology', nameKey: 'rationalityThinking', descKey: 'rationalityDesc' },
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

    /**
     * Очистка ресурсов при Уничтожении View
     */
    destroy() {
        this.savedProgress = null;
        super.destroy();
    }
}

// Экспорт
if (typeof window !== 'undefined') {
    window.IntroView = IntroView;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntroView;
}
