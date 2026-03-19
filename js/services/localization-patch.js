/**
 * Supplemental localization dictionary and DOM translation helpers.
 * Keeps runtime translations complete without bloating the base manager.
 */
(function () {
    const patches = {
        kk: {
            accessSubtitle: "Біз жүйені барлық пайдаланушылар үшін барынша қолжетімді етуге тырысамыз.",
            aiAnalysisTitle: "ЖИ талдауы",
            audioSystemLabel: "Аудиожүйе",
            audioSystemDesc: "Әрекеттерді дыбыстық растау және нәтижелерді дауыстап оқу үшін сөйлеу синтезі.",
            btn_send: "Жіберу",
            close: "Жабу",
            confirm: "Растау",
            confirmation: "Растау",
            confirmDeleteSelected: "Таңдалған тесттерді ({count}) жойғыңыз келетініне сенімдісіз бе?",
            contacts_city: "Қарағанды, Қазақстан",
            contacts_desc: "Идеяңызды тұрақты бизнеске айналдырайық. Жазыңыз!",
            contrastDesc: "Көру қабілеті бұзылған пайдаланушылар үшін жоғары контраст режимін қолдау.",
            copied: "Көшірілді!",
            copyCard: "Басып көшіру",
            desc: "Сипаттама",
            descAnalystRationalist: "Сіз талдау мен шешім қабылдауда рационалды әрі дәйекті тәсілді ұстанасыз.",
            descCreatorInnovator: "Сіз жаңа нәрсе жасап, тәжірибе жасаудан қуат аласыз.",
            descIndependentResearcher: "Сіздің зерттеушілік рухыңыз тәуелсіздікпен үйлеседі.",
            descLeaderOrganizer: "Сіз адамдармен жұмыс істеп, ұзақ мерзімді перспективаны көре аласыз.",
            descResearcherStrategist: "Сіз жаңа білімге ұмтылысты стратегиялық көзқараспен ұштастырасыз.",
            descSystemAnalyst: "Сіз құрылымдалған және жүйелі тәсілді қалайсыз.",
            diplomaAuthor: "Автор: Ахмедьянов Саламат, КПО 9/22-2",
            diplomaBadge: "Дипломдық жоба",
            diplomaTech: "HTML, CSS, JavaScript арқылы жасалған",
            diplomaTitle: "Интерактивті таңдау сценарийлері негізінде пайдаланушының тұлғалық қалаулары мен даму бағыттарын талдау жүйесін әзірлеу",
            errorAsync: "Операцияны орындау кезінде қате орын алды.",
            errorAuth: "Аутентификация қатесі. Қайта кіріп көріңіз.",
            errorData: "Деректерді жүктеу қатесі. Кейінірек қайталаңыз.",
            errorDefault: "Бірдеңе дұрыс болмады. Бетті жаңартып көріңіз.",
            errorGlobal: "Күтпеген қате орын алды.",
            errorNetwork: "Интернетке қосылу мәселесі. Байланысты тексеріңіз.",
            errorRender: "Бейнелеу қатесі. Бетті жаңартып көріңіз.",
            errorStorage: "Деректерді сақтау қатесі. Қолжетімді орынды тексеріңіз.",
            errorValidation: "Енгізілген деректердің дұрыстығын тексеріңіз.",
            exportFailed: "Экспорт қатесі: {message}",
            exportNotAvailable: "HTML/PDF экспорттау әзірге қолжетімсіз.",
            exportServiceUnavailable: "Экспорт сервисі қолжетімсіз.",
            failedToLoadAdvancedTestData: "Тереңдетілген тест деректерін жүктеу мүмкін болмады.",
            featureComingSoon: "Бұл мүмкіндік жақында қолжетімді болады.",
            feedbackError: "Кері байланысты жіберу кезінде қате орын алды.",
            feedbackFormError: "Кері байланыс формасын жүктеу қатесі",
            feedbackSkipped: "Кері байланыс өткізіліп жіберілді",
            feedbackThanks: "Пікіріңізге рақмет!",
            freelanceProfile: "Фриланс профилі",
            googleNotConfigured: "Google арқылы кіру бапталмаған",
            keepItUp: "Осылай жалғастырыңыз!",
            label_contact: "Email",
            label_message: "Хабарлама",
            label_name: "Атыңыз",
            languageSelect: "Тілді таңдау",
            location: "Орналасқан жері",
            loginFormNotFound: "Кіру формасы табылмады.",
            loginSuccess: "Сіз жүйеге сәтті кірдіңіз",
            mainContentAria: "Негізгі мазмұн",
            match: "Сәйкестік",
            matchScore: "Сәйкестік",
            methodologySubtitle: "Жай ғана сұрақтардан әлдеқайда артық",
            methodologyText: "Дәстүрлі тесттерден айырмашылығы, мұнда «дұрыс» жауапты тауып алу қиын. Біздің жүйе басқаша жұмыс істейді:",
            methodologyTitle: "Ішкі ғылым",
            missionText: "Ақпараттық шу дәуірінде өзіңмен байланысты жоғалту оңай. Біздің мақсатымыз — әр адамға саналы түрде өзін тануға арналған құрал беру. Бұл жай ғана тест емес, бұл сіздің шынайы құндылықтарыңызды, жасырын мотивтеріңізді және әлеуетті таланттарыңызды көрсететін цифрлық айна.",
            missionTitle: "Жобаның миссиясы",
            navMainAria: "Басты навигация",
            openNavigationMenu: "Навигация мәзірін ашу",
            payAttention: "Назар аударыңыз",
            peopleDesc: "жұмыста сіз үшін не маңыздырақ",
            peopleOrientation: "Жекешілдік ↔ Ұжымшылдық",
            placeholder_contact: "Email",
            placeholder_message: "Жобаңыз туралы айтып беріңіз",
            placeholder_name: "Атыңыз",
            profileContentAria: "Профиль мазмұны",
            rateAllAspects: "Нәтижелердің барлық аспектілерін бағалаңыз",
            recDecline: "{dim} бағытына назар аударыңыз. Бұл салада төмендеу байқалады, сондықтан тәжірибені қайта күшейткен дұрыс.",
            recGrowth: "{dim} бағытын дамытуды жалғастырыңыз. Бұл саладағы өсіміңіз тұрақты және перспективалы.",
            recStable: "Сіздің профиліңіз тұрақты. Бұл әрі қарай дамуға арналған мықты негіз.",
            registerFormNotFound: "Тіркелу формасы табылмады.",
            riskDesc: "белгісіздікке дайындығыңыз",
            riskTolerance: "Бақылау ↔ Бейімделу",
            scienceDataText: "Математикалық модель профильді 6 тәуелсіз ось бойынша құрып, тұлғаның бірегей «ізін» жасайды.",
            scienceDataTitle: "Деректерді талдау",
            scienceGameText: "Сценарийлік дилеммалар сізді әлеуметтік тұрғыдан күтілетін жауаптардан тыс күрделі таңдау жасауға итермелейді.",
            scienceGameTitle: "Ойын теориясы",
            sciencePsychText: "Белгісіздік жағдайында шешім қабылдауды талдау жарияланған емес, шынайы құндылықтарды ашады.",
            sciencePsychTitle: "Когнитивтік психология",
            section_contacts: "Байланыс",
            sessionLabel: "Сессия",
            similarTo: "Ұқсас",
            skipToContent: "Негізгі мазмұнға өту",
            stablePeriod: "Тұрақты кезең",
            step: "Қадам",
            supportDesc: "Бұл жоба толықтай тегін және жарнамасыз жұмыс істейді. Егер ол сізге пайдалы болса, авторға қолдау көрсете аласыз.",
            supportTitle: "Жобаға қолдау көрсету",
            systematicDesc: "мәселелерді қалай шешетініңіз",
            systematicThinking: "Рационалдылық ↔ Интуиция",
            testDataNotLoaded: "Тест деректері жүктелмеді.",
            testDeleted: "Тест жойылды",
            textSizeDesc: "Интерфейсті масштабтау және қаріп өлшемін өзгерту мүмкіндігі.",
            toggleTheme: "Тақырыпты ауыстыру",
            unknownError: "Белгісіз қате",
            usernameRequired: "Пайдаланушы атын енгізіңіз",
            usernameTooShort: "Пайдаланушы аты кемінде 3 таңбадан тұруы керек",
            valueCareerText: "Табиғи қабілеттеріңіз қай салада барынша ашылатынын түсініңіз: басқаруда, шығармашылықта, аналитикада немесе кәсіпкерлікте.",
            valueCareerTitle: "Мансап навигаторы",
            valueGrowthText: "Тұлғаңызды күшейтетін soft skills бойынша нақты ұсыныстары бар жеке даму картасын алыңыз.",
            valueGrowthTitle: "Өсу нүктелері",
            valueRelText: "Өзіңіздің шынайы қозғаушы күштеріңізді біліңіз: неге дәл осылай әрекет етесіз? Сізді не ынталандырады, ал не энергияңызды сарқиды?",
            valueRelTitle: "Өзіңізді түсіну",
            valueTitle: "Бұл сізге не үшін керек?",
            yourArchetype: "Сіздің архетипіңіз",
            aboutSubtitle: "Сіздің тұлғаңызды терең түсіну үшін когнитивті талдау мен жасанды интеллектті қолданатын жаңа буынның өзін-өзі тану жүйесі.",
            aboutContentAria: "Жоба туралы",
            accessibilityShort: "Қолжетімділік",
            analysisDimensionsAria: "Талдау өлшемдері",
            authSystemUnavailable: "Аутентификация жүйесі қолжетімсіз.",
            changesInDimensions: "{count} өлшемде өзгеріс",
            closeMenu: "Мәзірді жабу",
            collapseNavigation: "Навигацияны жию",
            growthInDimensions: "{count} өлшемде өсу",
            logoutAria: "Аккаунттан шығу",
            systemFeaturesAria: "Жүйе мүмкіндіктері",
            exploration: "Зерттеуші ↔ Орындаушы",
            explorationDesc: "жаңа білім мен тәжірибе алуға деген ұмтылыс",
            copyIndicatorLabel: "Көшіру күйі",
            noEvolutionData: "Эволюцияны талдау үшін кемінде 2 сессия қажет"
        },
        ru: {
            aboutContentAria: "О проекте",
            aboutSubtitle: "Самопознание нового поколения на базе когнитивного анализа и ИИ для глубокого понимания вашей личности.",
            accessSubtitle: "Мы стремимся сделать систему максимально доступной для всех пользователей.",
            accessibilityShort: "Доступность",
            aiAnalysisTitle: "ИИ-анализ",
            analysisDimensionsAria: "Измерения анализа",
            audioSystemLabel: "Аудиосистема",
            audioSystemDesc: "Звуковое подтверждение действий и синтез речи для чтения результатов вслух.",
            authSystemUnavailable: "Система аутентификации недоступна.",
            btn_send: "Отправить",
            changesInDimensions: "Изменения в {count} измерении(ях)",
            close: "Закрыть",
            closeMenu: "Закрыть меню",
            confirm: "Подтвердить",
            confirmation: "Подтверждение",
            confirmDeleteSelected: "Вы уверены, что хотите удалить выбранные тесты ({count})?",
            contacts_city: "Караганда, Казахстан",
            contacts_desc: "Давайте превратим вашу идею в стабильный бизнес. Пишите!",
            contrastDesc: "Поддержка режима высокой контрастности для людей с нарушениями зрения.",
            copied: "Скопировано!",
            copyCard: "Нажмите, чтобы скопировать",
            copyIndicatorLabel: "Статус копирования",
            desc: "Описание",
            descAnalystRationalist: "Вы опираетесь на рациональный и последовательный подход к анализу и решениям.",
            descCreatorInnovator: "Вас вдохновляет экспериментирование и создание нового.",
            descIndependentResearcher: "Ваш исследовательский дух сочетается с независимостью.",
            descLeaderOrganizer: "Вы умеете работать с людьми и видеть долгосрочную перспективу.",
            descResearcherStrategist: "Вы сочетаете стремление к новым знаниям со стратегическим видением.",
            descSystemAnalyst: "Вы предпочитаете структурированный и системный подход.",
            diplomaAuthor: "Автор: Ахмедьянов Саламат, КПО 9/22-2",
            diplomaBadge: "Дипломный проект",
            diplomaTech: "Разработано на HTML, CSS, JavaScript",
            diplomaTitle: "Разработка системы анализа личностных предпочтений и направлений развития пользователя на основе интерактивных сценариев выбора",
            errorAsync: "Произошла ошибка при выполнении операции.",
            errorAuth: "Ошибка аутентификации. Попробуйте войти снова.",
            errorData: "Ошибка загрузки данных. Попробуйте позже.",
            errorDefault: "Что-то пошло не так. Попробуйте обновить страницу.",
            errorGlobal: "Произошла непредвиденная ошибка.",
            errorNetwork: "Проблема с подключением к интернету. Проверьте соединение.",
            errorRender: "Ошибка отображения. Попробуйте обновить страницу.",
            errorStorage: "Ошибка сохранения данных. Проверьте доступное место.",
            errorValidation: "Проверьте правильность введённых данных.",
            exploration: "Исследователь ↔ Исполнитель",
            explorationDesc: "ваше стремление к новым знаниям и опыту",
            exportFailed: "Ошибка экспорта: {message}",
            exportNotAvailable: "Экспорт HTML/PDF недоступен.",
            exportServiceUnavailable: "Сервис экспорта недоступен.",
            failedToLoadAdvancedTestData: "Не удалось загрузить данные расширенного теста.",
            featureComingSoon: "Эта функция скоро появится.",
            feedbackError: "Не удалось отправить обратную связь.",
            feedbackFormError: "Ошибка загрузки формы обратной связи",
            feedbackSkipped: "Обратная связь пропущена",
            feedbackThanks: "Спасибо за обратную связь!",
            freelanceProfile: "Профиль фрилансера",
            googleNotConfigured: "Вход через Google не настроен",
            growthInDimensions: "Рост в {count} измерении(ях)",
            keepItUp: "Так держать!",
            label_contact: "Email",
            label_message: "Сообщение",
            label_name: "Ваше имя",
            languageSelect: "Выбор языка",
            location: "Локация",
            loginFormNotFound: "Форма входа не найдена.",
            loginSuccess: "Вы успешно вошли в систему",
            logoutAria: "Выйти из аккаунта",
            mainContentAria: "Основное содержимое",
            match: "Соответствие",
            matchScore: "Соответствие",
            methodologySubtitle: "Больше, чем просто вопросы",
            methodologyText: "В отличие от классических тестов, где легко «подгадать» правильный ответ, наша система работает иначе:",
            methodologyTitle: "Наука внутри",
            missionText: "В эпоху информационного шума легко потерять связь с собой. Наша цель — дать каждому инструмент для осознанного самопознания. Это не просто тест, а цифровое зеркало, которое отражает ваши истинные ценности, скрытые мотивы и потенциальные таланты.",
            missionTitle: "Миссия проекта",
            navMainAria: "Главная навигация",
            noEvolutionData: "Для анализа эволюции необходимо минимум 2 сессии",
            openNavigationMenu: "Открыть меню навигации",
            payAttention: "Обратите внимание",
            peopleDesc: "что для вас важнее в работе",
            peopleOrientation: "Индивидуализм ↔ Коллективизм",
            placeholder_contact: "Email",
            placeholder_message: "Расскажите о вашем проекте",
            placeholder_name: "Ваше имя",
            profileContentAria: "Содержимое профиля",
            rateAllAspects: "Пожалуйста, оцените все аспекты результатов",
            recDecline: "Обратите внимание на {dim}. Наблюдается снижение, возможно, стоит вернуться к практике в этой области.",
            recGrowth: "Продолжайте развивать {dim}. Ваш рост в этой области стабилен и перспективен.",
            recStable: "Ваш профиль стабилен. Это отличная основа для дальнейшего развития.",
            registerFormNotFound: "Форма регистрации не найдена.",
            riskDesc: "ваша готовность к неопределённости",
            riskTolerance: "Контроль ↔ Адаптация",
            scienceDataText: "Математическая модель строит профиль по 6 независимым осям, создавая уникальный «отпечаток» личности.",
            scienceDataTitle: "Анализ данных",
            scienceGameText: "Сценарные дилеммы ставят вас перед сложным выбором, исключая социально ожидаемые ответы.",
            scienceGameTitle: "Теория игр",
            sciencePsychText: "Анализ принятия решений в условиях неопределённости выявляет истинные, а не декларируемые ценности.",
            sciencePsychTitle: "Когнитивная психология",
            section_contacts: "Контакты",
            sessionLabel: "Сессия",
            similarTo: "Похожи на",
            skipToContent: "Перейти к основному содержанию",
            stablePeriod: "Стабильный период",
            step: "Шаг",
            supportDesc: "Этот проект работает полностью бесплатно и без рекламы. Если он вам оказался полезен, вы можете поддержать автора.",
            supportTitle: "Поддержка проекта",
            systemFeaturesAria: "Возможности системы",
            systematicDesc: "как вы подходите к решению задач",
            systematicThinking: "Рациональность ↔ Интуиция",
            testDataNotLoaded: "Данные теста не загружены.",
            testDeleted: "Тест удалён",
            textSizeDesc: "Возможность масштабировать интерфейс и менять размер шрифта.",
            toggleTheme: "Сменить тему",
            unknownError: "Неизвестная ошибка",
            usernameRequired: "Введите имя пользователя",
            usernameTooShort: "Имя пользователя должно содержать минимум 3 символа",
            valueCareerText: "Поймите, где ваши природные таланты раскроются максимально: в управлении, творчестве, аналитике или предпринимательстве.",
            valueCareerTitle: "Карьерный навигатор",
            valueGrowthText: "Получите персональную карту развития с конкретными рекомендациями по soft skills, которые усилят вашу личность.",
            valueGrowthTitle: "Точки роста",
            valueRelText: "Узнайте свои истинные драйверы: почему вы действуете именно так? Что вас мотивирует, а что забирает энергию?",
            valueRelTitle: "Понимание себя",
            valueTitle: "Зачем это вам?",
            yourArchetype: "Ваш архетип",
            collapseNavigation: "Свернуть навигацию"
        },
        en: {
            aboutContentAria: "About the project",
            accessSubtitle: "We strive to make the system as accessible as possible for all users.",
            accessibilityShort: "Accessibility",
            aiAnalysisTitle: "AI Analysis",
            analysisDimensionsAria: "Analysis dimensions",
            audioSystemLabel: "Audio System",
            audioSystemDesc: "Audio confirmation of actions and speech synthesis for reading results aloud.",
            authSystemUnavailable: "Authentication system is unavailable.",
            btn_send: "Send",
            changesInDimensions: "Changes in {count} dimension(s)",
            close: "Close",
            closeMenu: "Close menu",
            confirm: "Confirm",
            confirmation: "Confirmation",
            confirmDeleteSelected: "Are you sure you want to delete the selected tests ({count})?",
            contacts_city: "Karaganda, Kazakhstan",
            contacts_desc: "Let's turn your idea into a stable business. Contact me!",
            contrastDesc: "High contrast mode support for users with visual impairments.",
            copied: "Copied!",
            copyCard: "Click to copy",
            copyIndicatorLabel: "Copy status",
            desc: "Description",
            descAnalystRationalist: "You rely on a rational and consistent approach to analysis and decisions.",
            descCreatorInnovator: "You are energized by experimentation and creating something new.",
            descIndependentResearcher: "Your research mindset is paired with independence.",
            descLeaderOrganizer: "You know how to work with people and see the long-term perspective.",
            descResearcherStrategist: "You combine a drive for new knowledge with strategic vision.",
            descSystemAnalyst: "You prefer a structured, systems-oriented approach.",
            diplomaAuthor: "Author: Akhmedyanov Salamat, KPO 9/22-2",
            diplomaBadge: "Thesis Project",
            diplomaTech: "Built with HTML, CSS, JavaScript",
            diplomaTitle: "Development of a user personality preference and growth direction analysis system based on interactive choice scenarios",
            errorAsync: "An error occurred while performing the operation.",
            errorAuth: "Authentication error. Please try signing in again.",
            errorData: "Failed to load data. Please try again later.",
            errorDefault: "Something went wrong. Try refreshing the page.",
            errorGlobal: "An unexpected error occurred.",
            errorNetwork: "Network connection problem. Please check your internet connection.",
            errorRender: "Rendering error. Try refreshing the page.",
            errorStorage: "Failed to save data. Please check available space.",
            errorValidation: "Please check the entered data.",
            exportFailed: "Export failed: {message}",
            exportNotAvailable: "HTML/PDF export is not available.",
            exportServiceUnavailable: "Export service is unavailable.",
            failedToLoadAdvancedTestData: "Failed to load advanced test data.",
            featureComingSoon: "This feature is coming soon.",
            feedbackError: "Failed to submit feedback.",
            feedbackFormError: "Failed to load the feedback form",
            feedbackSkipped: "Feedback skipped",
            feedbackThanks: "Thanks for your feedback!",
            freelanceProfile: "Freelance profile",
            googleNotConfigured: "Google Sign-In is not configured.",
            growthInDimensions: "Growth in {count} dimension(s)",
            keepItUp: "Keep it up!",
            label_contact: "Email",
            label_message: "Message",
            label_name: "Your name",
            languageSelect: "Select language",
            location: "Location",
            loginFormNotFound: "Login form not found.",
            loginSuccess: "You have successfully signed in",
            logoutAria: "Log out of the account",
            mainContentAria: "Main content",
            match: "Match",
            matchScore: "Match",
            methodologySubtitle: "More Than Just Questions",
            methodologyText: "Unlike classic tests where it is easy to guess the “right” answer, our system works differently:",
            methodologyTitle: "The Science Inside",
            missionText: "In the era of information noise, it is easy to lose touch with yourself. Our goal is to give everyone a tool for conscious self-discovery. This is not just a test, but a digital mirror that reflects your true values, hidden motives, and potential talents.",
            missionTitle: "Project Mission",
            navMainAria: "Main navigation",
            noEvolutionData: "At least 2 sessions are required for evolution analysis",
            openNavigationMenu: "Open navigation menu",
            payAttention: "Pay attention",
            peopleDesc: "what matters more to you at work",
            peopleOrientation: "Individualism ↔ Collectivism",
            placeholder_contact: "Email",
            placeholder_message: "Tell me about your project",
            placeholder_name: "Your name",
            profileContentAria: "Profile content",
            rateAllAspects: "Please rate all aspects of the results",
            recDecline: "Pay attention to {dim}. A decline is noticeable there, so it may be worth returning to deliberate practice.",
            recGrowth: "Continue developing {dim}. Your growth in this area is steady and promising.",
            recStable: "Your profile is stable. This is a strong foundation for further growth.",
            registerFormNotFound: "Registration form not found.",
            riskDesc: "your readiness for uncertainty",
            riskTolerance: "Control ↔ Adaptation",
            scienceDataText: "A mathematical model builds a profile across 6 independent axes, creating a unique personality “fingerprint”.",
            scienceDataTitle: "Data Analysis",
            scienceGameText: "Scenario dilemmas force complex choices, removing socially expected answers.",
            scienceGameTitle: "Game Theory",
            sciencePsychText: "Decision-making analysis under uncertainty reveals true rather than declared values.",
            sciencePsychTitle: "Cognitive Psychology",
            section_contacts: "Contacts",
            sessionLabel: "Session",
            similarTo: "Similar to",
            skipToContent: "Skip to main content",
            stablePeriod: "Stable period",
            step: "Step",
            supportDesc: "This project runs completely free and ad-free. If you found it useful, you can support the author.",
            supportTitle: "Support the Project",
            systemFeaturesAria: "System features",
            systematicDesc: "how you approach problem solving",
            systematicThinking: "Rationality ↔ Intuition",
            testDataNotLoaded: "Test data is not loaded.",
            testDeleted: "Test deleted",
            textSizeDesc: "Ability to scale the interface and change the font size.",
            toggleTheme: "Switch theme",
            unknownError: "Unknown error",
            usernameRequired: "Enter a username",
            usernameTooShort: "Username must contain at least 3 characters",
            valueCareerText: "Understand where your natural talents will unfold most effectively: in management, creativity, analytics, or entrepreneurship.",
            valueCareerTitle: "Career Navigator",
            valueGrowthText: "Get a personal growth map with concrete soft skills recommendations that strengthen your personality.",
            valueGrowthTitle: "Growth Points",
            valueRelText: "Learn your true drivers: why do you act this way? What motivates you, and what drains your energy?",
            valueRelTitle: "Self-Understanding",
            valueTitle: "Why Do You Need This?",
            yourArchetype: "Your archetype",
            collapseNavigation: "Collapse navigation"
        }
    };

    const attributeMap = {
        'data-i18n-placeholder': 'placeholder',
        'data-i18n-title': 'title',
        'data-i18n-aria-label': 'aria-label',
        'data-i18n-content': 'content'
    };

    function mergeTranslations() {
        if (!window.i18n || !window.i18n.translations) {
            return false;
        }

        Object.entries(patches).forEach(([lang, values]) => {
            if (!window.i18n.translations[lang]) {
                window.i18n.translations[lang] = {};
            }
            Object.assign(window.i18n.translations[lang], values);
        });

        return true;
    }

    function translateNodeContent(root) {
        root.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            if (!key) {
                return;
            }

            const translated = window.i18n.t(key);
            if (translated && translated !== key) {
                element.textContent = translated;
            }
        });

        Object.entries(attributeMap).forEach(([dataAttribute, targetAttribute]) => {
            root.querySelectorAll(`[${dataAttribute}]`).forEach((element) => {
                const key = element.getAttribute(dataAttribute);
                if (!key) {
                    return;
                }

                const translated = window.i18n.t(key);
                if (translated && translated !== key) {
                    element.setAttribute(targetAttribute, translated);
                }
            });
        });
    }

    function applyLocalizedAttributes(root = document) {
        if (!window.i18n || !window.i18n.translations) {
            return false;
        }

        translateNodeContent(root);
        return true;
    }

    function handleLocalizedCopy(container, value) {
        if (!container || !navigator.clipboard) {
            return;
        }

        navigator.clipboard.writeText(value).then(() => {
            const indicator = container.querySelector('.copy-indicator');
            const number = container.querySelector('.kaspi-number');
            const copiedText = window.i18n ? window.i18n.t('copied') : 'Copied!';
            const copyText = window.i18n ? window.i18n.t('copyCard') : 'Click to copy';

            if (indicator) {
                indicator.innerHTML = `<span class="material-symbols-rounded" style="color:#10b981; font-size:1.2rem;">check_circle</span> ${copiedText}`;
                indicator.style.background = 'rgba(16,185,129,0.1)';
                indicator.style.color = '#10b981';
            }

            if (number) {
                number.style.color = '#10b981';
            }

            setTimeout(() => {
                if (indicator) {
                    indicator.innerHTML = `<span class="material-symbols-rounded" style="font-size:1rem;">content_copy</span> ${copyText}`;
                    indicator.style.background = 'rgba(0,0,0,0.2)';
                    indicator.style.color = 'var(--text-secondary)';
                }

                if (number) {
                    number.style.color = '#fff';
                }
            }, 2500);
        }).catch(() => {
            // Ignore clipboard failures silently; the user can still copy manually.
        });
    }

    function enhanceSetLanguage() {
        if (!window.i18n || window.i18n.__supplementalLocalizationPatched) {
            return;
        }

        const originalSetLanguage = window.i18n.setLanguage.bind(window.i18n);
        window.i18n.setLanguage = function patchedSetLanguage(lang) {
            const result = originalSetLanguage(lang);
            if (result) {
                applyLocalizedAttributes(document);
                window.dispatchEvent(new CustomEvent('localization:changed', { detail: { lang } }));
            }
            return result;
        };

        window.i18n.__supplementalLocalizationPatched = true;
    }

    function initializePatch() {
        if (!mergeTranslations()) {
            setTimeout(initializePatch, 100);
            return;
        }

        enhanceSetLanguage();
        applyLocalizedAttributes(document);
    }

    window.applyLocalizedAttributes = applyLocalizedAttributes;
    window.applyLocalizationPatch = initializePatch;
    window.handleLocalizedCopy = handleLocalizedCopy;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePatch, { once: true });
    } else {
        initializePatch();
    }

    window.addEventListener('load', initializePatch);
})();
