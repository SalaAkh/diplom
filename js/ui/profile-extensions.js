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

            // Способ 2: Напрямую из localStorage (для анонимных пользователей)
            const anonymousData = localStorage.getItem('personalityTestResults');
            if (anonymousData) {
                const parsed = JSON.parse(anonymousData);
                if (parsed.results && parsed.results.scores) {
                    this._cachedScores = parsed.results.normalizedScores || parsed.results.scores;
                    return this._cachedScores;
                }
            }

            // Способ 3: Из списка пользователей (для зарегистрированных, если auth не сработал)
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
                        <select id="roleSelect" class="form-select cosmic-select" style="max-width: 250px; padding: 0.5rem 1rem; border-radius: 8px; background: var(--input-bg, rgba(255,255,255,0.1)); border: 1px solid var(--border-color, rgba(255,255,255,0.2)); color: var(--text-color, inherit);" onchange="window.profileExtensions.updateComparison(this.value)">
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
            },
            celebrity: {
                kk: 'Салыстыру үшін алдымен тестті аяқтаңыз',
                ru: 'Пройдите тест для сравнения со знаменитостями',
                en: 'Complete a test to compare with celebrities'
            }
        };

        const titles = {
            comparative: { kk: 'Салыстырмалы талдау', ru: 'Сравнительный анализ', en: 'Comparative Analysis' },
            goals: { kk: 'Менің мақсаттарым', ru: 'Мои цели', en: 'My Goals' },
            advisor: { kk: 'AI-кеңесші', ru: 'AI-советник', en: 'AI Advisor' },
            celebrity: { kk: 'Сіз кімге ұқсайсыз', ru: 'На кого вы похожи', en: 'Who You Resemble' }
        };

        const icons = { comparative: '📊', goals: '🎯', advisor: '🤖', celebrity: '⭐' };

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
                animation: { duration: 0 },
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
    // Секция целей удалена по запросу


    /**
     * Рендер секции Карьеры
     */
    // Карьерный навигатор удален по запросу


    /**
     * Render Cognitive Style Section
     */
    // Когнитивный стиль удален по запросу


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
            const noCelebsText = { kk: 'Бұл санатта атақты тұлғалар жоқ', ru: 'Нет знаменитостей в этой категории', en: 'No celebrities in this category' };
            container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.7;">${noCelebsText[lang]}</p>`;
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

        const matchLabel = { kk: '% сәйкестік', ru: '% совпадение', en: '% match' };
        const profileCompLabel = { kk: 'Профильдерді салыстыру', ru: 'Сравнение профилей', en: 'Profile Comparison' };
        const youLabel = { kk: 'Сіз', ru: 'Вы', en: 'You' };
        const commonStrengthsLabel = { kk: '✓ Жалпы күшті жақтары:', ru: '✓ Общие сильные стороны:', en: '✓ Common Strengths:' };
        const closeLabel = { kk: 'Жабу', ru: 'Закрыть', en: 'Close' };

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
                <strong style="color: var(--success-color);">${commonStrengthsLabel[lang]}</strong> ${comparison.strengths.join(', ')}
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
                    ">${comparison.overallMatch}${matchLabel[lang]}</div>
                </div>
            </div>
            <p style="opacity: 0.9; line-height: 1.6; margin-bottom: 1.5rem;">${celeb.bio}</p>
            <h4 style="margin-bottom: 1rem;">${profileCompLabel[lang]}</h4>
            <div style="margin-bottom: 8px; display: flex; gap: 1rem; font-size: 0.8rem; opacity: 0.7;">
                <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 12px; height: 12px; background: var(--primary-color); border-radius: 2px;"></span> ${youLabel[lang]}</span>
                <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 12px; height: 12px; background: var(--secondary-color); border-radius: 2px;"></span> ${celeb.name}</span>
            </div>
            ${dimensionBars}
            ${strengthsHtml}
        `;

        window.app.ui.showModal({
            title: celeb.name,
            content: content,
            actions: [{ text: closeLabel[lang], class: 'btn-primary', closeAfter: true, onClick: () => { } }]
        });
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
        return styles + this.renderCelebritySection() + this.renderComparativeSection();
    }

    /**
     * Инициализировать после загрузки DOM
     */
    initAfterRender() {
        // Инициализируем график сравнения после рендера DOM
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (this.hasData()) {
                    this.updateComparison(this.selectedRole);
                }
            });
        });
    }

}

// Глобальный экземпляр
window.profileExtensions = new ProfileExtensions();
