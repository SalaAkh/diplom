/**
 * Модуль сравнительного анализа профиля
 * Сравнивает профиль пользователя с идеальными профилями профессий
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ComparativeAnalysis {
    constructor() {
        // Идеальные профили для разных ролей/профессий
        this.roleProfiles = {
            developer: {
                name: { kk: 'Бағдарламашы', ru: 'Разработчик', en: 'Developer' },
                icon: 'code',
                color: '#4a90e2',
                scores: {
                    strategic: 0.6,
                    explorer: 0.7,
                    individualism: 0.5,
                    rationality: 0.8,
                    adaptation: 0.4,
                    meaning: 0.3,
                    intuition: 0.4,
                    utility: 0.6
                },
                description: {
                    kk: 'Логикалық ойлау, мәселені шешу және техникалық дағдылар',
                    ru: 'Логическое мышление, решение проблем и технические навыки',
                    en: 'Logical thinking, problem solving and technical skills'
                }
            },
            manager: {
                name: { kk: 'Менеджер', ru: 'Менеджер', en: 'Manager' },
                icon: 'groups',
                color: '#50c878',
                scores: {
                    strategic: 0.8,
                    explorer: 0.4,
                    individualism: -0.3,
                    rationality: 0.5,
                    adaptation: 0.6,
                    meaning: 0.6,
                    intuition: 0.5,
                    utility: 0.7
                },
                description: {
                    kk: 'Көшбасшылық, стратегиялық жоспарлау және команда басқару',
                    ru: 'Лидерство, стратегическое планирование и управление командой',
                    en: 'Leadership, strategic planning and team management'
                }
            },
            researcher: {
                name: { kk: 'Зерттеуші', ru: 'Исследователь', en: 'Researcher' },
                icon: 'science',
                color: '#7b68ee',
                scores: {
                    strategic: 0.5,
                    explorer: 0.9,
                    individualism: 0.6,
                    rationality: 0.7,
                    adaptation: 0.3,
                    meaning: 0.8,
                    intuition: 0.5,
                    utility: 0.2
                },
                description: {
                    kk: 'Терең зерттеу, сыни ойлау және жаңа білім іздеу',
                    ru: 'Глубокое исследование, критическое мышление и поиск новых знаний',
                    en: 'Deep research, critical thinking and seeking new knowledge'
                }
            },
            designer: {
                name: { kk: 'Дизайнер', ru: 'Дизайнер', en: 'Designer' },
                icon: 'palette',
                color: '#f39c12',
                scores: {
                    strategic: 0.4,
                    explorer: 0.7,
                    individualism: 0.6,
                    rationality: 0.3,
                    adaptation: 0.7,
                    meaning: 0.5,
                    intuition: 0.8,
                    utility: 0.5
                },
                description: {
                    kk: 'Креативтілік, визуалды ойлау және эстетикалық сезім',
                    ru: 'Креативность, визуальное мышление и эстетическое чувство',
                    en: 'Creativity, visual thinking and aesthetic sense'
                }
            },
            analyst: {
                name: { kk: 'Аналитик', ru: 'Аналитик', en: 'Analyst' },
                icon: 'analytics',
                color: '#9b59b6',
                scores: {
                    strategic: 0.7,
                    explorer: 0.6,
                    individualism: 0.4,
                    rationality: 0.9,
                    adaptation: 0.3,
                    meaning: 0.4,
                    intuition: 0.3,
                    utility: 0.7
                },
                description: {
                    kk: 'Деректерді талдау, жүйелік ойлау және болжау',
                    ru: 'Анализ данных, системное мышление и прогнозирование',
                    en: 'Data analysis, systematic thinking and forecasting'
                }
            },
            entrepreneur: {
                name: { kk: 'Кәсіпкер', ru: 'Предприниматель', en: 'Entrepreneur' },
                icon: 'rocket_launch',
                color: '#e74c3c',
                scores: {
                    strategic: 0.7,
                    explorer: 0.6,
                    individualism: 0.7,
                    rationality: 0.5,
                    adaptation: 0.8,
                    meaning: 0.5,
                    intuition: 0.6,
                    utility: 0.9
                },
                description: {
                    kk: 'Тәуекелге бейімділік, бизнес-ойлау және нетворкинг',
                    ru: 'Готовность к риску, бизнес-мышление и нетворкинг',
                    en: 'Risk tolerance, business thinking and networking'
                }
            }
        };
    }

    /**
     * Получить текущий язык
     */
    getLang() {
        try {
            if (window.i18n) return window.i18n.getLanguage();
            const saved = localStorage.getItem('preferredLanguage');
            return saved && ['kk', 'ru', 'en'].includes(saved) ? saved : 'ru';
        } catch (e) {
            return 'ru';
        }
    }

    /**
     * Получить перевод
     */
    getText(field) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        const lang = this.getLang();
        return field[lang] || field['ru'] || field['en'] || '';
    }

    /**
     * Получить список всех ролей
     */
    getRoles() {
        return Object.keys(this.roleProfiles).map(key => ({
            id: key,
            name: this.getText(this.roleProfiles[key].name),
            icon: this.roleProfiles[key].icon,
            color: this.roleProfiles[key].color
        }));
    }

    /**
     * Получить профиль роли
     */
    getRoleProfile(roleId) {
        const role = this.roleProfiles[roleId];
        if (!role) return null;
        return {
            id: roleId,
            name: this.getText(role.name),
            icon: role.icon,
            color: role.color,
            scores: role.scores,
            description: this.getText(role.description)
        };
    }

    /**
     * Сравнить профиль пользователя с ролью
     * @param {Object} userScores - Нормализованные оценки пользователя
     * @param {string} roleId - ID роли для сравнения
     * @returns {Object} Результат сравнения
     */
    compareWithRole(userScores, roleId) {
        const role = this.getRoleProfile(roleId);
        if (!role) return null;

        const comparison = {
            role: role,
            dimensions: {},
            matchPercentage: 0,
            strengths: [],
            gaps: []
        };

        let totalDelta = 0;
        let dimensionCount = 0;

        Object.keys(role.scores).forEach(dim => {
            const userScore = userScores[dim] || 0;
            const roleScore = role.scores[dim];
            const delta = userScore - roleScore;
            const absDelta = Math.abs(delta);

            comparison.dimensions[dim] = {
                user: userScore,
                role: roleScore,
                delta: delta,
                match: Math.max(0, 100 - absDelta * 100)
            };

            totalDelta += absDelta;
            dimensionCount++;

            // Определяем сильные и слабые стороны
            if (delta >= 0.2) {
                comparison.strengths.push(dim);
            } else if (delta <= -0.3) {
                comparison.gaps.push(dim);
            }
        });

        // Расчет общего процента соответствия
        const avgDelta = dimensionCount > 0 ? totalDelta / dimensionCount : 0;
        comparison.matchPercentage = Math.round(Math.max(0, 100 - avgDelta * 100));

        return comparison;
    }

    /**
     * Сравнить текущий профиль с предыдущим
     * @param {Object} currentScores - Текущие оценки
     * @param {Object} previousScores - Предыдущие оценки
     * @returns {Object} Результат сравнения с историей
     */
    compareWithHistory(currentScores, previousScores) {
        if (!previousScores) return null;

        const comparison = {
            dimensions: {},
            improved: [],
            declined: [],
            stable: []
        };

        Object.keys(currentScores).forEach(dim => {
            const current = currentScores[dim] || 0;
            const previous = previousScores[dim] || 0;
            const change = current - previous;
            const changePercent = Math.round(change * 100);

            comparison.dimensions[dim] = {
                current: current,
                previous: previous,
                change: change,
                changePercent: changePercent
            };

            if (change > 0.1) {
                comparison.improved.push({ dimension: dim, change: changePercent });
            } else if (change < -0.1) {
                comparison.declined.push({ dimension: dim, change: changePercent });
            } else {
                comparison.stable.push(dim);
            }
        });

        return comparison;
    }

    /**
     * Найти наиболее подходящую роль для пользователя
     * @param {Object} userScores - Оценки пользователя
     * @returns {Array} Массив ролей, отсортированный по соответствию
     */
    findBestMatchingRoles(userScores) {
        const matches = [];

        Object.keys(this.roleProfiles).forEach(roleId => {
            const comparison = this.compareWithRole(userScores, roleId);
            if (comparison) {
                matches.push({
                    roleId: roleId,
                    role: comparison.role,
                    matchPercentage: comparison.matchPercentage,
                    strengths: comparison.strengths,
                    gaps: comparison.gaps
                });
            }
        });

        // Сортируем по проценту соответствия
        matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

        return matches;
    }

    /**
     * Генерация рекомендаций по развитию для конкретной роли
     * @param {Object} comparison - Результат сравнения
     * @returns {Array} Массив рекомендаций
     */
    generateRoleRecommendations(comparison) {
        const recommendations = [];
        const t = (key) => (window.t ? window.t(key) : key);

        comparison.gaps.forEach(dim => {
            const dimInfo = comparison.dimensions[dim];
            const needed = Math.abs(dimInfo.delta);

            let priority = 'medium';
            if (needed > 0.5) priority = 'high';
            else if (needed < 0.2) priority = 'low';

            recommendations.push({
                dimension: dim,
                priority: priority,
                currentLevel: Math.round((dimInfo.user + 1) * 50),
                targetLevel: Math.round((dimInfo.role + 1) * 50),
                gap: Math.round(needed * 100)
            });
        });

        // Сортируем по приоритету
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        return recommendations;
    }
}

// Глобальный экземпляр
window.comparativeAnalysis = new ComparativeAnalysis();
