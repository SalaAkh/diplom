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
        this.onSelectBasic = options.onSelectBasic || (() => { });
        this.onSelectAdvanced = options.onSelectAdvanced || (() => { });
        this.onSelectCognitive = options.onSelectCognitive || (() => { });
        this.onBack = options.onBack || (() => { });
    }

    /**
     * Получение HTML
     * @returns {string}
     */
    getHTML() {
        return `
            <style>
                .test-selection-container {
                    padding: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .selection-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }
                .selection-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 1rem;
                }
                .selection-subtitle {
                    font-size: 1.1rem;
                    opacity: 0.8;
                }
                .test-options-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 2rem;
                    margin-bottom: 3rem;
                }
                .test-option-card {
                    background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    padding: 2rem;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .test-option-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    z-index: 0;
                }
                .test-option-card:hover::before {
                    opacity: 0.1;
                }
                .test-option-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--primary-color);
                    box-shadow: 0 20px 60px rgba(var(--primary-rgb), 0.3);
                }
                .test-option-card.featured {
                    border: 2px solid var(--primary-color);
                    box-shadow: 0 10px 40px rgba(var(--primary-rgb), 0.2);
                }
                .test-option-card > * {
                    position: relative;
                    z-index: 1;
                }
                .option-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .option-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    box-shadow: 0 8px 24px rgba(var(--primary-rgb), 0.3);
                }
                .option-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0;
                }
                .option-stats {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: rgba(255,255,255,0.03);
                    border-radius: 12px;
                }
                .stat {
                    text-align: center;
                }
                .stat-value {
                    display: block;
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--primary-color);
                }
                .stat-label {
                    display: block;
                    font-size: 0.85rem;
                    opacity: 0.7;
                    margin-top: 0.25rem;
                }
                .option-description {
                    font-size: 1rem;
                    line-height: 1.6;
                    opacity: 0.85;
                    margin-bottom: 1.5rem;
                }
                .option-features {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 1.5rem 0;
                }
                .option-features li {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 0;
                    font-size: 0.95rem;
                }
                .option-features .material-symbols-rounded {
                    color: var(--primary-color);
                    font-size: 1.2rem;
                }
                .option-btn {
                    width: 100%;
                    padding: 1rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border-radius: 12px;
                    border: none;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .option-btn:hover {
                    transform: scale(1.02);
                    box-shadow: 0 8px 24px rgba(var(--primary-rgb), 0.4);
                }
                .badge-featured {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: linear-gradient(135deg, #ffd700, #ffed4e);
                    color: #000;
                    padding: 0.4rem 1rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
                }
                .selection-footer {
                    text-align: center;
                }
            </style>
            <div class="test-selection-container">
                <header class="selection-header">
                    <h1 class="selection-title">${this.t('selectTestType')}</h1>
                    <p class="selection-subtitle">${this.t('testTypeDescription')}</p>
                </header>
                
                <div class="test-options-grid">
                    ${this.getBasicTestCard()}
                    ${this.getCognitiveTestCard()}
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
     * HTML карточки когнитивного теста
     * @returns {string}
     */
    getCognitiveTestCard() {
        return `
            <div class="test-option-card" id="cognitiveTestCard">
                <div class="option-header">
                    <div class="option-icon" style="background: linear-gradient(135deg, #9333ea, #c026d3);">
                        <span class="material-symbols-rounded">psychology</span>
                    </div>
                    <h2 class="option-title">${this.t('cognitiveTest')}</h2>
                </div>
                
                <div class="option-stats">
                    <div class="stat">
                        <span class="stat-value">10</span>
                        <span class="stat-label">${this.t('questionsCount')}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">2-3</span>
                        <span class="stat-label">${this.t('minutes')}</span>
                    </div>
                </div>
                
                <p class="option-description">${this.t('cognitiveTestDescription')}</p>
                
                <ul class="option-features">
                    <li>
                        <span class="material-symbols-rounded">visibility</span>
                        ${this.t('cognitiveFeature1')}
                    </li>
                    <li>
                        <span class="material-symbols-rounded">tips_and_updates</span>
                        ${this.t('cognitiveFeature2')}
                    </li>
                    <li>
                        <span class="material-symbols-rounded">auto_awesome</span>
                        ${this.t('cognitiveFeature2')}
                    </li>
                </ul>
                
                <button class="btn btn-primary btn-lg option-btn" id="startCognitiveBtn">
                    <span class="material-symbols-rounded">play_arrow</span>
                    ${this.t('startCognitiveTest')}
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

        // Когнитивный тест
        const cognitiveBtn = document.getElementById('startCognitiveBtn');
        const cognitiveCard = document.getElementById('cognitiveTestCard');

        if (cognitiveBtn) {
            cognitiveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSelectCognitive();
            });
        }

        if (cognitiveCard) {
            cognitiveCard.addEventListener('click', () => this.handleSelectCognitive());
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
     * Обработчик выбора когнитивного теста
     */
    handleSelectCognitive() {
        this.emit('test:select', { mode: 'cognitive' });
        if (typeof this.onSelectCognitive === 'function') {
            this.onSelectCognitive();
        } else if (window.app) {
            window.app.startCognitiveTest();
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
