/**
 * AppState - Централизованное управление состоянием приложения
 * Реализует паттерн State Management с уведомлениями об изменениях
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class AppState {
    constructor(eventBus = null) {
        this.eventBus = eventBus || (typeof window !== 'undefined' ? window.eventBus : null);

        // Начальное состояние
        this.state = {
            // Экран/навигация
            currentScreen: 'intro', // intro, testSelection, testing, results, profile
            previousScreen: null,

            // Тест
            testMode: null, // 'basic' или 'advanced'
            testStarted: false,
            testCompleted: false,
            currentQuestionIndex: 0,
            totalQuestions: 0,
            answers: [],

            // Пользователь
            user: null,
            isAuthenticated: false,
            isGuest: true,

            // Настройки
            language: 'kk',
            theme: 'dark',

            // UI
            isLoading: false,
            loadingMessage: '',

            // Данные
            scenariosLoaded: false,
            advancedScenariosLoaded: false
        };

        // История состояний для отладки
        this.history = [];
        this.maxHistoryLength = 50;
    }

    /**
     * Получение текущего состояния
     * @param {string} key - Ключ состояния (опционально)
     * @returns {*} Значение состояния
     */
    get(key) {
        if (key) {
            return this.state[key];
        }
        return { ...this.state };
    }

    /**
     * Установка состояния
     * @param {string|Object} keyOrObject - Ключ или объект с изменениями
     * @param {*} value - Значение (если первый аргумент - ключ)
     */
    set(keyOrObject, value) {
        const changes = typeof keyOrObject === 'string'
            ? { [keyOrObject]: value }
            : keyOrObject;

        const oldState = { ...this.state };

        // Применяем изменения
        Object.assign(this.state, changes);

        // Сохраняем в историю
        this.saveToHistory(oldState, changes);

        // Уведомляем подписчиков
        this.notifyChanges(changes, oldState);
    }

    /**
     * Сохранение в историю изменений
     * @param {Object} oldState - Предыдущее состояние
     * @param {Object} changes - Изменения
     */
    saveToHistory(oldState, changes) {
        this.history.push({
            timestamp: Date.now(),
            changes,
            oldValues: Object.keys(changes).reduce((acc, key) => {
                acc[key] = oldState[key];
                return acc;
            }, {})
        });

        // Ограничиваем размер истории
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
    }

    /**
     * Уведомление об изменениях через EventBus
     * @param {Object} changes - Изменения
     * @param {Object} oldState - Предыдущее состояние
     */
    notifyChanges(changes, oldState) {
        if (!this.eventBus) return;

        // Общее событие изменения состояния
        this.eventBus.emit('state:changed', { changes, oldState, newState: this.state });

        // Специфические события
        if ('currentScreen' in changes) {
            this.eventBus.emit(EventBus.Events.SCREEN_CHANGED, {
                screen: changes.currentScreen,
                previousScreen: oldState.currentScreen
            });
        }

        if ('language' in changes) {
            this.eventBus.emit(EventBus.Events.LANGUAGE_CHANGED, changes.language);
        }

        if ('theme' in changes) {
            this.eventBus.emit(EventBus.Events.THEME_CHANGED, changes.theme);
        }

        if ('isAuthenticated' in changes || 'user' in changes) {
            if (changes.isAuthenticated) {
                this.eventBus.emit(EventBus.Events.USER_LOGIN, this.state.user);
            } else if (changes.isAuthenticated === false) {
                this.eventBus.emit(EventBus.Events.USER_LOGOUT);
            }
        }

        if ('isLoading' in changes) {
            this.eventBus.emit(
                changes.isLoading ? EventBus.Events.LOADING_START : EventBus.Events.LOADING_END,
                this.state.loadingMessage
            );
        }
    }

    /**
     * Сброс состояния теста
     */
    resetTest() {
        this.set({
            testStarted: false,
            testCompleted: false,
            currentQuestionIndex: 0,
            answers: [],
            testMode: null
        });
    }

    /**
     * Начало теста
     * @param {string} mode - Режим теста ('basic' или 'advanced')
     * @param {number} totalQuestions - Общее количество вопросов
     */
    startTest(mode, totalQuestions) {
        this.set({
            testMode: mode,
            testStarted: true,
            testCompleted: false,
            currentQuestionIndex: 0,
            totalQuestions,
            answers: [],
            currentScreen: 'testing'
        });

        if (this.eventBus) {
            this.eventBus.emit(EventBus.Events.TEST_STARTED, { mode, totalQuestions });
        }
    }

    /**
     * Запись ответа
     * @param {Object} answer - Ответ пользователя
     */
    recordAnswer(answer) {
        const answers = [...this.state.answers, answer];
        const currentQuestionIndex = this.state.currentQuestionIndex + 1;

        this.set({ answers, currentQuestionIndex });

        if (this.eventBus) {
            this.eventBus.emit(EventBus.Events.QUESTION_ANSWERED, answer);
            this.eventBus.emit(EventBus.Events.TEST_PROGRESS, {
                current: currentQuestionIndex,
                total: this.state.totalQuestions,
                percentage: Math.round((currentQuestionIndex / this.state.totalQuestions) * 100)
            });
        }
    }

    /**
     * Завершение теста
     * @param {Object} results - Результаты теста
     */
    completeTest(results) {
        this.set({
            testCompleted: true,
            currentScreen: 'results'
        });

        if (this.eventBus) {
            this.eventBus.emit(EventBus.Events.TEST_COMPLETED, results);
        }
    }

    /**
     * Авторизация пользователя
     * @param {Object} user - Данные пользователя
     */
    login(user) {
        this.set({
            user,
            isAuthenticated: true,
            isGuest: false
        });
    }

    /**
     * Выход пользователя
     */
    logout() {
        this.set({
            user: null,
            isAuthenticated: false,
            isGuest: true
        });
    }

    /**
     * Показать загрузку
     * @param {string} message - Сообщение загрузки
     */
    showLoading(message = '') {
        this.set({ isLoading: true, loadingMessage: message });
    }

    /**
     * Скрыть загрузку
     */
    hideLoading() {
        this.set({ isLoading: false, loadingMessage: '' });
    }

    /**
     * Навигация
     * @param {string} screen - Экран для отображения
     */
    navigate(screen) {
        this.set({
            previousScreen: this.state.currentScreen,
            currentScreen: screen
        });
    }

    /**
     * Получение истории изменений
     * @returns {Array} История изменений
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Отладочный вывод состояния
     */
    debug() {
        console.group('📊 AppState Debug');
        console.log('Ағымдағы күй (Current State):', this.state);
        console.log('Тарих (History):', this.history.slice(-5));
        console.groupEnd();
    }
}

// Глобальный экземпляр
if (typeof window !== 'undefined') {
    window.AppState = AppState;
    // Инициализируем после EventBus
    if (window.eventBus) {
        window.appState = new AppState(window.eventBus);
    } else {
        // Отложенная инициализация
        window.addEventListener('DOMContentLoaded', () => {
            if (!window.appState && window.eventBus) {
                window.appState = new AppState(window.eventBus);
            }
        });
    }
}

// Экспорт для модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppState;
}
