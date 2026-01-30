/**
 * Модуль геймификации
 * Добавляет элементы игры для повышения вовлеченности
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class GamificationSystem {
    constructor() {
        this.achievements = [];
        this.userLevel = 1;
        this.experience = 0;
        this.streak = 0; // Последовательность дней
        this.lastTestDate = null;
        this.dailyChallenges = [];
        this.initialized = false;
    }

    /**
     * Инициализация системы геймификации
     */
    initialize() {
        if (this.initialized) return;
        
        this.loadUserProgress();
        this.generateDailyChallenges();
        this.initialized = true;
    }

    /**
     * Регистрация прохождения теста
     * @param {Object} testData - Данные теста
     */
    recordTestCompletion(testData) {
        const today = new Date().toDateString();
        const lastDate = this.lastTestDate ? new Date(this.lastTestDate).toDateString() : null;
        
        // Проверка последовательности
        if (lastDate === today) {
            // Уже проходили сегодня
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastDate === yesterdayStr) {
            // Продолжаем последовательность
            this.streak++;
        } else if (lastDate !== today) {
            // Сбрасываем последовательность
            this.streak = 1;
        }
        
        this.lastTestDate = new Date().toISOString();
        
        // Начисление опыта
        const baseXP = 100;
        const streakBonus = Math.min(this.streak * 10, 50);
        const xpGained = baseXP + streakBonus;
        
        this.addExperience(xpGained);
        
        // Проверка достижений
        this.checkAchievements(testData);
        
        // Сохранение прогресса
        this.saveUserProgress();
        
        return {
            xpGained,
            streak: this.streak,
            level: this.userLevel,
            achievements: this.getNewAchievements()
        };
    }

    /**
     * Добавление опыта
     * @param {number} xp - Количество опыта
     */
    addExperience(xp) {
        this.experience += xp;
        
        // Проверка повышения уровня
        const xpForNextLevel = this.getXPForLevel(this.userLevel + 1);
        if (this.experience >= xpForNextLevel) {
            this.userLevel++;
            return {
                levelUp: true,
                newLevel: this.userLevel,
                totalXP: this.experience
            };
        }
        
        return {
            levelUp: false,
            currentLevel: this.userLevel,
            totalXP: this.experience,
            xpToNext: xpForNextLevel - this.experience
        };
    }

    /**
     * Получение необходимого опыта для уровня
     * @param {number} level - Уровень
     * @returns {number} Необходимый опыт
     */
    getXPForLevel(level) {
        // Формула: 100 * level^1.5
        return Math.floor(100 * Math.pow(level, 1.5));
    }

    /**
     * Проверка достижений
     * @param {Object} testData - Данные теста
     */
    checkAchievements(testData) {
        const newAchievements = [];
        
        // Достижения за количество прохождений
        const totalTests = this.getTotalTestsCompleted();
        if (totalTests === 1 && !this.hasAchievement('first_test')) {
            newAchievements.push(this.unlockAchievement('first_test'));
        }
        if (totalTests === 5 && !this.hasAchievement('five_tests')) {
            newAchievements.push(this.unlockAchievement('five_tests'));
        }
        if (totalTests === 10 && !this.hasAchievement('ten_tests')) {
            newAchievements.push(this.unlockAchievement('ten_tests'));
        }
        if (totalTests === 25 && !this.hasAchievement('twenty_five_tests')) {
            newAchievements.push(this.unlockAchievement('twenty_five_tests'));
        }
        
        // Достижения за последовательность
        if (this.streak === 3 && !this.hasAchievement('three_day_streak')) {
            newAchievements.push(this.unlockAchievement('three_day_streak'));
        }
        if (this.streak === 7 && !this.hasAchievement('week_streak')) {
            newAchievements.push(this.unlockAchievement('week_streak'));
        }
        if (this.streak === 30 && !this.hasAchievement('month_streak')) {
            newAchievements.push(this.unlockAchievement('month_streak'));
        }
        
        // Достижения за уровни
        if (this.userLevel === 5 && !this.hasAchievement('level_five')) {
            newAchievements.push(this.unlockAchievement('level_five'));
        }
        if (this.userLevel === 10 && !this.hasAchievement('level_ten')) {
            newAchievements.push(this.unlockAchievement('level_ten'));
        }
        if (this.userLevel === 20 && !this.hasAchievement('level_twenty')) {
            newAchievements.push(this.unlockAchievement('level_twenty'));
        }
        
        // Достижения за разнообразие выборов
        if (testData.choices) {
            const uniqueChoices = new Set(testData.choices.map(c => c.choice));
            if (uniqueChoices.size >= 3 && !this.hasAchievement('diverse_thinker')) {
                newAchievements.push(this.unlockAchievement('diverse_thinker'));
            }
        }
        
        // Достижения за консистентность
        if (testData.aiAnalysis && testData.aiAnalysis.vector) {
            const consistency = testData.aiAnalysis.vector.consistency || 0;
            if (consistency > 0.8 && !this.hasAchievement('consistent_decider')) {
                newAchievements.push(this.unlockAchievement('consistent_decider'));
            }
        }
        
        return newAchievements;
    }

    /**
     * Разблокировка достижения
     * @param {string} achievementId - ID достижения
     * @returns {Object} Достижение
     */
    unlockAchievement(achievementId) {
        const achievement = this.getAchievementDefinition(achievementId);
        if (!achievement) return null;
        
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        
        if (!this.achievements.find(a => a.id === achievementId)) {
            this.achievements.push(achievement);
        }
        
        return achievement;
    }

    /**
     * Проверка наличия достижения
     * @param {string} achievementId - ID достижения
     * @returns {boolean}
     */
    hasAchievement(achievementId) {
        return this.achievements.some(a => a.id === achievementId && a.unlocked);
    }

    /**
     * Получение определения достижения
     * @param {string} achievementId - ID достижения
     * @returns {Object} Определение достижения
     */
    getAchievementDefinition(achievementId) {
        const definitions = {
            'first_test': {
                id: 'first_test',
                name: 'Первый шаг',
                description: 'Пройдите первый тест',
                icon: '🎯',
                rarity: 'common',
                xpReward: 50
            },
            'five_tests': {
                id: 'five_tests',
                name: 'Опытный исследователь',
                description: 'Пройдите 5 тестов',
                icon: '📊',
                rarity: 'common',
                xpReward: 100
            },
            'ten_tests': {
                id: 'ten_tests',
                name: 'Мастер самопознания',
                description: 'Пройдите 10 тестов',
                icon: '🏆',
                rarity: 'rare',
                xpReward: 200
            },
            'twenty_five_tests': {
                id: 'twenty_five_tests',
                name: 'Легенда',
                description: 'Пройдите 25 тестов',
                icon: '👑',
                rarity: 'epic',
                xpReward: 500
            },
            'three_day_streak': {
                id: 'three_day_streak',
                name: 'Последовательность',
                description: 'Проходите тесты 3 дня подряд',
                icon: '🔥',
                rarity: 'common',
                xpReward: 75
            },
            'week_streak': {
                id: 'week_streak',
                name: 'Неделя самопознания',
                description: 'Проходите тесты неделю подряд',
                icon: '⭐',
                rarity: 'rare',
                xpReward: 250
            },
            'month_streak': {
                id: 'month_streak',
                name: 'Мастер дисциплины',
                description: 'Проходите тесты месяц подряд',
                icon: '💎',
                rarity: 'legendary',
                xpReward: 1000
            },
            'level_five': {
                id: 'level_five',
                name: 'Новичок',
                description: 'Достигните 5 уровня',
                icon: '🌟',
                rarity: 'common',
                xpReward: 100
            },
            'level_ten': {
                id: 'level_ten',
                name: 'Опытный',
                description: 'Достигните 10 уровня',
                icon: '💫',
                rarity: 'rare',
                xpReward: 300
            },
            'level_twenty': {
                id: 'level_twenty',
                name: 'Эксперт',
                description: 'Достигните 20 уровня',
                icon: '✨',
                rarity: 'epic',
                xpReward: 750
            },
            'diverse_thinker': {
                id: 'diverse_thinker',
                name: 'Разносторонний мыслитель',
                description: 'Используйте разнообразные варианты ответов',
                icon: '🎨',
                rarity: 'rare',
                xpReward: 150
            },
            'consistent_decider': {
                id: 'consistent_decider',
                name: 'Последовательный решатель',
                description: 'Демонстрируйте высокую консистентность в выборах',
                icon: '🎯',
                rarity: 'rare',
                xpReward: 200
            }
        };
        
        const definition = definitions[achievementId];
        if (definition) {
            return { ...definition, unlocked: false };
        }
        return null;
    }

    /**
     * Получение новых достижений
     * @returns {Array} Новые достижения
     */
    getNewAchievements() {
        return this.achievements.filter(a => {
            if (!a.unlockedAt) return false;
            const unlockedDate = new Date(a.unlockedAt);
            const now = new Date();
            // Достижения, разблокированные в последние 5 секунд
            return (now - unlockedDate) < 5000;
        });
    }

    /**
     * Генерация ежедневных челленджей
     */
    generateDailyChallenges() {
        const today = new Date().toDateString();
        const stored = this.getStoredDailyChallenges();
        
        if (stored && stored.date === today) {
            this.dailyChallenges = stored.challenges;
            return;
        }
        
        const challenges = [
            {
                id: 'complete_test',
                name: 'Пройдите тест',
                description: 'Завершите один тест сегодня',
                reward: 50,
                type: 'test',
                completed: false
            },
            {
                id: 'explore_dimensions',
                name: 'Исследуйте измерения',
                description: 'Получите результаты по всем 6 измерениям',
                reward: 75,
                type: 'dimensions',
                completed: false
            },
            {
                id: 'share_insight',
                name: 'Поделитесь инсайтом',
                description: 'Сохраните или поделитесь одним инсайтом',
                reward: 25,
                type: 'social',
                completed: false
            }
        ];
        
        this.dailyChallenges = challenges;
        this.saveDailyChallenges();
    }

    /**
     * Получение прогресса пользователя
     * @returns {Object} Прогресс
     */
    getUserProgress() {
        const xpForNext = this.getXPForLevel(this.userLevel + 1);
        const xpForCurrent = this.getXPForLevel(this.userLevel);
        const progressXP = this.experience - xpForCurrent;
        const neededXP = xpForNext - xpForCurrent;
        const progressPercent = (progressXP / neededXP) * 100;
        
        return {
            level: this.userLevel,
            experience: this.experience,
            progressPercent: Math.min(100, Math.max(0, progressPercent)),
            streak: this.streak,
            achievements: this.achievements.filter(a => a.unlocked).length,
            totalAchievements: Object.keys(this.getAllAchievementDefinitions()).length,
            xpToNext: neededXP - progressXP
        };
    }

    /**
     * Получение всех определений достижений
     * @returns {Object} Все достижения
     */
    getAllAchievementDefinitions() {
        const ids = [
            'first_test', 'five_tests', 'ten_tests', 'twenty_five_tests',
            'three_day_streak', 'week_streak', 'month_streak',
            'level_five', 'level_ten', 'level_twenty',
            'diverse_thinker', 'consistent_decider'
        ];
        
        const definitions = {};
        ids.forEach(id => {
            definitions[id] = this.getAchievementDefinition(id);
        });
        
        return definitions;
    }

    /**
     * Получение общего количества пройденных тестов
     * @returns {number}
     */
    getTotalTestsCompleted() {
        // Это должно загружаться из истории пользователя
        // Пока используем упрощенную версию
        const history = this.getTestHistory();
        return history.length;
    }

    /**
     * Получение истории тестов (заглушка)
     * @returns {Array}
     */
    getTestHistory() {
        try {
            const data = localStorage.getItem('personalityTestResults');
            if (data) {
                return [JSON.parse(data)]; // Упрощенная версия
            }
        } catch (e) {
            console.warn('Ошибка загрузки истории:', e);
        }
        return [];
    }

    /**
     * Сохранение прогресса пользователя
     */
    saveUserProgress() {
        try {
            const data = {
                level: this.userLevel,
                experience: this.experience,
                streak: this.streak,
                lastTestDate: this.lastTestDate,
                achievements: this.achievements,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('gamification_progress', JSON.stringify(data));
        } catch (e) {
            console.warn('Ошибка сохранения прогресса:', e);
        }
    }

    /**
     * Загрузка прогресса пользователя
     */
    loadUserProgress() {
        try {
            const data = localStorage.getItem('gamification_progress');
            if (data) {
                const parsed = JSON.parse(data);
                this.userLevel = parsed.level || 1;
                this.experience = parsed.experience || 0;
                this.streak = parsed.streak || 0;
                this.lastTestDate = parsed.lastTestDate || null;
                this.achievements = parsed.achievements || [];
            }
        } catch (e) {
            console.warn('Ошибка загрузки прогресса:', e);
        }
    }

    /**
     * Сохранение ежедневных челленджей
     */
    saveDailyChallenges() {
        try {
            const data = {
                date: new Date().toDateString(),
                challenges: this.dailyChallenges
            };
            localStorage.setItem('daily_challenges', JSON.stringify(data));
        } catch (e) {
            console.warn('Ошибка сохранения челленджей:', e);
        }
    }

    /**
     * Получение сохраненных ежедневных челленджей
     * @returns {Object|null}
     */
    getStoredDailyChallenges() {
        try {
            const data = localStorage.getItem('daily_challenges');
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('Ошибка загрузки челленджей:', e);
        }
        return null;
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
}
