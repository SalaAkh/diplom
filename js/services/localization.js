/**
 * Модуль локализации
 * Поддержка казахского (основной), русского и английского языков
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class LocalizationManager {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.translations = this.loadTranslations();
    }

    /**
     * Определение языка пользователя
     * @returns {string} Код языка (kk, ru, en)
     */
    detectLanguage() {
        // Проверяем сохранённый выбор
        const saved = localStorage.getItem('preferredLanguage');
        if (saved && ['kk', 'ru', 'en'].includes(saved)) {
            return saved;
        }

        // Определяем по браузеру
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('kk') || browserLang.startsWith('kz')) {
            return 'kk';
        } else if (browserLang.startsWith('en')) {
            return 'en';
        }

        // По умолчанию казахский
        return 'kk';
    }

    /**
     * Загрузка переводов
     * @returns {Object} Объект с переводами
     */
    loadTranslations() {
        return {
            kk: {
                // Общие
                appName: "Өзіндік тану жүйесі",
                tagline: "Жеке басымдықтар мен даму бағыттарын талдау",
                navTagline: "Neural Constellation",
                navHome: "Басты бет",
                navStartTest: "Тестті бастау",
                navProfile: "Профиль",
                navResults: "Нәтижелер",
                navAbout: "Жоба туралы",
                navGuest: "Қонақ",

                // Аутентификация
                welcome: "Қош келдіңіз",
                welcomeSubtitle: "Нәтижелерді сақтау үшін жүйеге кіріңіз немесе тіркеліңіз",
                login: "Кіру",
                register: "Тіркелу",
                username: "Пайдаланушы аты",
                email: "Email",
                enterUsername: "Атыңызды енгізіңіз",
                createUsername: "Атыңызды ойлап табыңыз",
                loginButton: "Кіру",
                registerButton: "Тіркелу",
                continueAsGuest: "Қонақ ретінде жалғастыру",
                guestNote: "Тіркелмеген болсаңыз, нәтижелер сақталмайды",
                loggedInAs: "Сіз кірдіңіз:",
                myProfile: "Менің профилім",
                logout: "Шығу",
                loginOrRegister: "Кіру немесе тіркелу",
                welcomeBack: "Қош келдіңіз",
                guestMode: "Қонақ режимі",
                loggedIn: "Сіз жүйеге кірдіңіз",
                loginSuccess: "Сіз жүйеге сәтті кірдіңіз",

                // Ошибки
                error: "Қате",
                reloadPage: "Бетті қайта жүктеу",
                userExists: "Мұндай атымен пайдаланушы бар",
                userNotFound: "Пайдаланушы табылмады",
                minUsernameLength: "Ат кемінде 3 таңбадан тұруы керек",

                // Вводный экран
                aboutSystem: "Зияткерлік өзіндік тану жүйесі",
                systemDescription: "Сіздің санаңыз — тұтас ғалам. Біздің жүйе терең психологиялық сценарийлер мен заманауи алгоритмдерді қолдана отырып, ішкі әлеміңізді зерттеуге көмектеседі. Интерактивті дилеммалар арқылы біз сіздің ойлау үлгілеріңіз бен шешім қабылдау стиліңізді ашамыз.",
                whatAwaits: "Сізді не күтеді:",
                interactiveScenarios: "12 бірегей интерактивті таңдау сценарийі",
                patternAnalysis: "Ойлау үлгілері мен когнитивті стильдерді терең талдау",
                visualProfile: "Нейрондық шоқжұлдыз түріндегі динамикалық 3D-профиль",
                aiAnalysis: "🤖 Жасанды интеллект негізіндегі жекеленген терең есеп",
                personalizedRecommendations: "Даму бағыттары бойынша практикалық ұсыныстар",
                analysisDimensions: "Талдау бағыттары:",
                strategicThinking: "Стратегия ↔ Тактика",
                strategicDesc: "жоспарлау горизонты мен перспективаны көру",
                explorerThinking: "Зерттеуші ↔ Орындаушы",
                explorerDesc: "жаңаны білуге және жүзеге асыруға ұмтылыс",
                individualismThinking: "Индивидуализм ↔ Коллективизм",
                individualismDesc: "жеке және командалық жұмыстағы басымдықтар",
                rationalityThinking: "Рационалдылық ↔ Интуиция",
                rationalityDesc: "шешім қабылдау тәсілі мен логика",
                controlThinking: "Басқару ↔ Адаптация",
                controlDesc: "белгісіздікке және өзгерістерге дайындық",
                meaningThinking: "Мағына іздеу ↔ Практикалық пайда",
                meaningDesc: "іс-әрекеттердің тереңдігі және нәтижеге бағытталуы",

                // Landing Page
                landingHeroTitle: "Өзіңіздің шынайы табиғатыңызды таныңыз",
                landingHeroSubtitle: "Когнитивті психология мен таңдау сценарийлеріне негізделген интеллектуалды тұлғаны талдау жүйесі. Күшті жақтарыңыз бен даму бағыттарыңызды анықтаңыз.",
                landingFeaturesTitle: "Сіз не аласыз",
                howItWorksTitle: "Бұл қалай жұмыс істейді",
                step1Title: "Тесттен өтіңіз",
                step1Desc: "Өзіңізге жақын іс-әрекет нұсқаларын таңдап, 12 сценарийлік сұраққа жауап беріңіз.",
                step2Title: "Алгоритм есептейді",
                step2Desc: "Жүйе жауаптарыңызды тұлғаның 6 негізгі өлшемі бойынша талдайды.",
                step3Title: "Профильді аласыз",
                step3Desc: "Толық есеп, 3D-модель және даму бойынша ұсыныстар бірден қолжетімді.",
                ctaTitle: "Ішкі әлеміңізді ашыңыз",
                ctaText: "5-7 минут ішінде тесттен өтіп, жеке ұсыныстармен тұлғаңыздың толық талдауын алыңыз.",
                // Старые названия для обратной совместимости

                startTest: "Тестті бастау",
                resultsTitle: "Тұлғалық профиль талдауы",
                yourProfile: "Сіздің профиліңіз",
                levelHigh: "Жоғары айқындық",
                levelMedium: "Орташа айқындық",
                levelLow: "Төмен айқындық",
                levelVeryLow: "Өте төмен айқындық",
                levelBalanced: "Теңгерімді",
                balancedProfile: "Теңгерімді профиль",
                balancedApproach: "Теңгерімді тәсіл",
                home: "Басты бет",
                continueTest: "Тестті жалғастыру",
                startNew: "Жаңадан бастау",
                unfinishedTest: "Аяқталмаған тест",
                continueOrStartNew: "Сіз тоқтаған жерден жалғастыра аласыз немесе жаңа тест бастай аласыз",

                // Выбор типа теста
                selectTestType: "Тест түрін таңдаңыз",
                testTypeDescription: "Сізге қолайлы тест нұсқасын таңдаңыз",
                basicTest: "Жылдам тест",
                advancedTest: "Тереңдетілген тест",
                mostAccurate: "Ең дәл",
                questionsCount: "Сұрақтар саны",
                estimatedTime: "Болжалған уақыт",
                minutes: "минут",
                basicTestDescription: "Негізгі сценарийлермен жылдам тестілеу негізгі тұлға профилін алу үшін.",
                basicTestFeature1: "12 таңдау сценарийі",
                basicTestFeature2: "Негізгі профиль талдауы",
                basicTestFeature3: "Даму бойынша ұсыныстар",
                advancedTestDescription: "Тереңдетілген сұрақтармен кешенді тестілеу тұлғаның ең дәл талдауы үшін.",
                advancedTestFeature1: "Сценарийлер, шкалалар, ашық сұрақтар",
                advancedTestFeature2: "Ситуациялық тапсырмалар",
                advancedTestFeature3: "Толық талдау",
                advancedTestFeature4: "Статистикалық сенімділік",
                startBasicTest: "Жылдам тестті бастау",
                startAdvancedTest: "Тереңдетілген тестті бастау",
                loading: "Жүктелуде...",
                loadingProfile: "Профиль жүктелуде...",
                errorLoadingAdvancedTest: "Тереңдетілген тестті жүктеу кезінде қате орын алды. Кейінірек қайталаңыз.",
                continue: "Жалғастыру",
                enterYourAnswer: "Жауабыңызды енгізіңіз...",
                pleaseEnterAnswer: "Жауабыңызды енгізіңіз",
                exactQuantity: "нақты саны",
                startNewTest: "Жаңа тест бастау",

                // Тест
                questionsCompleted: "аяқталды",
                question: "Сұрақ",
                of: "/",
                back: "← Артқа",
                option: "Нұсқа",
                or: "немесе",
                chooseOption: "💡 Сіздің басымдықтарыңызды ең жақсы көрсететін нұсқаны таңдаңыз. Дұрыс жауап жоқ.",
                confirmStartNew: "Жаңа тестілеуді бастауға сенімдісіз бе? Ағымдағы прогресс қайтарымсыз жойылады.",
                optional: "міндетті емес",

                // Результаты
                results: "Талдау нәтижелері",
                resultsTitle: "Тұлғалық профиль талдауы",
                comparison: "Орташа профильмен салыстыру",
                developmentDirections: "Даму бағыттары",
                detailedAnalysis: "Толық талдау",
                developmentVectors: "Даму векторлары",
                categoryRecommendations: "Бағыттар бойынша ұсыныстар",
                skillRecommendations: "Дағдылар бойынша ұсыныстар",
                aiAnalysis: "🤖 ИИ-профиль талдауы",
                downloadResults: "Нәтижелерді жүктеу",
                takeAgain: "Қайта өту",
                toMain: "Басты бетке",

                // ИИ анализ
                personalityType: "Тұлға типі",
                confidence: "Сенімділік:",
                insights: "Инсайттар",
                predictions: "Даму болжамдары",
                probability: "Ықтималдық:",
                roleCompatibility: "Рөлдермен үйлесімділік",

                // Профиль
                myProfileTitle: "Менің профилім",
                research: "Зерттеулер және Ғылым",
                creativity: "Шығармашылық және Инновациялар",
                management: "Басқару және Көшбасшылық",
                social: "Әлеуметтік сала және Көмек",
                entrepreneurship: "Кәсіпкерлік",
                analytics: "Аналитика және Консалтинг",

                // Vectors
                vectorResearcherStrategist: "Зерттеуші-Стратег",
                vectorCreatorInnovator: "Жаратушы-Новатор",
                vectorLeaderOrganizer: "Көшбасшы-Ұйымдастырушы",
                vectorAnalystRationalist: "Аналитик-Рационалист",
                vectorSystemAnalyst: "Жүйелік Аналитик",
                vectorIndependentResearcher: "Тәуелсіз Зерттеуші",

                // Traits & Summary parts
                traitRational: "рационалды тәсіл",
                traitIntuitive: "дамыған интуиция",
                traitIndependent: "өзіндік дербестік",
                traitCollectivist: "коллективизм",
                traitStrategic: "стратегиялық пайым",
                traitAdaptive: "жоғары бейімделгіштік",
                traitMeaning: "терең мағына іздеу",
                traitPragmatic: "прагматикалық",
                traitExplorer: "зерттеуші рух",

                strengthLogical: "логикалық ойлау",
                strengthIntuitive: "интуитивті пайымдау",
                strengthIndependent: "тәуелсіздік",
                strengthTeamwork: "командалық жұмыс",
                strengthPlanning: "ұзақ мерзімді жоспарлау",
                strengthFlexibility: "шешімдердегі икемділік",
                strengthValues: "құндылық бағдары",
                strengthResult: "нәтижеге бағдарлану",
                strengthCuriosity: "білуге құмарлық",

                summaryIntro: "Сіздің профиліңіз келесідей сипатталады:",
                summaryStrengths: "Сіздің күшті жақтарыңыз:",
                summaryBalanced: "Сіздің профиліңіз шешім қабылдаудың әртүрлі аспектілеріне теңгерімді тәсілді көрсетеді.",
                analyzerLevelHigh: "жоғары",
                analyzerLevelModerate: "орташа",
                analyzerLevelLow: "төмен",
                analyzerLevelModerateLow: "орташа төмен",
                analyzerLevelBalanced: "теңгерілген",
                descStrongSlight: "Сіз {dimension} бағытына күшті бейімділік көрсетесіз.",
                descModerateSlight: "Сізде {dimension} бағытына бейімділік бар.",
                descPreferOpposite: "Сіз {opposite} бағытын қалайсыз.",
                descModerateOpposite: "Сіз {opposite} бағытына бейімсіз.",
                descBalancedApproach: "Сізде {dimension} және {opposite} арасында теңгерілген тәсіл бар.",
                vectorEntrepreneurStrategist: "Кәсіпкер-Стратег",
                descEntrepreneurStrategist: "Сіздің тәуелсіздігіңіз бен стратегиялық ойлауыңыз кәсіпкерлік пен инновациялық бизнес-жобалар үшін өте қолайлы.",
                skillAnalytic: "Аналитикалық ойлау",
                skillMethodology: "Зерттеу әдіснамасы",
                skillCritical: "Критиқалық талдау",
                actResearch: "Ғылыми зерттеулер",
                actAnalysis: "Деректерді жинау және талдау",
                actScience: "Ғылыми мақалалар жазу",
                skillCreative: "Креативтілік",
                skillDesign: "Дизайн-ойлау",
                skillProto: "Прототиптеу",
                actVisual: "Визуалды контент жасау",
                actIdeas: "Идеялар генерациясы",
                actUI: "Интерфейстерді жобалау",
                skillLeadership: "Көшбасшылық",
                skillStrategicPlan: "Стратегиялық жоспарлау",
                skillNegot: "Келіссөздер",
                actManage: "Командаларды басқару",
                actStrategy: "Стратегияларды әзірлеу",
                actOrg: "Бизнес-процестерді ұйымдастыру",
                skillEmpat: "Эмпатия",
                skillComm: "Коммуникация",
                skillPed: "Педагогика",
                actHelp: "Адамдарға көмектесу",
                actTeach: "Оқыту және менторлық",
                actPsych: "Психологиялық қолдау",
                skillEntrepreneur: "Кәсіпкерлік",
                skillRisk: "Риск-менеджмент",
                skillSales: "Сатылымдар",
                actNewProj: "Жаңа жобаларды іске қосу",
                actOpp: "Бизнес-мүмкіндіктерді іздеу",
                actNet: "Нетворкинг",
                skillStat: "Статистика",
                skillSysAnal: "Жүйелік талдау",
                skillDS: "Data Science",
                actForecast: "Болжау",
                actOpt: "Процестерді оңтайландыру",
                actBigData: "Үлкен деректермен жұмыс",

                testHistory: "Тесттер тарихы",
                evolutionProgress: "Даму прогресі",
                keyInsights: "Негізгі инсайттар",
                insightPositiveTitle: "Күшті жақтарды дамыту",
                insightNeutralTitle: "Басымдықтардың өзгеруі",
                insightStabilityTitle: "Профиль тұрақтылығы",
                insightPositiveText: "Сіз {count} өлшемде өсім көрсеттіңіз: {dimensions}. Бұл белсенді дамуды білдіреді.",
                insightNeutralText: "Сіздің таңдауыңыз {count} өлшемде өзгерді. Бұл көзқарастардың табиғи эволюциясын немесе жаңа жағдайларға бейімделуді көрсетуі мүмкін.",
                insightStabilityText: "Сіздің профиліңіз тұрақты болып қалады, бұл қалыптасқан құндылықтар мен басымдықтарды білдіреді.",
                testNumber: "Тест #",
                viewResults: "Нәтижелерді көру",
                noHistory: "Сіз әлі тесттен өткен жоқсыз.",
                startTesting: "Тестті бастау",
                // Report
                reportTitle: "Тұлғалық профиль есебі",
                reportDate: "Құрылған күні",
                dimensionScores: "Өлшемдер бойынша бағалар",
                summaryLabel: "Жалпы түйіндеме",
                recommendationsLabel: "Даму бойынша ұсыныстар",
                generatedBy: "Өз-өзін тану жүйесімен жасалған",
                personalityType: "Тұлға түрі",

                // Направления
                research: "Зерттеу және Ғылым",
                creativity: "Шығармашылық және Инновациялар",
                management: "Басқару және Көшбасшылық",
                social: "Әлеуметтік сала және Көмек",
                descResearch: "Сіздің рационалды талдау мен зерттеуге бейімділігіңіз сізді ғылыми жұмысқа, аналитикаға және R&D үшін тамаша үміткер етеді. Сіз проблемаларға терең бойлай білесіз және жүйелі шешімдер таба аласыз.",
                descCreativity: "Сіздің эксперименттерге және жаңа нәрсе жасауға дайындығыңыз шығармашылық индустрияда, дизайнда және инновациялық жобаларда мүмкіндіктер ашады. Сіз соны жолдармен жүруден және өзгерістерге бейімделуден қорықпайсыз.",
                descManagement: "Адамдармен жұмыс істеу және стратегиялық перспективаны көру қабілетіңіз басқару мен көшбасшылықта жоғары бағаланады. Сіз командаларды ынталандырып, ұзақ мерзімді мақсаттарға жете аласыз.",
                descSocial: "Адамдарға бағдарлануыңыз бен мағына іздеуіңіз сізді әлеуметтік салада, білім беруде және денсаулық сақтауда тамаша үміткер етеді. Сіз басқаларға көмектесіп, қызмет етуден құндылық таба аласыз.",
                descEntrepreneurship: "Сіздің тәуелсіздігіңіз, стратегиялық ойлауыңыз және бейімделуге дайындығыңыз кәсіпкерлік үшін өте қолайлы. Сіз жаңа мүмкіндіктер жасап, тәуекелдерді басқара аласыз.",
                descAnalytics: "Сіздің рационалды тәсіліңіз, стратегиялық ойлауыңыз және бақылауға ұмтылысыңыз сізді тамаша аналитик және кеңесші етеді. Сіз күрделі мәселелерді құрылымдап, оңтайлы шешімдер таба аласыз.",

                // Измерения (новые 6 измерений)
                strategicName: "Стратегиялық ойлау",
                explorerName: "Зерттеуші",
                individualismName: "Жекешілдік",
                rationalityName: "Рационалдық",
                adaptationName: "Бейімделу",
                meaningName: "Мағына іздеу",
                intuitionName: "Түйсік",
                utilityName: "Прагматизм",
                // Старые названия для обратной совместимости
                controlName: "Бақылау",
                systematicName: "Рационалдық",
                peopleOrientedName: "Жекешілдік",
                riskToleranceName: "Бақылау",
                // Footer & Meta
                project: "Дипломдық жоба",
                dataProcessed: "Деректер браузерде өңделуде",
                theme: "Тақырып",
                rename: "Атын өзгерту",
                deleteTest: "Жою",
                // Analysis Details
                profileMatchText: "Сіздің профиліңіз бұл бағытқа {percent}% сәйкес келеді.",
                balancedProfileTitle: "Теңгерімді профиль",
                balancedProfileDesc: "Сіздің профиліңіз теңгерімді тәсілді көрсетеді. Мақсаттарыңызды анықтау үшін әртүрлі бағыттарды зерттеңіз.",
                generalDevelopment: "Жалпы даму",
                skillStructuredThinking: "Құрылымдық ойлау",
                skillTeamwork: "Командалық жұмыс",
                skillUncertaintyManagement: "Белгісіздікті басқару",
                skillStrategicPlanning: "Стратегиялық жоспарлау",
                skillResearchSkills: "Зерттеу дағдылары",
                skillMeaningSearch: "Терең мағына іздеу",
                adaptationName: "Бейімделу",
                flexibility: "Икемділік",
                activitiesMisc: "Әртүрлі жобалар",

                // Жүйе туралы
                aboutTitle: "Жүйе туралы",
                aboutSubtitle: "Сіздің тұлғаңызды терең түсіну үшін когнитивті талдау мен жасанды интеллектті қолданатын жаңа буынның өзін-өзі тану жүйесі.",
                featuresTitle: "Сізді не күтеді",
                featInteractive: "Интерактивті сценарийлер",
                featInteractiveDesc: "Шынайы жағдайларға еніп, сіздің психологиялық профиліңізді ашатын шешімдер қабылдаңыз.",
                featPattern: "Паттерндерді талдау",
                featPatternDesc: "ML алгоритмдері сіздің ойлау ерекшеліктеріңізді анықтайды.",
                feat3D: "3D Визуализация",
                feat3DDesc: "Нейрондық шоқжұлдыз түріндегі сіздің психологиялық профиліңіздің интерактивті 3D моделі.",
                dimensionsTitle: "Талдау өлшемдері",
                dimStrategyDesc: "Ұзақ мерзімді жоспарлау және жүйелі ойлау қабілеті.",
                dimResearchDesc: "Жаңа тәжірибеге ашықтық және белгісізді зерттеуге құштарлық.",
                dimIndividualismDesc: "Тәуелсіздік пен ұжымдық ойлау арасындағы тепе-теңдік.",
                dimRationalityDesc: "Шешім қабылдауда логика мен талдауға басымдық беру.",
                dimControlDesc: "Жағдай мен қоршаған ортаны басқаруға ұмтылу.",
                dimMeaningDesc: "Іс-әрекеттер мен оқиғалардан терең мағына іздеу.",
                explorationName: "Исследователь",
                // Эволюция
                evolutionTitle: "Профиль эволюциясы",
                evolutionInsights: "Эволюция инсайттары",
                evolutionRecommendations: "Эволюция бойынша ұсыныстар",
                evolutionChanges: "Өзгерістер",
                evolutionStability: "Тұрақтылық",
                evolutionImprovements: "Жетілдірулер",
                evolutionRegressions: "Өзгерістер",
                noEvolutionData: "Эволюция талдауы үшін кемінде 2 сессия қажет",

                // Персонализация
                chooseAvatar: "Аватар таңдау",
                editAvatar: "Аватарды өзгерту",
                editProfile: "Профильді өңдеу",
                emojiAvatars: "Эмодзи аватарлар",
                colorAvatars: "Түсті аватарлар",
                save: "Сақтау",
                cancel: "Болдырмау",
                enterTestName: "Тест атауын енгізіңіз:",
                deleteTest: "Тестті жою",
                confirmDelete: "Сіз бұл тест нәтижелерін жойғыңыз келе ме?",

                // Footer
                project: "Дипломдық жоба",
                dataProcessed: "Барлық деректер сіздің браузеріңізде жергілікті өңделеді",

                // Loading
                systemLoading: "Жүйені жүктеу...",
                processingResults: "Нәтижелерді өңдеу...",

                // Сравнение
                you: "Сіз",
                average: "Орташа",
                percentile: "процентиль",

                // Сапа және Ойын
                reliabilityTitle: "Тест сенімділігі",
                statisticalTitle: "Статистикалық валидация",
                qualityLabel: "Сапа:",
                validityLabel: "Жалпы жарамдылық:",
                testRetestReliability: "Тест-ретест сенімділігі:",
                internalConsistency: "Ішкі үйлесімділік:",
                issuesTitle: "Ескертулер:",
                yourGroup: "Сіздің тобыңыз:",
                comparisonTitle: "Орташа мәндермен салыстыру",
                comparisonInsights: "Салыстыру инсайттары",
                levelLabel: "Деңгей",
                streakLabel: "Тізбек:",
                achievementsTitle: "Жетістіктер:",
                newAchievements: "🎉 Жаңа жетістіктер!",
                xpToNext: "Келесі деңгейге дейін:",
                rateAllAspects: "Нәтижелердің барлық аспектілерін бағалаңыз",
                generatedBy: "Өзіндік тану жүйесінде жасалған"
            },
            ru: {
                // Общие
                appName: "Система самопознания",
                tagline: "Анализ личностных предпочтений и направлений развития",
                navTagline: "Neural Constellation",
                navHome: "Главная",
                navStartTest: "Начать тест",
                navProfile: "Профиль",
                navResults: "Результаты",
                navAbout: "О проекте",
                navGuest: "Гость",

                // Аутентификация
                welcome: "Добро пожаловать",
                welcomeSubtitle: "Войдите в систему или создайте аккаунт для сохранения результатов",
                login: "Вход",
                register: "Регистрация",
                username: "Имя пользователя",
                email: "Email",
                enterUsername: "Введите ваше имя",
                createUsername: "Придумайте имя",
                loginButton: "Войти",
                registerButton: "Зарегистрироваться",
                continueAsGuest: "Продолжить как гость",
                guestNote: "💡 Вы можете продолжить без регистрации, но результаты не будут сохранены",
                loggedInAs: "Вы вошли как:",
                myProfile: "Мой профиль",
                logout: "Выйти",
                loginOrRegister: "Войти или зарегистрироваться",
                welcomeBack: "С возвращением",
                guestMode: "Гостевой режим",
                loggedIn: "Вы вошли в систему",
                loginWithGoogle: "Войти через Google",
                or: "или",

                // Ошибки
                error: "Ошибка",
                reloadPage: "Перезагрузить страницу",
                userExists: "Пользователь с таким именем уже существует",
                userNotFound: "Пользователь не найден",
                minUsernameLength: "Имя должно содержать минимум 3 символа",

                // Вводный экран
                aboutTitle: "О системе",
                aboutSystem: "Интеллектуальная система самопознания",
                systemDescription: "Ваше сознание — это целая вселенная. Наша система использует передовые алгоритмы и психологические сценарии, чтобы помочь вам исследовать глубины вашего 'Я'. Через серию интерактивных дилемм мы раскроем паттерны вашего мышления, которые обычно скрыты в повседневной рутине.",
                whatAwaits: "В вашем путешествии вас ждёт:",
                featuresTitle: "В вашем путешествии вас ждёт",
                featInteractive: "Интерактивные сценарии",
                featInteractiveDesc: "12 глубоких интерактивных сценариев с множеством путей развития",
                featPattern: "Анализ паттернов",
                featPatternDesc: "Комплексный анализ когнитивных паттернов и стилей принятия решений",
                feat3D: "Визуальный профиль",
                feat3DDesc: "Динамический 3D-профиль личности в виде нейронного созвездия",
                whatAwaits: "В вашем путешествии вас ждёт:",
                interactiveScenarios: "12 глубоких интерактивных сценариев с множеством путей развития",
                patternAnalysis: "Комплексный анализ когнитивных паттернов и стилей принятия решений",
                visualProfile: "Динамический 3D-профиль личности в виде нейронного созвездия",
                aiAnalysis: "🤖 Персонализированный ИИ-отчет с глубокой интерпретацией результатов",
                personalizedRecommendations: "Индивидуальная стратегия развития и практические советы",
                analysisDimensions: "Ключевые грани вашего разума:",
                dimensionsTitle: "Ключевые грани вашего разума",
                strategicThinking: "Стратегия ↔ Тактика",
                strategicName: "Стратегия ↔ Тактика",
                strategicDesc: "ваш временной горизонт планирования и видение перспективы",
                dimStrategyDesc: "ваш временной горизонт планирования и видение перспективы",
                explorerThinking: "Исследователь ↔ Исполнитель",
                explorerName: "Исследователь ↔ Исполнитель",
                explorerDesc: "ваша тяга к новым знаниям против фокуса на реализации",
                dimResearchDesc: "ваша тяга к новым знаниям против фокуса на реализации",
                individualismThinking: "Индивидуализм ↔ Коллективизм",
                individualismName: "Индивидуализм ↔ Коллективизм",
                individualismDesc: "приоритет личных целей или интересов коллектива",
                dimIndividualismDesc: "приоритет личных целей или интересов коллектива",
                rationalityThinking: "Рациональность ↔ Интуиция",
                rationalityName: "Рациональность ↔ Интуиция",
                rationalityDesc: "баланс между холодным расчетом и внутренним голосом",
                dimRationalityDesc: "баланс между холодным расчетом и внутренним голосом",
                controlThinking: "Контроль ↔ Адаптация",
                controlName: "Контроль ↔ Адаптация",
                controlDesc: "готовность к неопределенности и гибкость в переменах",
                dimControlDesc: "готовность к неопределенности и гибкость в переменах",
                meaningThinking: "Поиск смысла ↔ Практическая польза",
                meaningName: "Поиск смысла ↔ Практическая польза",
                meaningDesc: "глубина ваших мотивов против ориентации на результат",
                dimMeaningDesc: "глубина ваших мотивов против ориентации на результат",

                // Landing Page
                landingHeroTitle: "Познай свою истинную природу",
                landingHeroSubtitle: "Интеллектуальная система анализа личности, основанная на когнитивной психологии и сценариях выбора. Определите свои сильные стороны и векторы развития.",
                landingFeaturesTitle: "Что вы получите",
                howItWorksTitle: "Как это работает",
                step1Title: "Проходите тест",
                step1Desc: "Ответьте на 12 сценарных вопросов, выбирая близкие вам варианты действий.",
                step2Title: "Алгоритм считает",
                step2Desc: "Система анализирует ваши ответы по 6 ключевым измерениям личности.",
                step3Title: "Получаете профиль",
                step3Desc: "Детальный отчет, 3D-модель и рекомендации по развитию доступны мгновенно.",
                ctaTitle: "Откройте свой внутренний мир",
                ctaText: "Пройдите тест за 5-7 минут и получите детальный анализ вашей личности с персональными рекомендациями.",

                startTest: "Начать тестирование",
                resultsTitle: "Анализ личностного профиля",
                yourProfile: "Ваш профиль",
                levelHigh: "Высокая выраженность",
                levelMedium: "Умеренная выраженность",
                levelLow: "Низкая выраженность",
                levelVeryLow: "Умеренно низкая выраженность",
                levelBalanced: "Сбалансировано",
                balancedProfile: "Сбалансированный профиль",
                balancedApproach: "Сбалансированный подход",
                home: "На главную",
                continueTest: "Продолжить тест",
                startNew: "Начать заново",
                unfinishedTest: "Незавершенный тест",
                continueOrStartNew: "Вы можете продолжить с того места, где остановились, или начать новый тест",

                // Выбор типа теста
                selectTestType: "Выберите тип теста",
                testTypeDescription: "Выберите подходящий для вас вариант тестирования",
                basicTest: "Быстрый тест",
                advancedTest: "Углубленный тест",
                mostAccurate: "Максимально точный",
                questionsCount: "Вопросов",
                estimatedTime: "Время",
                minutes: "минут",
                basicTestDescription: "Быстрое тестирование с основными сценариями для получения базового профиля личности.",
                basicTestFeature1: "12 сценариев с выбором",
                basicTestFeature2: "Базовый анализ профиля",
                basicTestFeature3: "Рекомендации по развитию",
                advancedTestDescription: "Комплексное тестирование с углубленными вопросами для максимально точного анализа личности.",
                advancedTestFeature1: "Сценарии, шкалы, открытые вопросы",
                advancedTestFeature2: "Ситуационные задачи",
                advancedTestFeature3: "Детализированный анализ",
                advancedTestFeature4: "Статистическая достоверность",
                startBasicTest: "Начать быстрый тест",
                startAdvancedTest: "Начать углубленный тест",
                loading: "Загрузка...",
                loadingProfile: "Загрузка профиля...",
                errorLoadingAdvancedTest: "Ошибка загрузки углубленного теста. Попробуйте позже.",
                continue: "Продолжить",
                enterYourAnswer: "Введите ваш ответ...",
                pleaseEnterAnswer: "Пожалуйста, введите ответ",
                exactQuantity: "точное количество",
                startNewTest: "Начать новый тест",

                // Тест
                questionsCompleted: "пройдено",
                question: "Вопрос",
                of: "из",
                back: "← Назад",
                option: "Вариант",
                or: "или",
                chooseOption: "💡 Выберите вариант, который лучше всего отражает ваши предпочтения. Правильного ответа нет.",
                confirmStartNew: "Вы уверены, что хотите начать новое тестирование? Текущий прогресс будет безвозвратно утерян.",
                optional: "необязательно",

                // Результаты
                results: "Результаты анализа",
                resultsTitle: "Анализ личностного профиля",
                visualProfile: "Визуальный профиль",
                comparison: "Сравнение с средним профилем",
                developmentDirections: "Направления развития",
                detailedAnalysis: "Детальный анализ",
                developmentVectors: "Векторы развития",
                categoryRecommendations: "Рекомендации по направлениям",
                skillRecommendations: "Рекомендации по навыкам",
                aiAnalysis: "🤖 ИИ-анализ профиля",
                downloadResults: "Скачать результаты",
                takeAgain: "Пройти заново",
                toMain: "На главную",

                // ИИ анализ
                personalityType: "Тип личности",
                confidence: "Уверенность:",
                insights: "Инсайты",
                predictions: "Предсказания развития",
                probability: "Вероятность:",
                roleCompatibility: "Совместимость с ролями",

                // Профиль
                myProfileTitle: "Мой профиль",
                registered: "Зарегистрирован:",
                lastLogin: "Последний вход:",
                testHistory: "История тестирований",

                research: "Исследование и Наука",
                creativity: "Творчество и Инновации",
                management: "Управление и Лидерство",
                social: "Социальная сфера и Помощь",
                entrepreneurship: "Предпринимательство",
                analytics: "Аналитика и Консалтинг",

                // Vectors
                vectorResearcherStrategist: "Исследователь-Стратег",
                vectorCreatorInnovator: "Творец-Новатор",
                vectorLeaderOrganizer: "Лидер-Организатор",
                vectorAnalystRationalist: "Аналитик-Рационалист",
                vectorSystemAnalyst: "Системный Аналитик",
                vectorIndependentResearcher: "Самостоятельный Исследователь",

                // Traits & Summary parts
                traitRational: "рациональный подход",
                traitIntuitive: "развитая интуиция",
                traitIndependent: "самостоятельность",
                traitCollectivist: "коллективизм",
                traitStrategic: "стратегическое видение",
                traitAdaptive: "высокая адаптивность",
                traitMeaning: "поиск глубинного смысла",
                traitPragmatic: "прагматичность",
                traitExplorer: "исследовательский дух",

                strengthLogical: "логическое мышление",
                strengthIntuitive: "интуитивное прозрение",
                strengthIndependent: "независимость",
                strengthTeamwork: "командная работа",
                strengthPlanning: "долгосрочное планирование",
                strengthFlexibility: "гибкость в решениях",
                strengthValues: "ценностная ориентация",
                strengthResult: "ориентация на результат",
                strengthCuriosity: "любознательность",

                summaryIntro: "Ваш профиль характеризуется:",
                summaryStrengths: "Ваши сильные стороны:",
                summaryBalanced: "Ваш профиль демонстрирует сбалансированный подход к различным аспектам принятия решений.",
                analyzerLevelHigh: "высокая",
                analyzerLevelModerate: "умеренная",
                analyzerLevelLow: "низкая",
                analyzerLevelModerateLow: "умеренно низкая",
                analyzerLevelBalanced: "сбалансированная",
                descStrongSlight: "Вы демонстрируете сильную склонность к {dimension}.",
                descModerateSlight: "У вас есть склонность к {dimension}.",
                descPreferOpposite: "Вы предпочитаете {opposite}.",
                descModerateOpposite: "Вы склонны к {opposite}.",
                descBalancedApproach: "У вас сбалансированный подход между {dimension} и {opposite}.",
                vectorEntrepreneurStrategist: "Предприниматель-Стратег",
                descEntrepreneurStrategist: "Ваша независимость и стратегическое мышление делают вас идеальным для предпринимательства и инновационных бизнес-проектов.",
                skillAnalytic: "Аналитическое мышление",
                skillMethodology: "Методология исследований",
                skillCritical: "Критический анализ",
                actResearch: "Научные исследования",
                actAnalysis: "Сбор и анализ данных",
                actScience: "Написание научных статей",
                skillCreative: "Креативность",
                skillDesign: "Дизайн-мышление",
                skillProto: "Прототипирование",
                actVisual: "Создание визуального контента",
                actIdeas: "Генерация идей",
                actUI: "Проектирование интерфейсов",
                skillLeadership: "Лидерство",
                skillStrategicPlan: "Стратегическое планирование",
                skillNegot: "Переговоры",
                actManage: "Управление командами",
                actStrategy: "Разработка стратегий",
                actOrg: "Организация бизнес-процессов",
                skillEmpat: "Эмпатия",
                skillComm: "Коммуникация",
                skillPed: "Педагогика",
                actHelp: "Помощь людям",
                actTeach: "Обучение и менторство",
                actPsych: "Психологическая поддержка",
                skillEntrepreneur: "Предпринимательство",
                skillRisk: "Риск-менеджмент",
                skillSales: "Продажи",
                actNewProj: "Запуск новых проектов",
                actOpp: "Поиск бизнес-возможностей",
                actNet: "Нетворкинг",
                skillStat: "Статистика",
                skillSysAnal: "Системный анализ",
                skillDS: "Data Science",
                actForecast: "Прогнозирование",
                actOpt: "Оптимизация процессов",
                actBigData: "Работа с большими данными",

                evolutionProgress: "Прогресс развития",
                keyInsights: "Ключевые инсайты",
                insightPositiveTitle: "Развитие сильных сторон",
                insightNeutralTitle: "Изменение приоритетов",
                insightStabilityTitle: "Стабильность профиля",
                insightPositiveText: "Вы показали рост в {count} измерении(ях): {dimensions}. Это указывает на активное развитие.",
                insightNeutralText: "Ваши предпочтения изменились в {count} измерении(ях). Это может отражать естественную эволюцию взглядов или адаптацию к новым обстоятельствам.",
                insightStabilityText: "Ваш профиль остаётся стабильным, что указывает на устойчивые предпочтения и ценности.",
                testNumber: "Тест №",
                viewResults: "Просмотреть результаты",
                noHistory: "Вы ещё не проходили тест.",
                startTesting: "Начать тестирование",
                // Report
                reportTitle: "Отчет о профиле личности",
                reportDate: "Дата формирования",
                dimensionScores: "Оценки по измерениям",
                summaryLabel: "Общее резюме",
                recommendationsLabel: "Рекомендации по развитию",
                generatedBy: "Сгенерировано системой самопознания",
                personalityType: "Тип личности",

                // Направления
                research: "Исследование и Наука",
                creativity: "Творчество и Инновации",
                management: "Управление и Лидерство",
                social: "Социальная сфера и Помощь",
                descResearch: "Ваша склонность к рациональному анализу и исследованию делает вас идеальным кандидатом для научной работы, аналитики и R&D. Вы умеете глубоко погружаться в проблемы и находить системные решения.",
                descCreativity: "Ваша готовность к экспериментам и созданию нового открывает возможности в творческих индустриях, дизайне и инновационных проектах. Вы не боитесь идти непроторенными путями и адаптироваться к изменениям.",
                descManagement: "Ваше умение работать with людьми и видеть стратегическую перспективу ценится в управлении и лидерстве. Вы способны мотивировать команды и достигать долгосрочных целей.",
                descSocial: "Ваша ориентация на людей и поиск смысла делают вас отличным кандидатом для работы в социальной сфере, образовании и здравоохранении. Вы умеете помогать другим и находить ценность в служении.",
                descEntrepreneurship: "Ваша независимость, стратегическое мышление и готовность к адаптации идеальны для предпринимательства. Вы способны создавать новые возможности и управлять рисками.",
                descAnalytics: "Ваш рациональный подход, стратегическое мышление и стремление к контролю делают вас отличным аналитиком и консультантом. Вы умеете структурировать сложные проблемы и находить оптимальные решения.",

                // Измерения (новые 6 измерений)
                strategicName: "Стратегическое мышление",
                explorerName: "Исследователь",
                individualismName: "Индивидуализм",
                rationalityName: "Рациональность",
                adaptationName: "Адаптивность",
                meaningName: "Поиск смысла",
                intuitionName: "Интуиция",
                utilityName: "Прагматичность",
                // Старые названия для обратной совместимости
                controlName: "Контроль",
                systematicName: "Рациональность",
                peopleOrientedName: "Индивидуализм",
                riskToleranceName: "Контроль",
                questionsCount: "Вопросов",
                estimatedTime: "Время",
                // Footer & Meta
                project: "Дипломный проект",
                dataProcessed: "Данные обрабатываются в вашем браузере",
                theme: "Тема",
                rename: "Переименовать",
                deleteTest: "Удалить",
                // Analysis Details
                profileMatchText: "Ваш профиль соответствует этому направлению на {percent}%.",
                balancedProfileTitle: "Сбалансированный профиль",
                balancedProfileDesc: "Ваш профиль демонстрирует сбалансированный подход. Исследуйте разные направления для определения наиболее подходящего пути.",
                generalDevelopment: "Общее развитие",
                skillStructuredThinking: "Структурированное мышление",
                skillTeamwork: "Командная работа",
                skillUncertaintyManagement: "Управление неопределённостью",
                skillStrategicPlanning: "Стратегияльное планирование",
                skillResearchSkills: "Исследовательские навыки",
                skillMeaningSearch: "Поиск глубинного смысла",
                adaptationName: "Адаптивность",
                flexibility: "Гибкость",
                activitiesMisc: "Разнообразные проекты",
                explorationName: "Исследователь",
                // Эволюция
                evolutionTitle: "Эволюция профиля",
                evolutionInsights: "Инсайты об эволюции",
                evolutionRecommendations: "Рекомендации",
                evolutionChanges: "Изменения",
                evolutionStability: "Стабильность",
                evolutionImprovements: "Улучшения",
                evolutionRegressions: "Изменения",
                noEvolutionData: "Для анализа эволюции необходимо минимум 2 сессии",

                // Персонализация
                chooseAvatar: "Выбрать аватар",
                editAvatar: "Изменить аватар",
                editProfile: "Редактировать профиль",
                emojiAvatars: "Эмодзи аватары",
                colorAvatars: "Цветные аватары",
                save: "Сохранить",
                cancel: "Отмена",
                enterTestName: "Введите название теста:",
                deleteTest: "Удалить тест",
                confirmDelete: "Вы уверены, что хотите удалить этот тест?",

                // Footer
                project: "Дипломный проект",
                dataProcessed: "Все данные обрабатываются локально в вашем браузере",

                // Loading
                systemLoading: "Загрузка системы...",
                processingResults: "Обработка результатов...",

                // Сравнение
                you: "Вы",
                average: "Среднее",
                percentile: "процентиль",

                // Качество и Геймификация
                reliabilityTitle: "Надежность теста",
                statisticalTitle: "Статистическая валидация",
                qualityLabel: "Качество:",
                validityLabel: "Общая валидность:",
                testRetestReliability: "Тест-ретест надежность:",
                internalConsistency: "Внутренняя согласованность (Cronbach's Alpha):",
                issuesTitle: "Замечания:",
                yourGroup: "Ваша группа:",
                comparisonTitle: "Сравнение со средними значениями",
                comparisonInsights: "Инсайты из сравнения",
                levelLabel: "Уровень",
                streakLabel: "Последовательность:",
                achievementsTitle: "Достижения:",
                newAchievements: "🎉 Новые достижения!",
                xpToNext: "До следующего уровня:",
                rateAllAspects: "Пожалуйста, оцените все аспекты результатов",
                feedbackSkipped: "Обратная связь пропущена",
                generatedBy: "Сгенерировано системой самопознания"
            },
            en: {
                // General
                appName: "Self-Discovery System",
                tagline: "Analysis of personal preferences and development directions",
                navTagline: "Neural Constellation",
                navHome: "Home",
                navStartTest: "Start Test",
                navProfile: "Profile",
                navResults: "Results",
                navAbout: "About Project",
                navGuest: "Guest",

                // Authentication
                welcome: "Welcome",
                welcomeSubtitle: "Sign in or create an account to save your results",
                login: "Login",
                register: "Register",
                username: "Username",
                email: "Email",
                enterUsername: "Enter your name",
                createUsername: "Create a username",
                loginButton: "Sign In",
                registerButton: "Sign Up",
                continueAsGuest: "Continue as Guest",
                guestNote: "💡 You can continue without registration, but results won't be saved",
                loggedInAs: "Logged in as:",
                myProfile: "My Profile",
                logout: "Logout",
                loginOrRegister: "Sign in or register",
                welcomeBack: "Welcome back",
                guestMode: "Guest Mode",
                loggedIn: "Logged In",
                loginWithGoogle: "Sign in with Google",
                or: "or",
                googleNotConfigured: "Google Sign-In not configured",

                // Errors
                error: "Error",
                reloadPage: "Reload page",
                userExists: "User with this name already exists",
                userNotFound: "User not found",
                minUsernameLength: "Username must be at least 3 characters",

                // Intro screen
                aboutSystem: "Intellectual Self-Discovery System",
                systemDescription: "Your mind is an entire universe. Our system uses advanced psychological scenarios and algorithms to help you explore the depths of your inner self. Through a series of interactive dilemmas, we reveal your thinking patterns and decision-making styles.",
                whatAwaits: "In your journey:",
                interactiveScenarios: "12 deep interactive choice scenarios with multiple paths",
                patternAnalysis: "Complex analysis of cognitive patterns and decision styles",
                visualProfile: "Dynamic 3D personality profile as a neural constellation",
                aiAnalysis: "🤖 Personalized AI-driven report with deep interpretation",
                personalizedRecommendations: "Individual development strategy and practical advice",
                analysisDimensions: "Key dimensions of your mind:",
                strategicThinking: "Strategy ↔ Tactics",
                strategicDesc: "your planning horizon and vision of perspective",
                explorerThinking: "Explorer ↔ Executor",
                explorerDesc: "your drive for new knowledge vs focus on implementation",
                individualismThinking: "Individualism ↔ Collectivism",
                individualismDesc: "priority of personal goals vs group interests",
                rationalityThinking: "Rationality ↔ Intuition",
                rationalityDesc: "balance between calculation and inner voice",
                controlThinking: "Control ↔ Adaptation",
                controlDesc: "readiness for uncertainty and flexibility in change",
                meaningThinking: "Search for Meaning ↔ Practical Utility",
                meaningDesc: "depth of your motives vs focus on concrete results",

                // Landing Page
                landingHeroTitle: "Know Your True Nature",
                landingHeroSubtitle: "An intelligent personality analysis system based on cognitive psychology and choice scenarios. Identify your strengths and development vectors.",
                landingFeaturesTitle: "What You Will Get",
                howItWorksTitle: "How It Works",
                step1Title: "Take the Test",
                step1Desc: "Answer 12 scenario questions by choosing the action options closest to you.",
                step2Title: "Algorithm Calculates",
                step2Desc: "The system analyzes your answers across 6 key personality dimensions.",
                step3Title: "Get Profile",
                step3Desc: "Detailed report, 3D model, and development recommendations are available instantly.",
                ctaTitle: "Discover Your Inner World",
                ctaText: "Take the test in 5-7 minutes and get a detailed analysis of your personality with personal recommendations.",
                // Старые названия для обратной совместимости
                systematicThinking: "Rationality ↔ Intuition",
                systematicDesc: "how you approach problem solving",
                peopleOrientation: "Individualism ↔ Collectivism",
                peopleDesc: "what matters more to you at work",
                riskTolerance: "Control ↔ Adaptation",
                riskDesc: "your readiness for uncertainty",
                exploration: "Explorer ↔ Executor",
                explorationDesc: "your drive for new knowledge",
                startTest: "Start Testing",
                resultsTitle: "Personality Profile Analysis",
                yourProfile: "Your Profile",
                levelHigh: "High visibility",
                levelMedium: "Moderate visibility",
                levelLow: "Low visibility",
                levelVeryLow: "Very low visibility",
                levelBalanced: "Balanced",
                balancedProfile: "Balanced Profile",
                balancedApproach: "Balanced Approach",
                home: "Home",
                continueTest: "Continue Test",
                startNew: "Start New",
                unfinishedTest: "Unfinished Test",
                continueOrStartNew: "You can continue from where you left off or start a new test",

                // Test type selection
                selectTestType: "Select Test Type",
                testTypeDescription: "Choose the testing option that suits you",
                basicTest: "Quick Test",
                advancedTest: "Advanced Test",
                mostAccurate: "Most Accurate",
                questionsCount: "Questions",
                estimatedTime: "Time",
                minutes: "minutes",
                basicTestDescription: "Quick testing with basic scenarios to get a basic personality profile.",
                basicTestFeature1: "12 choice scenarios",
                basicTestFeature2: "Basic profile analysis",
                basicTestFeature3: "Development recommendations",
                advancedTestDescription: "Comprehensive testing with in-depth questions for the most accurate personality analysis.",
                advancedTestFeature1: "Scenarios, scales, open questions",
                advancedTestFeature2: "Situational tasks",
                advancedTestFeature3: "Detailed analysis",
                advancedTestFeature4: "Statistical reliability",
                startBasicTest: "Start Quick Test",
                startAdvancedTest: "Start Advanced Test",
                loading: "Loading...",
                loadingProfile: "Loading profile...",
                errorLoadingAdvancedTest: "Error loading advanced test. Please try again later.",
                continue: "Continue",
                enterYourAnswer: "Enter your answer...",
                pleaseEnterAnswer: "Please enter an answer",
                exactQuantity: "exact quantity",
                startNewTest: "Start New Test",

                // Test
                questionsCompleted: "completed",
                question: "Question",
                of: "of",
                back: "← Back",
                option: "Option",
                or: "or",
                chooseOption: "💡 Choose the option that best reflects your preferences. There is no right answer.",
                confirmStartNew: "Are you sure you want to start a new assessment? Current progress will be permanently lost.",
                optional: "optional",

                // Results
                results: "Analysis Results",
                resultsTitle: "Personality Profile Analysis",
                visualProfile: "Visual Profile",
                comparison: "Comparison with Average Profile",
                developmentDirections: "Development Directions",
                detailedAnalysis: "Detailed Analysis",
                developmentVectors: "Development Vectors",
                categoryRecommendations: "Recommendations by Directions",
                skillRecommendations: "Skill Recommendations",
                aiAnalysis: "🤖 AI Profile Analysis",
                downloadResults: "Download Results",
                takeAgain: "Take Again",
                toMain: "To Main",

                // AI Analysis
                personalityType: "Personality Type",
                confidence: "Confidence:",
                insights: "Insights",
                predictions: "Development Predictions",
                probability: "Probability:",
                roleCompatibility: "Role Compatibility",

                // Profile
                myProfileTitle: "My Profile",
                registered: "Registered:",
                lastLogin: "Last Login:",
                evolutionProgress: "Development Progress",

                research: "Research and Science",
                creativity: "Creativity and Innovation",
                management: "Management and Leadership",
                social: "Social Sphere and Assistance",
                entrepreneurship: "Entrepreneurship",
                analytics: "Analytics and Consulting",

                // Vectors
                vectorResearcherStrategist: "Researcher-Strategist",
                vectorCreatorInnovator: "Creator-Innovator",
                vectorLeaderOrganizer: "Leader-Organizer",
                vectorAnalystRationalist: "Analyst-Rationalist",
                vectorSystemAnalyst: "System Analyst",
                vectorIndependentResearcher: "Independent Researcher",

                // Traits & Summary parts
                traitRational: "rational approach",
                traitIntuitive: "developed intuition",
                traitIndependent: "independence",
                traitCollectivist: "collectivism",
                traitStrategic: "strategic vision",
                traitAdaptive: "high adaptability",
                traitMeaning: "search for deep meaning",
                traitPragmatic: "pragmatism",
                traitExplorer: "explorative spirit",

                strengthLogical: "logical thinking",
                strengthIntuitive: "intuitive insight",
                strengthIndependent: "independence",
                strengthTeamwork: "teamwork",
                strengthPlanning: "long-term planning",
                strengthFlexibility: "flexibility in decisions",
                strengthValues: "value orientation",
                strengthResult: "result orientation",
                strengthCuriosity: "curiosity",

                summaryIntro: "Your profile is characterized by:",
                summaryStrengths: "Your strengths:",
                summaryBalanced: "Your profile demonstrates a balanced approach to various aspects of decision-making.",

                keyInsights: "Key Insights",
                insightPositiveTitle: "Developing Strengths",
                insightNeutralTitle: "Changing Priorities",
                insightStabilityTitle: "Profile Stability",
                insightPositiveText: "You showed growth in {count} dimension(s): {dimensions}. This indicates active development.",
                insightNeutralText: "Your preferences changed in {count} dimension(s). This may reflect natural evolution of views or adaptation to new circumstances.",
                insightStabilityText: "Your profile remains stable, indicating consistent values and priorities.",
                testHistory: "Test History",
                testNumber: "Test #",
                viewResults: "View Results",
                noHistory: "You haven't taken the test yet.",
                startTesting: "Start Testing",
                // Report
                reportTitle: "Self-Knowledge System Report",
                reportDate: "Generation Date",
                dimensionScores: "Dimension Scores",
                summaryLabel: "General Summary",
                recommendationsLabel: "Recommendations",
                generatedBy: "Generated by Self-Knowledge System",

                // Directions
                research: "Research and Science",
                creativity: "Creativity and Innovation",
                management: "Management and Leadership",
                social: "Social Sphere and Help",
                descResearch: "Your inclination for rational analysis and research makes you an ideal candidate for scientific work, analytics, and R&D. You know how to dive deep into problems and find systemic solutions.",
                descCreativity: "Your readiness for experimentation and creating new things opens up opportunities in creative industries, design, and innovative projects. You are not afraid to take untrodden paths and adapt to changes.",
                descManagement: "Your ability to work with people and see a strategic perspective is valued in management and leadership. You are able to motivate teams and achieve long-term goals.",
                descSocial: "Your orientation towards people and search for meaning make you an excellent candidate for work in the social sphere, education, and healthcare. You know how to help others and find value in service.",
                descEntrepreneurship: "Your independence, strategic thinking, and readiness for adaptation are ideal for entrepreneurship. You are able to create new opportunities and manage risks.",
                descAnalytics: "Your rational approach, strategic thinking, and desire for control make you an excellent analyst and consultant. You know how to structure complex problems and find optimal solutions.",

                // Dimensions (new 6 dimensions)
                strategicName: "Strategic Thinking",
                explorerName: "Explorer",
                individualismName: "Individualism",
                rationalityName: "Rationality",
                adaptationName: "Adaptability",
                meaningName: "Search for Meaning",
                intuitionName: "Intuition",
                utilityName: "Utility",
                // Old names for backward compatibility
                controlName: "Control",
                systematicName: "Rationality",
                peopleOrientedName: "Individualism",
                riskToleranceName: "Control",
                // Footer & Meta
                project: "Diploma Project",
                dataProcessed: "Data is processed in your browser",
                theme: "Theme",
                rename: "Rename",
                deleteTest: "Delete",
                // Analysis Details
                profileMatchText: "Your profile matches this direction by {percent}%.",
                balancedProfileTitle: "Balanced Profile",
                balancedProfileDesc: "Your profile demonstrates a balanced approach. Explore different directions to find the most suitable path.",
                generalDevelopment: "General Development",
                skillStructuredThinking: "Structured Thinking",
                skillTeamwork: "Teamwork",
                skillUncertaintyManagement: "Uncertainty Management",
                skillStrategicPlanning: "Strategic Planning",
                skillResearchSkills: "Research Skills",
                skillMeaningSearch: "Meaning Search",
                adaptationName: "Adaptability",
                flexibility: "Flexibility",
                activitiesMisc: "Miscellaneous Projects",

                // About System
                aboutTitle: "About System",
                aboutSubtitle: "A new generation self-knowledge system using cognitive analysis and AI for deep understanding of your personality.",
                featuresTitle: "What Awaits You",
                featInteractive: "Interactive Scenarios",
                featInteractiveDesc: "Immerse yourself in realistic situations and make decisions that reveal your psychological profile.",
                featPattern: "Pattern Analysis",
                featPatternDesc: "ML algorithms analyze your cognitive patterns and identify unique thinking features.",
                feat3D: "3D Visualization",
                feat3DDesc: "Interactive 3D model of your psychological profile as a neural constellation.",
                dimensionsTitle: "Analysis Dimensions",
                dimStrategyDesc: "Ability for long-term planning and systems thinking.",
                dimResearchDesc: "Openness to new experiences and desire to explore the unknown.",
                dimIndividualismDesc: "Balance between independence and collective thinking.",
                dimRationalityDesc: "Preference for logic and analysis in decision making.",
                dimControlDesc: "Desire to control situations and environment.",
                dimMeaningDesc: "Search for deep meaning in actions and events.",
                explorationName: "Explorer",
                // Evolution
                evolutionTitle: "Profile Evolution",
                evolutionInsights: "Evolution Insights",
                evolutionRecommendations: "Recommendations",
                evolutionChanges: "Changes",
                evolutionStability: "Stability",
                evolutionImprovements: "Improvements",
                evolutionRegressions: "Changes",
                noEvolutionData: "At least 2 sessions required for evolution analysis",

                // Personalization
                chooseAvatar: "Choose Avatar",
                editAvatar: "Change Avatar",
                editProfile: "Edit Profile",
                emojiAvatars: "Emoji Avatars",
                colorAvatars: "Color Avatars",
                save: "Save",
                cancel: "Cancel",
                enterTestName: "Enter test name:",
                deleteTest: "Delete test",
                confirmDelete: "Are you sure you want to delete this test?",

                // Footer
                project: "Diploma Project",
                dataProcessed: "All data is processed locally in your browser",

                // Loading
                systemLoading: "System loading...",
                processingResults: "Processing results...",

                // Сравнение
                you: "You",
                average: "Average",
                percentile: "percentile",

                // Quality & Gamification
                reliabilityTitle: "Test Reliability",
                statisticalTitle: "Statistical Validation",
                qualityLabel: "Quality:",
                validityLabel: "Overall Validity:",
                testRetestReliability: "Test-Retest Reliability:",
                internalConsistency: "Internal Consistency:",
                issuesTitle: "Issues:",
                yourGroup: "Your Group:",
                comparisonTitle: "Comparison with Averages",
                comparisonInsights: "Comparison Insights",
                levelLabel: "Level",
                streakLabel: "Streak:",
                achievementsTitle: "Achievements:",
                newAchievements: "🎉 New Achievements!",
                xpToNext: "To next level:",
                recommendationsLabel: "Development Recommendations",
                summaryIntro: "Your profile is characterized by:",
                summaryStrengths: "Your strengths:",
                summaryBalanced: "Your profile demonstrates a balanced approach across all dimensions.",
                analyzerLevelHigh: "high",
                analyzerLevelModerate: "moderate",
                analyzerLevelLow: "low",
                analyzerLevelModerateLow: "moderately low",
                analyzerLevelBalanced: "balanced",

                descStrongSlight: "You demonstrate a strong inclination for {dimension}.",
                descModerateSlight: "You have an inclination for {dimension}.",
                descPreferOpposite: "You prefer {opposite}.",
                descModerateOpposite: "You are inclined towards {opposite}.",
                descBalancedApproach: "You have a balanced approach between {dimension} and {opposite}.",
                vectorEntrepreneurStrategist: "Entrepreneur-Strategist",
                descEntrepreneurStrategist: "Your independence and strategic thinking are ideal for entrepreneurship and innovative business projects.",
                skillAnalytic: "Analytical Thinking",
                skillMethodology: "Research Methodology",
                skillCritical: "Critical Analysis",
                actResearch: "Scientific Research",
                actAnalysis: "Data Collection and Analysis",
                actScience: "Writing Scientific Articles",
                skillCreative: "Creativity",
                skillDesign: "Design Thinking",
                skillProto: "Prototyping",
                actVisual: "Creating Visual Content",
                actIdeas: "Idea Generation",
                actUI: "Interface Design",
                skillLeadership: "Leadership",
                skillStrategicPlan: "Strategic Planning",
                skillNegot: "Negotiations",
                actManage: "Team Management",
                actStrategy: "Strategy Development",
                actOrg: "Business Process Organization",
                skillEmpat: "Empathy",
                skillComm: "Communication",
                skillPed: "Pedagogy",
                actHelp: "Helping People",
                actTeach: "Training and Mentoring",
                actPsych: "Psychological Support",
                skillEntrepreneur: "Entrepreneurship",
                skillRisk: "Risk Management",
                skillSales: "Sales",
                actNewProj: "Starting New Projects",
                actOpp: "Seeking Business Opportunities",
                actNet: "Networking",
                skillStat: "Statistics",
                skillSysAnal: "System Analysis",
                skillDS: "Data Science",
                actForecast: "Forecasting",
                actOpt: "Process Optimization",
                actBigData: "Working with Big Data"
            }
        };
    }

    /**
     * Получение перевода
     * @param {string} key - Ключ перевода
     * @param {Object} params - Параметры для подстановки
     * @returns {string} Переведённый текст
     */
    t(key, params = {}) {
        let translation = this.translations[this.currentLanguage]?.[key] ||
            this.translations['en']?.[key] ||
            this.translations['ru']?.[key] ||
            this.translations['kk']?.[key] ||
            key;

        // Подстановка параметров
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });

        return translation;
    }

    /**
     * Установка языка
     * @param {string} lang - Код языка (kk, ru, en)
     */
    setLanguage(lang) {
        if (['kk', 'ru', 'en'].includes(lang)) {
            this.currentLanguage = lang;
            localStorage.setItem('preferredLanguage', lang);
            return true;
        }
        return false;
    }

    /**
     * Получение текущего языка
     * @returns {string} Код языка
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Получение названия языка
     * @param {string} lang - Код языка
     * @returns {string} Название языка
     */
    getLanguageName(lang) {
        const names = {
            kk: 'Қазақша',
            ru: 'Русский',
            en: 'English'
        };
        return names[lang] || lang;
    }

    /**
     * Получение всех доступных языков
     * @returns {Array} Массив языков
     */
    getAvailableLanguages() {
        return [
            {
                code: 'kk',
                name: 'Қазақша',
                flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 16" width="24" height="12"><rect width="32" height="16" fill="#00afca"/><circle cx="16" cy="8" r="3.5" fill="#fec52e"/><path d="M16 4.5v7M12.5 8h7" stroke="#fec52e" stroke-width="0.5"/><path d="M0 0h1.5v16H0z" fill="#fec52e"/></svg>`
            },
            {
                code: 'ru',
                name: 'Русский',
                flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="21" height="14"><rect width="3" height="2" fill="#fff"/><rect width="3" height="1.333" y="0.667" fill="#0039a6"/><rect width="3" height="0.667" y="1.333" fill="#d52b1e"/></svg>`
            },
            {
                code: 'en',
                name: 'English',
                flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="12"><clipPath id="s"><path d="M0 0v30h60V0z"/></clipPath><path d="M0 0v30h60V0z" fill="#012169"/><path d="m0 0 60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="m0 0 60 30m0-30L0 30" clip-path="url(#s)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>`
            }
        ];
    }
}

// Глобальная функция для удобства
if (typeof window !== 'undefined') {
    window.i18n = new LocalizationManager();
    window.t = (key) => window.i18n.t(key);
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalizationManager;
}

// Явное присвоение к window для браузера
if (typeof window !== 'undefined') {
    window.LocalizationManager = LocalizationManager;
}
