/**
 * EventBus - Шина событий для межмодульной коммуникации
 * Реализует паттерн Publisher-Subscriber для слабой связанности модулей
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class EventBus {
    constructor() {
        this.events = {};
        this.onceEvents = {};
    }

    /**
     * Подписка на событие
     * @param {string} event - Имя события
     * @param {Function} callback - Функция-обработчик
     * @returns {Function} Функция для отписки
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);

        // Возвращаем функцию для отписки
        return () => this.off(event, callback);
    }

    /**
     * Подписка на событие (однократно)
     * @param {string} event - Имя события
     * @param {Function} callback - Функция-обработчик
     */
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    /**
     * Отписка от события
     * @param {string} event - Имя события
     * @param {Function} callback - Функция-обработчик
     */
    off(event, callback) {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter(cb => cb !== callback);

        if (this.events[event].length === 0) {
            delete this.events[event];
        }
    }

    /**
     * Генерация события
     * @param {string} event - Имя события
     * @param {*} data - Данные события
     */
    emit(event, data) {
        if (!this.events[event]) return;

        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[EventBus] Қате "${event}" өңдеу кезінде (Error in handler for "${event}"):`, error);
            }
        });
    }

    /**
     * Удаление всех подписчиков события
     * @param {string} event - Имя события (опционально, если не указано - удаляются все)
     */
    clear(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }

    /**
     * Получение списка всех событий
     * @returns {Array} Список событий
     */
    getEvents() {
        return Object.keys(this.events);
    }

    /**
     * Проверка наличия подписчиков
     * @param {string} event - Имя события
     * @returns {boolean}
     */
    hasListeners(event) {
        return this.events[event] && this.events[event].length > 0;
    }
}

// Предопределённые события приложения
EventBus.Events = {
    // Тест
    TEST_STARTED: 'test:started',
    TEST_COMPLETED: 'test:completed',
    TEST_PROGRESS: 'test:progress',
    QUESTION_ANSWERED: 'question:answered',

    // Результаты
    RESULTS_READY: 'results:ready',
    RESULTS_SAVED: 'results:saved',

    // Навигация
    SCREEN_CHANGED: 'screen:changed',

    // Пользователь
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_REGISTERED: 'user:registered',

    // Настройки
    LANGUAGE_CHANGED: 'language:changed',
    THEME_CHANGED: 'theme:changed',

    // Данные
    DATA_LOADED: 'data:loaded',
    DATA_ERROR: 'data:error',

    // UI
    LOADING_START: 'loading:start',
    LOADING_END: 'loading:end',
    TOAST_SHOW: 'toast:show',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close'
};

// Глобальный экземпляр
if (typeof window !== 'undefined') {
    window.EventBus = EventBus;
    window.eventBus = new EventBus();
}

// Экспорт для модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBus;
}
