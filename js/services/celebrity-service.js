/**
 * Сервис сравнения со знаменитостями
 * Находит похожие профили знаменитостей на основе косинусного сходства
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class CelebrityService {
    constructor() {
        this.profiles = window.CELEBRITY_PROFILES?.profiles || [];
        this.categories = window.CELEBRITY_PROFILES?.categories || {};
        this.dimensionKeys = ['rationality', 'strategic', 'explorer', 'individualism', 'adaptation', 'intuition'];
    }

    /**
     * Получить текущий язык
     * @returns {string} Код языка
     */
    getLang() {
        if (window.i18n?.currentLanguage) {
            return window.i18n.currentLanguage;
        }
        return localStorage.getItem('preferredLanguage') || 'ru';
    }

    /**
     * Получить локализованный текст
     * @param {Object|string} field - Объект с переводами или строка
     * @returns {string} Текст на текущем языке
     */
    getLocalizedText(field) {
        if (typeof field === 'string') return field;
        if (!field) return '';
        const lang = this.getLang();
        return field[lang] || field['ru'] || field['en'] || Object.values(field)[0] || '';
    }

    /**
     * Вычислить косинусное сходство между двумя профилями
     * @param {Object} scores1 - Первый профиль
     * @param {Object} scores2 - Второй профиль
     * @returns {number} Сходство от 0 до 1
     */
    calculateCosineSimilarity(scores1, scores2) {
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;

        for (const dim of this.dimensionKeys) {
            const val1 = scores1[dim] || 0;
            const val2 = scores2[dim] || 0;

            dotProduct += val1 * val2;
            magnitude1 += val1 * val1;
            magnitude2 += val2 * val2;
        }

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        if (magnitude1 === 0 || magnitude2 === 0) return 0;

        return dotProduct / (magnitude1 * magnitude2);
    }

    /**
     * Вычислить евклидово расстояние (нормализованное в сходство)
     * @param {Object} scores1 - Первый профиль
     * @param {Object} scores2 - Второй профиль
     * @returns {number} Сходство от 0 до 1
     */
    calculateEuclideanSimilarity(scores1, scores2) {
        let sumSquared = 0;

        for (const dim of this.dimensionKeys) {
            const val1 = scores1[dim] || 0;
            const val2 = scores2[dim] || 0;
            sumSquared += Math.pow(val1 - val2, 2);
        }

        const distance = Math.sqrt(sumSquared);
        // Нормализация: максимальное расстояние = sqrt(6) ≈ 2.45 (для 6 измерений от 0 до 1)
        const maxDistance = Math.sqrt(this.dimensionKeys.length);
        return 1 - (distance / maxDistance);
    }

    /**
     * Комбинированная метрика сходства
     * @param {Object} scores1 - Первый профиль
     * @param {Object} scores2 - Второй профиль
     * @returns {number} Сходство от 0 до 1
     */
    calculateSimilarity(scores1, scores2) {
        const cosine = this.calculateCosineSimilarity(scores1, scores2);
        const euclidean = this.calculateEuclideanSimilarity(scores1, scores2);
        // Комбинируем обе метрики (60% косинус, 40% евклид)
        return cosine * 0.6 + euclidean * 0.4;
    }

    /**
     * Найти похожих знаменитостей
     * @param {Object} userScores - Профиль пользователя
     * @param {number} limit - Максимальное количество результатов
     * @param {string} category - Фильтр по категории (опционально)
     * @returns {Array} Массив знаменитостей с процентом сходства
     */
    findSimilarCelebrities(userScores, limit = 5, category = null) {
        if (!userScores || Object.keys(userScores).length === 0) {
            return [];
        }

        let profiles = this.profiles;

        // Фильтрация по категории
        if (category && category !== 'all') {
            profiles = profiles.filter(p => p.category === category);
        }

        // Вычисление сходства
        const results = profiles.map(celebrity => {
            const similarity = this.calculateSimilarity(userScores, celebrity.scores);
            return {
                ...celebrity,
                similarity: similarity,
                matchPercent: Math.round(similarity * 100),
                name: this.getLocalizedText(celebrity.name),
                bio: this.getLocalizedText(celebrity.bio),
                achievements: this.getLocalizedText(celebrity.achievements),
                categoryName: this.getLocalizedText(this.categories[celebrity.category])
            };
        });

        // Сортировка по сходству и ограничение
        return results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }

    /**
     * Получить знаменитость по ID
     * @param {string} id - ID знаменитости
     * @returns {Object|null} Профиль знаменитости
     */
    getCelebrityById(id) {
        const celebrity = this.profiles.find(p => p.id === id);
        if (!celebrity) return null;

        return {
            ...celebrity,
            name: this.getLocalizedText(celebrity.name),
            bio: this.getLocalizedText(celebrity.bio),
            achievements: this.getLocalizedText(celebrity.achievements),
            categoryName: this.getLocalizedText(this.categories[celebrity.category])
        };
    }

    /**
     * Получить всех знаменитостей по категории
     * @param {string} category - Категория
     * @returns {Array} Массив знаменитостей
     */
    getCelebritiesByCategory(category) {
        return this.profiles
            .filter(p => p.category === category)
            .map(celebrity => ({
                ...celebrity,
                name: this.getLocalizedText(celebrity.name),
                bio: this.getLocalizedText(celebrity.bio),
                categoryName: this.getLocalizedText(this.categories[celebrity.category])
            }));
    }

    /**
     * Получить все категории
     * @returns {Array} Массив категорий
     */
    getCategories() {
        return Object.keys(this.categories).map(key => ({
            id: key,
            name: this.getLocalizedText(this.categories[key])
        }));
    }

    /**
     * Получить детальное сравнение с конкретной знаменитостью
     * @param {Object} userScores - Профиль пользователя
     * @param {string} celebrityId - ID знаменитости
     * @returns {Object} Детальное сравнение
     */
    getDetailedComparison(userScores, celebrityId) {
        const celebrity = this.getCelebrityById(celebrityId);
        if (!celebrity) return null;

        const dimensionNames = {
            rationality: { ru: 'Рациональность', kk: 'Ұтымдылық', en: 'Rationality' },
            strategic: { ru: 'Стратегичность', kk: 'Стратегиялық', en: 'Strategic' },
            explorer: { ru: 'Исследование', kk: 'Зерттеу', en: 'Explorer' },
            individualism: { ru: 'Индивидуализм', kk: 'Дараизм', en: 'Individualism' },
            adaptation: { ru: 'Адаптивность', kk: 'Бейімделу', en: 'Adaptation' },
            intuition: { ru: 'Интуиция', kk: 'Интуиция', en: 'Intuition' }
        };

        const comparison = {
            celebrity: celebrity,
            overallMatch: Math.round(this.calculateSimilarity(userScores, celebrity.scores) * 100),
            dimensions: [],
            strengths: [],
            differences: []
        };

        for (const dim of this.dimensionKeys) {
            const userVal = userScores[dim] || 0;
            const celVal = celebrity.scores[dim] || 0;
            const diff = userVal - celVal;
            const dimName = this.getLocalizedText(dimensionNames[dim]);

            comparison.dimensions.push({
                key: dim,
                name: dimName,
                user: Math.round(userVal * 100),
                celebrity: Math.round(celVal * 100),
                difference: Math.round(diff * 100),
                match: Math.round((1 - Math.abs(diff)) * 100)
            });

            // Определить сильные стороны (совпадения > 70%)
            if (Math.abs(diff) < 0.3 && userVal > 0.6 && celVal > 0.6) {
                comparison.strengths.push(dimName);
            }

            // Определить различия (разница > 30%)
            if (Math.abs(diff) > 0.3) {
                comparison.differences.push({
                    dimension: dimName,
                    direction: diff > 0 ? 'higher' : 'lower',
                    magnitude: Math.abs(Math.round(diff * 100))
                });
            }
        }

        return comparison;
    }

    /**
     * Получить статистику по всем знаменитостям
     * @returns {Object} Статистика
     */
    getStatistics() {
        return {
            total: this.profiles.length,
            byCategory: Object.keys(this.categories).map(cat => ({
                category: cat,
                name: this.getLocalizedText(this.categories[cat]),
                count: this.profiles.filter(p => p.category === cat).length
            }))
        };
    }
}

// Глобальный экземпляр
window.celebrityService = new CelebrityService();
