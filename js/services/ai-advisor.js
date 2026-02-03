/**
 * AI-советник с персональными рекомендациями
 * Генерирует умные рекомендации на основе профиля личности
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class AIAdvisor {
    constructor() {
        this.paradoxes = this.defineParadoxes();
        this.recommendations = this.defineRecommendations();
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
     * Определить возможные парадоксы в профиле
     */
    defineParadoxes() {
        return [
            {
                id: 'risk_rational',
                condition: (s) => s.adaptation > 0.4 && s.rationality > 0.4,
                name: { kk: 'Есептелген тәуекел', ru: 'Рассчитанный риск', en: 'Calculated Risk' },
                description: {
                    kk: 'Сіз тәуекелге дайын, бірақ барлық нәрсені мұқият талдайсыз',
                    ru: 'Вы готовы к риску, но тщательно всё анализируете',
                    en: 'You are ready for risks, but carefully analyze everything'
                },
                insight: {
                    kk: 'Бұл сирек кездесетін комбинация, ол стартаптар мен инвестицияларда өте бағалы',
                    ru: 'Это редкая комбинация, очень ценная в стартапах и инвестициях',
                    en: 'This is a rare combination, very valuable in startups and investments'
                }
            },
            {
                id: 'individual_meaning',
                condition: (s) => s.individualism > 0.3 && s.meaning > 0.4,
                name: { kk: 'Мақсатты индивидуализм', ru: 'Целенаправленный индивидуализм', en: 'Purposeful Individualism' },
                description: {
                    kk: 'Сіз өз жолыңызды таңдайсыз, бірақ терең мағынаға ұмтыласыз',
                    ru: 'Вы выбираете свой путь, но стремитесь к глубокому смыслу',
                    en: 'You choose your own path but strive for deep meaning'
                },
                insight: {
                    kk: 'Бұл көшбасшылар мен визионерлерге тән',
                    ru: 'Это характерно для лидеров и визионеров',
                    en: 'This is characteristic of leaders and visionaries'
                }
            },
            {
                id: 'strategic_intuition',
                condition: (s) => s.strategic > 0.4 && s.intuition > 0.4,
                name: { kk: 'Интуитивті стратег', ru: 'Интуитивный стратег', en: 'Intuitive Strategist' },
                description: {
                    kk: 'Сіз логика мен интуицияны ұштастырасыз',
                    ru: 'Вы сочетаете логику и интуицию в планировании',
                    en: 'You combine logic and intuition in planning'
                },
                insight: {
                    kk: 'Сіз күрделі шешімдерде артықшылыққа иесіз',
                    ru: 'Вы имеете преимущество в сложных решениях',
                    en: 'You have an advantage in complex decisions'
                }
            },
            {
                id: 'explorer_utility',
                condition: (s) => s.explorer > 0.4 && s.utility > 0.4,
                name: { kk: 'Практикалық зерттеуші', ru: 'Практичный исследователь', en: 'Practical Explorer' },
                description: {
                    kk: 'Сіз жаңа білімді практикаға қолданасыз',
                    ru: 'Вы применяете новые знания на практике',
                    en: 'You apply new knowledge in practice'
                },
                insight: {
                    kk: 'Бұл инноваторлар мен технологиялық көшбасшылардың қасиеті',
                    ru: 'Это качество инноваторов и технологических лидеров',
                    en: 'This is a quality of innovators and tech leaders'
                }
            }
        ];
    }

    /**
     * Определить рекомендации по книгам и курсам
     */
    defineRecommendations() {
        return {
            strategic: {
                books: [
                    { name: 'Думай медленно, решай быстро', author: 'Даниэль Канеман' },
                    { name: 'Стратегия голубого океана', author: 'Чан Ким' }
                ],
                courses: ['Стратегическое планирование', 'Системное мышление'],
                activities: ['Составление долгосрочных планов', 'Анализ рынка']
            },
            explorer: {
                books: [
                    { name: 'Гибкое сознание', author: 'Кэрол Дуэк' },
                    { name: 'Думай как ученый', author: 'Адам Грант' }
                ],
                courses: ['Методология исследований', 'Критическое мышление'],
                activities: ['Изучение новых областей', 'Эксперименты']
            },
            individualism: {
                books: [
                    { name: 'Атлант расправил плечи', author: 'Айн Рэнд' },
                    { name: 'Путь к финансовой свободе', author: 'Бодо Шефер' }
                ],
                courses: ['Личный бренд', 'Самоменеджмент'],
                activities: ['Работа над личными проектами', 'Нетворкинг']
            },
            rationality: {
                books: [
                    { name: 'Искусство ясно мыслить', author: 'Рольф Добелли' },
                    { name: 'Суперпрогнозирование', author: 'Филип Тетлок' }
                ],
                courses: ['Логика', 'Анализ данных'],
                activities: ['Решение логических задач', 'Проверка гипотез']
            },
            adaptation: {
                books: [
                    { name: 'Антихрупкость', author: 'Нассим Талеб' },
                    { name: 'Кто украл мой сыр?', author: 'Спенсер Джонсон' }
                ],
                courses: ['Управление изменениями', 'Стресс-менеджмент'],
                activities: ['Выход из зоны комфорта', 'Адаптация к новому']
            },
            meaning: {
                books: [
                    { name: 'Человек в поисках смысла', author: 'Виктор Франкл' },
                    { name: 'Начни с "Почему"', author: 'Саймон Синек' }
                ],
                courses: ['Философия жизни', 'Личностное развитие'],
                activities: ['Рефлексия', 'Волонтёрство']
            },
            intuition: {
                books: [
                    { name: 'Сила интуиции', author: 'Гари Кляйн' },
                    { name: 'Эмоциональный интеллект', author: 'Дэниел Гоулман' }
                ],
                courses: ['Развитие EQ', 'Медитация'],
                activities: ['Практики осознанности', 'Творческие задачи']
            },
            utility: {
                books: [
                    { name: 'Lean Startup', author: 'Эрик Рис' },
                    { name: 'Думай и богатей', author: 'Наполеон Хилл' }
                ],
                courses: ['Бизнес-модели', 'Продуктовый менеджмент'],
                activities: ['Оптимизация процессов', 'MVP-разработка']
            }
        };
    }

    /**
     * Анализировать профиль и выявить парадоксы
     * @param {Object} scores - Нормализованные оценки
     * @returns {Array} Массив обнаруженных парадоксов
     */
    analyzeParadoxes(scores) {
        const found = [];

        this.paradoxes.forEach(p => {
            if (p.condition(scores)) {
                found.push({
                    id: p.id,
                    name: this.getText(p.name),
                    description: this.getText(p.description),
                    insight: this.getText(p.insight)
                });
            }
        });

        return found;
    }

    /**
     * Сгенерировать ключевые инсайты
     * @param {Object} scores - Нормализованные оценки
     * @returns {Array} Массив инсайтов
     */
    generateInsights(scores) {
        const lang = this.getLang();
        const insights = [];

        // Найдем сильные стороны (>0.4)
        const strengths = [];
        // Найдем слабые стороны (<-0.2)
        const weaknesses = [];

        Object.keys(scores).forEach(dim => {
            if (scores[dim] > 0.4) strengths.push(dim);
            if (scores[dim] < -0.2) weaknesses.push(dim);
        });

        // Инсайт по сильным сторонам
        if (strengths.length > 0) {
            const dimNames = {
                strategic: { ru: 'стратегическое мышление', kk: 'стратегиялық ойлау', en: 'strategic thinking' },
                explorer: { ru: 'исследовательский интерес', kk: 'зерттеушілік қызығушылық', en: 'explorer interest' },
                individualism: { ru: 'самостоятельность', kk: 'дербестік', en: 'independence' },
                rationality: { ru: 'рациональность', kk: 'рационалдылық', en: 'rationality' },
                adaptation: { ru: 'адаптивность', kk: 'бейімделу', en: 'adaptability' },
                meaning: { ru: 'поиск смысла', kk: 'мағына іздеу', en: 'meaning seeking' },
                intuition: { ru: 'интуиция', kk: 'түйсік', en: 'intuition' },
                utility: { ru: 'практичность', kk: 'практикалық', en: 'practicality' }
            };

            const strengthNames = strengths.map(s => dimNames[s]?.[lang] || s).join(', ');
            insights.push({
                type: 'strength',
                icon: 'star',
                title: lang === 'kk' ? 'Күшті жақтарыңыз' : lang === 'en' ? 'Your Strengths' : 'Ваши сильные стороны',
                text: lang === 'kk'
                    ? `Сіздің ерекше қасиеттеріңіз: ${strengthNames}. Бұл сіздің табиғи артықшылықтарыңыз.`
                    : lang === 'en'
                        ? `Your distinctive qualities: ${strengthNames}. These are your natural advantages.`
                        : `Ваши отличительные качества: ${strengthNames}. Это ваши естественные преимущества.`
            });
        }

        // Парадоксы
        const paradoxes = this.analyzeParadoxes(scores);
        paradoxes.forEach(p => {
            insights.push({
                type: 'paradox',
                icon: 'psychology',
                title: p.name,
                text: `${p.description}. ${p.insight}`
            });
        });

        // Рекомендация по развитию
        if (weaknesses.length > 0) {
            insights.push({
                type: 'development',
                icon: 'trending_up',
                title: lang === 'kk' ? 'Даму нүктесі' : lang === 'en' ? 'Growth Point' : 'Точка роста',
                text: lang === 'kk'
                    ? 'Келесі тестті 2-4 апта ішінде қайта өтіп, прогресті бақылаңыз'
                    : lang === 'en'
                        ? 'Retake the test in 2-4 weeks to track your progress'
                        : 'Пройдите тест повторно через 2-4 недели, чтобы отследить прогресс'
            });
        }

        return insights;
    }

    /**
     * Получить рекомендации по книгам/курсам
     * @param {Object} scores - Нормализованные оценки
     * @returns {Object} Рекомендации
     */
    getBookRecommendations(scores) {
        const result = {
            toStrengthen: [],
            toDevelop: []
        };

        // Книги для развития слабых сторон
        Object.keys(scores).forEach(dim => {
            if (scores[dim] < 0 && this.recommendations[dim]) {
                const rec = this.recommendations[dim];
                result.toDevelop.push({
                    dimension: dim,
                    books: rec.books.slice(0, 1),
                    courses: rec.courses.slice(0, 1)
                });
            }
        });

        // Книги для усиления сильных сторон
        Object.keys(scores).forEach(dim => {
            if (scores[dim] > 0.3 && this.recommendations[dim]) {
                const rec = this.recommendations[dim];
                result.toStrengthen.push({
                    dimension: dim,
                    books: rec.books.slice(0, 1),
                    activities: rec.activities.slice(0, 1)
                });
            }
        });

        return result;
    }

    /**
     * Сгенерировать 30-дневный план развития
     * @param {Object} scores - Нормализованные оценки
     * @returns {Array} План по неделям
     */
    get30DayPlan(scores) {
        const lang = this.getLang();
        const plan = [];

        // Определяем приоритетные области для развития
        const priorities = [];
        Object.keys(scores).forEach(dim => {
            if (scores[dim] < 0.2 && this.recommendations[dim]) {
                priorities.push({ dim, score: scores[dim], rec: this.recommendations[dim] });
            }
        });

        // Сортируем по приоритету (сначала самые низкие)
        priorities.sort((a, b) => a.score - b.score);

        // Генерируем план по неделям
        const weekLabels = {
            kk: ['1-ші апта', '2-ші апта', '3-ші апта', '4-ші апта'],
            ru: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'],
            en: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        };

        for (let i = 0; i < 4; i++) {
            const weekPlan = {
                week: i + 1,
                title: weekLabels[lang]?.[i] || weekLabels['ru'][i],
                tasks: []
            };

            if (priorities[0]?.rec) {
                const rec = priorities[0].rec;

                if (i === 0) {
                    // Неделя 1: Начало
                    weekPlan.focus = lang === 'kk' ? 'Танысу' : lang === 'en' ? 'Getting Started' : 'Знакомство';
                    weekPlan.tasks = [
                        lang === 'kk' ? `"${rec.books[0]?.name}" кітабын оқуды бастау`
                            : lang === 'en' ? `Start reading "${rec.books[0]?.name}"`
                                : `Начать читать "${rec.books[0]?.name}"`,
                        lang === 'kk' ? 'Күнделік рефлексия (10 мин)'
                            : lang === 'en' ? 'Daily reflection (10 min)'
                                : 'Ежедневная рефлексия (10 мин)'
                    ];
                } else if (i === 1) {
                    // Неделя 2: Практика
                    weekPlan.focus = lang === 'kk' ? 'Тәжірибе' : lang === 'en' ? 'Practice' : 'Практика';
                    weekPlan.tasks = [
                        lang === 'kk' ? `"${rec.courses[0]}" курсын бастау`
                            : lang === 'en' ? `Start the "${rec.courses[0]}" course`
                                : `Начать курс "${rec.courses[0]}"`,
                        lang === 'kk' ? 'Күнделікті міндеттерде қолдану'
                            : lang === 'en' ? 'Apply in daily tasks'
                                : 'Применять в повседневных задачах'
                    ];
                } else if (i === 2) {
                    // Неделя 3: Углубление
                    weekPlan.focus = lang === 'kk' ? 'Тереңдету' : lang === 'en' ? 'Deepening' : 'Углубление';
                    weekPlan.tasks = [
                        lang === 'kk' ? `${rec.activities[0]}`
                            : lang === 'en' ? `${rec.activities[0]}`
                                : `${rec.activities[0]}`,
                        lang === 'kk' ? 'Прогресті бағалау'
                            : lang === 'en' ? 'Evaluate progress'
                                : 'Оценить прогресс'
                    ];
                } else {
                    // Неделя 4: Закрепление
                    weekPlan.focus = lang === 'kk' ? 'Бекіту' : lang === 'en' ? 'Consolidation' : 'Закрепление';
                    weekPlan.tasks = [
                        lang === 'kk' ? 'Тестті қайта өту'
                            : lang === 'en' ? 'Retake the test'
                                : 'Пройти тест повторно',
                        lang === 'kk' ? 'Жаңа мақсаттар қою'
                            : lang === 'en' ? 'Set new goals'
                                : 'Поставить новые цели'
                    ];
                }
            }

            plan.push(weekPlan);
        }

        return plan;
    }

    /**
     * Получить полный отчет AI-советника
     * @param {Object} scores - Нормализованные оценки
     * @returns {Object} Полный отчет
     */
    getFullReport(scores) {
        return {
            insights: this.generateInsights(scores),
            paradoxes: this.analyzeParadoxes(scores),
            recommendations: this.getBookRecommendations(scores),
            plan: this.get30DayPlan(scores)
        };
    }
}

// Глобальный экземпляр
window.aiAdvisor = new AIAdvisor();
