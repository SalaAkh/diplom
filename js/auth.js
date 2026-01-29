/**
 * Модуль аутентификации и управления аккаунтами
 * Локальная система без сервера
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.usersKey = 'personalityTestUsers';
        this.sessionKey = 'currentSession';
        // Пытаемся загрузить Client ID из localStorage
        this.googleClientId = localStorage.getItem('googleClientId');
        
        // Инициализируем трекер эволюции
        this.evolutionTracker = typeof EvolutionTracker !== 'undefined' ? new EvolutionTracker() : null;
        
        // Инициализируем Google Sign-In после загрузки API
        if (typeof window !== 'undefined') {
            // Ждём загрузки Google API
            if (window.google && window.google.accounts) {
                this.initGoogleSignIn();
            } else {
                // Если API ещё не загружен, ждём
                window.addEventListener('load', () => {
                    if (window.google && window.google.accounts) {
                        this.initGoogleSignIn();
                    }
                });
            }
        }
    }

    /**
     * Проверка конфигурации Google Sign-In
     * @returns {boolean} true если Google Sign-In настроен
     */
    isGoogleSignInConfigured() {
        // Проверяем наличие Client ID
        if (!this.googleClientId || this.googleClientId === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
            return false;
        }
        
        // Проверяем наличие Google API
        if (typeof window === 'undefined' || !window.google || !window.google.accounts) {
            return false;
        }
        
        return true;
    }

    /**
     * Инициализация Google Sign-In
     */
    initGoogleSignIn() {
        // Проверяем конфигурацию перед инициализацией
        if (!this.isGoogleSignInConfigured()) {
            debugLog('Google Sign-In не настроен или API не загружен');
            return false;
        }
        
        try {
            window.google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: this.handleGoogleSignIn.bind(this)
            });
            
            // Показываем кнопку входа, если она есть
            try {
                window.google.accounts.id.renderButton(
                    document.getElementById('googleSignInButton'),
                    { theme: 'outline', size: 'large' }
                );
            } catch (renderError) {
                debugLog('Не удалось отобразить кнопку Google Sign-In:', renderError);
            }
            
            return true;
        } catch (error) {
            console.error('Ошибка инициализации Google Sign-In:', error);
            return false;
        }
    }

    /**
     * Обработка входа через Google
     * @param {Object} response - Ответ от Google
     */
    handleGoogleSignIn(response) {
        try {
            // Декодируем JWT токен (упрощённая версия для демо)
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            const googleUser = {
                id: payload.sub,
                username: payload.name || payload.email.split('@')[0],
                email: payload.email,
                picture: payload.picture,
                provider: 'google',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                testHistory: [],
                profile: null
            };

            // Проверяем, существует ли пользователь
            const users = this.getAllUsers();
            let existingUser = users.find(u => u.email === googleUser.email || u.id === googleUser.id);

            if (existingUser) {
                // Обновляем последний вход
                existingUser.lastLogin = new Date().toISOString();
                existingUser.picture = googleUser.picture;
                this.saveUsers(users);
                this.currentUser = existingUser;
            } else {
                // Создаём нового пользователя
                users.push(googleUser);
                this.saveUsers(users);
                this.currentUser = googleUser;
            }

            // Сохраняем сессию
            localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
            
            // Обновляем UI
            if (typeof app !== 'undefined') {
                app.state = 'intro';
                app.showIntro();
            }

            return {
                success: true,
                user: this.currentUser
            };
        } catch (error) {
            console.error('Google Sign-In error:', error);
            return {
                success: false,
                error: 'Ошибка входа через Google'
            };
        }
    }

    /**
     * Установка Google Client ID
     * @param {string} clientId - Google Client ID
     */
    setGoogleClientId(clientId) {
        this.googleClientId = clientId;
        localStorage.setItem('googleClientId', clientId);
        this.initGoogleSignIn();
    }

    /**
     * Регистрация нового пользователя
     * @param {string} username - Имя пользователя
     * @param {string} email - Email (опционально)
     * @returns {Object} Результат регистрации
     */
    register(username, email = '') {
        try {
            const users = this.getAllUsers();
            
            // Проверка на существующего пользователя
            if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
                return {
                    success: false,
                    error: 'Пользователь с таким именем уже существует'
                };
            }

            // Создание нового пользователя
            const newUser = {
                id: this.generateId(),
                username: username.trim(),
                email: email.trim(),
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                testHistory: [],
                profile: null
            };

            users.push(newUser);
            this.saveUsers(users);

            // Автоматический вход
            this.login(username);

            return {
                success: true,
                user: newUser
            };
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            return {
                success: false,
                error: 'Ошибка при регистрации'
            };
        }
    }

    /**
     * Вход пользователя
     * @param {string} username - Имя пользователя
     * @returns {Object} Результат входа
     */
    login(username) {
        try {
            const users = this.getAllUsers();
            const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

            if (!user) {
                return {
                    success: false,
                    error: 'Пользователь не найден'
                };
            }

            // Обновление времени последнего входа
            user.lastLogin = new Date().toISOString();
            this.updateUser(user);

            // Сохранение сессии
            this.currentUser = user;
            localStorage.setItem(this.sessionKey, JSON.stringify({
                userId: user.id,
                username: user.username,
                loginTime: new Date().toISOString()
            }));

            return {
                success: true,
                user: user
            };
        } catch (error) {
            console.error('Ошибка входа:', error);
            return {
                success: false,
                error: 'Ошибка при входе'
            };
        }
    }

    /**
     * Выход пользователя
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
    }

    /**
     * Проверка текущей сессии
     * @returns {Object|null} Текущий пользователь или null
     */
    getCurrentUser() {
        if (this.currentUser) {
            return this.currentUser;
        }

        try {
            const sessionData = localStorage.getItem(this.sessionKey);
            if (sessionData) {
                const session = JSON.parse(sessionData);
                const users = this.getAllUsers();
                const user = users.find(u => u.id === session.userId);
                
                if (user) {
                    this.currentUser = user;
                    return user;
                }
            }
        } catch (error) {
            console.error('Ошибка проверки сессии:', error);
        }

        return null;
    }

    /**
     * Сохранение результатов теста для текущего пользователя
     * @param {Object} results - Результаты теста
     */
    saveTestResults(results) {
        const user = this.getCurrentUser();
        if (!user) return false;

        try {
            const testResult = {
                id: this.generateId(),
                date: new Date().toISOString(),
                results: results,
                profile: results.profile,
                scores: results.scores,
                normalizedScores: results.normalizedScores,
                vector: results.aiAnalysis?.vector || null,
                choices: results.choices || [],
                statistics: results.statistics || {}
            };

            user.testHistory.push(testResult);
            user.profile = results.profile; // Обновляем текущий профиль
            this.updateUser(user);

            // Сохраняем в трекер эволюции
            if (this.evolutionTracker) {
                this.evolutionTracker.saveSessionResults(user.id, {
                    scores: results.scores,
                    normalizedScores: results.normalizedScores,
                    vector: results.aiAnalysis?.vector || null,
                    profile: results.profile,
                    choices: results.choices || [],
                    statistics: results.statistics || {}
                });
            }

            return true;
        } catch (error) {
            console.error('Ошибка сохранения результатов:', error);
            return false;
        }
    }

    /**
     * Получение истории тестов пользователя
     * @returns {Array} История тестов
     */
    getTestHistory() {
        const user = this.getCurrentUser();
        if (!user) return [];

        return user.testHistory.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
    }

    /**
     * Получение истории эволюции пользователя
     * @returns {Object|null} История эволюции
     */
    getEvolutionHistory() {
        const user = this.getCurrentUser();
        if (!user || !this.evolutionTracker) return null;

        return this.evolutionTracker.getEvolutionHistory(user.id);
    }

    /**
     * Получение отчёта об эволюции
     * @returns {Object|null} Отчёт об эволюции
     */
    getEvolutionReport() {
        const user = this.getCurrentUser();
        if (!user || !this.evolutionTracker) return null;

        return this.evolutionTracker.generateEvolutionReport(user.id);
    }

    /**
     * Получение всех пользователей
     * @returns {Array} Массив пользователей
     */
    getAllUsers() {
        try {
            const usersData = localStorage.getItem(this.usersKey);
            return usersData ? JSON.parse(usersData) : [];
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            return [];
        }
    }

    /**
     * Сохранение всех пользователей
     * @param {Array} users - Массив пользователей
     */
    saveUsers(users) {
        try {
            localStorage.setItem(this.usersKey, JSON.stringify(users));
        } catch (error) {
            console.error('Ошибка сохранения пользователей:', error);
        }
    }

    /**
     * Обновление пользователя
     * @param {Object} user - Обновлённый пользователь
     */
    updateUser(user) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === user.id);
        
        if (index !== -1) {
            users[index] = user;
            this.saveUsers(users);
            
            if (this.currentUser && this.currentUser.id === user.id) {
                this.currentUser = user;
            }
        }
    }

    /**
     * Удаление аккаунта
     * @param {string} userId - ID пользователя
     * @returns {boolean} Успех операции
     */
    deleteAccount(userId) {
        try {
            const users = this.getAllUsers();
            const filteredUsers = users.filter(u => u.id !== userId);
            this.saveUsers(filteredUsers);

            if (this.currentUser && this.currentUser.id === userId) {
                this.logout();
            }

            return true;
        } catch (error) {
            console.error('Ошибка удаления аккаунта:', error);
            return false;
        }
    }

    /**
     * Генерация уникального ID
     * @returns {string} Уникальный ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Проверка, зарегистрирован ли пользователь
     * @param {string} username - Имя пользователя
     * @returns {boolean}
     */
    userExists(username) {
        const users = this.getAllUsers();
        return users.some(u => u.username.toLowerCase() === username.toLowerCase());
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}

// Явное присвоение к window для браузера
if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;
}
