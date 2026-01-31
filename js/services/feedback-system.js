/**
 * Сервис для управления отзывами пользователей
 * Позволяет отправлять оценки и текстовые отзывы.
 * В текущей реализации сохраняет данные в localStorage.
 */
class FeedbackService {
    constructor() {
        this.storageKey = 'neural_constellation_feedback';
        this.feedbacks = this.loadFeedbacks();
        console.log('FeedbackService initialized');
    }

    /**
     * Загружает сохраненные отзывы из localStorage
     */
    loadFeedbacks() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error loading feedbacks:', e);
            return [];
        }
    }

    /**
     * Сохраняет текущий список отзывов в localStorage
     */
    saveFeedbacks() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.feedbacks));
        } catch (e) {
            console.error('Error saving feedbacks:', e);
        }
    }

    /**
     * Отправляет новый отзыв
     * @param {Object} feedbackData - Данные отзыва
     * @param {number} feedbackData.rating - Оценка (1-5)
     * @param {string} feedbackData.text - Текст отзыва (опционально)
     * @param {string} feedbackData.userId - ID пользователя (опционально)
     * @returns {Promise<boolean>} - Результат отправки
     */
    async submitFeedback(feedbackData) {
        // Имитация асинхронного запроса к API
        return new Promise((resolve) => {
            setTimeout(() => {
                const newFeedback = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    rating: feedbackData.rating,
                    text: feedbackData.text || '',
                    userId: feedbackData.userId || 'anonymous',
                    source: feedbackData.source || 'web_app'
                };

                this.feedbacks.push(newFeedback);
                this.saveFeedbacks();

                console.log('Feedback submitted:', newFeedback);
                resolve(true);
            }, 800); // Имитация задержки сети
        });
    }

    /**
     * Возвращает все отзывы (для админки или дебага)
     */
    getAllFeedbacks() {
        return this.feedbacks;
    }

    /**
     * Подсчитывает среднюю оценку
     */
    getAverageRating() {
        if (this.feedbacks.length === 0) return 0;
        const sum = this.feedbacks.reduce((acc, f) => acc + (Number(f.rating) || 0), 0);
        return (sum / this.feedbacks.length).toFixed(1);
    }
}

// Экспорт экземпляра для использования в приложении
// Используем глобальную переменную для простоты доступа из app.js
window.FeedbackService = FeedbackService;
