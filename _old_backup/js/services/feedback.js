/**
 * Объединённый модуль обратной связи
 * Содержит FeedbackSystem (хранение) и FeedbackService (UI)
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

// ============================================
// FeedbackSystem - базовый класс для хранения отзывов
// ============================================
class FeedbackSystem {
    constructor() {
        this.storageKey = 'neural_constellation_feedback';
        this.feedbacks = this.loadFeedbacks();
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
     * @returns {Promise<boolean>} - Результат отправки
     */
    async submitFeedback(feedbackData) {
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
                resolve(true);
            }, 300);
        });
    }

    /**
     * Сохраняет отзыв (синхронный вариант для FeedbackService)
     */
    saveFeedback(data) {
        try {
            const newFeedback = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                ...data
            };
            this.feedbacks.push(newFeedback);
            this.saveFeedbacks();
            return true;
        } catch (e) {
            console.error('Error saving feedback:', e);
            return false;
        }
    }

    /**
     * Возвращает все отзывы
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

    /**
     * Создаёт HTML формы обратной связи (заглушка)
     */
    createFeedbackForm() {
        return '<div class="p-4 text-center">Feedback form placeholder</div>';
    }
}

// ============================================
// FeedbackService - UI сервис для работы с формой
// ============================================
class FeedbackService {
    constructor(i18n, auth, analyzer, ui) {
        this.i18n = i18n;
        this.auth = auth;
        this.analyzer = analyzer;
        this.ui = ui;
        this.feedbackSystem = new FeedbackSystem();
    }

    /**
     * Показ формы обратной связи
     * @param {string} containerId - ID контейнера для формы
     */
    showForm(containerId = 'feedbackFormContainer') {
        const container = document.getElementById(containerId);
        if (!container || !this.feedbackSystem) return;

        try {
            const formHtml = this.feedbackSystem.createFeedbackForm({
                normalizedScores: this.analyzer && typeof this.analyzer.getNormalizedScores === 'function' ? this.analyzer.getNormalizedScores() : {},
                profile: this.analyzer && typeof this.analyzer.generateProfile === 'function' ? this.analyzer.generateProfile() : {}
            });
            container.innerHTML = formHtml;
            this._initRatingHandlers(container);
        } catch (e) {
            console.error('Error showing feedback form:', e);
            container.innerHTML = '<p>Error loading feedback form</p>';
        }
    }

    /**
     * Инициализация обработчиков клика по звездам рейтинга
     * @private
     */
    _initRatingHandlers(container) {
        const ratingButtons = container.querySelectorAll('.rating-btn');
        const ratings = { relevance: 0, accuracy: 0, helpfulness: 0 };

        ratingButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const rating = parseInt(btn.dataset.rating);

                ratingButtons.forEach(b => {
                    if (b.dataset.type === type) {
                        b.classList.remove('active');
                        if (parseInt(b.dataset.rating) <= rating) {
                            b.classList.add('active');
                        }
                    }
                });

                ratings[type] = rating;
                container.dataset.ratings = JSON.stringify(ratings);
            });
        });
    }

    /**
     * Отправка обратной связи
     * @param {string} containerId - ID контейнера
     */
    submit(containerId = 'feedbackFormContainer') {
        const container = document.getElementById(containerId);
        if (!container || !this.feedbackSystem) return;

        const ratings = JSON.parse(container.dataset.ratings || '{}');
        const comments = document.getElementById('feedbackComments')?.value || '';

        if (!ratings.relevance || !ratings.accuracy || !ratings.helpfulness) {
            if (this.ui && typeof this.ui.showAlert === 'function') {
                this.ui.showAlert(this.i18n.t('rateAllAspects'));
            } else {
                alert(this.i18n.t('rateAllAspects') || 'Please rate all aspects');
            }
            return;
        }

        const feedback = {
            userId: this.auth && typeof this.auth.getCurrentUser === 'function' ? (this.auth.getCurrentUser()?.id || 'anonymous') : 'anonymous',
            relevance: ratings.relevance,
            accuracy: ratings.accuracy,
            helpfulness: ratings.helpfulness,
            comments: comments,
            testResults: {
                normalizedScores: this.analyzer && typeof this.analyzer.getNormalizedScores === 'function' ? this.analyzer.getNormalizedScores() : {},
                profile: this.analyzer && typeof this.analyzer.generateProfile === 'function' ? this.analyzer.generateProfile() : {}
            }
        };

        if (this.feedbackSystem.saveFeedback(feedback)) {
            container.innerHTML = `<div class="feedback-success"><p>${this.i18n.t('feedbackThanks')}</p></div>`;
        } else {
            if (this.ui && typeof this.ui.showAlert === 'function') {
                this.ui.showAlert(this.i18n.t('feedbackError'));
            }
        }
    }

    /**
     * Пропуск обратной связи
     * @param {string} containerId 
     */
    skip(containerId = 'feedbackFormContainer') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<p class="feedback-skipped">${this.i18n.t('feedbackSkipped')}</p>`;
        }
    }
}

// Экспорт для глобального использования
window.FeedbackSystem = FeedbackSystem;
window.FeedbackService = FeedbackService;
