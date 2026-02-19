/**
 * Аутентификация және аккаунттарды басқару модулі (Authentication and account management module)
 * Серверсіз жергілікті жүйе (Local system without server)
 * 
 * Авторы (Author): Ахмедьянов Саламат КПО 9/22-2
 * Мерзімі (Date): 2026
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.usersKey = 'personalityTestUsers';
        this.sessionKey = 'currentSession';
        // Инициализируем трекер эволюции
        this.evolutionTracker = typeof EvolutionTracker !== 'undefined' ? new EvolutionTracker() : null;
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
                    error: 'Мұндай атымен пайдаланушы бұрыннан бар (User with this name already exists)'
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
            console.error('Тіркеу қатесі (Registration error):', error);
            return {
                success: false,
                error: 'Тіркелу қатесі (Error during registration)'
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
                    error: 'Пайдаланушы табылмады (User not found)'
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
            console.error('Кіру қатесі (Login error):', error);
            return {
                success: false,
                error: 'Кіру қатесі (Error during login)'
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
            console.error('Сессияны тексеру қатесі (Error checking session):', error);
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
            console.error('Нәтижелерді сақтау қатесі (Error saving results):', error);
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
            console.error('Пайдаланушыларды жүктеу қатесі (Error loading users):', error);
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
            console.error('Пайдаланушыларды сақтау қатесі (Error saving users):', error);
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
            console.error('Аккаунтты өшіру қатесі (Error deleting account):', error);
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

    /**
     * Обновление названия теста
     * @param {number} index - Индекс теста в истории
     * @param {string} title - Новое название
     */
    updateTestTitle(index, title) {
        const user = this.getCurrentUser();
        if (!user || !user.testHistory || !user.testHistory[index]) return false;

        user.testHistory[index].title = title;
        this.updateUser(user);
        return true;
    }
    /**
     * Удаление теста из истории
     * @param {number} index - Индекс теста в истории
     */
    deleteTest(index) {
        const user = this.getCurrentUser();
        if (!user || !user.testHistory || !user.testHistory[index]) return false;

        user.testHistory.splice(index, 1);
        this.updateUser(user);
        return true;
    }

    /**
     * Удаление нескольких тестов из истории
     * @param {Array<number>} indices - Массив индексов тестов
     */
    deleteMultipleTests(indices) {
        const user = this.getCurrentUser();
        if (!user || !user.testHistory || !Array.isArray(indices) || indices.length === 0) {
            return false;
        }

        // Сортируем индексы в обратном порядке для корректного удаления
        const sortedIndices = [...indices].sort((a, b) => b - a);

        let deletedCount = 0;
        sortedIndices.forEach(index => {
            if (user.testHistory[index]) {
                user.testHistory.splice(index, 1);
                deletedCount++;
            }
        });

        if (deletedCount > 0) {
            this.updateUser(user);
            return true;
        }

        return false;
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
