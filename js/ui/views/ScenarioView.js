/**
 * ScenarioView - Компонент отображения сценариев и вопросов теста
 * Управляет интерфейсом прохождения теста
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ScenarioView extends BaseView {
    constructor(options = {}) {
        super(options);
        this.scenario = options.scenario || null;
        this.questionIndex = options.questionIndex || 0;
        this.totalQuestions = options.totalQuestions || 12;
        this.testMode = options.testMode || 'basic';
        this.onAnswer = options.onAnswer || (() => { });
        this.onBack = options.onBack || null;
    }

    /**
     * Обновление данных сценария
     * @param {Object} scenario - Данные сценария
     * @param {number} index - Индекс вопроса
     */
    updateScenario(scenario, index) {
        this.scenario = scenario;
        this.questionIndex = index;
        this.render();
    }

    /**
     * Получение HTML
     * @returns {string}
     */
    getHTML() {
        if (!this.scenario) {
            return `<div class="loading">${this.t('loading')}</div>`;
        }

        const progress = Math.round((this.questionIndex / this.totalQuestions) * 100);

        return `
            <div class="test-container">
                ${this.getProgressHTML(progress)}
                ${this.getScenarioContentHTML()}
                ${this.getOptionsHTML()}
                ${this.getNavigationHTML()}
            </div>
        `;
    }

    /**
     * HTML прогресс-бара
     * @param {number} progress - Процент прохождения
     * @returns {string}
     */
    getProgressHTML(progress) {
        return `
            <div class="test-progress">
                <div class="progress-header">
                    <span class="progress-text">
                        ${this.t('question')} ${this.questionIndex + 1} ${this.t('of')} ${this.totalQuestions}
                    </span>
                    <span class="progress-percentage">${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }

    /**
     * HTML содержимого сценария
     * @returns {string}
     */
    getScenarioContentHTML() {
        const title = this.getLocalizedText(this.scenario.title);
        const description = this.getLocalizedText(this.scenario.description);
        const context = this.scenario.metadata?.context;

        return `
            <div class="scenario-content">
                ${context ? `<div class="scenario-context">${this.escapeHTML(context)}</div>` : ''}
                <h2 class="scenario-title">${this.escapeHTML(title)}</h2>
                <p class="scenario-description">${this.escapeHTML(description)}</p>
            </div>
        `;
    }

    /**
     * HTML вариантов ответа
     * @returns {string}
     */
    getOptionsHTML() {
        const options = ['A', 'B', 'C', 'D'].filter(opt => this.scenario[`option${opt}`]);

        return `
            <div class="scenario-options">
                ${options.map(opt => this.getOptionHTML(opt)).join('')}
            </div>
            <p class="scenario-hint">${this.t('chooseOption')}</p>
        `;
    }

    /**
     * HTML одного варианта ответа
     * @param {string} option - Буква варианта (A, B, C, D)
     * @returns {string}
     */
    getOptionHTML(option) {
        const optionData = this.scenario[`option${option}`];
        if (!optionData) return '';

        const text = this.getLocalizedText(optionData.text);

        return `
            <button class="option-btn" data-option="${option}">
                <span class="option-letter">${option}</span>
                <span class="option-text">${this.escapeHTML(text)}</span>
            </button>
        `;
    }

    /**
     * HTML навигации
     * @returns {string}
     */
    getNavigationHTML() {
        const showBack = this.questionIndex > 0 && this.onBack;

        return `
            <div class="test-navigation">
                ${showBack ? `
                    <button class="btn btn-secondary" id="backBtn">
                        ${this.t('back')}
                    </button>
                ` : '<div></div>'}
            </div>
        `;
    }

    /**
     * Получение локализованного текста
     * @param {string|Object} text - Текст или объект с переводами
     * @returns {string}
     */
    getLocalizedText(text) {
        if (!text) return '';
        if (typeof text === 'string') return text;

        const lang = this.i18n?.getLanguage() || 'kk';
        return text[lang] || text.kk || text.ru || text.en || '';
    }

    /**
     * Привязка событий
     */
    afterRender() {
        this.bindEvents();
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        // Варианты ответов
        const optionBtns = this.container?.querySelectorAll('.option-btn');
        optionBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const option = e.currentTarget.dataset.option;
                this.handleOptionSelect(option);
            });
        });

        // Кнопка назад
        const backBtn = document.getElementById('backBtn');
        if (backBtn && this.onBack) {
            backBtn.addEventListener('click', () => this.onBack());
        }
    }

    /**
     * Обработчик выбора варианта
     * @param {string} option - Выбранный вариант
     */
    handleOptionSelect(option) {
        // Визуальная обратная связь
        const selectedBtn = this.container?.querySelector(`[data-option="${option}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');

            // Небольшая задержка перед переходом для анимации
            setTimeout(() => {
                this.emit(EventBus.Events.QUESTION_ANSWERED, {
                    scenarioId: this.scenario.id,
                    choice: option,
                    questionIndex: this.questionIndex
                });

                if (typeof this.onAnswer === 'function') {
                    this.onAnswer(this.scenario.id, option);
                }
            }, 200);
        }
    }

    showTransition() {
        if (this.container) {
            this.container.classList.add('transitioning');
            setTimeout(() => {
                if (this.container) this.container.classList.remove('transitioning');
            }, 300);
        }
    }

    /**
     * Очистка ресурсов при Уничтожении View
     */
    destroy() {
        // Clear references
        this.scenario = null;
        this.onAnswer = null;
        this.onBack = null;
        super.destroy();
    }
}

// Экспорт
if (typeof window !== 'undefined') {
    window.ScenarioView = ScenarioView;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScenarioView;
}
