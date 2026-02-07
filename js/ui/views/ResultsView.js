/**
 * ResultsView - Компонент отображения результатов теста
 * Показывает профиль личности, графики и рекомендации
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ResultsView extends BaseView {
    constructor(options = {}) {
        super(options);
        this.results = options.results || null;
        this.visualizer = options.visualizer || null;
        this.onDownload = options.onDownload || (() => { });
        this.onRetake = options.onRetake || (() => { });
        this.onHome = options.onHome || (() => { });
    }

    /**
     * Обновление результатов
     * @param {Object} results - Результаты теста
     */
    updateResults(results) {
        this.results = results;
        this.render();
    }

    /**
     * Получение HTML
     * @returns {string}
     */
    getHTML() {
        if (!this.results) {
            return `<div class="loading">${this.t('processingResults')}</div>`;
        }

        return `
            <div class="results-container">
                <header class="results-header">
                    <h1 class="results-title">${this.t('resultsTitle')}</h1>
                    <p class="results-subtitle">${this.t('yourProfile')}</p>
                </header>
                
                ${this.getArchetypeHTML()}
                
                <section class="results-section" id="profileSection">
                    <h2 class="section-title">${this.t('visualProfile')}</h2>
                    <div class="chart-container" id="radarChartContainer"></div>
                </section>
                
                <section class="results-section" id="scoresSection">
                    ${this.getScoresHTML()}
                </section>
                
                <section class="results-section" id="summarySection">
                    <h2 class="section-title">${this.t('detailedAnalysis')}</h2>
                    <div class="summary-content">
                        ${this.getSummaryHTML()}
                    </div>
                </section>
                
                <section class="results-section" id="directionsSection">
                    <h2 class="section-title">${this.t('developmentDirections')}</h2>
                    <div class="directions-grid">
                        ${this.getDirectionsHTML()}
                    </div>
                </section>
                
                <section class="results-section" id="recommendationsSection">
                    <h2 class="section-title">${this.t('skillRecommendations')}</h2>
                    <div class="recommendations-content">
                        ${this.getRecommendationsHTML()}
                    </div>
                </section>
                
                <div class="results-actions">
                    <button class="btn btn-primary" id="downloadResultsBtn">
                        <span class="material-symbols-rounded">download</span>
                        ${this.t('downloadResults')}
                    </button>
                    <button class="btn btn-secondary" id="retakeTestBtn">
                        <span class="material-symbols-rounded">refresh</span>
                        ${this.t('takeAgain')}
                    </button>
                    <button class="btn btn-text" id="homeBtn">
                        <span class="material-symbols-rounded">home</span>
                        ${this.t('toMain')}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * HTML для оценок по измерениям
     * @returns {string}
     */
    getScoresHTML() {
        const scores = this.results.normalizedScores || {};
        const dimensions = [
            { key: 'rationality', icon: 'psychology', oppositeKey: 'intuition' },
            { key: 'control', icon: 'tune', oppositeKey: 'adaptation' },
            { key: 'strategic', icon: 'timeline', oppositeKey: 'tactical' },
            { key: 'explorer', icon: 'explore', oppositeKey: 'executor' },
            { key: 'individualism', icon: 'person', oppositeKey: 'collectivism' },
            { key: 'meaning', icon: 'lightbulb', oppositeKey: 'utility' }
        ];

        return `
            <h2 class="section-title">${this.t('dimensionScores')}</h2>
            <div class="scores-grid">
                ${dimensions.map(dim => {
            const value = scores[dim.key] || 0;
            const percentage = Math.round((value + 1) * 50); // Нормализуем от -1..1 к 0..100
            const level = this.getLevel(value);

            return `
                        <div class="score-card">
                            <div class="score-header">
                                <span class="material-symbols-rounded">${dim.icon}</span>
                                <span class="score-name">${this.t(dim.key + 'Name')}</span>
                            </div>
                            <div class="score-bar">
                                <div class="score-fill ${level}" style="width: ${percentage}%"></div>
                            </div>
                            <div class="score-labels">
                                <span class="score-low">${this.t(dim.oppositeKey + 'Name') || dim.oppositeKey}</span>
                                <span class="score-value">${percentage}%</span>
                                <span class="score-high">${this.t(dim.key + 'Name')}</span>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    /**
     * Получение уровня на основе значения
     * @param {number} value - Значение (-1 до 1)
     * @returns {string}
     */
    getLevel(value) {
        if (value > 0.5) return 'high';
        if (value > 0.2) return 'medium-high';
        if (value > -0.2) return 'balanced';
        if (value > -0.5) return 'medium-low';
        return 'low';
    }

    /**
     * HTML блока архетипа личности
     * @returns {string}
     */
    getArchetypeHTML() {
        const archetype = this.results.profile?.archetype;
        if (!archetype) {
            return '';
        }

        const celebrities = archetype.celebrities && archetype.celebrities.length > 0
            ? archetype.celebrities.slice(0, 2).join(', ')
            : '';

        return `
            <section class="results-section archetype-section" id="archetypeSection">
                <div class="archetype-card" style="--archetype-color: ${archetype.color}">
                    <div class="archetype-icon-wrapper">
                        <span class="material-symbols-rounded archetype-icon">${archetype.icon}</span>
                    </div>
                    <div class="archetype-content">
                        <div class="archetype-label">${this.t('yourArchetype') || 'Ваш Архетип'}</div>
                        <h2 class="archetype-name">${this.escapeHTML(archetype.name)}</h2>
                        <p class="archetype-description">${this.escapeHTML(archetype.description)}</p>
                        ${celebrities ? `
                            <div class="archetype-celebrities">
                                <span class="celebrities-label">${this.t('similarTo') || 'Похожи на'}:</span>
                                <span class="celebrities-names">${this.escapeHTML(celebrities)}</span>
                            </div>
                        ` : ''}
                        <div class="archetype-match">
                            <span class="match-label">${this.t('matchScore') || 'Соответствие'}:</span>
                            <span class="match-value">${archetype.matchScore}%</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * HTML резюме профиля
     * @returns {string}
     */
    getSummaryHTML() {
        const summary = this.results.textProfile?.summary || '';
        const strengths = this.results.textProfile?.strengths || [];

        return `
            <div class="profile-summary">
                <p class="summary-text">${this.escapeHTML(summary)}</p>
                ${strengths.length > 0 ? `
                    <div class="strengths-list">
                        <h4>${this.t('summaryStrengths')}</h4>
                        <ul>
                            ${strengths.map(s => `<li>${this.escapeHTML(s)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * HTML направлений развития
     * @returns {string}
     */
    getDirectionsHTML() {
        const directions = this.results.categoryMatches || [];

        if (directions.length === 0) {
            return `<p class="no-data">${this.t('balancedProfileDesc')}</p>`;
        }

        return directions.slice(0, 3).map(dir => `
            <div class="direction-card">
                <div class="direction-header">
                    <h3 class="direction-name">${this.t(dir.category)}</h3>
                    <span class="direction-match">${Math.round(dir.matchPercentage)}%</span>
                </div>
                <p class="direction-desc">${this.t('desc' + this.capitalize(dir.category))}</p>
            </div>
        `).join('');
    }

    /**
     * HTML рекомендаций
     * @returns {string}
     */
    getRecommendationsHTML() {
        const recommendations = this.results.recommendations || [];

        if (recommendations.length === 0) {
            return `<p class="no-data">${this.t('balancedProfileDesc')}</p>`;
        }

        return `
            <ul class="recommendations-list">
                ${recommendations.map(rec => `
                    <li class="recommendation-item">
                        <span class="material-symbols-rounded">check_circle</span>
                        <span>${this.escapeHTML(rec)}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    /**
     * Капитализация первой буквы
     * @param {string} str - Строка
     * @returns {string}
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Привязка событий после рендера
     */
    afterRender() {
        this.bindEvents();
        this.renderCharts();
    }

    /**
     * Рендеринг графиков
     */
    renderCharts() {
        if (this.visualizer && this.results) {
            setTimeout(() => {
                try {
                    this.visualizer.createRadarChart(
                        this.results.normalizedScores,
                        this.results.dimensions
                    );
                } catch (error) {
                    console.error('[ResultsView] Кесте жасау қатесі (Error creating chart):', error);
                }
            }, 100);
        }
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        const downloadBtn = document.getElementById('downloadResultsBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handleDownload());
        }

        const retakeBtn = document.getElementById('retakeTestBtn');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => this.handleRetake());
        }

        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => this.handleHome());
        }
    }

    /**
     * Обработчик скачивания
     */
    handleDownload() {
        this.emit('results:download', this.results);
        if (typeof this.onDownload === 'function') {
            this.onDownload(this.results);
        }
    }

    /**
     * Обработчик повтора теста
     */
    handleRetake() {
        if (confirm(this.t('confirmStartNew'))) {
            this.emit('test:retake');
            if (typeof this.onRetake === 'function') {
                this.onRetake();
            }
        }
    }

    /**
     * Обработчик перехода на главную
     */
    handleHome() {
        this.emit(EventBus.Events.SCREEN_CHANGED, { screen: 'intro' });
        if (typeof this.onHome === 'function') {
            this.onHome();
        }
    }
}

// Экспорт
if (typeof window !== 'undefined') {
    window.ResultsView = ResultsView;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResultsView;
}
