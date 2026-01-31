/**
 * Сервис для работы с обратной связью
 */
console.log('FeedbackService script loading...');
// Mock class if FeedbackSystem is missing
class FeedbackSystemMock {
    constructor() {
        console.warn('Using FeedbackSystemMock');
    }
    createFeedbackForm() {
        return '<div class="p-4 text-center">Feedback system is currently simplified.</div>';
    }
    saveFeedback(data) {
        console.log('Feedback saved (mock):', data);
        return true;
    }
}

class FeedbackService {
    constructor(i18n, auth, analyzer, ui) {
        this.i18n = i18n;
        this.auth = auth;
        this.analyzer = analyzer;
        this.ui = ui;
        // Use real system or mock
        this.feedbackSystem = typeof FeedbackSystem !== 'undefined' ? new FeedbackSystem() : new FeedbackSystemMock();
    }

    /**
     * Показ формы обратной связи
     * @param {string} containerId - ID контейнера для формы
     */
    showForm(containerId = 'feedbackFormContainer') {
        const container = document.getElementById(containerId);
        if (!container || !this.feedbackSystem) return;

        try {
            // Safe execution
            const formHtml = this.feedbackSystem.createFeedbackForm({
                normalizedScores: this.analyzer && typeof this.analyzer.getNormalizedScores === 'function' ? this.analyzer.getNormalizedScores() : {},
                profile: this.analyzer && typeof this.analyzer.generateProfile === 'function' ? this.analyzer.generateProfile() : {}
            });
            container.innerHTML = formHtml;

            // Инициализация обработчиков рейтингов
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

                // Обновляем состояние кнопок
                ratingButtons.forEach(b => {
                    if (b.dataset.type === type) {
                        b.classList.remove('active');
                        if (parseInt(b.dataset.rating) <= rating) {
                            b.classList.add('active');
                        }
                    }
                });

                ratings[type] = rating;
                // Сохраняем во временное хранилище контейнера или в класс
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
window.FeedbackService = FeedbackService;
console.log('FeedbackService loaded and exported to window');
