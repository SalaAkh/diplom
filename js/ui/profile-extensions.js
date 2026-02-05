/**
 * Расширения профиля - UI для новых модулей
 * Добавляет секции: Сравнительный анализ, Цели, AI-советник
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ProfileExtensions {
    constructor() {
        this.selectedRole = 'developer';
        this.comparisonChart = null;
        this._cachedScores = null;
    }

    /**
     * Получить текущий язык
     */
    getLang() {
        try {
            if (window.i18n) return window.i18n.getLanguage();
            const saved = localStorage.getItem('preferredLanguage');
            return saved && ['kk', 'ru', 'en'].includes(saved) ? saved : 'ru';
        } catch (e) {
            return 'ru';
        }
    }

    /**
     * Получить последние результаты пользователя
     */
    getLatestScores() {
        // Используем кэш если есть
        if (this._cachedScores) return this._cachedScores;

        try {
            // Способ 1: Через app.auth
            if (window.app && window.app.auth) {
                const history = window.app.auth.getTestHistory();
                if (history && history.length > 0) {
                    const latest = history[0];
                    this._cachedScores = latest.normalizedScores || latest.scores || null;
                    if (this._cachedScores) return this._cachedScores;
                }
            }

            // Способ 2: Напрямую из localStorage
            const usersData = localStorage.getItem('personalityTestUsers');
            if (usersData) {
                const users = JSON.parse(usersData);
                const session = localStorage.getItem('currentSession');
                if (session) {
                    const sessionData = JSON.parse(session);
                    const user = users.find(u => u.id === sessionData.userId);
                    if (user && user.testHistory && user.testHistory.length > 0) {
                        // Сортируем по дате и берем последний
                        const sorted = user.testHistory.sort((a, b) =>
                            new Date(b.date) - new Date(a.date)
                        );
                        this._cachedScores = sorted[0].normalizedScores || sorted[0].scores || null;
                        return this._cachedScores;
                    }
                }
            }
        } catch (e) {
            console.error('[ProfileExtensions] Error getting scores:', e);
        }
        return null;
    }

    /**
     * Проверка доступности данных
     */
    hasData() {
        return this.getLatestScores() !== null;
    }

    /**
     * Рендер секции сравнительного анализа
     */
    renderComparativeSection() {
        const lang = this.getLang();
        const scores = this.getLatestScores();

        if (!scores || !window.comparativeAnalysis) {
            return this.renderNoDataCard(lang, 'comparative');
        }

        const roles = window.comparativeAnalysis.getRoles();
        const rolesOptions = roles.map(r =>
            `<option value="${r.id}" ${r.id === this.selectedRole ? 'selected' : ''}>${r.name}</option>`
        ).join('');

        const titles = {
            kk: 'Салыстырмалы талдау',
            ru: 'Сравнительный анализ',
            en: 'Comparative Analysis'
        };

        const selectLabels = {
            kk: 'Рөлді таңдаңыз:',
            ru: 'Выберите роль:',
            en: 'Select role:'
        };

        const matchLabels = {
            kk: 'Сәйкестік',
            ru: 'Соответствие',
            en: 'Match'
        };

        return `
            <div class="cosmic-card mb-6 fade-in" id="comparativeAnalysisSection">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="card-title">📊 ${titles[lang]}</h2>
                </div>
                <div class="card-body">
                    <div class="comparative-controls" style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                        <label for="roleSelect" style="font-weight: 500;">${selectLabels[lang]}</label>
                        <select id="roleSelect" class="form-select cosmic-select" style="max-width: 250px; padding: 0.5rem 1rem; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: inherit;" onchange="window.profileExtensions.updateComparison(this.value)">
                            ${rolesOptions}
                        </select>
                        <div id="matchBadge" style="margin-left: auto; padding: 0.5rem 1rem; border-radius: 20px; background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); color: white; font-weight: 600;">
                            ${matchLabels[lang]}: <span id="matchPercent">--</span>%
                        </div>
                    </div>
                    <div id="comparisonChartContainer" style="height: 320px; position: relative;">
                        <canvas id="comparisonChart"></canvas>
                    </div>
                    <div id="comparisonDetails" style="margin-top: 1.5rem;"></div>
                </div>
            </div>
        `;
    }

    /**
     * Карточка "нет данных"
     */
    renderNoDataCard(lang, type) {
        const messages = {
            comparative: {
                kk: 'Салыстыру үшін алдымен тестті өтіңіз',
                ru: 'Пройдите тест для сравнительного анализа',
                en: 'Complete a test for comparative analysis'
            },
            goals: {
                kk: 'Мақсат қою үшін тестті өтіңіз',
                ru: 'Пройдите тест для постановки целей',
                en: 'Complete a test to set goals'
            },
            advisor: {
                kk: 'AI-кеңесші үшін тестті өтіңіз',
                ru: 'Пройдите тест для AI-советника',
                en: 'Complete a test for AI Advisor'
            }
        };

        const titles = {
            comparative: { kk: 'Салыстырмалы талдау', ru: 'Сравнительный анализ', en: 'Comparative Analysis' },
            goals: { kk: 'Менің мақсаттарым', ru: 'Мои цели', en: 'My Goals' },
            advisor: { kk: 'AI-кеңесші', ru: 'AI-советник', en: 'AI Advisor' }
        };

        const icons = { comparative: '📊', goals: '🎯', advisor: '🤖' };

        return `
            <div class="cosmic-card mb-6 fade-in">
                <div class="card-header">
                    <h2 class="card-title">${icons[type]} ${titles[type][lang]}</h2>
                </div>
                <div class="card-body" style="text-align: center; padding: 2rem;">
                    <p style="opacity: 0.7; margin-bottom: 1rem;">${messages[type][lang]}</p>
                    <a href="index.html#test" class="btn btn-primary btn-sm">
                        ${lang === 'kk' ? 'Тестке өту' : lang === 'en' ? 'Go to Test' : 'Пройти тест'}
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Обновить сравнение при смене роли
     */
    updateComparison(roleId) {
        this.selectedRole = roleId;
        const scores = this.getLatestScores();

        if (!scores || !window.comparativeAnalysis) return;

        const comparison = window.comparativeAnalysis.compareWithRole(scores, roleId);
        if (!comparison) return;

        // Обновляем бейдж
        const matchPercent = document.getElementById('matchPercent');
        if (matchPercent) {
            matchPercent.textContent = comparison.matchPercentage;
            // Цвет в зависимости от %
            const badge = document.getElementById('matchBadge');
            if (badge) {
                if (comparison.matchPercentage >= 70) {
                    badge.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                } else if (comparison.matchPercentage >= 50) {
                    badge.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                } else {
                    badge.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                }
            }
        }

        // Обновляем график
        this.renderComparisonChart(scores, comparison);

        // Обновляем детали
        this.renderComparisonDetails(comparison);
    }

    /**
     * Рендер графика сравнения
     */
    renderComparisonChart(userScores, comparison) {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;

        // Ждём Chart.js
        if (typeof Chart === 'undefined') {
            setTimeout(() => this.renderComparisonChart(userScores, comparison), 500);
            return;
        }

        const lang = this.getLang();
        const labels = Object.keys(comparison.dimensions).map(dim => {
            const names = {
                strategic: { kk: 'Стратегия', ru: 'Стратегия', en: 'Strategy' },
                explorer: { kk: 'Зерттеуші', ru: 'Исследователь', en: 'Explorer' },
                individualism: { kk: 'Дербестік', ru: 'Индивидуализм', en: 'Individualism' },
                rationality: { kk: 'Рационалдылық', ru: 'Рациональность', en: 'Rationality' },
                adaptation: { kk: 'Бейімделу', ru: 'Адаптивность', en: 'Adaptability' },
                meaning: { kk: 'Мағына', ru: 'Смысл', en: 'Meaning' },
                intuition: { kk: 'Түйсік', ru: 'Интуиция', en: 'Intuition' },
                utility: { kk: 'Практика', ru: 'Практичность', en: 'Practicality' }
            };
            return names[dim]?.[lang] || dim;
        });

        const userLabels = { kk: 'Сіздің профиль', ru: 'Ваш профиль', en: 'Your Profile' };
        const roleLabels = { kk: 'Идеалды профиль', ru: 'Идеальный профиль', en: 'Ideal Profile' };

        const userData = Object.values(comparison.dimensions).map(d => Math.round((d.user + 1) * 50));
        const roleData = Object.values(comparison.dimensions).map(d => Math.round((d.role + 1) * 50));

        if (this.comparisonChart) {
            this.comparisonChart.destroy();
        }

        this.comparisonChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: userLabels[lang],
                        data: userData,
                        borderColor: '#00c6fb',
                        backgroundColor: 'rgba(0, 198, 251, 0.15)',
                        borderWidth: 3,
                        pointRadius: 5,
                        pointBackgroundColor: '#00c6fb',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    },
                    {
                        label: roleLabels[lang],
                        data: roleData,
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.15)',
                        borderWidth: 3,
                        pointRadius: 5,
                        pointBackgroundColor: '#f39c12',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 25,
                            color: '#94a3b8',
                            backdropColor: 'transparent',
                            font: { size: 10 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#e2e8f0',
                            font: { size: 12, weight: '500' }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e2e8f0',
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 13 }
                        }
                    }
                }
            }
        });
    }

    /**
     * Рендер деталей сравнения
     */
    renderComparisonDetails(comparison) {
        const container = document.getElementById('comparisonDetails');
        if (!container) return;

        const lang = this.getLang();

        const strengthsLabel = { kk: 'Күшті жақтарыңыз', ru: 'Ваши сильные стороны', en: 'Your Strengths' };
        const gapsLabel = { kk: 'Даму нүктелері', ru: 'Точки роста', en: 'Growth Areas' };

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">';

        if (comparison.strengths.length > 0) {
            html += `
                <div style="background: rgba(16, 185, 129, 0.1); padding: 1.25rem; border-radius: 12px; border-left: 4px solid #10b981;">
                    <h4 style="color: #10b981; margin: 0 0 0.75rem 0; font-size: 1rem;">✨ ${strengthsLabel[lang]}</h4>
                    <ul style="margin: 0; padding-left: 1.25rem; line-height: 1.8;">
                        ${comparison.strengths.map(s => `<li>${this.getDimensionName(s)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (comparison.gaps.length > 0) {
            html += `
                <div style="background: rgba(245, 158, 11, 0.1); padding: 1.25rem; border-radius: 12px; border-left: 4px solid #f59e0b;">
                    <h4 style="color: #f59e0b; margin: 0 0 0.75rem 0; font-size: 1rem;">📈 ${gapsLabel[lang]}</h4>
                    <ul style="margin: 0; padding-left: 1.25rem; line-height: 1.8;">
                        ${comparison.gaps.map(g => `<li>${this.getDimensionName(g)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (comparison.strengths.length === 0 && comparison.gaps.length === 0) {
            const perfectMatch = { kk: 'Тамаша сәйкестік!', ru: 'Отличное соответствие!', en: 'Great match!' };
            html += `
                <div style="background: rgba(16, 185, 129, 0.1); padding: 1.25rem; border-radius: 12px; text-align: center;">
                    <span style="font-size: 2rem;">🎉</span>
                    <p style="margin: 0.5rem 0 0 0; font-weight: 500;">${perfectMatch[lang]}</p>
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Получить название измерения
     */
    getDimensionName(dim) {
        const lang = this.getLang();
        const names = {
            strategic: { kk: 'Стратегиялық ойлау', ru: 'Стратегическое мышление', en: 'Strategic Thinking' },
            explorer: { kk: 'Зерттеушілік қызығушылық', ru: 'Исследовательский интерес', en: 'Explorer Interest' },
            individualism: { kk: 'Дербестік', ru: 'Индивидуализм', en: 'Individualism' },
            rationality: { kk: 'Рационалдылық', ru: 'Рациональность', en: 'Rationality' },
            adaptation: { kk: 'Бейімделу', ru: 'Адаптивность', en: 'Adaptability' },
            meaning: { kk: 'Мағына іздеу', ru: 'Поиск смысла', en: 'Meaning Seeking' },
            intuition: { kk: 'Түйсік', ru: 'Интуиция', en: 'Intuition' },
            utility: { kk: 'Практикалық', ru: 'Практичность', en: 'Practicality' }
        };
        return names[dim]?.[lang] || dim;
    }

    /**
     * Рендер секции целей
     */
    renderGoalsSection() {
        const lang = this.getLang();
        const scores = this.getLatestScores();
        const activeGoals = window.goalsService.getActiveGoals();
        const stats = window.goalsService.getGoalsStats();
        const suggestions = scores ? window.goalsService.getSuggestedGoals(scores) : [];

        // Titles and Labels
        const titles = { kk: 'Менің мақсаттарым', ru: 'Мои цели', en: 'My Goals' };
        const noGoalsLabels = { kk: 'Әлі мақсат жоқ', ru: 'Активных целей нет', en: 'No active goals' };
        const noGoalsSub = { kk: 'Төмендегі ұсыныстардан таңдаңыз', ru: 'Выберите рекомендацию или создайте свою', en: 'Choose a recommendation or create your own' };
        const suggestedLabels = { kk: 'Ұсынылған мақсаттар', ru: 'Рекомендуемые цели', en: 'Recommended Goals' };
        const addGoalLabels = { kk: 'Өз мақсатыңызды қосыңыз', ru: 'Создать свою цель', en: 'Create Custom Goal' };
        const dimensionLabel = { kk: 'Санат', ru: 'Категория', en: 'Category' };
        const targetLabel = { kk: 'Мақсат', ru: 'Цель', en: 'Target' };
        const addBtnLabel = { kk: 'Қосу', ru: 'Добавить', en: 'Add' };

        // 1. Active Goals List
        let goalsHtml = '';
        if (activeGoals.length > 0) {
            goalsHtml = `<div class="goals-list" style="display: grid; gap: 1rem;">` +
                activeGoals.map(goal => {
                    const progressValue = goal.progress.length > 0 ? goal.progress[goal.progress.length - 1].value : 0;
                    const progressPercent = Math.min(100, Math.round(progressValue / goal.targetValue * 100));

                    return `
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.25rem; border-radius: 16px; display: flex; align-items: center; gap: 1.25rem; transition: all 0.3s ease;" class="goal-card">
                        <div style="width: 48px; height: 48px; background: rgba(var(--primary-rgb), 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary-color);">
                            <span class="material-symbols-rounded">flag</span>
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; align-items: center;">
                                <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #fff;">${goal.dimensionName}</h4>
                                <span style="font-size: 0.85rem; padding: 2px 8px; background: rgba(255,255,255,0.1); border-radius: 6px; color: rgba(255,255,255,0.8);">${progressValue}% / ${goal.targetValue}%</span>
                            </div>
                            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--primary-color), var(--success-color)); border-radius: 3px;"></div>
                            </div>
                        </div>
                        <button class="btn btn-ghost btn-icon" onclick="window.profileExtensions.removeGoal('${goal.id}')" title="Remove">
                            <span class="material-symbols-rounded" style="opacity: 0.5; font-size: 1.25rem; color: #fff;">delete</span>
                        </button>
                    </div>`;
                }).join('') +
                `</div>`;
        } else {
            goalsHtml = `
                <div style="text-align: center; padding: 3rem 1rem; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px dashed rgba(255,255,255,0.1);">
                    <div style="width: 64px; height: 64px; margin: 0 auto 1rem; background: rgba(var(--primary-rgb), 0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span class="material-symbols-rounded" style="font-size: 2rem; color: var(--primary-color); opacity: 0.6;">track_changes</span>
                    </div>
                    <h4 style="margin: 0 0 0.5rem; opacity: 0.9; color: #fff;">${noGoalsLabels[lang]}</h4>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.5; color: rgba(255,255,255,0.7);">${noGoalsSub[lang]}</p>
                </div>
            `;
        }

        // 2. Suggestions
        let suggestionsHtml = '';
        if (suggestions.length > 0) {
            suggestionsHtml = `
                <div style="margin-top: 2rem;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 0.95rem; opacity: 0.7; letter-spacing: 0.5px; text-transform: uppercase; color: #fff;">⚡ ${suggestedLabels[lang]}</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                        ${suggestions.map(s => `
                            <button class="btn" onclick="window.profileExtensions.addSuggestedGoal('${s.dimension}', ${s.suggestedTarget})" 
                                style="background: rgba(var(--primary-rgb), 0.1); border: 1px solid rgba(var(--primary-rgb), 0.2); border-radius: 12px; padding: 0.75rem 1.25rem; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s ease; color: #fff;">
                                <span class="material-symbols-rounded" style="color: var(--primary-color); font-size: 1.2rem;">add_circle</span>
                                <span style="font-weight: 500;">${s.dimensionName}</span>
                                <span style="opacity: 0.5; font-size: 0.85rem; margin-left: 0.25rem; color: rgba(255,255,255,0.7);">→ ${s.suggestedTarget}%</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // 3. Custom Goal Form
        const dimensions = [
            { id: 'strategic', name: this.getDimensionName('strategic') },
            { id: 'explorer', name: this.getDimensionName('explorer') },
            { id: 'individualism', name: this.getDimensionName('individualism') },
            { id: 'rationality', name: this.getDimensionName('rationality') },
            { id: 'adaptation', name: this.getDimensionName('adaptation') },
            { id: 'meaning', name: this.getDimensionName('meaning') },
            { id: 'intuition', name: this.getDimensionName('intuition') },
            { id: 'utility', name: this.getDimensionName('utility') }
        ];

        const customGoalForm = `
            <div style="margin-top: 2rem; background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
                    <span class="material-symbols-rounded" style="color: var(--accent-color);">edit_square</span>
                    <h4 style="margin: 0; font-size: 1rem; color: #fff;">${addGoalLabels[lang]}</h4>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
                    <div style="flex-grow: 2;">
                        <label style="font-size: 0.8rem; opacity: 0.6; display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.9);">${dimensionLabel[lang]}</label>
                        <select id="customGoalDimension" class="form-select cosmic-select" style="width: 100%; height: 42px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: #fff; padding: 0 1rem;">
                            ${dimensions.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 0.8rem; opacity: 0.6; display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.9);">${targetLabel[lang]} (%)</label>
                        <input type="number" id="customGoalTarget" min="10" max="100" value="80" class="form-control cosmic-input" style="width: 100%; height: 42px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: #fff; padding: 0 1rem;">
                    </div>
                    <button class="btn btn-primary" onclick="window.profileExtensions.addCustomGoal()" style="height: 42px; padding: 0 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 8px;">
                        <span>${addBtnLabel[lang]}</span>
                        <span class="material-symbols-rounded" style="font-size: 1.2rem;">arrow_forward</span>
                    </button>
                </div>
            </div>
        `;

        return `
            <div class="cosmic-card mb-6 fade-in delay-1" id="goalsSection">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="card-title">🎯 ${titles[lang]}</h2>
                    <div style="background: rgba(var(--primary-rgb), 0.15); padding: 0.35rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; color: var(--primary-color);">
                        ${activeGoals.length} Active
                    </div>
                </div>
                <div class="card-body">
                    ${goalsHtml}
                    ${suggestionsHtml}
                    ${customGoalForm}
                </div>
            </div>
        `;
    }

    /**
     * Добавить рекомендуемую цель
     */
    addSuggestedGoal(dimension, target) {
        if (window.goalsService) {
            window.goalsService.setGoal(dimension, target);
            this.refreshGoalsSection();
        }
    }

    /**
     * Добавить свою пользовательскую цель
     */
    addCustomGoal() {
        const dimensionSelect = document.getElementById('customGoalDimension');
        const targetInput = document.getElementById('customGoalTarget');

        if (!dimensionSelect || !targetInput) return;

        const dimension = dimensionSelect.value;
        const target = parseInt(targetInput.value, 10);

        if (dimension && target >= 10 && target <= 100 && window.goalsService) {
            window.goalsService.setGoal(dimension, target);
            this.refreshGoalsSection();
        }
    }

    /**
     * Удалить цель
     */
    removeGoal(goalId) {
        if (window.goalsService) {
            window.goalsService.removeGoal(goalId);
            this.refreshGoalsSection();
        }
    }

    /**
     * Обновить только секцию целей
     */
    refreshGoalsSection() {
        const container = document.getElementById('goalsSection');
        if (container) {
            const parent = container.parentElement;
            const nextSibling = container.nextSibling;
            container.remove();

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = this.renderGoalsSection();

            if (nextSibling) {
                parent.insertBefore(tempDiv.firstElementChild, nextSibling);
            } else {
                parent.appendChild(tempDiv.firstElementChild);
            }
        }
    }

    /**
     * Рендер секции Карьеры
     */
    renderCareerSection() {
        const lang = this.getLang();
        const scores = this.getLatestScores();

        if (!scores || !window.careerService) {
            return '';
        }

        const matches = window.careerService.getTopCareers(scores, 3);
        const titles = { kk: 'Ілеспе мамандықтар', ru: 'Карьерный навигатор', en: 'Career Navigator' };
        const subtitle = { kk: 'Сіздің профиліңіз келесі мамандықтарға сәйкес келеді', ru: 'Ваш профиль наиболее совместим с этими профессиями', en: 'Your profile matches these professions best' };

        let careersHtml = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                ${matches.map((career, index) => `
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.25rem; border-radius: 16px; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: ${index === 0 ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)'};"></div>
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                            <div>
                                <h4 style="margin: 0; font-size: 1.1rem; color: #fff;">${career.title[lang] || career.title.ru}</h4>
                                <span style="font-size: 0.8rem; opacity: 0.6; display: block; margin-top: 0.25rem;">${career.category}</span>
                            </div>
                            <div style="background: rgba(var(--primary-rgb), 0.1); color: var(--primary-color); padding: 4px 8px; border-radius: 8px; font-weight: 600; font-size: 0.9rem;">
                                ${career.matchPercent}%
                            </div>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); height: 6px; border-radius: 3px; overflow: hidden;">
                            <div style="width: ${career.matchPercent}%; height: 100%; background: var(--gradient-primary); border-radius: 3px;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        return `
            <div class="cosmic-card mb-6 fade-in delay-2" id="careerSection">
                <div class="card-header">
                    <h2 class="card-title">🚀 ${titles[lang]}</h2>
                </div>
                <div class="card-body">
                    <p style="margin-bottom: 1.5rem; opacity: 0.7;">${subtitle[lang]}</p>
                    ${careersHtml}
                </div>
            </div>
        `;
    }

    /**
     * Render Cognitive Style Section
     */
    renderCognitiveSection() {
        // Try load from storage
        let results = null;
        try {
            if (typeof StorageManager !== 'undefined') {
                const storage = new StorageManager();
                results = storage.loadCognitiveResults();
            } else if (window.app && window.app.storage) {
                results = window.app.storage.loadCognitiveResults();
            }
        } catch (e) { console.warn('Coult not load cognitive results', e); }

        if (!results) return '';

        const lang = this.getLang();
        const titles = { kk: 'Когнитивтік стиль', ru: 'Когнитивный стиль', en: 'Cognitive Style' };
        const subtitle = {
            kk: 'Ақпаратты қабылдау және өңдеу стилі',
            ru: 'Стиль восприятия и обработки информации',
            en: 'Information perception and processing style'
        };

        const details = results.details || {};
        const title = details.title && details.title[lang] ? details.title[lang] : results.dominant;
        const desc = details.description && details.description[lang] ? details.description[lang] : '';

        return `
            <div class="cosmic-card mb-6 fade-in delay-2" id="cognitiveSection" style="border-left: 4px solid var(--accent-color);">
                <div class="card-header">
                    <h2 class="card-title">🧠 ${titles[lang]}</h2>
                    <span style="background: var(--accent-color); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 0.9rem;">${title}</span>
                </div>
                <div class="card-body">
                    <p style="margin-bottom: 1.5rem; opacity: 0.7;">${subtitle[lang]}</p>
                    
                     <div class="chart-container" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 80px; text-align: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: var(--secondary-color);">${results.breakdown.visual}%</div>
                            <div style="font-size: 0.8rem; opacity: 0.7;">Visual</div>
                        </div>
                        <div style="flex: 1; min-width: 80px; text-align: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: var(--secondary-color);">${results.breakdown.auditory}%</div>
                            <div style="font-size: 0.8rem; opacity: 0.7;">Auditory</div>
                        </div>
                        <div style="flex: 1; min-width: 80px; text-align: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: var(--secondary-color);">${results.breakdown.kinesthetic}%</div>
                            <div style="font-size: 0.8rem; opacity: 0.7;">Kinesthetic</div>
                        </div>
                    </div>
                    
                    <p style="opacity: 0.9; line-height: 1.6; text-align: justify;">${desc}</p>
                </div>
            </div>
        `;
    }

    /**
     * Рендер секции похожих знаменитостей
     */
    renderCelebritySection() {
        const lang = this.getLang();
        const titles = {
            kk: 'Сіз кімге ұқсайсыз',
            ru: 'На кого вы похожи',
            en: 'Who You Resemble'
        };
        const subtitles = {
            kk: 'Сіздің профиліңізге ұқсас танымал тұлғалар',
            ru: 'Известные личности со схожим профилем',
            en: 'Famous personalities with a similar profile'
        };
        const noDataText = {
            kk: 'Салыстыру үшін алдымен тестті аяқтаңыз',
            ru: 'Пройдите тест для сравнения со знаменитостями',
            en: 'Complete a test to compare with celebrities'
        };
        const matchText = {
            kk: 'ұқсастық',
            ru: 'сходство',
            en: 'match'
        };
        const categories = {
            all: { kk: 'Барлығы', ru: 'Все', en: 'All' },
            business: { kk: 'Бизнесмендер', ru: 'Бизнесмены', en: 'Business' },
            science: { kk: 'Ғалымдар', ru: 'Учёные', en: 'Scientists' },
            actors: { kk: 'Актёрлер', ru: 'Актёры', en: 'Actors' },
            athletes: { kk: 'Спортшылар', ru: 'Спортсмены', en: 'Athletes' },
            musicians: { kk: 'Музыканттар', ru: 'Музыканты', en: 'Musicians' },
            leaders: { kk: 'Көшбасшылар', ru: 'Лидеры', en: 'Leaders' }
        };

        if (!this.hasData() || !window.celebrityService) {
            return this.renderNoDataCard(lang, 'celebrity');
        }

        const scores = this.getLatestScores();
        const celebrities = window.celebrityService.findSimilarCelebrities(scores, 6);

        if (!celebrities || celebrities.length === 0) {
            return `
                <div class="profile-card" style="margin-bottom: 2rem;">
                    <div class="card-header">
                        <h3><span class="material-symbols-rounded">star</span> ${titles[lang]}</h3>
                    </div>
                    <div class="card-body">
                        <p style="text-align: center; opacity: 0.7;">${noDataText[lang]}</p>
                    </div>
                </div>
            `;
        }

        // Генерация опций категорий
        const categoryOptions = Object.entries(categories)
            .map(([id, names]) => `<option value="${id}">${names[lang]}</option>`)
            .join('');

        // Генерация карточек знаменитостей
        const celebrityCards = celebrities.map(celeb => {
            const matchColor = celeb.matchPercent >= 70 ? 'var(--success-color)' :
                celeb.matchPercent >= 50 ? 'var(--warning-color)' : 'var(--primary-color)';

            const achievementsList = Array.isArray(celeb.achievements)
                ? celeb.achievements.slice(0, 3).join(' • ')
                : celeb.achievements;

            return `
                <div class="celebrity-card" data-celebrity-id="${celeb.id}" style="
                    background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
                    border-radius: 16px;
                    padding: 1.2rem;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.3)';"
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                   onclick="window.profileExtensions.showCelebrityDetails('${celeb.id}')">
                    <div style="
                        width: 64px;
                        height: 64px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        overflow: hidden;
                        border: 2px solid rgba(255,255,255,0.2);
                    ">
                        ${celeb.photoUrl
                    ? `<img src="${celeb.photoUrl}" alt="${celeb.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'material-symbols-rounded\\' style=\\'font-size: 28px; color: white;\\'>person</span>';">`
                    : `<span class="material-symbols-rounded" style="font-size: 28px; color: white;">person</span>`
                }
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${celeb.name}</h4>
                            <span style="
                                background: ${matchColor};
                                color: white;
                                padding: 2px 8px;
                                border-radius: 12px;
                                font-size: 0.75rem;
                                font-weight: 600;
                                flex-shrink: 0;
                                margin-left: 8px;
                            ">${celeb.matchPercent}% ${matchText[lang]}</span>
                        </div>
                        <div style="font-size: 0.8rem; color: var(--primary-color); margin-bottom: 4px;">${celeb.categoryName}</div>
                        <p style="margin: 0; font-size: 0.85rem; opacity: 0.8; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${celeb.bio}</p>
                        <div style="font-size: 0.75rem; opacity: 0.6; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${achievementsList}</div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="profile-card" style="margin-bottom: 2rem;">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <h3 style="margin: 0;"><span class="material-symbols-rounded" style="color: var(--primary-color);">star</span> ${titles[lang]}</h3>
                    <select class="cosmic-select" id="celebrityCategoryFilter" onchange="window.profileExtensions.filterCelebrities(this.value)" style="
                        padding: 0.5rem 1rem;
                        border-radius: 20px;
                        border: 1px solid rgba(255,255,255,0.2);
                        background: rgba(255,255,255,0.05);
                        color: white;
                        font-size: 0.85rem;
                        cursor: pointer;
                    ">
                        ${categoryOptions}
                    </select>
                </div>
                <p style="opacity: 0.7; margin-bottom: 1.5rem; font-size: 0.9rem;">${subtitles[lang]}</p>
                <div id="celebrityCardsContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
                    ${celebrityCards}
                </div>
            </div>
        `;
    }

    /**
     * Фильтр знаменитостей по категории
     */
    filterCelebrities(category) {
        const scores = this.getLatestScores();
        if (!scores || !window.celebrityService) return;

        const celebrities = window.celebrityService.findSimilarCelebrities(scores, 6, category === 'all' ? null : category);
        const container = document.getElementById('celebrityCardsContainer');
        if (!container) return;

        const lang = this.getLang();
        const matchText = { kk: 'ұқсастық', ru: 'сходство', en: 'match' };

        if (celebrities.length === 0) {
            container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.7;">Нет знаменитостей в этой категории</p>`;
            return;
        }

        container.innerHTML = celebrities.map(celeb => {
            const matchColor = celeb.matchPercent >= 70 ? 'var(--success-color)' :
                celeb.matchPercent >= 50 ? 'var(--warning-color)' : 'var(--primary-color)';
            const achievementsList = Array.isArray(celeb.achievements)
                ? celeb.achievements.slice(0, 3).join(' • ')
                : celeb.achievements;

            return `
                <div class="celebrity-card" data-celebrity-id="${celeb.id}" style="
                    background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
                    border-radius: 16px;
                    padding: 1.2rem;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.3)';"
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                   onclick="window.profileExtensions.showCelebrityDetails('${celeb.id}')">
                    <div style="
                        width: 64px;
                        height: 64px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        overflow: hidden;
                        border: 2px solid rgba(255,255,255,0.2);
                    ">
                        ${celeb.photoUrl
                    ? `<img src="${celeb.photoUrl}" alt="${celeb.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'material-symbols-rounded\\' style=\\'font-size: 28px; color: white;\\'>person</span>';">`
                    : `<span class="material-symbols-rounded" style="font-size: 28px; color: white;">person</span>`
                }
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: white;">${celeb.name}</h4>
                            <span style="
                                background: ${matchColor};
                                color: white;
                                padding: 2px 8px;
                                border-radius: 12px;
                                font-size: 0.75rem;
                                font-weight: 600;
                                flex-shrink: 0;
                            ">${celeb.matchPercent}% ${matchText[lang]}</span>
                        </div>
                        <div style="font-size: 0.8rem; color: var(--primary-color); margin-bottom: 4px;">${celeb.categoryName}</div>
                        <p style="margin: 0; font-size: 0.85rem; opacity: 0.8; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${celeb.bio}</p>
                        <div style="font-size: 0.75rem; opacity: 0.6; margin-top: 6px;">${achievementsList}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Показать детали знаменитости в модальном окне
     */
    showCelebrityDetails(celebrityId) {
        if (!window.celebrityService || !window.app?.ui) return;

        const scores = this.getLatestScores();
        const comparison = window.celebrityService.getDetailedComparison(scores, celebrityId);
        if (!comparison) return;

        const lang = this.getLang();
        const celeb = comparison.celebrity;

        const dimensionBars = comparison.dimensions.map(d => `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                    <span>${d.name}</span>
                    <span style="opacity: 0.7;">${d.user}% vs ${d.celebrity}%</span>
                </div>
                <div style="display: flex; gap: 4px; height: 8px;">
                    <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${d.user}%; background: var(--primary-color); border-radius: 4px;"></div>
                    </div>
                    <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${d.celebrity}%; background: var(--secondary-color); border-radius: 4px;"></div>
                    </div>
                </div>
            </div>
        `).join('');

        const strengthsHtml = comparison.strengths.length > 0
            ? `<div style="margin-top: 1rem; padding: 1rem; background: rgba(34, 197, 94, 0.1); border-radius: 12px; border-left: 3px solid var(--success-color);">
                <strong style="color: var(--success-color);">✓ Общие сильные стороны:</strong> ${comparison.strengths.join(', ')}
            </div>`
            : '';

        const content = `
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: center;">
                <div style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    border: 3px solid rgba(255,255,255,0.2);
                ">
                    ${celeb.photoUrl
                ? `<img src="${celeb.photoUrl}" alt="${celeb.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<span style=\\'font-size: 36px; color: white;\\'>👤</span>';">`
                : '<span style="font-size: 36px; color: white;">👤</span>'
            }
                </div>
                <div>
                    <h3 style="margin: 0 0 4px 0;">${celeb.name}</h3>
                    <div style="color: var(--primary-color); font-size: 0.9rem;">${celeb.categoryName}</div>
                    <div style="
                        margin-top: 8px;
                        display: inline-block;
                        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 0.9rem;
                        font-weight: 600;
                    ">${comparison.overallMatch}% совпадение</div>
                </div>
            </div>
            <p style="opacity: 0.9; line-height: 1.6; margin-bottom: 1.5rem;">${celeb.bio}</p>
            <h4 style="margin-bottom: 1rem;">Сравнение профилей</h4>
            <div style="margin-bottom: 8px; display: flex; gap: 1rem; font-size: 0.8rem; opacity: 0.7;">
                <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 12px; height: 12px; background: var(--primary-color); border-radius: 2px;"></span> Вы</span>
                <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 12px; height: 12px; background: var(--secondary-color); border-radius: 2px;"></span> ${celeb.name}</span>
            </div>
            ${dimensionBars}
            ${strengthsHtml}
        `;

        window.app.ui.showModal({
            title: celeb.name,
            content: content,
            actions: [{ text: 'Закрыть', class: 'btn-primary', closeAfter: true, onClick: () => { } }]
        });
    }

    /**
     * Рендер секции детальных тестов
     */
    renderDetailedTestsSection() {
        const lang = this.getLang();
        const titles = {
            kk: 'Терең тесттер',
            ru: 'Детальные тесты',
            en: 'Detailed Tests'
        };
        const subtitles = {
            kk: 'Өзіңіздің жеке қасиеттеріңізді тереңірек зерттеңіз',
            ru: 'Исследуйте свои качества глубже',
            en: 'Explore your qualities more deeply'
        };
        const startText = { kk: 'Бастау', ru: 'Начать', en: 'Start' };
        const viewResultsText = { kk: 'Нәтижелер', ru: 'Результаты', en: 'Results' };
        const notCompletedText = { kk: 'Өтілмеген', ru: 'Не пройден', en: 'Not completed' };

        if (!window.detailedTestsService) {
            return '';
        }

        const tests = window.detailedTestsService.getAvailableTests();
        if (!tests || tests.length === 0) {
            return '';
        }

        const testCards = tests.map(test => {
            const hasResults = test.hasResults;
            const latestResults = hasResults ? window.detailedTestsService.getLatestResults(test.id) : null;

            return `
                <div class="detailed-test-card" style="
                    background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
                    border-radius: 16px;
                    padding: 1.5rem;
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                ">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="
                            width: 50px;
                            height: 50px;
                            border-radius: 12px;
                            background: ${test.color};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                        ">
                            <span class="material-symbols-rounded" style="color: white; font-size: 24px;">${test.icon}</span>
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 4px 0; font-size: 1rem; font-weight: 600;">${test.name}</h4>
                            <div style="font-size: 0.8rem; opacity: 0.7;">${test.questionCount} вопросов • ${test.duration} мин</div>
                        </div>
                    </div>
                    
                    <p style="margin: 0; font-size: 0.85rem; opacity: 0.8; line-height: 1.5;">${test.description}</p>
                    
                    ${hasResults ? `
                        <div style="
                            background: rgba(255,255,255,0.05);
                            border-radius: 12px;
                            padding: 1rem;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        ">
                            <div>
                                <div style="font-size: 0.75rem; opacity: 0.6;">Последний результат</div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: ${test.color};">${latestResults?.overallScore || 0}%</div>
                            </div>
                            <div style="
                                padding: 4px 12px;
                                background: ${latestResults?.overallScore >= 70 ? 'rgba(34, 197, 94, 0.2)' : latestResults?.overallScore >= 40 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
                                color: ${latestResults?.overallScore >= 70 ? 'var(--success-color)' : latestResults?.overallScore >= 40 ? 'var(--warning-color)' : 'var(--danger-color)'};
                                border-radius: 20px;
                                font-size: 0.8rem;
                                font-weight: 600;
                            ">${latestResults?.overallInterpretation?.label || ''}</div>
                        </div>
                    ` : `
                        <div style="
                            background: rgba(255,255,255,0.03);
                            border-radius: 12px;
                            padding: 1rem;
                            text-align: center;
                            font-size: 0.85rem;
                            opacity: 0.6;
                        ">${notCompletedText[lang]}</div>
                    `}
                    
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="window.profileExtensions.startDetailedTest('${test.id}')" style="
                            flex: 1;
                            padding: 0.75rem;
                            border-radius: 10px;
                            border: none;
                            background: linear-gradient(135deg, ${test.color}, ${test.color}cc);
                            color: white;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 0.5rem;
                        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
                            <span class="material-symbols-rounded" style="font-size: 18px;">play_arrow</span>
                            ${startText[lang]}
                        </button>
                        ${hasResults ? `
                            <button onclick="window.profileExtensions.showDetailedTestResults('${test.id}')" style="
                                padding: 0.75rem 1rem;
                                border-radius: 10px;
                                border: 1px solid rgba(255,255,255,0.2);
                                background: transparent;
                                color: white;
                                font-weight: 500;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                                ${viewResultsText[lang]}
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="profile-card" style="margin-bottom: 2rem;">
                <div class="card-header">
                    <h3><span class="material-symbols-rounded" style="color: var(--primary-color);">quiz</span> ${titles[lang]}</h3>
                </div>
                <p style="opacity: 0.7; margin-bottom: 1.5rem; font-size: 0.9rem;">${subtitles[lang]}</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${testCards}
                </div>
            </div>
        `;
    }

    /**
     * Начать детальный тест
     */
    startDetailedTest(testId) {
        const test = window.detailedTestsService?.getTestById(testId);
        if (!test) return;

        // Показываем модальное окно с тестом
        this.showDetailedTestModal(test);
    }

    /**
     * Показать модальное окно с детальным тестом
     */
    showDetailedTestModal(test) {
        if (!window.app?.ui) return;

        const lang = this.getLang();
        const answerScale = window.detailedTestsService.getAnswerScale();

        // Состояние теста
        let currentQuestion = 0;
        const answers = {};
        const questions = test.questions;

        const renderQuestion = (index) => {
            const q = questions[index];
            const scaleButtons = answerScale.map(s => `
                <button 
                    class="scale-btn ${answers[q.id] === s.value ? 'selected' : ''}" 
                    data-value="${s.value}"
                    style="
                        padding: 0.75rem 0.5rem;
                        border-radius: 8px;
                        border: 1px solid ${answers[q.id] === s.value ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)'};
                        background: ${answers[q.id] === s.value ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(255,255,255,0.05)'};
                        color: white;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-size: 0.75rem;
                        text-align: center;
                    "
                    onclick="window.profileExtensions._selectAnswer('${q.id}', ${s.value})"
                >${s.label}</button>
            `).join('');

            return `
                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.85rem; opacity: 0.7;">
                        <span>${test.dimensionNames[q.dimension]}</span>
                        <span>${index + 1} / ${questions.length}</span>
                    </div>
                    <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 1.5rem;">
                        <div style="height: 100%; width: ${((index + 1) / questions.length) * 100}%; background: var(--primary-color); border-radius: 2px; transition: width 0.3s ease;"></div>
                    </div>
                    <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">${q.text}</p>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;" id="scaleButtons">
                        ${scaleButtons}
                    </div>
                </div>
            `;
        };

        // Сохраняем состояние теста
        this._currentTest = { test, currentQuestion, answers, questions };

        const content = `
            <div id="testQuestionContainer">
                ${renderQuestion(0)}
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button id="prevQuestionBtn" style="
                    flex: 1;
                    padding: 0.75rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.2);
                    background: transparent;
                    color: white;
                    cursor: pointer;
                    display: none;
                " onclick="window.profileExtensions._prevQuestion()">← Назад</button>
                <button id="nextQuestionBtn" style="
                    flex: 2;
                    padding: 0.75rem;
                    border-radius: 10px;
                    border: none;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                " onclick="window.profileExtensions._nextQuestion()">Далее →</button>
            </div>
        `;

        window.app.ui.showModal({
            title: test.name,
            content: content,
            persistent: true,
            actions: []
        });
    }

    /**
     * Выбор ответа
     */
    _selectAnswer(questionId, value) {
        if (!this._currentTest) return;
        this._currentTest.answers[questionId] = value;

        // Обновляем UI кнопок
        document.querySelectorAll('.scale-btn').forEach(btn => {
            const btnValue = parseInt(btn.dataset.value);
            btn.style.border = btnValue === value ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.2)';
            btn.style.background = btnValue === value ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(255,255,255,0.05)';
        });
    }

    /**
     * Следующий вопрос
     */
    _nextQuestion() {
        if (!this._currentTest) return;

        const { test, questions, answers } = this._currentTest;
        const currentQ = questions[this._currentTest.currentQuestion];

        if (!answers[currentQ.id]) {
            // Требуем ответ
            return;
        }

        if (this._currentTest.currentQuestion < questions.length - 1) {
            this._currentTest.currentQuestion++;
            this._updateQuestionUI();
        } else {
            // Завершаем тест
            this._finishDetailedTest();
        }
    }

    /**
     * Предыдущий вопрос
     */
    _prevQuestion() {
        if (!this._currentTest || this._currentTest.currentQuestion <= 0) return;
        this._currentTest.currentQuestion--;
        this._updateQuestionUI();
    }

    /**
     * Обновить UI вопроса
     */
    _updateQuestionUI() {
        if (!this._currentTest) return;

        const { test, questions, answers, currentQuestion } = this._currentTest;
        const q = questions[currentQuestion];
        const answerScale = window.detailedTestsService.getAnswerScale();

        const container = document.getElementById('testQuestionContainer');
        if (!container) return;

        const scaleButtons = answerScale.map(s => `
            <button 
                class="scale-btn" 
                data-value="${s.value}"
                style="
                    padding: 0.75rem 0.5rem;
                    border-radius: 8px;
                    border: 1px solid ${answers[q.id] === s.value ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)'};
                    background: ${answers[q.id] === s.value ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(255,255,255,0.05)'};
                    color: white;
                    cursor: pointer;
                    font-size: 0.75rem;
                    text-align: center;
                "
                onclick="window.profileExtensions._selectAnswer('${q.id}', ${s.value})"
            >${s.label}</button>
        `).join('');

        container.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.85rem; opacity: 0.7;">
                    <span>${test.dimensionNames[q.dimension]}</span>
                    <span>${currentQuestion + 1} / ${questions.length}</span>
                </div>
                <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 1.5rem;">
                    <div style="height: 100%; width: ${((currentQuestion + 1) / questions.length) * 100}%; background: var(--primary-color); border-radius: 2px;"></div>
                </div>
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">${q.text}</p>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
                    ${scaleButtons}
                </div>
            </div>
        `;

        // Обновляем кнопки навигации
        const prevBtn = document.getElementById('prevQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');

        if (prevBtn) {
            prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
        }
        if (nextBtn) {
            nextBtn.textContent = currentQuestion >= questions.length - 1 ? 'Завершить ✓' : 'Далее →';
        }
    }

    /**
     * Завершить детальный тест
     */
    _finishDetailedTest() {
        if (!this._currentTest) return;

        const { test, answers } = this._currentTest;
        const results = window.detailedTestsService.calculateResults(test.id, answers);

        if (results) {
            window.detailedTestsService.saveTestResults(results);
            this.showDetailedTestResults(test.id);
        }

        this._currentTest = null;
    }

    /**
     * Показать результаты детального теста
     */
    showDetailedTestResults(testId) {
        if (!window.app?.ui || !window.detailedTestsService) return;

        const results = window.detailedTestsService.getLatestResults(testId);
        if (!results) return;

        const recommendations = window.detailedTestsService.getRecommendations(testId);

        const dimensionBars = Object.entries(results.dimensions).map(([key, dim]) => {
            const color = dim.score >= 70 ? 'var(--success-color)' : dim.score >= 40 ? 'var(--warning-color)' : 'var(--danger-color)';
            return `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.9rem;">
                        <span>${dim.name}</span>
                        <span style="font-weight: 600; color: ${color};">${dim.score}%</span>
                    </div>
                    <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${dim.score}%; background: ${color}; border-radius: 4px;"></div>
                    </div>
                    <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 4px;">${dim.interpretation.description}</div>
                </div>
            `;
        }).join('');

        const recsHtml = recommendations.length > 0 ? `
            <h4 style="margin: 1.5rem 0 1rem 0;">Рекомендации</h4>
            ${recommendations.map(r => `
                <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 0.75rem; border-left: 3px solid ${r.level === 'high' ? 'var(--success-color)' : r.level === 'low' ? 'var(--warning-color)' : 'var(--primary-color)'};">
                    <div style="font-weight: 600; margin-bottom: 4px;">${r.dimension}</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">${r.tip}</div>
                </div>
            `).join('')}
        ` : '';

        const content = `
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem auto;
                ">
                    <span style="font-size: 2.5rem; font-weight: 700; color: white;">${results.overallScore}%</span>
                </div>
                <div style="font-size: 1.2rem; font-weight: 600;">${results.overallInterpretation.label}</div>
                <div style="font-size: 0.9rem; opacity: 0.7;">${results.overallInterpretation.description}</div>
            </div>
            
            <h4 style="margin-bottom: 1rem;">Результаты по измерениям</h4>
            ${dimensionBars}
            ${recsHtml}
        `;

        window.app.ui.showModal({
            title: `Результаты: ${results.testName}`,
            content: content,
            actions: [{ text: 'Закрыть', class: 'btn-primary', closeAfter: true, onClick: () => { } }]
        });
    }

    /**
     * Рендер секции совместимости
     */
    renderCompatibilitySection() {
        const lang = this.getLang();
        const scores = this.getLatestScores();

        if (!scores || !window.compatibilityService) {
            return '';
        }

        const titles = {
            kk: 'Үйлесімділік болжамы',
            ru: 'Прогноз совместимости',
            en: 'Compatibility Forecast'
        };
        const subtitles = {
            kk: 'Белгілі тұлғалармен үйлесімділігіңізді тексеріңіз',
            ru: 'Проверьте свою совместимость со знаменитостями',
            en: 'Check your compatibility with celebrities'
        };
        const selectText = { kk: 'Таңдаңыз', ru: 'Выберите', en: 'Select' };
        const compareText = { kk: 'Салыстыру', ru: 'Сравнить', en: 'Compare' };

        // Получаем список знаменитостей
        const celebrities = window.CELEBRITY_PROFILES?.profiles || [];
        const celebrityOptions = celebrities.map(c => {
            const name = typeof c.name === 'object' ? (c.name[lang] || c.name.ru) : c.name;
            return `<option value="${c.id}">${name}</option>`;
        }).join('');

        // Топ-3 совместимых
        const topCompatible = window.compatibilityService.findMostCompatibleCelebrities(scores, 3);

        const topCardsHtml = topCompatible.map(item => {
            const name = typeof item.celebrity.name === 'object'
                ? (item.celebrity.name[lang] || item.celebrity.name.ru)
                : item.celebrity.name;
            const scoreColor = item.overallScore >= 70 ? 'var(--success-color)' :
                item.overallScore >= 50 ? 'var(--warning-color)' : 'var(--danger-color)';

            return `
                <div class="compat-card" style="
                    background: rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 1rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255,255,255,0.1);
                " onclick="window.profileExtensions.showCompatibilityDetails('${item.celebrity.id}')"
                   onmouseover="this.style.transform='translateY(-4px)';this.style.borderColor='var(--primary-color)'"
                   onmouseout="this.style.transform='none';this.style.borderColor='rgba(255,255,255,0.1)'">
                    <div style="
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, ${scoreColor}, ${scoreColor}aa);
                        margin: 0 auto 0.75rem auto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        font-weight: 700;
                        color: white;
                    ">${item.overallScore}%</div>
                    <div style="font-weight: 600; font-size: 0.9rem;">${name}</div>
                    <div style="font-size: 0.75rem; opacity: 0.6; margin-top: 4px;">${item.label}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="profile-card" style="margin-bottom: 2rem;">
                <div class="card-header">
                    <h3><span class="material-symbols-rounded" style="color: var(--primary-color);">diversity_3</span> ${titles[lang]}</h3>
                </div>
                <p style="opacity: 0.7; margin-bottom: 1.5rem; font-size: 0.9rem;">${subtitles[lang]}</p>
                
                <!-- Топ совместимых -->
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 0.95rem; margin-bottom: 1rem; opacity: 0.9;">🏆 Топ совместимости</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;">
                        ${topCardsHtml}
                    </div>
                </div>
                
                <!-- Сравнение с выбранной знаменитостью -->
                <div style="
                    background: rgba(255,255,255,0.03);
                    border-radius: 12px;
                    padding: 1.25rem;
                    border: 1px solid rgba(255,255,255,0.08);
                ">
                    <div style="font-size: 0.9rem; margin-bottom: 1rem; opacity: 0.8;">Сравниться с:</div>
                    <div style="display: flex; gap: 0.75rem;">
                        <select id="compatCelebritySelect" style="
                            flex: 1;
                            padding: 0.75rem 1rem;
                            border-radius: 10px;
                            border: 1px solid rgba(255,255,255,0.2);
                            background: rgba(255,255,255,0.05);
                            color: white;
                            font-size: 0.9rem;
                            cursor: pointer;
                        ">
                            <option value="">${selectText[lang]}...</option>
                            ${celebrityOptions}
                        </select>
                        <button onclick="window.profileExtensions.compareCelebrity()" style="
                            padding: 0.75rem 1.5rem;
                            border-radius: 10px;
                            border: none;
                            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                            color: white;
                            font-weight: 600;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        ">
                            <span class="material-symbols-rounded" style="font-size: 18px;">compare</span>
                            ${compareText[lang]}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Сравнить со знаменитостью (по выбору)
     */
    compareCelebrity() {
        const select = document.getElementById('compatCelebritySelect');
        if (!select || !select.value) return;
        this.showCompatibilityDetails(select.value);
    }

    /**
     * Показать детали совместимости
     */
    showCompatibilityDetails(celebrityId) {
        if (!window.app?.ui || !window.compatibilityService) return;

        const scores = this.getLatestScores();
        if (!scores) return;

        const result = window.compatibilityService.compareWithCelebrity(scores, celebrityId);
        if (!result) return;

        const lang = this.getLang();
        const name = typeof result.celebrity.name === 'object'
            ? (result.celebrity.name[lang] || result.celebrity.name.ru)
            : result.celebrity.name;

        // Gauge
        const gaugeColor = result.overallScore >= 70 ? 'var(--success-color)' :
            result.overallScore >= 50 ? 'var(--warning-color)' : 'var(--danger-color)';
        const rotation = (result.overallScore / 100) * 180 - 90;

        // Dimension bars
        const dimBars = Object.entries(result.dimensions).map(([dim, score]) => {
            const dimLabel = window.compatibilityService.dimensionLabels[lang]?.[dim] || dim;
            const barColor = score >= 70 ? 'var(--success-color)' : score >= 50 ? 'var(--warning-color)' : 'var(--danger-color)';
            return `
                <div style="margin-bottom: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                        <span>${dimLabel}</span>
                        <span style="font-weight: 600;">${score}%</span>
                    </div>
                    <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; width: ${score}%; background: ${barColor}; border-radius: 3px;"></div>
                    </div>
                </div>
            `;
        }).join('');

        // Synergies and conflicts
        const synergiesHtml = result.synergies.length > 0 ? `
            <div style="margin-top: 1rem;">
                <div style="font-weight: 600; color: var(--success-color); margin-bottom: 0.5rem;">💚 Области синергии</div>
                ${result.synergies.map(s => `
                    <div style="padding: 0.5rem; background: rgba(34,197,94,0.1); border-radius: 8px; margin-bottom: 0.5rem; font-size: 0.85rem;">
                        ${s.dimension} (${s.score}%)
                    </div>
                `).join('')}
            </div>
        ` : '';

        const conflictsHtml = result.conflicts.length > 0 ? `
            <div style="margin-top: 1rem;">
                <div style="font-weight: 600; color: var(--warning-color); margin-bottom: 0.5rem;">⚠️ Области напряжения</div>
                ${result.conflicts.map(c => `
                    <div style="padding: 0.5rem; background: rgba(251,191,36,0.1); border-radius: 8px; margin-bottom: 0.5rem; font-size: 0.85rem;">
                        ${c.dimension} (${c.score}%)
                    </div>
                `).join('')}
            </div>
        ` : '';

        // Recommendations
        const recommendations = window.compatibilityService.generateRecommendations(result);
        const recsHtml = recommendations.length > 0 ? `
            <h4 style="margin: 1.5rem 0 1rem 0;">Рекомендации по взаимодействию</h4>
            ${recommendations.map(r => `
                <div style="
                    padding: 1rem;
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                    margin-bottom: 0.75rem;
                    border-left: 3px solid ${r.type === 'synergy' ? 'var(--success-color)' : 'var(--warning-color)'};
                ">
                    <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">${r.dimension}</div>
                    <div style="font-size: 0.85rem; opacity: 0.9;">${r.advice}</div>
                </div>
            `).join('')}
        ` : '';

        const content = `
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <!-- Gauge circle -->
                <div style="
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: conic-gradient(${gaugeColor} 0deg, ${gaugeColor} ${result.overallScore * 3.6}deg, rgba(255,255,255,0.1) ${result.overallScore * 3.6}deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem auto;
                    position: relative;
                ">
                    <div style="
                        width: 90px;
                        height: 90px;
                        border-radius: 50%;
                        background: var(--bg-secondary);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                    ">
                        <span style="font-size: 2rem; font-weight: 700;">${result.overallScore}%</span>
                    </div>
                </div>
                <div style="font-size: 1.1rem; font-weight: 600;">${result.label}</div>
                <div style="font-size: 0.9rem; opacity: 0.7;">с ${name}</div>
            </div>
            
            <h4 style="margin-bottom: 1rem;">По измерениям</h4>
            ${dimBars}
            ${synergiesHtml}
            ${conflictsHtml}
            ${recsHtml}
        `;

        window.app.ui.showModal({
            title: `Совместимость с ${name}`,
            content: content,
            actions: [{ text: 'Закрыть', class: 'btn-primary', closeAfter: true, onClick: () => { } }]
        });
    }

    /**
     * Рендер секции персонализированного контента
     */
    renderContentSection() {
        const lang = this.getLang();
        const scores = this.getLatestScores();

        if (!scores || !window.contentService) {
            return '';
        }

        const titles = {
            kk: 'Дамуға арналған контент',
            ru: 'Контент для развития',
            en: 'Content for Growth'
        };
        const tabLabels = {
            kk: { books: 'Кітаптар', courses: 'Курстар', exercises: 'Жаттығулар' },
            ru: { books: 'Книги', courses: 'Курсы', exercises: 'Упражнения' },
            en: { books: 'Books', courses: 'Courses', exercises: 'Exercises' }
        };
        const addToPlanText = { kk: 'Жоспарға қосу', ru: 'В план', en: 'Add to plan' };
        const inPlanText = { kk: 'Жоспарда', ru: 'В плане', en: 'In plan' };

        // Получаем рекомендации
        const books = window.contentService.getRecommendedBooks(scores, 4);
        const courses = window.contentService.getRecommendedCourses(scores, 3);
        const exercises = window.contentService.getExercises(null, 3);

        // Карточки книг
        const booksHtml = books.map(book => `
            <div class="content-card" style="
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 1rem;
                border: 1px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <span style="font-size: 2rem;">${book.icon}</span>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 4px 0; font-size: 0.95rem;">${book.title}</h4>
                        <div style="font-size: 0.8rem; opacity: 0.6;">${book.author}</div>
                    </div>
                </div>
                <p style="margin: 0.75rem 0; font-size: 0.85rem; opacity: 0.8; line-height: 1.4;">${book.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="
                        font-size: 0.75rem;
                        padding: 4px 8px;
                        background: rgba(255,255,255,0.1);
                        border-radius: 6px;
                    ">${book.difficultyLabel}</span>
                    <button onclick="window.profileExtensions.togglePlan('${book.id}')" style="
                        padding: 6px 12px;
                        border-radius: 8px;
                        border: none;
                        background: ${book.inPlan ? 'var(--success-color)' : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'};
                        color: white;
                        font-size: 0.8rem;
                        cursor: pointer;
                    ">${book.inPlan ? inPlanText[lang] : addToPlanText[lang]}</button>
                </div>
            </div>
        `).join('');

        // Карточки курсов
        const coursesHtml = courses.map(course => `
            <div class="content-card" style="
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 1rem;
                border: 1px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <span style="font-size: 2rem;">${course.icon}</span>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 4px 0; font-size: 0.95rem;">${course.title}</h4>
                        <div style="font-size: 0.8rem; opacity: 0.6;">${course.platform} • ${course.duration}</div>
                    </div>
                </div>
                <p style="margin: 0.75rem 0; font-size: 0.85rem; opacity: 0.8; line-height: 1.4;">${course.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="
                        font-size: 0.75rem;
                        padding: 4px 8px;
                        background: rgba(255,255,255,0.1);
                        border-radius: 6px;
                    ">${course.difficultyLabel}</span>
                    <button onclick="window.profileExtensions.togglePlan('${course.id}')" style="
                        padding: 6px 12px;
                        border-radius: 8px;
                        border: none;
                        background: ${course.inPlan ? 'var(--success-color)' : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'};
                        color: white;
                        font-size: 0.8rem;
                        cursor: pointer;
                    ">${course.inPlan ? inPlanText[lang] : addToPlanText[lang]}</button>
                </div>
            </div>
        `).join('');

        // Карточки упражнений
        const exercisesHtml = exercises.map(ex => `
            <div class="content-card" style="
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 1rem;
                border: 1px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <span style="font-size: 2rem;">${ex.icon}</span>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 4px 0; font-size: 0.95rem;">${ex.title}</h4>
                        <div style="font-size: 0.8rem; opacity: 0.6;">${ex.duration} • ${ex.frequency === 'daily' ? 'Ежедневно' : ex.frequency}</div>
                    </div>
                </div>
                <p style="margin: 0.75rem 0; font-size: 0.85rem; opacity: 0.8; line-height: 1.4;">${ex.description}</p>
                <button onclick="window.profileExtensions.showExerciseDetails('${ex.id}')" style="
                    width: 100%;
                    padding: 8px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.2);
                    background: transparent;
                    color: white;
                    font-size: 0.85rem;
                    cursor: pointer;
                ">Подробнее →</button>
            </div>
        `).join('');

        return `
            <div class="profile-card" style="margin-bottom: 2rem;">
                <div class="card-header">
                    <h3><span class="material-symbols-rounded" style="color: var(--primary-color);">auto_stories</span> ${titles[lang]}</h3>
                </div>
                
                <!-- Табы -->
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                    <button class="content-tab active" data-tab="books" onclick="window.profileExtensions.switchContentTab('books')" style="
                        padding: 0.5rem 1rem;
                        border-radius: 8px 8px 0 0;
                        border: none;
                        background: var(--primary-color);
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                    ">📚 ${tabLabels[lang].books}</button>
                    <button class="content-tab" data-tab="courses" onclick="window.profileExtensions.switchContentTab('courses')" style="
                        padding: 0.5rem 1rem;
                        border-radius: 8px 8px 0 0;
                        border: none;
                        background: rgba(255,255,255,0.1);
                        color: white;
                        font-weight: 500;
                        cursor: pointer;
                    ">🎓 ${tabLabels[lang].courses}</button>
                    <button class="content-tab" data-tab="exercises" onclick="window.profileExtensions.switchContentTab('exercises')" style="
                        padding: 0.5rem 1rem;
                        border-radius: 8px 8px 0 0;
                        border: none;
                        background: rgba(255,255,255,0.1);
                        color: white;
                        font-weight: 500;
                        cursor: pointer;
                    ">🏃 ${tabLabels[lang].exercises}</button>
                </div>
                
                <!-- Контент табов -->
                <div id="contentTabBooks" class="content-tab-pane" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;">
                    ${booksHtml}
                </div>
                <div id="contentTabCourses" class="content-tab-pane" style="display: none; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;">
                    ${coursesHtml}
                </div>
                <div id="contentTabExercises" class="content-tab-pane" style="display: none; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;">
                    ${exercisesHtml}
                </div>
            </div>
        `;
    }

    /**
     * Переключить таб контента
     */
    switchContentTab(tabName) {
        // Скрываем все панели
        document.querySelectorAll('.content-tab-pane').forEach(pane => {
            pane.style.display = 'none';
        });

        // Сбрасываем стили табов
        document.querySelectorAll('.content-tab').forEach(tab => {
            tab.style.background = 'rgba(255,255,255,0.1)';
        });

        // Показываем выбранную панель
        const paneId = 'contentTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
        const pane = document.getElementById(paneId);
        if (pane) {
            pane.style.display = 'grid';
        }

        // Активируем таб
        const activeTab = document.querySelector(`.content-tab[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.style.background = 'var(--primary-color)';
        }
    }

    /**
     * Добавить/убрать из плана
     */
    togglePlan(contentId) {
        if (!window.contentService) return;

        const progress = window.contentService.getProgress();
        if (progress.inPlan?.includes(contentId)) {
            window.contentService.removeFromPlan(contentId);
        } else {
            window.contentService.addToPlan(contentId);
        }

        // Обновляем отображение (простое обновление страницы)
        location.reload();
    }

    /**
     * Показать детали упражнения
     */
    showExerciseDetails(exerciseId) {
        if (!window.app?.ui || !window.contentService) return;

        const exercises = window.contentService.getExercises();
        const ex = exercises.find(e => e.id === exerciseId);
        if (!ex) return;

        const instructionsList = ex.instructions.map((step, i) => `
            <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
                <div style="
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    flex-shrink: 0;
                ">${i + 1}</div>
                <div style="font-size: 0.95rem; line-height: 1.5;">${step}</div>
            </div>
        `).join('');

        const content = `
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <span style="font-size: 4rem;">${ex.icon}</span>
                <div style="margin-top: 0.5rem; opacity: 0.7;">${ex.duration} • ${ex.difficultyLabel}</div>
            </div>
            <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">${ex.description}</p>
            <h4 style="margin-bottom: 1rem;">Как выполнять:</h4>
            ${instructionsList}
        `;

        window.app.ui.showModal({
            title: ex.title,
            content: content,
            actions: [
                { text: 'Добавить в план', class: 'btn-primary', closeAfter: true, onClick: () => window.contentService.addToPlan(exerciseId) },
                { text: 'Закрыть', closeAfter: true, onClick: () => { } }
            ]
        });
    }

    /**
     * Рендер секции AI-советника
     */
    renderAIAdvisorSection() {
        const lang = this.getLang();
        const scores = this.getLatestScores();

        if (!scores || !window.aiAdvisor) {
            return this.renderNoDataCard(lang, 'advisor');
        }

        const report = window.aiAdvisor.getFullReport(scores);

        const titles = { kk: 'AI-кеңесші', ru: 'AI-советник', en: 'AI Advisor' };
        const planTitles = { kk: '30 күндік даму жоспары', ru: '30-дневный план развития', en: '30-Day Development Plan' };

        // Инсайты
        let insightsHtml = '';
        if (report.insights && report.insights.length > 0) {
            insightsHtml = report.insights.map(insight => `
                <div style="background: rgba(var(--primary-rgb), 0.08); padding: 1rem 1.25rem; border-radius: 12px; margin-bottom: 0.75rem; display: flex; gap: 1rem; align-items: flex-start;">
                    <span class="material-symbols-rounded" style="color: var(--primary-color); font-size: 1.5rem;">${insight.icon || 'lightbulb'}</span>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${insight.title}</h4>
                        <p style="margin: 0; opacity: 0.85; font-size: 0.95rem; line-height: 1.6; text-align: justify;">${insight.text}</p>
                    </div>
                </div>
            `).join('');
        }

        // 30-дневный план
        let planHtml = '';
        if (report.plan && report.plan.length > 0) {
            planHtml = `
                <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">${planTitles[lang]}</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                        ${report.plan.map((week, i) => `
                            <div style="background: rgba(var(--primary-rgb), 0.05); padding: 1.25rem; border-radius: 12px; border-top: 3px solid var(--primary-color);">
                                <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-color); font-size: 0.95rem;">${week.title}</h4>
                                <p style="margin: 0 0 0.75rem 0; font-weight: 600; font-size: 0.9rem; opacity: 0.9;">${week.focus || ''}</p>
                                <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.85rem; line-height: 1.7; opacity: 0.85;">
                                    ${week.tasks.map(task => `<li>${task}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return `
            <div class="cosmic-card mb-6 fade-in delay-2" id="aiAdvisorSection">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="card-title">🤖 ${titles[lang]}</h2>
                    <button class="btn btn-ghost btn-icon" onclick="window.profileExtensions.showAIInfo()" title="Info" style="opacity: 0.7;">
                        <span class="material-symbols-rounded">info</span>
                    </button>
                </div>
                <div class="card-body">
                    ${insightsHtml}
                    ${planHtml}
                </div>
            </div>
        `;
    }

    /**
     * Получить все секции расширений
     */
    getAllSections() {
        this._cachedScores = null; // Сброс кэша
        const styles = `
            <style>
                .cosmic-select option {
                    background-color: #1e1e2d;
                    color: #fff;
                    padding: 8px;
                }
                .cosmic-select:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
                }
                .cosmic-input {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    color: #e2e8f0 !important;
                }
                .cosmic-input:focus {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    border-color: var(--primary-color) !important;
                    color: #fff !important;
                    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2) !important;
                }
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 5px rgba(var(--primary-rgb), 0.3); }
                    50% { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.6); }
                    100% { box-shadow: 0 0 5px rgba(var(--primary-rgb), 0.3); }
                }
                .evolution-badge {
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-left: 10px;
                    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.4);
                    animation: pulse-glow 2s infinite;
                }
            </style>
        `;
        // Ensure binding context if methods are called directly
        return styles + this.renderCelebritySection() + this.renderDetailedTestsSection() + this.renderCompatibilitySection() + this.renderContentSection() + this.renderComparativeSection() + this.renderGoalsSection() + this.renderCareerSection() + this.renderCognitiveSection() + this.renderAIAdvisorSection();
    }

    /**
     * Инициализировать после загрузки DOM
     */
    initAfterRender() {
        // Инициализируем график сравнения с дефолтной ролью
        setTimeout(() => {
            if (this.hasData()) {
                this.updateComparison(this.selectedRole);
            }
        }, 800);
    }
    /**
     * Показать информацию об AI-советнике
     */
    showAIInfo() {
        if (window.app && window.app.ui) {
            const lang = this.getLang();
            const titles = { kk: 'AI-кеңесші туралы', ru: 'Об AI-советнике', en: 'About AI Advisor' };
            const content = {
                kk: '<p>AI-кеңесші сіздің профиліңізді талдайды және жекелендірілген ұсыныстар береді.</p>',
                ru: `
                    <p style="margin-bottom: 1rem; line-height: 1.6;">AI-советник — это интеллектуальный модуль, который анализирует ваши результаты тестов и выявляет скрытые закономерности.</p>
                    <ul style="margin-bottom: 1rem; padding-left: 1.2rem; line-height: 1.5;">
                        <li style="margin-bottom: 0.5rem;">Распознает "парадоксы" личности (сочетание противоположных черт)</li>
                        <li style="margin-bottom: 0.5rem;">Cоставляет персональный план развития на 30 дней</li>
                        <li style="margin-bottom: 0.5rem;">Дает конкретные советы по книгам и курсам</li>
                    </ul>
                    <p style="opacity: 0.8; font-size: 0.9rem;">Данные анализируются локально на основе уникальных алгоритмов психометрии.</p>
                `,
                en: '<p>AI Advisor analyzes your profile and provides personalized recommendations.</p>'
            };

            window.app.ui.showModal({
                title: titles[lang],
                content: content[lang],
                actions: [{ text: 'OK', class: 'btn-primary', closeAfter: true, onClick: () => { } }]
            });
        }
    }
}

// Глобальный экземпляр
window.profileExtensions = new ProfileExtensions();
