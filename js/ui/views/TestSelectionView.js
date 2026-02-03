/**
 * TestSelectionView - Компонент выбора типа теста
 * Отображает варианты тестов (быстрый и углублённый)
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class TestSelectionView extends BaseView {
    constructor(options = {}) {
        super(options);
        this.onSelectBasic = options.onSelectBasic || (() => { });
        this.onSelectAdvanced = options.onSelectAdvanced || (() => { });
        this.onBack = options.onBack || (() => { });
    }

    /**
     * Получение HTML
     * @returns {string}
     */
    getHTML() {
        return `
            <div class="test-selection-container">
                <header class="selection-header">
                    <h1 class="selection-title">${this.t('selectTestType')}</h1>
                    <p class="selection-subtitle">${this.t('testTypeDescription')}</p>
                </header>
                
                <div class="test-options-grid">
                    ${this.getBasicTestCard()}
                    ${this.getAdvancedTestCard()}
                </div>
                
                <div class="selection-footer">
                    <button class="btn btn-text" id="backToHomeBtn">
                        <span class="material-symbols-rounded">arrow_back</span>
                        ${this.t('home')}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * HTML карточки быстрого теста
     * @returns {string}
     */
    getBasicTestCard() {
        return `
            <div class="test-option-card" id="basicTestCard">
                <div class="option-header">
                    <div class="option-icon">
                        <span class="material-symbols-rounded">bolt</span>
                    </div>
                    <h2 class="option-title">${this.t('basicTest')}</h2>
                </div>
                
                <div class="option-stats">
                    <div class="stat">
                        <span class="stat-value">12</span>
                        <span class="stat-label">${this.t('questionsCount')}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">5-7</span>
                        <span class="stat-label">${this.t('minutes')}</span>
                    </div>
                </div>
                
                <p class="option-description">${this.t('basicTestDescription')}</p>
                
                <ul class="option-features">
                    <li>
                        <span class="material-symbols-rounded">check</span>
                        ${this.t('basicTestFeature1')}
                    </li>
                    <li>
                        <span class="material-symbols-rounded">check</span>
                        ${this.t('basicTestFeature2')}
                    </li>
                    <li>
                        <span class="material-symbols-rounded">check</span>
                        ${this.t('basicTestFeature3')}
                    </li>
                </ul>
                
                <button class="btn btn-primary btn-lg option-btn" id="startBasicBtn">
                    <span class="material-symbols-rounded">play_arrow</span>
                    ${this.t('startBasicTest')}
                </button>
            </div>
        `;
    }

    /**
     * HTML карточки углублённого теста
     * @returns {string}
     */
    getAdvancedTestCard() {
        return `
            <div class="test-option-card featured" id="advancedTestCard">
                <div class="badge-featured">${this.t('mostAccurate')}</div>
                
                <div class="option-header">
                    <div class="option-icon">
                        <span class="material-symbols-rounded">psychology</span>
                    </div>
                    <h2 class="option-title">${this.t('advancedTest')}</h2>
                </div>
                
                <div class="option-stats">
                    <div class="stat">
                        <span class="stat-value">36</span>
                        <span class="stat-label">${this.t('questionsCount')}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">15-20</span>
                        <span class="stat-label">${this.t('minutes')}</span>
                    </div>
                </div>
                
                <p class="option-description">${this.t('advancedTestDescription')}</p>
                
                <ul class="option-features">
                    <li>
                        <span class="material-symbols-rounded">check</span>
                        ${this.t('advancedTestFeature1')}
                    </li>
                    <li>
                        <span class="material-symbols-rounded">check</span>
                        ${this.t('advancedTestFeature2')}
                    </li>
                    <li>
                        <span class="material-symbols-rounded">check</span>
                        ${this.t('advancedTestFeature3')}
                    </li>
                    <li>
                        <span class="material-symbols-rounded">check</span>
                        ${this.t('advancedTestFeature4')}
                    </li>
                </ul>
                
                <button class="btn btn-primary btn-lg option-btn" id="startAdvancedBtn">
                    <span class="material-symbols-rounded">play_arrow</span>
                    ${this.t('startAdvancedTest')}
                </button>
            </div>
        `;
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
        // Быстрый тест
        const basicBtn = document.getElementById('startBasicBtn');
        const basicCard = document.getElementById('basicTestCard');

        if (basicBtn) {
            basicBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSelectBasic();
            });
        }

        if (basicCard) {
            basicCard.addEventListener('click', () => this.handleSelectBasic());
        }

        // Углублённый тест
        const advancedBtn = document.getElementById('startAdvancedBtn');
        const advancedCard = document.getElementById('advancedTestCard');

        if (advancedBtn) {
            advancedBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSelectAdvanced();
            });
        }

        if (advancedCard) {
            advancedCard.addEventListener('click', () => this.handleSelectAdvanced());
        }

        // Назад
        const backBtn = document.getElementById('backToHomeBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.handleBack());
        }
    }

    /**
     * Обработчик выбора быстрого теста
     */
    handleSelectBasic() {
        this.emit('test:select', { mode: 'basic' });
        if (typeof this.onSelectBasic === 'function') {
            this.onSelectBasic();
        }
    }

    /**
     * Обработчик выбора углублённого теста
     */
    handleSelectAdvanced() {
        this.emit('test:select', { mode: 'advanced' });
        if (typeof this.onSelectAdvanced === 'function') {
            this.onSelectAdvanced();
        }
    }

    /**
     * Обработчик возврата
     */
    handleBack() {
        this.emit(EventBus.Events.SCREEN_CHANGED, { screen: 'intro' });
        if (typeof this.onBack === 'function') {
            this.onBack();
        }
    }
}

// Экспорт
if (typeof window !== 'undefined') {
    window.TestSelectionView = TestSelectionView;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestSelectionView;
}
