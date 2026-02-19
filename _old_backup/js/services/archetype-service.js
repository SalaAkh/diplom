/**
 * Сервис определения архетипа личности
 * Анализирует баллы и определяет наиболее подходящий архетип
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ArchetypeService {
    constructor() {
        this.archetypes = window.PERSONALITY_ARCHETYPES || [];
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
     * Получить локализованный текст
     */
    getText(field) {
        if (!field) return '';
        if (typeof field === 'string') return field;
        const lang = this.getLang();
        return field[lang] || field['ru'] || field['en'] || '';
    }

    /**
     * Проверить, является ли профиль сбалансированным
     * @param {Object} scores - Нормализованные оценки
     * @returns {boolean} true если профиль сбалансирован
     */
    isBalancedProfile(scores) {
        const values = Object.values(scores);
        const extremeCount = values.filter(v => Math.abs(v) > 0.3).length;
        return extremeCount <= 1;
    }

    /**
     * Вычислить соответствие архетипу
     * @param {Object} archetype - Архетип для проверки
     * @param {Object} scores - Нормализованные оценки
     * @returns {number} Значение соответствия (0-1)
     */
    calculateMatch(archetype, scores) {
        const conditions = archetype.conditions;

        // Особый случай: сбалансированный профиль
        if (conditions._balanced) {
            return this.isBalancedProfile(scores) ? 0.8 : 0.1;
        }

        let matchScore = 0;
        let conditionCount = 0;

        Object.keys(conditions).forEach(dimension => {
            const condition = conditions[dimension];
            const score = scores[dimension] || 0;

            if (condition.min !== undefined) {
                conditionCount++;
                if (score >= condition.min) {
                    // Чем выше score относительно min, тем лучше соответствие
                    matchScore += 0.5 + Math.min(0.5, (score - condition.min));
                } else {
                    // Частичное соответствие, если близко к порогу
                    const diff = condition.min - score;
                    if (diff < 0.2) {
                        matchScore += 0.3 * (1 - diff / 0.2);
                    }
                }
            }

            if (condition.max !== undefined) {
                conditionCount++;
                if (score <= condition.max) {
                    matchScore += 0.5 + Math.min(0.5, (condition.max - score));
                } else {
                    const diff = score - condition.max;
                    if (diff < 0.2) {
                        matchScore += 0.3 * (1 - diff / 0.2);
                    }
                }
            }
        });

        return conditionCount > 0 ? matchScore / conditionCount : 0;
    }

    /**
     * Определить архетип пользователя
     * @param {Object} normalizedScores - Нормализованные оценки по измерениям
     * @returns {Object} Объект архетипа с локализованными данными
     */
    determineArchetype(normalizedScores) {
        if (!this.archetypes || this.archetypes.length === 0) {
            console.warn('Архетиптер жүктелмеген (Archetypes not loaded)');
            return this.getDefaultArchetype();
        }

        // Вычисляем соответствие для каждого архетипа
        const matches = this.archetypes.map(archetype => ({
            archetype,
            matchScore: this.calculateMatch(archetype, normalizedScores)
        }));

        // Сортируем по соответствию
        matches.sort((a, b) => b.matchScore - a.matchScore);

        // Берем лучший результат
        const bestMatch = matches[0];

        if (bestMatch.matchScore < 0.3) {
            // Если нет хорошего соответствия, возвращаем "Гармоничный Медиатор"
            const balanced = this.archetypes.find(a => a.id === 'harmonic_mediator');
            if (balanced) {
                return this.formatArchetypeResult(balanced, 0.6);
            }
        }

        return this.formatArchetypeResult(bestMatch.archetype, bestMatch.matchScore);
    }

    /**
     * Форматировать результат архетипа
     * @param {Object} archetype - Архетип
     * @param {number} matchScore - Значение соответствия
     * @returns {Object} Форматированный результат
     */
    formatArchetypeResult(archetype, matchScore) {
        return {
            id: archetype.id,
            name: this.getText(archetype.name),
            description: this.getText(archetype.description),
            icon: archetype.icon,
            color: archetype.color,
            celebrities: archetype.celebrities || [],
            matchScore: Math.round(matchScore * 100),
            // Сырые данные для других языков
            _raw: archetype
        };
    }

    /**
     * Получить архетип по умолчанию
     * @returns {Object} Архетип по умолчанию
     */
    getDefaultArchetype() {
        const lang = this.getLang();
        return {
            id: 'balanced',
            name: lang === 'kk' ? 'Теңгерімді Тұлға' :
                lang === 'en' ? 'Balanced Personality' : 'Сбалансированная Личность',
            description: lang === 'kk' ? 'Сіздің профиліңіз теңгерімді, бұл көп жақтылықты білдіреді.' :
                lang === 'en' ? 'Your profile is balanced, indicating versatility.' :
                    'Ваш профиль сбалансирован, что говорит о многосторонности.',
            icon: 'balance',
            color: '#64748b',
            celebrities: [],
            matchScore: 50,
            _raw: null
        };
    }

    /**
     * Получить все архетипы
     * @returns {Array} Массив всех архетипов с локализацией
     */
    getAllArchetypes() {
        return this.archetypes.map(a => ({
            id: a.id,
            name: this.getText(a.name),
            description: this.getText(a.description),
            icon: a.icon,
            color: a.color,
            celebrities: a.celebrities || []
        }));
    }

    /**
     * Получить детали архетипа по ID
     * @param {string} archetypeId - ID архетипа
     * @returns {Object|null} Детали архетипа или null
     */
    getArchetypeById(archetypeId) {
        const archetype = this.archetypes.find(a => a.id === archetypeId);
        if (!archetype) return null;

        return {
            id: archetype.id,
            name: this.getText(archetype.name),
            description: this.getText(archetype.description),
            icon: archetype.icon,
            color: archetype.color,
            celebrities: archetype.celebrities || [],
            _raw: archetype
        };
    }
}

// Глобальный экземпляр
window.archetypeService = new ArchetypeService();
