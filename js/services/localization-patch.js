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
            utilityName: "Практичность"
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
            utilityName: "Utility"
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
            utilityName: "Практикалық"
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
