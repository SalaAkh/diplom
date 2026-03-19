/**
 * ÐÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ Ð¶Ó™Ð½Ðµ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ñ‚Ð°Ñ€Ð´Ñ‹ Ð±Ð°ÑÒ›Ð°Ñ€Ñƒ Ð¼Ð¾Ð´ÑƒÐ»Ñ– (Authentication and account management module)
 * Ð¡ÐµÑ€Ð²ÐµÑ€ÑÑ–Ð· Ð¶ÐµÑ€Ð³Ñ–Ð»Ñ–ÐºÑ‚Ñ– Ð¶Ò¯Ð¹Ðµ (Local system without server)
 * 
 * ÐÐ²Ñ‚Ð¾Ñ€Ñ‹ (Author): ÐÑ…Ð¼ÐµÐ´ÑŒÑÐ½Ð¾Ð² Ð¡Ð°Ð»Ð°Ð¼Ð°Ñ‚ ÐšÐŸÐž 9/22-2
 * ÐœÐµÑ€Ð·Ñ–Ð¼Ñ– (Date): 2026
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.usersKey = 'personalityTestUsers';
        this.sessionKey = 'currentSession';
        // Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐµÐ¼ Ñ‚Ñ€ÐµÐºÐµÑ€ ÑÐ²Ð¾Ð»ÑŽÑ†Ð¸Ð¸
        this.evolutionTracker = typeof EvolutionTracker !== 'undefined' ? new EvolutionTracker() : null;
    }

    /**
     * Ð ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ Ð½Ð¾Ð²Ð¾Ð³Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @param {string} username - Ð˜Ð¼Ñ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @param {string} email - Email (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾)
     * @returns {Object} Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¸
     */
    register(username, email = '') {
        const t = (typeof window !== 'undefined' && window.t) ? window.t : ((key) => key);
        try {
            const users = this.getAllUsers();

            // ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð° ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÑŽÑ‰ÐµÐ³Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
            if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
                return {
                    success: false,
                    error: t('userExists') || 'User with this name already exists'
                };
            }

            // Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð½Ð¾Ð²Ð¾Ð³Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
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

            // ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ð²Ñ…Ð¾Ð´
            this.login(username);

            return {
                success: true,
                user: newUser
            };
        } catch (error) {
            console.error('Ð¢Ñ–Ñ€ÐºÐµÑƒ Ò›Ð°Ñ‚ÐµÑÑ– (Registration error):', error);
            return {
                success: false,
                error: t('errorDefault') || 'Error during registration'
            };
        }
    }

    /**
     * Ð’Ñ…Ð¾Ð´ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @param {string} username - Ð˜Ð¼Ñ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @returns {Object} Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð²Ñ…Ð¾Ð´Ð°
     */
    login(username) {
        const t = (typeof window !== 'undefined' && window.t) ? window.t : ((key) => key);
        try {
            const users = this.getAllUsers();
            const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

            if (!user) {
                return {
                    success: false,
                    error: t('userNotFound') || 'User not found'
                };
            }

            // ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½ÐµÐ³Ð¾ Ð²Ñ…Ð¾Ð´Ð°
            user.lastLogin = new Date().toISOString();
            this.updateUser(user);

            // Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ ÑÐµÑÑÐ¸Ð¸
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
            console.error('ÐšÑ–Ñ€Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Login error):', error);
            return {
                success: false,
                error: t('errorDefault') || 'Error during login'
            };
        }
    }

    /**
     * Ð’Ñ‹Ñ…Ð¾Ð´ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
    }

    /**
     * ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ñ‚ÐµÐºÑƒÑ‰ÐµÐ¹ ÑÐµÑÑÐ¸Ð¸
     * @returns {Object|null} Ð¢ÐµÐºÑƒÑ‰Ð¸Ð¹ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ Ð¸Ð»Ð¸ null
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
            console.error('Ð¡ÐµÑÑÐ¸ÑÐ½Ñ‹ Ñ‚ÐµÐºÑÐµÑ€Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error checking session):', error);
        }

        return null;
    }

    /**
     * Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð² Ñ‚ÐµÑÑ‚Ð° Ð´Ð»Ñ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ³Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @param {Object} results - Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹ Ñ‚ÐµÑÑ‚Ð°
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
            user.profile = results.profile; // ÐžÐ±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¹ Ð¿Ñ€Ð¾Ñ„Ð¸Ð»ÑŒ
            this.updateUser(user);

            // Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÑÐµÐ¼ Ð² Ñ‚Ñ€ÐµÐºÐµÑ€ ÑÐ²Ð¾Ð»ÑŽÑ†Ð¸Ð¸
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
            console.error('ÐÓ™Ñ‚Ð¸Ð¶ÐµÐ»ÐµÑ€Ð´Ñ– ÑÐ°Ò›Ñ‚Ð°Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error saving results):', error);
            return false;
        }
    }

    /**
     * ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ Ñ‚ÐµÑÑ‚Ð¾Ð² Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @returns {Array} Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ Ñ‚ÐµÑÑ‚Ð¾Ð²
     */
    getTestHistory() {
        const user = this.getCurrentUser();
        if (!user) return [];

        return user.testHistory.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );
    }

    /**
     * ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸ ÑÐ²Ð¾Ð»ÑŽÑ†Ð¸Ð¸ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @returns {Object|null} Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ ÑÐ²Ð¾Ð»ÑŽÑ†Ð¸Ð¸
     */
    getEvolutionHistory() {
        const user = this.getCurrentUser();
        if (!user || !this.evolutionTracker) return null;

        return this.evolutionTracker.getEvolutionHistory(user.id);
    }

    /**
     * ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð° Ð¾Ð± ÑÐ²Ð¾Ð»ÑŽÑ†Ð¸Ð¸
     * @returns {Object|null} ÐžÑ‚Ñ‡Ñ‘Ñ‚ Ð¾Ð± ÑÐ²Ð¾Ð»ÑŽÑ†Ð¸Ð¸
     */
    getEvolutionReport() {
        const user = this.getCurrentUser();
        if (!user || !this.evolutionTracker) return null;

        return this.evolutionTracker.generateEvolutionReport(user.id);
    }

    /**
     * ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð²ÑÐµÑ… Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹
     * @returns {Array} ÐœÐ°ÑÑÐ¸Ð² Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹
     */
    getAllUsers() {
        try {
            const usersData = localStorage.getItem(this.usersKey);
            return usersData ? JSON.parse(usersData) : [];
        } catch (error) {
            console.error('ÐŸÐ°Ð¹Ð´Ð°Ð»Ð°Ð½ÑƒÑˆÑ‹Ð»Ð°Ñ€Ð´Ñ‹ Ð¶Ò¯ÐºÑ‚ÐµÑƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error loading users):', error);
            return [];
        }
    }

    /**
     * Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð²ÑÐµÑ… Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹
     * @param {Array} users - ÐœÐ°ÑÑÐ¸Ð² Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹
     */
    saveUsers(users) {
        try {
            localStorage.setItem(this.usersKey, JSON.stringify(users));
        } catch (error) {
            console.error('ÐŸÐ°Ð¹Ð´Ð°Ð»Ð°Ð½ÑƒÑˆÑ‹Ð»Ð°Ñ€Ð´Ñ‹ ÑÐ°Ò›Ñ‚Ð°Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error saving users):', error);
        }
    }

    /**
     * ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @param {Object} user - ÐžÐ±Ð½Ð¾Ð²Ð»Ñ‘Ð½Ð½Ñ‹Ð¹ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ
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
     * Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°
     * @param {string} userId - ID Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @returns {boolean} Ð£ÑÐ¿ÐµÑ… Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¸
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
            console.error('ÐÐºÐºÐ°ÑƒÐ½Ñ‚Ñ‚Ñ‹ Ó©ÑˆÑ–Ñ€Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error deleting account):', error);
            return false;
        }
    }

    /**
     * Ð“ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ ÑƒÐ½Ð¸ÐºÐ°Ð»ÑŒÐ½Ð¾Ð³Ð¾ ID
     * @returns {string} Ð£Ð½Ð¸ÐºÐ°Ð»ÑŒÐ½Ñ‹Ð¹ ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ°, Ð·Ð°Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½ Ð»Ð¸ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ
     * @param {string} username - Ð˜Ð¼Ñ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @returns {boolean}
     */
    userExists(username) {
        const users = this.getAllUsers();
        return users.some(u => u.username.toLowerCase() === username.toLowerCase());
    }

    /**
     * ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ñ Ñ‚ÐµÑÑ‚Ð°
     * @param {string} testId - ID Ñ‚ÐµÑÑ‚Ð°
     * @param {string} title - ÐÐ¾Ð²Ð¾Ðµ Ð½Ð°Ð·Ð²Ð°Ð½Ð¸Ðµ
     */
    updateTestTitle(testId, title) {
        const user = this.getCurrentUser();
        if (!user || !user.testHistory) return false;

        const test = user.testHistory.find(t => t.id === testId);
        if (test) {
            test.title = title;
            this.updateUser(user);
            return true;
        }
        return false;
    }

    /**
     * Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ñ‚ÐµÑÑ‚Ð° Ð¸Ð· Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸
     * @param {string} testId - ID Ñ‚ÐµÑÑ‚Ð°
     */
    deleteTest(testId) {
        const user = this.getCurrentUser();
        if (!user || !user.testHistory) return false;

        const initialLength = user.testHistory.length;
        user.testHistory = user.testHistory.filter(t => t.id !== testId);

        if (user.testHistory.length !== initialLength) {
            this.updateUser(user);
            return true;
        }
        return false;
    }

    /**
     * Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¸Ñ… Ñ‚ÐµÑÑ‚Ð¾Ð² Ð¸Ð· Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸
     * @param {Array<string>} testIds - ÐœÐ°ÑÑÐ¸Ð² ID Ñ‚ÐµÑÑ‚Ð¾Ð²
     */
    deleteMultipleTests(testIds) {
        const user = this.getCurrentUser();
        if (!user || !user.testHistory || !Array.isArray(testIds) || testIds.length === 0) {
            return false;
        }

        const initialLength = user.testHistory.length;
        user.testHistory = user.testHistory.filter(t => !testIds.includes(t.id));

        if (user.testHistory.length !== initialLength) {
            this.updateUser(user);
            return true;
        }

        return false;
    }
}

// Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð´Ð»Ñ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ð² Ð´Ñ€ÑƒÐ³Ð¸Ñ… Ð¼Ð¾Ð´ÑƒÐ»ÑÑ…
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}

// Ð¯Ð²Ð½Ð¾Ðµ Ð¿Ñ€Ð¸ÑÐ²Ð¾ÐµÐ½Ð¸Ðµ Ðº window Ð´Ð»Ñ Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð°
if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;
}


