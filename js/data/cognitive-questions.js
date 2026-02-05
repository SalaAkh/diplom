/**
 * Cognitive Styles Test Questions (VAK Model)
 * Visual, Auditory, Kinesthetic
 */
window.COGNITIVE_QUESTIONS = [
    {
        id: 'cog_1',
        text: {
            kk: 'Жаңа техниканы сатып алғанда, сіз ең алдымен не істейсіз?',
            ru: 'Когда вы покупаете новую технику, вы первым делом...',
            en: 'When you buy new equipment, you first...'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: 'Нұсқаулықты оқып, суреттерін қараймын', ru: 'Читаю инструкцию и смотрю схемы', en: 'Read instructions and look at diagrams' } },
            { id: 'a', type: 'auditory', text: { kk: 'Сатушыдан сұраймын немесе досыммен ақылдасамын', ru: 'Спрашиваю продавца или обсуждаю с другом', en: 'Ask questions or discuss with a friend' } },
            { id: 'k', type: 'kinesthetic', text: { kk: 'Түймелерін басып, қалай жұмыс істейтінін байқап көремін', ru: 'Нажимаю кнопки и пробую, как это работает', en: 'Press buttons and try out how it works' } }
        ]
    },
    {
        id: 'cog_2',
        text: {
            kk: 'Жол сұрағанда сізге қалай түсіндірген ыңғайлы?',
            ru: 'Когда вы спрашивате дорогу, вам понятнее, если...',
            en: 'When you ask for directions, it is clearer if...'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: 'Картадан көрсетсе немесе сызып берсе', ru: 'Покажут на карте или нарисуют схему', en: 'Show on a map or draw a diagram' } },
            { id: 'a', type: 'auditory', text: { kk: 'Ауызша түсіндіріп берсе', ru: 'Расскажут словами (поверните направо...)', en: 'Explain verbally (turn right...)' } },
            { id: 'k', type: 'kinesthetic', text: { kk: 'Қолымен нұсқап көрсетсе немесе ертіп барсе', ru: 'Покажут рукой направление или проводят', en: 'Point with hand or guide you' } }
        ]
    },
    {
        id: 'cog_3',
        text: {
            kk: 'Демалыста не істегенді ұнатасыз?',
            ru: 'Что вы предпочитаете делать на отдыхе?',
            en: 'What do you prefer to do on vacation?'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: 'Кітап оқуды немесе фильм көруді', ru: 'Читать книги или смотреть фильмы', en: 'Read books or watch movies' } },
            { id: 'a', type: 'auditory', text: { kk: 'Музыка тыңдауды немесе әңгімелесуді', ru: 'Слушать музыку или общаться', en: 'Listen to music or chat' } },
            { id: 'k', type: 'kinesthetic', text: { kk: 'Спортпен шұғылдануды немесе серуендеуді', ru: 'Заниматься спортом или гулять', en: 'Do sports or walk' } }
        ]
    },
    {
        id: 'cog_4',
        text: {
            kk: 'Емтиханға дайындалғанда сізге не көмектеседі?',
            ru: 'При подготовке к экзамену вам помогает...',
            en: 'When preparing for an exam, what helps you?'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: 'Сызбалар, графиктер және жазбалар', ru: 'Схемы, графики и конспекты', en: 'Diagrams, graphs and notes' } },
            { id: 'a', type: 'auditory', text: { kk: 'Тақырыпты басқалармен талқылау', ru: 'Обсуждение темы с другими', en: 'Discussing the topic with others' } },
            { id: 'k', type: 'kinesthetic', text: { kk: 'Тәжірибе жасау немесе қимыл-қозғалыс', ru: 'Практика или движение во время учебы', en: 'Practice or moving while studying' } }
        ]
    },
    {
        id: 'cog_5',
        text: {
            kk: 'Ашуланған кезде сіз...',
            ru: 'Когда вы рассержены, вы...',
            en: 'When you are angry, you...'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: 'Үндемей тұнжырап қаласыз', ru: 'Молча хмуритесь и замыкаетесь', en: 'Frown silently and withdraw' } },
            { id: 'a', type: 'auditory', text: { kk: 'Дауыс көтеріп сөйлейсіз', ru: 'Повышаете голос и высказываетесь', en: 'Raise your voice and speak out' } },
            { id: 'k', type: 'kinesthetic', text: { kk: 'Есікті қатты жабасыз немесе жұдырық түйесіз', ru: 'Хлопаете дверью или сжимаете кулаки', en: 'Slam the door or clench fists' } }
        ]
    },
    {
        id: 'cog_6',
        text: {
            kk: 'Біреуді еске алғанда, ең алдымен не есіңізге түседі?',
            ru: 'Вспоминая кого-то, вы первым делом вспоминаете...',
            en: 'When remembering someone, you first recall...'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: 'Оның түрін', ru: 'Его лицо', en: 'Their face' } },
            { id: 'a', type: 'auditory', text: { kk: 'Оның даусын немесе айтқан сөздерін', ru: 'Его голос или слова', en: 'Their voice or words' } },
            { id: 'k', type: 'kinesthetic', text: { kk: 'Онымен бірге өткізген сәттерді', ru: 'Ощущения от общения или действия', en: 'Feelings or shared activities' } }
        ]
    },
    {
        id: 'cog_7',
        text: {
            kk: 'Киім таңдағанда сіз үшін маңыздысы...',
            ru: 'При выборе одежды для вас важнее...',
            en: 'When choosing clothes, it is more important...'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: 'Түсі және сәні', ru: 'Цвет и фасон (как выглядит)', en: 'Color and style (how it looks)' } },
            { id: 'a', type: 'auditory', text: { kk: 'Бренд аты немесе "сөйлейтін" жазулар', ru: 'Название бренда или надписи', en: 'Brand name or slogans' } },
            { id: 'k', type: 'kinesthetic', text: { kk: 'Матасының ыңғайлылығы', ru: 'Удобство и ткань (как сидит)', en: 'Comfort and fabric (how it feels)' } }
        ]
    },
    {
        id: 'cog_8',
        text: {
            kk: 'Мәселені шешу керек болғанда...',
            ru: 'Когда нужно решить проблему...',
            en: 'When creating a plan or solving a problem...'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: 'Жоспар құрып, тізім жасайсыз', ru: 'Составляете список или план на бумаге', en: 'Make a list or plan on paper' } },
            { id: 'a', type: 'auditory', text: { kk: 'Өзіңізбен немесе басқамен сөйлесесіз', ru: 'Проговариваете решение вслух или с кем-то', en: 'Talk clearly through the solution' } },
            { id: 'k', type: 'kinesthetic', text: { kk: 'Бірден іске кірісесіз', ru: 'Начинаете действовать и пробовать варианты', en: 'Start doing and trying options' } }
        ]
    },
    {
        id: 'cog_9',
        text: {
            kk: 'Көңіл-күйіңіз жақсы екенін қалай сипаттайсыз?',
            ru: 'Как вы опишете свое хорошее настроение?',
            en: 'How do you describe your good mood?'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: '"Өмір жарқын көрінеді!"', ru: '"Мир выглядит прекрасно!"', en: '"The world looks bright!"' } },
            { id: 'a', type: 'auditory', text: { kk: '"Жаным ән салып тұр!"', ru: '"Душа поет!"', en: '"My soul is singing!"' } },
            { id: 'k', type: 'kinesthetic', text: { kk: '"Өзімді керемет сезінемін!"', ru: '"Чувствую себя великолепно!"', en: '"I feel great!"' } }
        ]
    },
    {
        id: 'cog_10',
        text: {
            kk: 'Жаңа дағдыны үйренгенде...',
            ru: 'Изучая новый навык, вы...',
            en: 'Learning a new skill, you...'
        },
        options: [
            { id: 'v', type: 'visual', text: { kk: 'Мұғалімнің көрсеткенін қарайсыз', ru: 'Смотрите, как делает учитель', en: 'Watch the teacher do it' } },
            { id: 'a', type: 'auditory', text: { kk: 'Мұғалімнің түсіндіргенін тыңдайсыз', ru: 'Слушаете объяснения учителя', en: 'Listen to the teacher explain' } },
            { id: 'k', type: 'kinesthetic', text: { kk: 'Өзіңіз қайталап жасап көресіз', ru: 'Пробуете сделать сами вместе с учителем', en: 'Try to do it yourself with the teacher' } }
        ]
    }
];
