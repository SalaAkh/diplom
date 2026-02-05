/**
 * Сервис персонализированного контента
 * Подбирает книги, курсы и упражнения на основе профиля
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ContentService {
    constructor() {
        this.db = window.CONTENT_DATABASE || {};
        this.storageKey = 'contentProgress';
    }

    /**
     * Получить текущий язык
     */
    getLang() {
        if (window.localizationService?.getCurrentLanguage) {
            return window.localizationService.getCurrentLanguage();
        }
        return localStorage.getItem('language') || 'ru';
    }

    /**
     * Получить локализованный текст
     */
    getLocalizedText(field) {
        if (typeof field === 'string') return field;
        if (!field) return '';
        const lang = this.getLang();
        return field[lang] || field['ru'] || field['en'] || Object.values(field)[0] || '';
    }

    /**
     * Получить метку сложности
     */
    getDifficultyLabel(difficulty) {
        const lang = this.getLang();
        return this.db.difficultyLabels?.[lang]?.[difficulty] || difficulty;
    }

    /**
     * Найти слабые измерения пользователя
     * @param {Object} scores - Баллы пользователя
     * @param {number} threshold - Порог слабости (по умолчанию 0.5)
     * @returns {Array} Массив слабых измерений
     */
    findWeakDimensions(scores, threshold = 0.5) {
        if (!scores) return [];

        return Object.entries(scores)
            .filter(([_, value]) => value < threshold)
            .sort((a, b) => a[1] - b[1])
            .map(([dim]) => dim);
    }

    /**
     * Подобрать рекомендуемые книги
     * @param {Object} scores - Баллы пользователя
     * @param {number} limit - Максимальное количество
     * @returns {Array} Массив книг
     */
    getRecommendedBooks(scores, limit = 5) {
        if (!this.db.books) return [];

        const weakDimensions = this.findWeakDimensions(scores);
        const lang = this.getLang();
        const progress = this.getProgress();

        // Ранжируем книги по релевантности
        const ranked = this.db.books.map(book => {
            let relevance = 0;

            // Приоритет книгам для слабых измерений
            for (const dim of book.targetDimensions) {
                const dimIndex = weakDimensions.indexOf(dim);
                if (dimIndex !== -1) {
                    relevance += (weakDimensions.length - dimIndex) * 10;
                }
            }

            // Небольшой случайный разброс для разнообразия
            relevance += Math.random() * 3;

            // Понижаем рейтинг завершённых
            if (progress.completed?.includes(book.id)) {
                relevance -= 50;
            }

            return {
                id: book.id,
                title: this.getLocalizedText(book.title),
                author: book.author,
                description: this.getLocalizedText(book.description),
                targetDimensions: book.targetDimensions,
                difficulty: book.difficulty,
                difficultyLabel: this.getDifficultyLabel(book.difficulty),
                url: book.url,
                icon: book.icon,
                relevance,
                completed: progress.completed?.includes(book.id) || false,
                inPlan: progress.inPlan?.includes(book.id) || false
            };
        });

        return ranked
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, limit);
    }

    /**
     * Подобрать рекомендуемые курсы
     * @param {Object} scores - Баллы пользователя
     * @param {number} limit - Максимальное количество
     * @returns {Array} Массив курсов
     */
    getRecommendedCourses(scores, limit = 5) {
        if (!this.db.courses) return [];

        const weakDimensions = this.findWeakDimensions(scores);
        const progress = this.getProgress();

        const ranked = this.db.courses.map(course => {
            let relevance = 0;

            for (const dim of course.targetDimensions) {
                const dimIndex = weakDimensions.indexOf(dim);
                if (dimIndex !== -1) {
                    relevance += (weakDimensions.length - dimIndex) * 10;
                }
            }

            relevance += Math.random() * 3;

            if (progress.completed?.includes(course.id)) {
                relevance -= 50;
            }

            return {
                id: course.id,
                title: this.getLocalizedText(course.title),
                platform: course.platform,
                description: this.getLocalizedText(course.description),
                duration: course.duration,
                targetDimensions: course.targetDimensions,
                difficulty: course.difficulty,
                difficultyLabel: this.getDifficultyLabel(course.difficulty),
                url: course.url,
                icon: course.icon,
                relevance,
                completed: progress.completed?.includes(course.id) || false,
                inPlan: progress.inPlan?.includes(course.id) || false
            };
        });

        return ranked
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, limit);
    }

    /**
     * Получить упражнения для измерения
     * @param {string} dimension - Измерение (или null для всех)
     * @param {number} limit - Максимальное количество
     * @returns {Array} Массив упражнений
     */
    getExercises(dimension = null, limit = 10) {
        if (!this.db.exercises) return [];

        const lang = this.getLang();
        const progress = this.getProgress();

        let exercises = this.db.exercises;

        // Фильтруем по измерению если указано
        if (dimension) {
            exercises = exercises.filter(ex => ex.targetDimensions.includes(dimension));
        }

        return exercises.slice(0, limit).map(ex => ({
            id: ex.id,
            title: this.getLocalizedText(ex.title),
            description: this.getLocalizedText(ex.description),
            instructions: ex.instructions[lang] || ex.instructions.ru || [],
            duration: ex.duration,
            frequency: ex.frequency,
            targetDimensions: ex.targetDimensions,
            difficulty: ex.difficulty,
            difficultyLabel: this.getDifficultyLabel(ex.difficulty),
            icon: ex.icon,
            completed: progress.completed?.includes(ex.id) || false,
            inPlan: progress.inPlan?.includes(ex.id) || false
        }));
    }

    /**
     * Получить персонализированную программу
     * @param {Object} scores - Баллы пользователя
     * @returns {Object} Программа развития
     */
    getPersonalizedProgram(scores) {
        return {
            books: this.getRecommendedBooks(scores, 3),
            courses: this.getRecommendedCourses(scores, 2),
            exercises: this.getExercises(null, 3),
            weakDimensions: this.findWeakDimensions(scores)
        };
    }

    /**
     * Добавить в план
     * @param {string} contentId - ID контента
     */
    addToPlan(contentId) {
        const progress = this.getProgress();
        if (!progress.inPlan) progress.inPlan = [];
        if (!progress.inPlan.includes(contentId)) {
            progress.inPlan.push(contentId);
            this.saveProgress(progress);
        }
    }

    /**
     * Удалить из плана
     * @param {string} contentId - ID контента
     */
    removeFromPlan(contentId) {
        const progress = this.getProgress();
        if (progress.inPlan) {
            progress.inPlan = progress.inPlan.filter(id => id !== contentId);
            this.saveProgress(progress);
        }
    }

    /**
     * Отметить как завершённое
     * @param {string} contentId - ID контента
     */
    markAsCompleted(contentId) {
        const progress = this.getProgress();
        if (!progress.completed) progress.completed = [];
        if (!progress.completed.includes(contentId)) {
            progress.completed.push(contentId);
        }
        // Убираем из плана
        if (progress.inPlan) {
            progress.inPlan = progress.inPlan.filter(id => id !== contentId);
        }
        this.saveProgress(progress);
    }

    /**
     * Получить прогресс
     * @returns {Object} Данные прогресса
     */
    getProgress() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        } catch {
            return {};
        }
    }

    /**
     * Сохранить прогресс
     * @param {Object} progress - Данные прогресса
     */
    saveProgress(progress) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(progress));
        } catch (e) {
            console.error('[ContentService] Error saving progress:', e);
        }
    }

    /**
     * Получить статистику прогресса
     * @returns {Object} Статистика
     */
    getProgressStats() {
        const progress = this.getProgress();
        return {
            completedCount: progress.completed?.length || 0,
            inPlanCount: progress.inPlan?.length || 0,
            totalBooks: this.db.books?.length || 0,
            totalCourses: this.db.courses?.length || 0,
            totalExercises: this.db.exercises?.length || 0
        };
    }
}

// Глобальный экземпляр
window.contentService = new ContentService();
