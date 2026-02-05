/**
 * Сервис совместимости профилей
 * Анализирует совместимость и взаимодействие между профилями
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class CompatibilityService {
    constructor() {
        this.dimensions = ['rationality', 'ambition', 'sociability', 'creativity', 'emotional', 'reliability'];
        this.dimensionLabels = {
            ru: {
                rationality: 'Рациональность',
                ambition: 'Амбициозность',
                sociability: 'Социальность',
                creativity: 'Креативность',
                emotional: 'Эмоциональность',
                reliability: 'Надёжность'
            },
            kk: {
                rationality: 'Ұтымдылық',
                ambition: 'Амбиция',
                sociability: 'Әлеуметтілік',
                creativity: 'Шығармашылық',
                emotional: 'Эмоционалдылық',
                reliability: 'Сенімділік'
            },
            en: {
                rationality: 'Rationality',
                ambition: 'Ambition',
                sociability: 'Sociability',
                creativity: 'Creativity',
                emotional: 'Emotional',
                reliability: 'Reliability'
            }
        };
    }

    /**
     * Получить текущий язык
     */
    getLang() {
        if (window.localizationService?.getCurrentLanguage) {
            return window.localizationService.getCurrentLanguage();
        }
        return localStorage.getItem('language') || 'ru';
    }

    /**
     * Рассчитать совместимость двух профилей
     * @param {Object} profile1 - Первый профиль { dim: score }
     * @param {Object} profile2 - Второй профиль { dim: score }
     * @returns {Object} Результат совместимости
     */
    calculateCompatibility(profile1, profile2) {
        if (!profile1 || !profile2) return null;

        const dimScores = {};
        let totalScore = 0;
        let count = 0;

        for (const dim of this.dimensions) {
            const s1 = profile1[dim] ?? 0.5;
            const s2 = profile2[dim] ?? 0.5;

            // Расчёт совместимости по измерению
            // Комбинация: близость значений + комплементарность
            const similarity = 1 - Math.abs(s1 - s2);
            const complementarity = this.getComplementarityScore(dim, s1, s2);

            // Взвешенная комбинация
            const dimScore = similarity * 0.6 + complementarity * 0.4;
            dimScores[dim] = Math.round(dimScore * 100);
            totalScore += dimScore;
            count++;
        }

        const overallScore = Math.round((totalScore / count) * 100);

        return {
            overallScore,
            dimensions: dimScores,
            synergies: this.findSynergies(dimScores),
            conflicts: this.findConflicts(dimScores),
            type: this.getCompatibilityType(overallScore),
            label: this.getCompatibilityLabel(overallScore)
        };
    }

    /**
     * Рассчитать комплементарность по измерению
     */
    getComplementarityScore(dim, s1, s2) {
        // Некоторые измерения лучше комплементарны (разные значения)
        // Другие лучше схожи
        const complementaryDims = ['creativity', 'emotional'];
        const similarDims = ['ambition', 'reliability'];

        if (complementaryDims.includes(dim)) {
            // Для комплементарных: небольшая разница хороша
            const diff = Math.abs(s1 - s2);
            return diff > 0.3 && diff < 0.6 ? 1 : 0.5;
        } else if (similarDims.includes(dim)) {
            // Для схожих: близость — лучше
            return 1 - Math.abs(s1 - s2);
        }

        // Нейтральные
        return 0.7;
    }

    /**
     * Найти области синергии
     */
    findSynergies(dimScores) {
        const lang = this.getLang();
        return Object.entries(dimScores)
            .filter(([_, score]) => score >= 70)
            .map(([dim, score]) => ({
                dimension: this.dimensionLabels[lang]?.[dim] || dim,
                score,
                key: dim
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }

    /**
     * Найти области конфликта
     */
    findConflicts(dimScores) {
        const lang = this.getLang();
        return Object.entries(dimScores)
            .filter(([_, score]) => score < 50)
            .map(([dim, score]) => ({
                dimension: this.dimensionLabels[lang]?.[dim] || dim,
                score,
                key: dim
            }))
            .sort((a, b) => a.score - b.score)
            .slice(0, 3);
    }

    /**
     * Получить тип совместимости
     */
    getCompatibilityType(score) {
        if (score >= 80) return 'excellent';
        if (score >= 65) return 'good';
        if (score >= 50) return 'moderate';
        if (score >= 35) return 'challenging';
        return 'difficult';
    }

    /**
     * Получить метку совместимости
     */
    getCompatibilityLabel(score) {
        const lang = this.getLang();
        const labels = {
            ru: {
                excellent: 'Отличная совместимость',
                good: 'Хорошая совместимость',
                moderate: 'Умеренная совместимость',
                challenging: 'Сложная совместимость',
                difficult: 'Низкая совместимость'
            },
            kk: {
                excellent: 'Тамаша үйлесімділік',
                good: 'Жақсы үйлесімділік',
                moderate: 'Орташа үйлесімділік',
                challenging: 'Күрделі үйлесімділік',
                difficult: 'Төмен үйлесімділік'
            },
            en: {
                excellent: 'Excellent compatibility',
                good: 'Good compatibility',
                moderate: 'Moderate compatibility',
                challenging: 'Challenging compatibility',
                difficult: 'Low compatibility'
            }
        };

        return labels[lang]?.[this.getCompatibilityType(score)] || labels.ru[this.getCompatibilityType(score)];
    }

    /**
     * Генерировать рекомендации по взаимодействию
     * @param {Object} compatibility - Результат calculateCompatibility
     * @returns {Array} Массив рекомендаций
     */
    generateRecommendations(compatibility) {
        if (!compatibility) return [];

        const lang = this.getLang();
        const recommendations = [];

        // Рекомендации по синергиям
        const synergyAdvice = {
            ru: {
                rationality: 'Используйте аналитические способности друг друга для решения сложных задач.',
                ambition: 'Ваши амбиции схожи — ставьте общие большие цели.',
                sociability: 'Вместе вы отлично работаете в команде и на публике.',
                creativity: 'Объединяйте креативные идеи для инноваций.',
                emotional: 'Ваша эмоциональная связь — основа доверия.',
                reliability: 'Вы можете полагаться друг на друга в сложных ситуациях.'
            },
            kk: {
                rationality: 'Күрделі мәселелерді шешу үшін бір-біріңіздің аналитикалық қабілеттеріңізді пайдаланыңыз.',
                ambition: 'Сіздің амбицияларыңыз ұқсас — ортақ үлкен мақсаттар қойыңыз.',
                sociability: 'Бірге сіз командада және жұртшылықта тамаша жұмыс істейсіз.',
                creativity: 'Инновациялар үшін шығармашылық идеяларды біріктіріңіз.',
                emotional: 'Сіздің эмоционалдық байланысыңыз — сенімнің негізі.',
                reliability: 'Қиын жағдайларда бір-біріңізге сене аласыздар.'
            },
            en: {
                rationality: 'Leverage each other\'s analytical abilities for complex problem-solving.',
                ambition: 'Your ambitions align — set common big goals together.',
                sociability: 'Together you excel in teamwork and public settings.',
                creativity: 'Combine creative ideas for innovation.',
                emotional: 'Your emotional connection is the foundation of trust.',
                reliability: 'You can rely on each other in challenging situations.'
            }
        };

        // Добавляем советы по синергиям
        for (const synergy of compatibility.synergies) {
            const advice = synergyAdvice[lang]?.[synergy.key] || synergyAdvice.ru[synergy.key];
            if (advice) {
                recommendations.push({
                    type: 'synergy',
                    dimension: synergy.dimension,
                    score: synergy.score,
                    advice
                });
            }
        }

        // Рекомендации по конфликтам
        const conflictAdvice = {
            ru: {
                rationality: 'Уважайте разные подходы к принятию решений — логика vs интуиция.',
                ambition: 'Обсудите ожидания от темпа достижения целей.',
                sociability: 'Находите баланс между временем вместе и личным пространством.',
                creativity: 'Цените как креативность, так и практичность.',
                emotional: 'Будьте терпеливы к разной эмоциональной экспрессии.',
                reliability: 'Чётко оговаривайте обязательства и сроки.'
            },
            kk: {
                rationality: 'Шешім қабылдаудың әртүрлі тәсілдерін құрметтеңіз — логика vs интуиция.',
                ambition: 'Мақсаттарға жету қарқынынан үміттерді талқылаңыз.',
                sociability: 'Бірге уақыт пен жеке кеңістік арасындағы тепе-теңдікті табыңыз.',
                creativity: 'Шығармашылықты да, практикалықты да бағалаңыз.',
                emotional: 'Әртүрлі эмоционалдық көріністерге шыдамды болыңыз.',
                reliability: 'Міндеттемелер мен мерзімдерді нақты айтыңыз.'
            },
            en: {
                rationality: 'Respect different decision-making approaches — logic vs intuition.',
                ambition: 'Discuss expectations about the pace of achieving goals.',
                sociability: 'Find balance between time together and personal space.',
                creativity: 'Value both creativity and practicality.',
                emotional: 'Be patient with different emotional expressions.',
                reliability: 'Clearly define commitments and deadlines.'
            }
        };

        // Добавляем советы по конфликтам
        for (const conflict of compatibility.conflicts) {
            const advice = conflictAdvice[lang]?.[conflict.key] || conflictAdvice.ru[conflict.key];
            if (advice) {
                recommendations.push({
                    type: 'conflict',
                    dimension: conflict.dimension,
                    score: conflict.score,
                    advice
                });
            }
        }

        return recommendations;
    }

    /**
     * Получить идеальный профиль партнёра
     * @param {Object} userScores - Баллы пользователя
     * @returns {Object} Идеальный профиль
     */
    getIdealPartnerProfile(userScores) {
        if (!userScores) return null;

        const idealProfile = {};

        // Оптимальный партнёр — комплементарен в некоторых измерениях
        for (const dim of this.dimensions) {
            const userScore = userScores[dim] ?? 0.5;

            // Для эмоциональности и креативности — комплементарность
            if (dim === 'emotional' || dim === 'creativity') {
                idealProfile[dim] = userScore > 0.5 ? userScore - 0.2 : userScore + 0.2;
            }
            // Для надёжности и амбициозности — сходство
            else if (dim === 'reliability' || dim === 'ambition') {
                idealProfile[dim] = userScore;
            }
            // Для остальных — небольшая вариация
            else {
                idealProfile[dim] = Math.max(0.3, Math.min(0.9, userScore + (Math.random() * 0.2 - 0.1)));
            }

            idealProfile[dim] = Math.round(idealProfile[dim] * 100) / 100;
        }

        return idealProfile;
    }

    /**
     * Сравнить профиль со знаменитостью
     * @param {Object} userScores - Баллы пользователя
     * @param {string} celebrityId - ID знаменитости
     * @returns {Object} Результат сравнения
     */
    compareWithCelebrity(userScores, celebrityId) {
        if (!window.celebrityService) return null;

        const celebrity = window.celebrityService.getCelebrityById(celebrityId);
        if (!celebrity) return null;

        const compatibility = this.calculateCompatibility(userScores, celebrity.scores);
        const recommendations = this.generateRecommendations(compatibility);

        return {
            celebrity: {
                id: celebrity.id,
                name: celebrity.name,
                category: celebrity.category,
                photo: celebrity.photo || null
            },
            ...compatibility,
            recommendations
        };
    }

    /**
     * Найти наиболее совместимых знаменитостей
     * @param {Object} userScores - Баллы пользователя
     * @param {number} limit - Количество
     * @returns {Array} Массив совместимых знаменитостей
     */
    findMostCompatibleCelebrities(userScores, limit = 5) {
        if (!window.CELEBRITY_PROFILES?.profiles) return [];

        const results = [];

        for (const celebrity of window.CELEBRITY_PROFILES.profiles) {
            const compatibility = this.calculateCompatibility(userScores, celebrity.scores);
            if (compatibility) {
                results.push({
                    celebrity: {
                        id: celebrity.id,
                        name: celebrity.name,
                        category: celebrity.category,
                        photo: celebrity.photo
                    },
                    ...compatibility
                });
            }
        }

        return results
            .sort((a, b) => b.overallScore - a.overallScore)
            .slice(0, limit);
    }
}

// Глобальный экземпляр
window.compatibilityService = new CompatibilityService();
