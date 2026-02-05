/**
 * База данных персонализированного контента
 * Книги, курсы и упражнения для развития личных качеств
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

const CONTENT_DATABASE = {
    // === КНИГИ ===
    books: [
        // Рациональность
        {
            id: 'book_1',
            title: { ru: 'Думай медленно... решай быстро', kk: 'Жай ойла... тез шеш', en: 'Thinking, Fast and Slow' },
            author: 'Daniel Kahneman',
            description: {
                ru: 'Нобелевский лауреат о двух системах мышления и принятии решений.',
                kk: 'Нобель лауреаты екі ойлау жүйесі және шешім қабылдау туралы.',
                en: 'Nobel laureate on two thinking systems and decision making.'
            },
            targetDimensions: ['rationality'],
            difficulty: 'advanced',
            url: 'https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow',
            icon: '🧠'
        },
        {
            id: 'book_2',
            title: { ru: 'Искусство ясно мыслить', kk: 'Анық ойлау өнері', en: 'The Art of Thinking Clearly' },
            author: 'Rolf Dobelli',
            description: {
                ru: '52 когнитивных искажения и как их избежать.',
                kk: '52 когнитивтік бұрмалау және оларды қалай болдырмау керек.',
                en: '52 cognitive biases and how to avoid them.'
            },
            targetDimensions: ['rationality'],
            difficulty: 'intermediate',
            icon: '💡'
        },
        // Амбициозность
        {
            id: 'book_3',
            title: { ru: '7 навыков высокоэффективных людей', kk: 'Өте тиімді адамдардың 7 дағдысы', en: 'The 7 Habits of Highly Effective People' },
            author: 'Stephen Covey',
            description: {
                ru: 'Классическое руководство по личной эффективности и достижению целей.',
                kk: 'Жеке тиімділік және мақсаттарға жету бойынша классикалық нұсқаулық.',
                en: 'Classic guide to personal effectiveness and goal achievement.'
            },
            targetDimensions: ['ambition', 'reliability'],
            difficulty: 'beginner',
            icon: '🚀'
        },
        {
            id: 'book_4',
            title: { ru: 'Атомные привычки', kk: 'Атомдық әдеттер', en: 'Atomic Habits' },
            author: 'James Clear',
            description: {
                ru: 'Маленькие изменения → большие результаты. Наука формирования привычек.',
                kk: 'Кішкене өзгерістер → үлкен нәтижелер. Әдеттерді қалыптастыру ғылымы.',
                en: 'Small changes → big results. The science of habit formation.'
            },
            targetDimensions: ['ambition', 'reliability'],
            difficulty: 'beginner',
            icon: '⚛️'
        },
        // Креативность
        {
            id: 'book_5',
            title: { ru: 'Кради как художник', kk: 'Суретші сияқты ұрла', en: 'Steal Like an Artist' },
            author: 'Austin Kleon',
            description: {
                ru: '10 вещей о креативности, которых вам никто не рассказывал.',
                kk: 'Креативтілік туралы сізге ешкім айтпаған 10 нәрсе.',
                en: '10 things nobody told you about being creative.'
            },
            targetDimensions: ['creativity'],
            difficulty: 'beginner',
            icon: '🎨'
        },
        {
            id: 'book_6',
            title: { ru: 'Гибкое сознание', kk: 'Икемді сана', en: 'Mindset' },
            author: 'Carol Dweck',
            description: {
                ru: 'Новая психология успеха: фиксированное vs растущее мышление.',
                kk: 'Табыстың жаңа психологиясы: тұрақты vs өсетін ойлау.',
                en: 'The new psychology of success: fixed vs growth mindset.'
            },
            targetDimensions: ['creativity', 'ambition'],
            difficulty: 'intermediate',
            icon: '🌱'
        },
        // Эмоциональность
        {
            id: 'book_7',
            title: { ru: 'Эмоциональный интеллект', kk: 'Эмоционалдық интеллект', en: 'Emotional Intelligence' },
            author: 'Daniel Goleman',
            description: {
                ru: 'Почему EQ может быть важнее IQ.',
                kk: 'EQ неге IQ-дан маңызды болуы мүмкін.',
                en: 'Why EQ can be more important than IQ.'
            },
            targetDimensions: ['emotional'],
            difficulty: 'intermediate',
            icon: '❤️'
        },
        {
            id: 'book_8',
            title: { ru: 'Ненасильственное общение', kk: 'Зорлықсыз қарым-қатынас', en: 'Nonviolent Communication' },
            author: 'Marshall Rosenberg',
            description: {
                ru: 'Язык жизни: как говорить и слушать с эмпатией.',
                kk: 'Өмір тілі: эмпатиямен қалай сөйлесу және тыңдау керек.',
                en: 'A language of life: how to speak and listen with empathy.'
            },
            targetDimensions: ['emotional', 'sociability'],
            difficulty: 'intermediate',
            icon: '💬'
        },
        // Социальность
        {
            id: 'book_9',
            title: { ru: 'Как завоёвывать друзей', kk: 'Достарды қалай табуға болады', en: 'How to Win Friends and Influence People' },
            author: 'Dale Carnegie',
            description: {
                ru: 'Классика межличностного общения и влияния.',
                kk: 'Тұлғааралық қарым-қатынас және ықпал ету классикасы.',
                en: 'The classic on interpersonal communication and influence.'
            },
            targetDimensions: ['sociability'],
            difficulty: 'beginner',
            icon: '🤝'
        },
        {
            id: 'book_10',
            title: { ru: 'Никогда не ешьте в одиночку', kk: 'Ешқашан жалғыз тамақтанбаңыз', en: 'Never Eat Alone' },
            author: 'Keith Ferrazzi',
            description: {
                ru: 'Секреты нетворкинга от мастера связей.',
                kk: 'Байланыс шеберінен нетворкинг құпиялары.',
                en: 'Networking secrets from a master connector.'
            },
            targetDimensions: ['sociability', 'ambition'],
            difficulty: 'intermediate',
            icon: '🍽️'
        }
    ],

    // === КУРСЫ ===
    courses: [
        {
            id: 'course_1',
            title: { ru: 'Критическое мышление', kk: 'Сыни ойлау', en: 'Critical Thinking' },
            platform: 'Coursera',
            description: {
                ru: 'Развитие навыков анализа информации и принятия решений.',
                kk: 'Ақпаратты талдау және шешім қабылдау дағдыларын дамыту.',
                en: 'Developing skills for analysis and decision-making.'
            },
            duration: '6 weeks',
            targetDimensions: ['rationality'],
            difficulty: 'intermediate',
            url: 'https://www.coursera.org/learn/critical-thinking-skills',
            icon: '🎓'
        },
        {
            id: 'course_2',
            title: { ru: 'Лидерство и эмоциональный интеллект', kk: 'Көшбасшылық және эмоционалдық интеллект', en: 'Leadership and Emotional Intelligence' },
            platform: 'edX',
            description: {
                ru: 'Развивайте лидерские качества через понимание эмоций.',
                kk: 'Эмоцияларды түсіну арқылы көшбасшылық қасиеттерін дамытыңыз.',
                en: 'Develop leadership skills through understanding emotions.'
            },
            duration: '8 weeks',
            targetDimensions: ['emotional', 'sociability'],
            difficulty: 'intermediate',
            icon: '👑'
        },
        {
            id: 'course_3',
            title: { ru: 'Креативность и дизайн-мышление', kk: 'Креативтілік және дизайн-ойлау', en: 'Creativity and Design Thinking' },
            platform: 'LinkedIn Learning',
            description: {
                ru: 'Методы генерации идей и инновационного мышления.',
                kk: 'Идеялар генерациялау және инновациялық ойлау әдістері.',
                en: 'Methods for idea generation and innovative thinking.'
            },
            duration: '4 weeks',
            targetDimensions: ['creativity'],
            difficulty: 'beginner',
            icon: '✨'
        },
        {
            id: 'course_4',
            title: { ru: 'Управление стрессом', kk: 'Стрессті басқару', en: 'Stress Management' },
            platform: 'Udemy',
            description: {
                ru: 'Практические техники снижения стресса и поддержания баланса.',
                kk: 'Стрессті азайту және тепе-теңдікті сақтаудың практикалық әдістері.',
                en: 'Practical techniques for stress reduction and maintaining balance.'
            },
            duration: '3 weeks',
            targetDimensions: ['emotional', 'reliability'],
            difficulty: 'beginner',
            icon: '🧘'
        },
        {
            id: 'course_5',
            title: { ru: 'Публичные выступления', kk: 'Көпшілік алдында сөйлеу', en: 'Public Speaking' },
            platform: 'Skillshare',
            description: {
                ru: 'От страха к уверенности: мастерство презентаций.',
                kk: 'Қорқыныштан сенімге: презентациялар шеберлігі.',
                en: 'From fear to confidence: presentation mastery.'
            },
            duration: '5 weeks',
            targetDimensions: ['sociability', 'emotional'],
            difficulty: 'intermediate',
            icon: '🎤'
        }
    ],

    // === УПРАЖНЕНИЯ ===
    exercises: [
        // Рациональность
        {
            id: 'ex_1',
            title: { ru: 'Дневник решений', kk: 'Шешімдер күнделігі', en: 'Decision Journal' },
            description: {
                ru: 'Записывайте важные решения и их обоснования, затем анализируйте результаты.',
                kk: 'Маңызды шешімдер мен олардың негіздемелерін жазып, нәтижелерді талдаңыз.',
                en: 'Write down important decisions and their reasoning, then analyze results.'
            },
            instructions: {
                ru: ['Перед принятием решения запишите варианты', 'Оцените плюсы и минусы каждого', 'Запишите итоговое решение и почему', 'Через месяц проанализируйте результат'],
                kk: ['Шешім қабылдау алдында нұсқаларды жазыңыз', 'Әрқайсысының артықшылықтары мен кемшіліктерін бағалаңыз', 'Соңғы шешімді және себебін жазыңыз', 'Бір айдан кейін нәтижені талдаңыз'],
                en: ['Before deciding, write down options', 'Evaluate pros and cons of each', 'Write down final decision and why', 'After a month, analyze the result']
            },
            duration: '10 мин/день',
            frequency: 'daily',
            targetDimensions: ['rationality'],
            difficulty: 'beginner',
            icon: '📝'
        },
        // Эмоциональность
        {
            id: 'ex_2',
            title: { ru: 'Эмоциональный чек-ин', kk: 'Эмоционалдық тексеру', en: 'Emotional Check-in' },
            description: {
                ru: 'Осознанное наблюдение за своими эмоциями в течение дня.',
                kk: 'Күн ішінде эмоцияларыңызды саналы бақылау.',
                en: 'Mindful observation of your emotions throughout the day.'
            },
            instructions: {
                ru: ['Установите 3 напоминания в течение дня', 'Остановитесь и спросите: "Что я сейчас чувствую?"', 'Назовите эмоцию и её интенсивность (1-10)', 'Запишите триггер если есть'],
                kk: ['Күн ішінде 3 еске салу орнатыңыз', 'Тоқтап сұраңыз: "Мен қазір не сезінемін?"', 'Эмоцияны және оның қарқындылығын (1-10) атаңыз', 'Триггер болса жазып алыңыз'],
                en: ['Set 3 reminders during the day', 'Stop and ask: "What am I feeling now?"', 'Name the emotion and its intensity (1-10)', 'Note the trigger if any']
            },
            duration: '5 мин × 3',
            frequency: 'daily',
            targetDimensions: ['emotional'],
            difficulty: 'beginner',
            icon: '🎭'
        },
        // Креативность
        {
            id: 'ex_3',
            title: { ru: 'Утренние страницы', kk: 'Таңғы беттер', en: 'Morning Pages' },
            description: {
                ru: 'Свободное письмо утром для разблокировки креативности.',
                kk: 'Шығармашылықты босату үшін таңертеңгі еркін жазу.',
                en: 'Free writing in the morning to unlock creativity.'
            },
            instructions: {
                ru: ['Сразу после пробуждения напишите 3 страницы', 'Пишите без остановки, всё что приходит в голову', 'Не редактируйте и не перечитывайте', 'Делайте это каждый день минимум 2 недели'],
                kk: ['Оянған бойда 3 бет жазыңыз', 'Тоқтамай, ойға келген нәрсені жазыңыз', 'Өңдемеңіз және қайта оқымаңыз', 'Мұны күн сайын кемінде 2 апта жасаңыз'],
                en: ['Right after waking up, write 3 pages', 'Write non-stop, everything that comes to mind', 'Do not edit or re-read', 'Do this every day for at least 2 weeks']
            },
            duration: '20-30 мин',
            frequency: 'daily',
            targetDimensions: ['creativity'],
            difficulty: 'beginner',
            icon: '✍️'
        },
        // Социальность
        {
            id: 'ex_4',
            title: { ru: 'Ежедневный small talk', kk: 'Күнделікті шағын әңгіме', en: 'Daily Small Talk' },
            description: {
                ru: 'Практика коротких разговоров с незнакомыми людьми.',
                kk: 'Бейтаныс адамдармен қысқа әңгімелесу практикасы.',
                en: 'Practice short conversations with strangers.'
            },
            instructions: {
                ru: ['Каждый день заговорите минимум с 1 незнакомцем', 'Начните с простого: комплимент, вопрос о погоде', 'Постепенно увеличивайте продолжительность', 'Записывайте, что сработало'],
                kk: ['Күн сайын кем дегенде 1 бейтаныспен сөйлесіңіз', 'Қарапайым нәрседен бастаңыз: мақтау, ауа-райы туралы сұрақ', 'Ұзақтығын біртіндеп арттырыңыз', 'Не жұмыс істегенін жазып алыңыз'],
                en: ['Each day, talk to at least 1 stranger', 'Start simple: a compliment, weather question', 'Gradually increase duration', 'Note what worked']
            },
            duration: '2-5 мин',
            frequency: 'daily',
            targetDimensions: ['sociability'],
            difficulty: 'intermediate',
            icon: '💬'
        },
        // Надёжность
        {
            id: 'ex_5',
            title: { ru: 'Микро-обязательства', kk: 'Микро-міндеттемелер', en: 'Micro-commitments' },
            description: {
                ru: 'Тренировка надёжности через маленькие обещания себе.',
                kk: 'Өзіңізге кішкене уәделер арқылы сенімділікті жаттықтыру.',
                en: 'Training reliability through small promises to yourself.'
            },
            instructions: {
                ru: ['Каждое утро дайте себе 3 маленьких обещания', 'Обещания должны быть выполнимы за день', 'Вечером отмечайте выполнение', 'Постепенно повышайте сложность'],
                kk: ['Күн сайын таңертең өзіңізге 3 кішкене уәде беріңіз', 'Уәделер бір күнде орындалуы керек', 'Кешке орындалғанын белгілеңіз', 'Біртіндеп күрделілікті арттырыңыз'],
                en: ['Each morning, make 3 small promises to yourself', 'Promises must be achievable within the day', 'In the evening, mark completion', 'Gradually increase difficulty']
            },
            duration: '5 мин утром + 2 мин вечером',
            frequency: 'daily',
            targetDimensions: ['reliability'],
            difficulty: 'beginner',
            icon: '✅'
        },
        // Амбициозность
        {
            id: 'ex_6',
            title: { ru: 'Визуализация цели', kk: 'Мақсатты визуализация', en: 'Goal Visualization' },
            description: {
                ru: 'Мысленная проработка достижения цели для повышения мотивации.',
                kk: 'Мотивацияны арттыру үшін мақсатқа жетуді ойша өңдеу.',
                en: 'Mental rehearsal of goal achievement to increase motivation.'
            },
            instructions: {
                ru: ['Найдите тихое место и закройте глаза', 'Представьте момент достижения цели', 'Добавьте детали: что видите, слышите, чувствуете', 'Удерживайте образ 5 минут'],
                kk: ['Тыныш орын тауып, көзіңізді жұмыңыз', 'Мақсатқа жету сәтін елестетіңіз', 'Бөлшектерді қосыңыз: не көресіз, естисіз, сезінесіз', 'Бейнені 5 минут ұстаңыз'],
                en: ['Find a quiet place and close your eyes', 'Imagine the moment of achieving the goal', 'Add details: what you see, hear, feel', 'Hold the image for 5 minutes']
            },
            duration: '5-10 мин',
            frequency: 'daily',
            targetDimensions: ['ambition'],
            difficulty: 'beginner',
            icon: '🎯'
        }
    ],

    // Уровни сложности
    difficultyLabels: {
        ru: { beginner: 'Начальный', intermediate: 'Средний', advanced: 'Продвинутый' },
        kk: { beginner: 'Бастапқы', intermediate: 'Орташа', advanced: 'Жоғары' },
        en: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
    }
};

// Экспорт
window.CONTENT_DATABASE = CONTENT_DATABASE;
