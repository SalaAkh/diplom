/**
 * Модуль отслеживания эволюции результатов
 * Сравнивает результаты между сессиями и отслеживает изменения
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class EvolutionTracker {
    constructor() {
        this.storageKey = 'evolutionHistory';
    }

    /**
     * Сохранение результатов сессии
     * @param {string} userId - ID пользователя
     * @param {Object} sessionData - Данные сессии
     */
    saveSessionResults(userId, sessionData) {
        const history = this.getEvolutionHistory(userId);

        const session = {
            date: new Date().toISOString(),
            scores: sessionData.scores || {},
            normalizedScores: sessionData.normalizedScores || {},
            vector: sessionData.vector || null,
            profile: sessionData.profile || null,
            choices: sessionData.choices || [],
            statistics: sessionData.statistics || {}
        };

        history.sessions.push(session);

        // Вычисляем тренды
        history.trends = this.calculateTrends(history.sessions);

        // Сохраняем обновлённую историю
        this.saveEvolutionHistory(userId, history);

        return session;
    }

    /**
     * Сравнение двух сессий
     * @param {Object} session1 - Первая сессия
     * @param {Object} session2 - Вторая сессия
     * @returns {Object} Результат сравнения
     */
    compareSessions(session1, session2) {
        if (!session1.normalizedScores || !session2.normalizedScores) {
            return { error: 'Недостаточно данных для сравнения' };
        }

        const comparison = {
            dimensions: {},
            overallChange: 0,
            significantChanges: [],
            improvements: [],
            regressions: []
        };

        const scores1 = session1.normalizedScores;
        const scores2 = session2.normalizedScores;

        let totalChange = 0;
        let dimensionCount = 0;

        Object.keys(scores1).forEach(dimension => {
            if (scores2[dimension] !== undefined) {
                const change = scores2[dimension] - scores1[dimension];
                const absChange = Math.abs(change);

                comparison.dimensions[dimension] = {
                    before: scores1[dimension],
                    after: scores2[dimension],
                    change: change,
                    absChange: absChange,
                    percentChange: Math.round((change / (Math.abs(scores1[dimension]) || 1)) * 100)
                };

                totalChange += absChange;
                dimensionCount++;

                // Определяем значительные изменения
                if (absChange > 0.3) {
                    comparison.significantChanges.push({
                        dimension: dimension,
                        change: change,
                        direction: change > 0 ? 'increase' : 'decrease',
                        magnitude: absChange
                    });

                    if (change > 0) {
                        comparison.improvements.push(dimension);
                    } else {
                        comparison.regressions.push(dimension);
                    }
                }
            }
        });

        comparison.overallChange = dimensionCount > 0 ? totalChange / dimensionCount : 0;
        comparison.timeBetween = this.calculateTimeBetween(session1.date, session2.date);

        return comparison;
    }

    /**
     * Отслеживание эволюции пользователя
     * @param {string} userId - ID пользователя
     * @returns {Object} Данные об эволюции
     */
    trackEvolution(userId) {
        const history = this.getEvolutionHistory(userId);
        const t = (window.i18n && window.i18n.t) ? window.i18n.t.bind(window.i18n) : ((key) => key);

        if (history.sessions.length < 2) {
            return {
                hasEvolution: false,
                message: t('noEvolutionData') || 'At least 2 sessions are required for evolution analysis'
            };
        }

        const sessions = history.sessions;
        const comparisons = [];

        // ?????????? ?????? ?????? ? ??????????
        for (let i = 1; i < sessions.length; i++) {
            const comparison = this.compareSessions(sessions[i - 1], sessions[i]);
            comparisons.push({
                fromSession: i - 1,
                toSession: i,
                comparison: comparison
            });
        }

        const overallComparison = this.compareSessions(sessions[0], sessions[sessions.length - 1]);

        return {
            hasEvolution: true,
            totalSessions: sessions.length,
            comparisons: comparisons,
            overallComparison: overallComparison,
            trends: history.trends,
            evolutionSummary: this.generateEvolutionSummary(comparisons, overallComparison)
        };
    }
    generateEvolutionReport(userId) {
        const evolution = this.trackEvolution(userId);

        if (!evolution.hasEvolution) {
            return evolution;
        }

        const report = {
            ...evolution,
            insights: this.generateEvolutionInsights(evolution),
            recommendations: this.generateEvolutionRecommendations(evolution),
            timeline: this.generateTimeline(evolution)
        };

        return report;
    }

    /**
     * Обнаружение изменений в измерении
     * @param {string} dimension - Название измерения
     * @param {number} oldScore - Старая оценка
     * @param {number} newScore - Новая оценка
     * @returns {Object} Информация об изменении
     */
    detectChanges(dimension, oldScore, newScore) {
        const change = newScore - oldScore;
        const absChange = Math.abs(change);
        const percentChange = oldScore !== 0 ? (change / Math.abs(oldScore)) * 100 : 0;

        return {
            dimension: dimension,
            change: change,
            absChange: absChange,
            percentChange: percentChange,
            isSignificant: absChange > 0.3,
            direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable',
            magnitude: this.getChangeMagnitude(absChange)
        };
    }

    /**
     * Получение величины изменения
     * @param {number} absChange - Абсолютное изменение
     * @returns {string} Величина: 'small', 'medium', 'large'
     */
    getChangeMagnitude(absChange) {
        if (absChange < 0.2) return 'small';
        if (absChange < 0.5) return 'medium';
        return 'large';
    }

    /**
     * Вычисление трендов по измерениям
     * @param {Array} sessions - Массив сессий
     * @returns {Object} Тренды по каждому измерению
     */
    calculateTrends(sessions) {
        if (sessions.length < 2) return {};

        const trends = {};
        const firstSession = sessions[0];
        const lastSession = sessions[sessions.length - 1];

        if (!firstSession.normalizedScores || !lastSession.normalizedScores) {
            return {};
        }

        Object.keys(firstSession.normalizedScores).forEach(dimension => {
            if (lastSession.normalizedScores[dimension] !== undefined) {
                const firstValue = firstSession.normalizedScores[dimension];
                const lastValue = lastSession.normalizedScores[dimension];
                const change = lastValue - firstValue;

                trends[dimension] = {
                    direction: change > 0.1 ? 'increasing' : change < -0.1 ? 'decreasing' : 'stable',
                    rate: change / sessions.length, // Среднее изменение на сессию
                    totalChange: change,
                    firstValue: firstValue,
                    lastValue: lastValue
                };
            }
        });

        return trends;
    }

    /**
     * Генерация сводки эволюции
     * @param {Array} comparisons - Массив сравнений
     * @param {Object} overallComparison - Общее сравнение
     * @returns {Object} Сводка
     */
    generateEvolutionSummary(comparisons, overallComparison) {
        const summary = {
            totalChanges: overallComparison.significantChanges?.length || 0,
            improvements: overallComparison.improvements?.length || 0,
            regressions: overallComparison.regressions?.length || 0,
            mostChangedDimension: null,
            stability: 0
        };

        // Находим измерение с наибольшим изменением
        if (overallComparison.dimensions) {
            let maxChange = 0;
            Object.keys(overallComparison.dimensions).forEach(dim => {
                const absChange = overallComparison.dimensions[dim].absChange;
                if (absChange > maxChange) {
                    maxChange = absChange;
                    summary.mostChangedDimension = dim;
                }
            });
        }

        // Вычисляем стабильность (обратная величина общего изменения)
        summary.stability = Math.max(0, 1 - (overallComparison.overallChange || 0));

        return summary;
    }

    /**
     * Генерация инсайтов об эволюции
     * @param {Object} evolution - Данные об эволюции
     * @returns {Array} Инсайты
     */
    generateEvolutionInsights(evolution) {
        const insights = [];
        const t = (key) => (window.t ? window.t(key) : key);

        // Helper to localize dimension list
        const localizeDims = (dims) => dims.map(d => t(`${d}Name`) || d).join(', ');

        if (evolution.overallComparison) {
            const comp = evolution.overallComparison;

            if (comp.improvements && comp.improvements.length > 0) {
                insights.push({
                    type: 'positive',
                    title: t('insightPositiveTitle') || 'Развитие сильных сторон',
                    text: (t('insightPositiveText') || 'Вы показали рост в {count} измерении(ях): {dimensions}.')
                        .replace('{count}', comp.improvements.length)
                        .replace('{dimensions}', localizeDims(comp.improvements))
                });
            }

            if (comp.regressions && comp.regressions.length > 0) {
                insights.push({
                    type: 'neutral',
                    title: t('insightNeutralTitle') || 'Изменение приоритетов',
                    text: (t('insightNeutralText') || 'Ваши предпочтения изменились в {count} измерении(ях).')
                        .replace('{count}', comp.regressions.length)
                        .replace('{dimensions}', localizeDims(comp.regressions))
                });
            }

            if (comp.overallChange < 0.1) {
                insights.push({
                    type: 'stability',
                    title: t('insightStabilityTitle') || 'Стабильность профиля',
                    text: t('insightStabilityText') || 'Ваш профиль остаётся стабильным.'
                });
            }
        }

        return insights;
    }

    /**
     * Генерация рекомендаций на основе эволюции
     * @param {Object} evolution - Данные об эволюции
     * @returns {Array} Рекомендации
     */
    generateEvolutionRecommendations(evolution) {
        const recommendations = [];
        const t = (key, params = {}) => {
            if (window.i18n && window.i18n.t) {
                const value = window.i18n.t(key, params);
                if (value && value !== key) return value;
            }
            return key;
        };

        if (evolution.trends) {
            Object.keys(evolution.trends).forEach(dimension => {
                const trend = evolution.trends[dimension];
                const dimensionName = t(`${dimension}Name`) || dimension;

                if (trend.direction === 'increasing' && trend.rate > 0.02) {
                    recommendations.push({
                        dimension: dimension,
                        type: 'leverage',
                        text: t('recGrowth', { dim: dimensionName }) || `Continue developing ${dimensionName}.`
                    });
                } else if (trend.direction === 'decreasing' && Math.abs(trend.rate) > 0.02) {
                    recommendations.push({
                        dimension: dimension,
                        type: 'attention',
                        text: t('recDecline', { dim: dimensionName }) || `Pay attention to ${dimensionName}.`
                    });
                }
            });
        }

        if (recommendations.length === 0 && evolution.overallComparison) {
            recommendations.push({
                type: 'leverage',
                text: t('recStable') || 'Your profile is stable. This is an excellent foundation for further growth.'
            });
        }

        return recommendations;
    }
    generateTimeline(evolution) {
        if (!evolution.comparisons) return [];

        const t = (window.i18n && window.i18n.t) ? window.i18n.t.bind(window.i18n) : ((key) => key);

        return evolution.comparisons.map((comp) => {
            return {
                period: `${t('sessionLabel')} ${comp.fromSession + 1} -> ${comp.toSession + 1}` ,
                changes: comp.comparison.significantChanges || [],
                summary: this.generatePeriodSummary(comp.comparison)
            };
        });
    }
    generatePeriodSummary(comparison) {
        const t = (window.i18n && window.i18n.t) ? window.i18n.t.bind(window.i18n) : ((key) => key);

        if (comparison.improvements && comparison.improvements.length > 0) {
            return t('growthInDimensions', { count: comparison.improvements.length }) ||
                `Growth in ${comparison.improvements.length} dimension(s)`;
        }

        if (comparison.regressions && comparison.regressions.length > 0) {
            return t('changesInDimensions', { count: comparison.regressions.length }) ||
                `Changes in ${comparison.regressions.length} dimension(s)`;
        }

        return t('stablePeriod') || 'Stable period';
    }
    calculateTimeBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffMs = Math.abs(d2 - d1);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        return {
            days: diffDays,
            months: diffMonths,
            years: diffYears,
            formatted: diffYears > 0 ? `${diffYears} год(а/лет)` :
                diffMonths > 0 ? `${diffMonths} месяц(ев)` :
                    `${diffDays} день(дней)`
        };
    }

    /**
     * Получение истории эволюции пользователя
     * @param {string} userId - ID пользователя
     * @returns {Object} История эволюции
     */
    getEvolutionHistory(userId) {
        const key = `${this.storageKey}_${userId}`;
        const stored = localStorage.getItem(key);

        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Эволюция тарихын оқу қатесі (Error reading evolution history):', e);
            }
        }

        return {
            userId: userId,
            sessions: [],
            trends: {}
        };
    }

    /**
     * Сохранение истории эволюции
     * @param {string} userId - ID пользователя
     * @param {Object} history - История эволюции
     */
    saveEvolutionHistory(userId, history) {
        const key = `${this.storageKey}_${userId}`;
        try {
            localStorage.setItem(key, JSON.stringify(history));
        } catch (e) {
            console.error('Эволюция тарихын сақтау қатесі (Error saving evolution history):', e);
        }
    }

    /**
     * Очистка истории эволюции пользователя
     * @param {string} userId - ID пользователя
     */
    clearEvolutionHistory(userId) {
        const key = `${this.storageKey}_${userId}`;
        localStorage.removeItem(key);
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EvolutionTracker;
}
