/**
 * Сервис управления личными целями развития
 * Позволяет пользователю устанавливать цели и отслеживать прогресс
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class GoalsService {
    constructor() {
        this.storageKey = 'personality_goals';
        this.goals = this.loadGoals();
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
     * Названия измерений на разных языках
     */
    getDimensionNames() {
        return {
            strategic: { kk: 'Стратегиялық ойлау', ru: 'Стратегическое мышление', en: 'Strategic Thinking' },
            explorer: { kk: 'Зерттеушілік қызығушылық', ru: 'Исследовательский интерес', en: 'Explorer Interest' },
            individualism: { kk: 'Дербестік', ru: 'Индивидуализм', en: 'Individualism' },
            rationality: { kk: 'Рационалдылық', ru: 'Рациональность', en: 'Rationality' },
            adaptation: { kk: 'Бейімделу', ru: 'Адаптивность', en: 'Adaptability' },
            meaning: { kk: 'Мағына іздеу', ru: 'Поиск смысла', en: 'Meaning Seeking' },
            intuition: { kk: 'Түйсік', ru: 'Интуиция', en: 'Intuition' },
            utility: { kk: 'Практикалық', ru: 'Практичность', en: 'Practicality' }
        };
    }

    /**
     * Получить локализованное название измерения
     */
    getDimensionName(dimension) {
        const names = this.getDimensionNames();
        const lang = this.getLang();
        if (names[dimension]) {
            return names[dimension][lang] || names[dimension]['ru'];
        }
        return dimension;
    }

    /**
     * Загрузить цели из localStorage
     */
    loadGoals() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Ошибка загрузки целей:', e);
            return [];
        }
    }

    /**
     * Сохранить цели в localStorage
     */
    saveGoals() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.goals));
        } catch (e) {
            console.error('Ошибка сохранения целей:', e);
        }
    }

    /**
     * Установить новую цель
     * @param {string} dimension - Измерение для развития
     * @param {number} targetValue - Целевое значение (0-100)
     * @param {string} description - Описание цели (опционально)
     */
    setGoal(dimension, targetValue, description = '') {
        // Проверяем, нет ли уже такой цели
        const existingIndex = this.goals.findIndex(g => g.dimension === dimension && g.status === 'active');

        const goal = {
            id: Date.now().toString(),
            dimension: dimension,
            dimensionName: this.getDimensionName(dimension),
            targetValue: Math.min(100, Math.max(0, targetValue)),
            description: description,
            createdAt: new Date().toISOString(),
            status: 'active',
            progress: []
        };

        if (existingIndex >= 0) {
            // Обновляем существующую цель
            this.goals[existingIndex] = { ...this.goals[existingIndex], ...goal };
        } else {
            this.goals.push(goal);
        }

        this.saveGoals();
        return goal;
    }

    /**
     * Получить активные цели
     */
    getActiveGoals() {
        return this.goals.filter(g => g.status === 'active');
    }

    /**
     * Получить все цели
     */
    getAllGoals() {
        return this.goals;
    }

    /**
     * Удалить цель
     * @param {string} goalId - ID цели
     */
    removeGoal(goalId) {
        this.goals = this.goals.filter(g => g.id !== goalId);
        this.saveGoals();
    }

    /**
     * Завершить цель
     * @param {string} goalId - ID цели
     */
    completeGoal(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            goal.status = 'completed';
            goal.completedAt = new Date().toISOString();
            this.saveGoals();
        }
    }

    /**
     * Проверить прогресс целей на основе новых результатов
     * @param {Object} newScores - Новые нормализованные оценки
     * @returns {Array} Массив обновлений прогресса
     */
    checkProgress(newScores) {
        const updates = [];
        const activeGoals = this.getActiveGoals();

        activeGoals.forEach(goal => {
            const currentValue = newScores[goal.dimension];
            if (currentValue === undefined) return;

            // Преобразуем в процентное значение (0-100)
            const currentPercent = Math.round((currentValue + 1) * 50);

            // Добавляем запись о прогрессе
            const progressEntry = {
                date: new Date().toISOString(),
                value: currentPercent
            };
            goal.progress.push(progressEntry);

            // Определяем статус
            const achieved = currentPercent >= goal.targetValue;
            const previousValue = goal.progress.length > 1
                ? goal.progress[goal.progress.length - 2].value
                : 0;
            const improvement = currentPercent - previousValue;

            updates.push({
                goalId: goal.id,
                dimension: goal.dimension,
                dimensionName: goal.dimensionName,
                targetValue: goal.targetValue,
                currentValue: currentPercent,
                improvement: improvement,
                achieved: achieved,
                progressPercent: Math.min(100, Math.round((currentPercent / goal.targetValue) * 100))
            });

            // Автоматически завершаем достигнутые цели
            if (achieved) {
                goal.status = 'completed';
                goal.completedAt = new Date().toISOString();
            }
        });

        this.saveGoals();
        return updates;
    }

    /**
     * Получить рекомендуемые цели на основе профиля
     * @param {Object} scores - Текущие оценки пользователя
     * @returns {Array} Массив рекомендуемых целей
     */
    getSuggestedGoals(scores) {
        const suggestions = [];
        const dimensions = this.getDimensionNames();
        const lang = this.getLang();

        Object.keys(dimensions).forEach(dim => {
            const score = scores[dim] || 0;
            const percent = Math.round((score + 1) * 50);

            // Рекомендуем развитие слабых сторон
            if (percent < 40) {
                suggestions.push({
                    dimension: dim,
                    dimensionName: dimensions[dim][lang] || dimensions[dim]['ru'],
                    currentValue: percent,
                    suggestedTarget: 60,
                    priority: 'high',
                    reason: {
                        kk: 'Бұл саланы дамытуға назар аудару керек',
                        ru: 'Эта область требует развития',
                        en: 'This area needs development'
                    }
                });
            } else if (percent >= 40 && percent < 60) {
                suggestions.push({
                    dimension: dim,
                    dimensionName: dimensions[dim][lang] || dimensions[dim]['ru'],
                    currentValue: percent,
                    suggestedTarget: 75,
                    priority: 'medium',
                    reason: {
                        kk: 'Бұл саланы күшейтуге болады',
                        ru: 'Эту область можно усилить',
                        en: 'This area can be strengthened'
                    }
                });
            }
        });

        // Сортируем по приоритету
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        return suggestions.slice(0, 3); // Возвращаем топ-3 рекомендации
    }

    /**
     * Получить статистику по целям
     */
    getGoalsStats() {
        const all = this.goals;
        const active = all.filter(g => g.status === 'active');
        const completed = all.filter(g => g.status === 'completed');

        return {
            total: all.length,
            active: active.length,
            completed: completed.length,
            completionRate: all.length > 0 ? Math.round((completed.length / all.length) * 100) : 0
        };
    }
}

// Глобальный экземпляр
window.goalsService = new GoalsService();
