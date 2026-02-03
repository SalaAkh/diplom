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
            </style>
        `;
        return styles + this.renderComparativeSection() + this.renderGoalsSection() + this.renderAIAdvisorSection();
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
