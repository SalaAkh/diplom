/**
 * Patch to add missing translations dynamically
 * Works around encoding issues in the main localization.js file
 */
(function () {
    const patches = {
        ru: {
            keepItUp: "Так держать!",
            payAttention: "Обратите внимание",
            recGrowth: "Продолжайте развивать {dim}. Ваш рост в этой области стабилен и перспективен.",
            recDecline: "Обратите внимание на {dim}. Наблюдается снижение, возможно, стоит вернуться к практике в этой области.",
            recStable: "Ваш профиль стабилен. Это отличная основа для дальнейшего развития. Попробуйте новые форматы обучения.",
            keyInsights: "Ключевые инсайты",
            strategicName: "Стратегическое мышление",
            explorerName: "Исследовательский интерес",
            individualismName: "Индивидуализм",
            rationalityName: "Рациональность",
            adaptationName: "Адаптивность",
            meaningName: "Поиск смысла",
            intuitionName: "Интуиция",
            utilityName: "Практичность",
            resultsDownloaded: "Результаты успешно скачаны",
            // Diploma info
            diplomaBadge: "Дипломная работа",
            diplomaTitle: "Разработка системы анализа личностных предпочтений и направлений развития пользователя на основе интерактивных сценариев выбора",
            diplomaTech: "Разработано на HTML, CSS, JavaScript",
            diplomaAuthor: "Автор: Ахмедьянов Саламат КПО 9/22-2",
            diplomaDate: "2026 год",
            // Accessibility (about page)
            accessTitle: "Настройки доступности",
            accessSubtitle: "Мы стремимся сделать систему максимально доступной для всех пользователей.",
            contrastLabel: "Контрастность",
            contrastDesc: "Поддержка режима высокой контрастности для людей с нарушениями зрения.",
            textSizeLabel: "Размер текста",
            textSizeDesc: "Возможность масштабирования интерфейса и изменения размера шрифта.",
            audioFeedbackLabel: "Звуковое сопровождение",
            audioFeedbackDesc: "Звуковое подтверждение действий и озвучивание важных изменений состояния.",
            readingLabel: "Озвучивание результатов",
            readingDesc: "Синтез речи для автоматического прочтения ваших результатов и рекомендаций.",
            audioSystemLabel: "Аудиосистема",
            audioSystemDesc: "Звуковое подтверждение действий и синтез речи для озвучивания результатов."
        },
        en: {
            keepItUp: "Keep it up!",
            payAttention: "Pay attention",
            recGrowth: "Continue developing {dim}. Your growth in this area is stable and promising.",
            recDecline: "Pay attention to {dim}. A decline is observed, consider returning to practice in this area.",
            recStable: "Your profile is stable. This is a great foundation for further development. Try new learning formats.",
            keyInsights: "Key Insights",
            strategicName: "Strategic Thinking",
            explorerName: "Exploration Interest",
            individualismName: "Individualism",
            rationalityName: "Rationality",
            adaptationName: "Adaptability",
            meaningName: "Search for Meaning",
            intuitionName: "Intuition",
            utilityName: "Utility",
            resultsDownloaded: "Results downloaded successfully",
            // Diploma info
            diplomaBadge: "Thesis Project",
            diplomaTitle: "Development of a user personality preference and growth direction analysis system based on interactive choice scenarios",
            diplomaTech: "Built with HTML, CSS, JavaScript",
            diplomaAuthor: "Author: Akhmedyanov Salamat, KPO 9/22-2",
            diplomaDate: "2026",
            // Accessibility (about page)
            accessTitle: "Accessibility Settings",
            accessSubtitle: "We strive to make the system as accessible as possible for all users.",
            contrastLabel: "Contrast",
            contrastDesc: "High contrast mode support for people with visual impairments.",
            textSizeLabel: "Text Size",
            textSizeDesc: "Ability to scale the interface and change the font size.",
            audioFeedbackLabel: "Audio Feedback",
            audioFeedbackDesc: "Audio confirmation of actions and voicing of important state changes.",
            readingLabel: "Read Results Aloud",
            readingDesc: "Speech synthesis for automatic reading of your results and recommendations.",
            audioSystemLabel: "Audio System",
            audioSystemDesc: "Audio confirmation of actions and speech synthesis for reading results aloud."
        },
        kk: {
            keepItUp: "Жарайсыз!",
            payAttention: "Назар аударыңыз",
            recGrowth: "{dim} бағытын дамытуды жалғастырыңыз. Бұл саладағы өсуіңіз тұрақты және келешегі зор.",
            recDecline: "{dim} бағытына назар аударыңыз. Төмендеу байқалады, осы саладағы тәжірибеге қайта оралу керек.",
            recStable: "Сіздің профиліңіз тұрақты. Бұл одан әрі даму үшін тамаша негіз. Жаңа оқу форматтарын байқап көріңіз.",
            keyInsights: "Негізгі инсайттар",
            strategicName: "Стратегиялық ойлау",
            explorerName: "Зерттеу қызығушылығы",
            individualismName: "Индивидуализм",
            rationalityName: "Рационалдылық",
            adaptationName: "Бейімделгіштік",
            meaningName: "Мағына іздеу",
            intuitionName: "Интуиция",
            utilityName: "Практикалық",
            resultsDownloaded: "Нәтижелер сәтті жүктелді",
            // Diploma info
            diplomaBadge: "Дипломдық жоба",
            diplomaTitle: "Интерактивті таңдау сценарийлері негізінде пайдаланушының жеке қалаулары мен даму бағыттарын талдау жүйесін әзірлеу",
            diplomaTech: "HTML, CSS, JS бағдарламалау тілдерінде",
            diplomaAuthor: "Авторы: Ахмедьянов Саламат КПО 9/22-2",
            diplomaDate: "2026 жыл",
            // Accessibility (about page)
            accessTitle: "Қолжетімділік параметрлері",
            accessSubtitle: "Біз жүйені барлық пайдаланушылар үшін барынша қолжетімді етуге тырысамыз.",
            contrastLabel: "Контрасттылық",
            contrastDesc: "Көру қабілеті бұзылған адамдар үшін жоғары контраст режимін қолдау.",
            textSizeLabel: "Мәтін өлшемі",
            textSizeDesc: "Интерфейсті масштабтау және қаріп өлшемін өзгерту мүмкіндігі.",
            audioFeedbackLabel: "Дыбыстық сүйемелдеу",
            audioFeedbackDesc: "Әрекеттерді дыбыстық растау және маңызды күй өзгерістерін дыбыстау.",
            readingLabel: "Нәтижелерді дауыстап оқу",
            readingDesc: "Нәтижелер мен ұсыныстарды автоматты түрде оқу үшін сөйлеу синтезі.",
            audioSystemLabel: "Аудиожүйе",
            audioSystemDesc: "Әрекеттерді дыбыстық растау және нәтижелерді дауыстап оқу үшін сөйлеу синтезі."
        }
    };

    function applyPatch() {
        if (window.i18n && window.i18n.translations) {
            console.log('Applying localization patch...');
            Object.keys(patches).forEach(lang => {
                if (!window.i18n.translations[lang]) {
                    window.i18n.translations[lang] = {};
                }
                Object.assign(window.i18n.translations[lang], patches[lang]);
            });
            console.log('Localization patch applied successfully.');

            // Re-apply translations to all data-i18n elements in the DOM
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const translated = window.i18n.t(key);
                if (translated && translated !== key) {
                    el.textContent = translated;
                }
            });
        } else {
            console.log('Waiting for i18n to load...');
            setTimeout(applyPatch, 100);
        }
    }

    // Try to apply immediately or wait
    if (document.readyState === 'complete') {
        applyPatch();
    } else {
        window.addEventListener('load', applyPatch);
    }

    // Also try strictly after a delay to ensure it overrides
    setTimeout(applyPatch, 500);
})();
