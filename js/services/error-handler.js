/**
 * Централизованная система обработки ошибок
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.init();
    }

    init() {
        // Глобальный обработчик необработанных ошибок
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'global', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Обработчик необработанных Promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'promise', {
                promise: event.promise
            });
            event.preventDefault(); // Предотвращаем вывод в консоль
        });
    }

    /**
     * Обработка ошибки
     * @param {Error|string} error - Ошибка
     * @param {string} context - Контекст ошибки
     * @param {Object} metadata - Дополнительные данные
     */
    handleError(error, context = 'unknown', metadata = {}) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            context,
            message: error?.message || String(error),
            stack: error?.stack,
            metadata,
            userAgent: navigator.userAgent
        };

        // Логирование для разработки
        if (DEBUG) {
            console.group(`%c[Error Handler] ${context}`, 'color: #e74c3c; font-weight: bold');
            console.error('Error:', error);
            console.log('Context:', context);
            console.log('Metadata:', metadata);
            console.groupEnd();
        }

        // Сохраняем в лог
        this.logError(errorInfo);

        // Показываем пользовательское сообщение
        this.showUserFriendlyError(error, context);

        // Опционально: отправка в систему мониторинга (Sentry, LogRocket и т.д.)
        this.reportError(errorInfo);
    }

    /**
     * Показать дружелюбное сообщение пользователю
     * @param {Error|string} error - Ошибка
     * @param {string} context - Контекст
     */
    showUserFriendlyError(error, context) {
        const t = window.t || ((key) => key);

        const messages = {
            'network': t('errorNetwork') || 'Проблема с подключением к интернету. Проверьте соединение.',
            'storage': t('errorStorage') || 'Ошибка сохранения данных. Проверьте доступное место.',
            'render': t('errorRender') || 'Ошибка отображения. Попробуйте обновить страницу.',
            'auth': t('errorAuth') || 'Ошибка аутентификации. Попробуйте войти снова.',
            'data': t('errorData') || 'Ошибка загрузки данных. Попробуйте позже.',
            'validation': t('errorValidation') || 'Проверьте правильность введенных данных.',
            'promise': t('errorAsync') || 'Произошла ошибка при выполнении операции.',
            'global': t('errorGlobal') || 'Произошла непредвиденная ошибка.',
            'default': t('errorDefault') || 'Что-то пошло не так. Попробуйте обновить страницу.'
        };

        const message = messages[context] || messages.default;

        // Показываем toast уведомление
        if (window.showError) {
            window.showError(message, 5000);
        } else if (window.toastManager) {
            window.toastManager.error(message, 5000);
        } else {
            // Fallback: обычный alert
            console.error(message);
        }
    }

    /**
     * Сохранение ошибки в лог
     * @param {Object} errorInfo - Информация об ошибке
     */
    logError(errorInfo) {
        this.errorLog.push(errorInfo);

        // Ограничиваем размер лога
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }

        // Сохраняем в localStorage для анализа
        try {
            const recentErrors = this.errorLog.slice(-10);
            localStorage.setItem('error_log', JSON.stringify(recentErrors));
        } catch (e) {
            // Игнорируем ошибки сохранения
        }
    }

    /**
     * Отправка ошибки в систему мониторинга
     * @param {Object} errorInfo - Информация об ошибке
     */
    reportError(errorInfo) {
        // Здесь можно интегрировать Sentry, LogRocket и т.д.
        // Пример для Sentry:
        // if (window.Sentry) {
        //     Sentry.captureException(errorInfo);
        // }

        // Для разработки просто логируем
        if (DEBUG) {
            console.log('[Error Reporter] Error logged:', errorInfo);
        }
    }

    /**
     * Получить последние ошибки
     * @param {number} count - Количество ошибок
     * @returns {Array} Массив ошибок
     */
    getRecentErrors(count = 10) {
        return this.errorLog.slice(-count);
    }

    /**
     * Очистить лог ошибок
     */
    clearLog() {
        this.errorLog = [];
        try {
            localStorage.removeItem('error_log');
        } catch (e) {
            // Игнорируем
        }
    }

    /**
     * Экспорт лога ошибок
     * @returns {string} JSON строка с ошибками
     */
    exportLog() {
        return JSON.stringify(this.errorLog, null, 2);
    }
}

// Вспомогательные функции для удобства использования
class ErrorUtils {
    /**
     * Безопасное выполнение функции с обработкой ошибок
     * @param {Function} fn - Функция для выполнения
     * @param {string} context - Контекст
     * @param {*} fallback - Значение по умолчанию при ошибке
     */
    static tryCatch(fn, context = 'unknown', fallback = null) {
        try {
            return fn();
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, context);
            }
            return fallback;
        }
    }

    /**
     * Безопасное выполнение асинхронной функции
     * @param {Function} fn - Асинхронная функция
     * @param {string} context - Контекст
     * @param {*} fallback - Значение по умолчанию при ошибке
     */
    static async tryAsync(fn, context = 'unknown', fallback = null) {
        try {
            return await fn();
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, context);
            }
            return fallback;
        }
    }

    /**
     * Создание обертки для функции с обработкой ошибок
     * @param {Function} fn - Функция
     * @param {string} context - Контекст
     */
    static wrap(fn, context = 'unknown') {
        return function (...args) {
            try {
                return fn.apply(this, args);
            } catch (error) {
                if (window.errorHandler) {
                    window.errorHandler.handleError(error, context);
                }
                throw error;
            }
        };
    }
}

// Глобальная инициализация
if (typeof window !== 'undefined') {
    window.errorHandler = new ErrorHandler();
    window.ErrorUtils = ErrorUtils;

    console.log('%c[Error Handler] Initialized', 'color: #3498db; font-weight: bold');
}
