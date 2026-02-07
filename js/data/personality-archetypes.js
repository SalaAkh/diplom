/**
 * Архетипы личности
 * Система типологии на основе 8 измерений
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

const PERSONALITY_ARCHETYPES = [
    {
        id: 'strategic_visionary',
        name: {
            kk: 'Стратегиялық Визионер',
            ru: 'Стратегический Визионер',
            en: 'Strategic Visionary'
        },
        description: {
            kk: 'Сіз болашақты көре аласыз және оған жету жолын жоспарлай аласыз. Сіздің күшіңіз — ұзақ мерзімді ойлау мен жаңа мүмкіндіктерді көру.',
            ru: 'Вы видите будущее и умеете планировать путь к нему. Ваша сила — в долгосрочном мышлении и способности замечать новые возможности.',
            en: 'You see the future and know how to plan the path to it. Your strength lies in long-term thinking and spotting new opportunities.'
        },
        icon: 'visibility',
        color: '#6366f1',
        conditions: {
            strategic: { min: 0.3 },
            explorer: { min: 0.3 }
        },
        celebrities: ['Elon Musk', 'Steve Jobs']
    },
    {
        id: 'analytical_thinker',
        name: {
            kk: 'Аналитикалық Ойшыл',
            ru: 'Аналитический Мыслитель',
            en: 'Analytical Thinker'
        },
        description: {
            kk: 'Сіз логика мен жүйелі талдау арқылы шешім қабылдайсыз. Деректер мен фактілер сіздің ең жақсы достарыңыз.',
            ru: 'Вы принимаете решения через логику и системный анализ. Данные и факты — ваши лучшие друзья.',
            en: 'You make decisions through logic and systematic analysis. Data and facts are your best friends.'
        },
        icon: 'analytics',
        color: '#3b82f6',
        conditions: {
            rationality: { min: 0.3 },
            strategic: { min: 0.2 }
        },
        celebrities: ['Albert Einstein', 'Marie Curie']
    },
    {
        id: 'creative_innovator',
        name: {
            kk: 'Шығармашыл Инноватор',
            ru: 'Творческий Инноватор',
            en: 'Creative Innovator'
        },
        description: {
            kk: 'Сіз қораптан тыс ойлайсыз және жаңа идеялар генерациялайсыз. Сіздің қиялыңыз шексіз.',
            ru: 'Вы мыслите нестандартно и генерируете новые идеи. Ваше воображение не знает границ.',
            en: 'You think outside the box and generate new ideas. Your imagination knows no limits.'
        },
        icon: 'lightbulb',
        color: '#8b5cf6',
        conditions: {
            explorer: { min: 0.3 },
            intuition: { min: 0.2 }
        },
        celebrities: ['Leonardo da Vinci', 'Nikola Tesla']
    },
    {
        id: 'empathic_mentor',
        name: {
            kk: 'Эмпатиялық Тәлімгер',
            ru: 'Эмпатичный Наставник',
            en: 'Empathic Mentor'
        },
        description: {
            kk: 'Сіз адамдарды түсінесіз және оларға көмектескіңіз келеді. Сіздің миссияңыз — басқаларды дамыту.',
            ru: 'Вы понимаете людей и стремитесь им помогать. Ваша миссия — развивать других.',
            en: 'You understand people and want to help them. Your mission is to develop others.'
        },
        icon: 'favorite',
        color: '#ec4899',
        conditions: {
            meaning: { min: 0.3 },
            individualism: { max: -0.2 }
        },
        celebrities: ['Dalai Lama', 'Oprah Winfrey']
    },
    {
        id: 'pragmatic_executor',
        name: {
            kk: 'Прагматикалық Орындаушы',
            ru: 'Прагматичный Исполнитель',
            en: 'Pragmatic Executor'
        },
        description: {
            kk: 'Сіз нәтижеге бағытталғансыз және істерді аяқтай аласыз. Сіз үшін маңызды нәрсе — нақты нәтиже.',
            ru: 'Вы ориентированы на результат и умеете доводить дела до конца. Для вас важен конкретный результат.',
            en: 'You are result-oriented and know how to get things done. What matters to you is the concrete outcome.'
        },
        icon: 'task_alt',
        color: '#10b981',
        conditions: {
            utility: { min: 0.3 },
            rationality: { min: 0.2 }
        },
        celebrities: ['Jeff Bezos', 'Warren Buffett']
    },
    {
        id: 'adaptive_leader',
        name: {
            kk: 'Бейімделгіш Көшбасшы',
            ru: 'Адаптивный Лидер',
            en: 'Adaptive Leader'
        },
        description: {
            kk: 'Сіз өзгерістерге тез бейімделесіз және топты жаңа бағытта жетелей аласыз.',
            ru: 'Вы быстро адаптируетесь к изменениям и умеете вести команду в новом направлении.',
            en: 'You quickly adapt to changes and can lead a team in new directions.'
        },
        icon: 'sync_alt',
        color: '#f59e0b',
        conditions: {
            adaptation: { min: 0.3 },
            strategic: { min: 0.2 }
        },
        celebrities: ['Nelson Mandela', 'Angela Merkel']
    },
    {
        id: 'independent_researcher',
        name: {
            kk: 'Тәуелсіз Зерттеуші',
            ru: 'Независимый Исследователь',
            en: 'Independent Researcher'
        },
        description: {
            kk: 'Сіз өз жолыңызда жүресіз және жаңа білім іздейсіз. Тәуелсіздік пен қызығушылық — сіздің қозғаушы күшіңіз.',
            ru: 'Вы идёте своим путём и ищете новые знания. Независимость и любознательность — ваши движущие силы.',
            en: 'You go your own way and seek new knowledge. Independence and curiosity are your driving forces.'
        },
        icon: 'explore',
        color: '#06b6d4',
        conditions: {
            explorer: { min: 0.3 },
            individualism: { min: 0.3 }
        },
        celebrities: ['Charles Darwin', 'Jane Goodall']
    },
    {
        id: 'system_organizer',
        name: {
            kk: 'Жүйелі Ұйымдастырушы',
            ru: 'Системный Организатор',
            en: 'System Organizer'
        },
        description: {
            kk: 'Сіз тәртіп пен құрылым жасай аласыз. Сіздің күшіңіз — процестерді оңтайландыру.',
            ru: 'Вы создаёте порядок и структуру. Ваша сила — в оптимизации процессов.',
            en: 'You create order and structure. Your strength lies in optimizing processes.'
        },
        icon: 'account_tree',
        color: '#64748b',
        conditions: {
            rationality: { min: 0.3 },
            individualism: { max: -0.2 }
        },
        celebrities: ['Henry Ford', 'Tim Cook']
    },
    {
        id: 'inspiring_idealist',
        name: {
            kk: 'Шабыттандырушы Идеалист',
            ru: 'Вдохновляющий Идеалист',
            en: 'Inspiring Idealist'
        },
        description: {
            kk: 'Сіз үлкен идеяларға сенесіз және басқаларды да соған шабыттандыра аласыз.',
            ru: 'Вы верите в большие идеи и умеете вдохновлять других на их достижение.',
            en: 'You believe in big ideas and can inspire others to achieve them.'
        },
        icon: 'auto_awesome',
        color: '#a855f7',
        conditions: {
            meaning: { min: 0.3 },
            intuition: { min: 0.2 }
        },
        celebrities: ['Martin Luther King Jr.', 'Malala Yousafzai']
    },
    {
        id: 'decisive_entrepreneur',
        name: {
            kk: 'Шешімді Кәсіпкер',
            ru: 'Решительный Предприниматель',
            en: 'Decisive Entrepreneur'
        },
        description: {
            kk: 'Сіз мүмкіндіктерді көресіз және тәуекелге бара аласыз. Сіз үшін әрекет — сөзден маңызды.',
            ru: 'Вы видите возможности и готовы рисковать. Для вас действие важнее слов.',
            en: 'You spot opportunities and are willing to take risks. For you, action speaks louder than words.'
        },
        icon: 'rocket_launch',
        color: '#ef4444',
        conditions: {
            utility: { min: 0.3 },
            adaptation: { min: 0.3 }
        },
        celebrities: ['Richard Branson', 'Mark Zuckerberg']
    },
    {
        id: 'harmonic_mediator',
        name: {
            kk: 'Үйлесімді Медиатор',
            ru: 'Гармоничный Медиатор',
            en: 'Harmonic Mediator'
        },
        description: {
            kk: 'Сізде теңгерім мен келісім табу қабілеті бар. Сіз әртүрлі көзқарастар арасында көпір бола аласыз.',
            ru: 'У вас есть способность находить баланс и согласие. Вы можете быть мостом между разными точками зрения.',
            en: 'You have the ability to find balance and harmony. You can be a bridge between different viewpoints.'
        },
        icon: 'balance',
        color: '#14b8a6',
        conditions: {
            // Balanced profile - no extreme scores
            _balanced: true
        },
        celebrities: ['Kofi Annan', 'Desmond Tutu']
    },
    {
        id: 'intuitive_strategist',
        name: {
            kk: 'Интуитивті Стратег',
            ru: 'Интуитивный Стратег',
            en: 'Intuitive Strategist'
        },
        description: {
            kk: 'Сіз логика мен интуицияны біріктіресіз. Сіз ойынның алдында жүресіз.',
            ru: 'Вы сочетаете логику и интуицию. Вы всегда на шаг впереди.',
            en: 'You combine logic and intuition. You are always one step ahead.'
        },
        icon: 'psychology',
        color: '#7c3aed',
        conditions: {
            strategic: { min: 0.3 },
            intuition: { min: 0.3 }
        },
        celebrities: ['Steve Wozniak', 'Ada Lovelace']
    }
];

// Export for use in other modules
window.PERSONALITY_ARCHETYPES = PERSONALITY_ARCHETYPES;
