/**
 * Cognitive Service
 * Analyzes cognitive styles (VAK: Visual, Auditory, Kinesthetic)
 * 
 * @author Salamat Akhmedyanov
 */
class CognitiveService {
    constructor() {
        this.questions = window.COGNITIVE_QUESTIONS || [];
    }

    /**
     * Analyze test results
     * @param {Array} answers Array of answer objects { choice: { id, type } }
     */
    analyze(answers) {
        if (!answers || answers.length === 0) return null;

        const counts = { visual: 0, auditory: 0, kinesthetic: 0 };
        let total = 0;

        answers.forEach(ans => {
            if (ans && ans.choice && ans.choice.type) {
                if (counts[ans.choice.type] !== undefined) {
                    counts[ans.choice.type]++;
                    total++;
                }
            }
        });

        if (total === 0) return null;

        const results = {
            visual: Math.round((counts.visual / total) * 100),
            auditory: Math.round((counts.auditory / total) * 100),
            kinesthetic: Math.round((counts.kinesthetic / total) * 100),
        };

        // Determine dominant style
        let dominant = 'visual';
        let maxVal = results.visual;

        if (results.auditory > maxVal) {
            dominant = 'auditory';
            maxVal = results.auditory;
        }
        if (results.kinesthetic > maxVal) {
            dominant = 'kinesthetic';
            maxVal = results.kinesthetic;
        }

        return {
            breakdown: results,
            dominant: dominant,
            details: this.getStyleDetails(dominant)
        };
    }

    getStyleDetails(style) {
        const details = {
            visual: {
                title: { ru: 'Визуал', kk: 'Визуал', en: 'Visual' },
                description: {
                    ru: 'Вы лучше всего воспринимаете информацию через зрение. Вам помогают графики, диаграммы и чтение.',
                    kk: 'Сіз ақпаратты көзбен көру арқылы жақсы қабылдайсыз. Сізге графиктер мен диаграммалар көмектеседі.',
                    en: 'You perceive information best through sight. Graphs, diagrams, and reading help you.'
                },
                tips: {
                    ru: 'Используйте стикеры, маркеры и интеллект-карты для обучения.',
                    kk: 'Оқу үшін стикерлер, маркерлер және интеллект-карталарды қолданыңыз.',
                    en: 'Use stickers, markers, and mind maps for learning.'
                }
            },
            auditory: {
                title: { ru: 'Аудиал', kk: 'Аудиал', en: 'Auditory' },
                description: {
                    ru: 'Вы лучше усваиваете информацию на слух. Обсуждения и лекции для вас наиболее эффективны.',
                    kk: 'Сіз ақпаратты есту арқылы жақсы қабылдайсыз. Талқылаулар мен лекциялар сіз үшін тиімді.',
                    en: 'You absorb information best by hearing. Discussions and lectures are most effective for you.'
                },
                tips: {
                    ru: 'Записывайте лекции на диктофон и обсуждайте материал с друзьями.',
                    kk: 'Лекцияларды диктофонға жазып, материалды достарыңызбен талқылаңыз.',
                    en: 'Record lectures and discuss material with friends.'
                }
            },
            kinesthetic: {
                title: { ru: 'Кинестетик', kk: 'Кинестетик', en: 'Kinesthetic' },
                description: {
                    ru: 'Вы познаете мир через практику и ощущения. Вам нужно "потрогать" и сделать самому.',
                    kk: 'Сіз әлемді тәжірибе мен сезім арқылы танисыз. Сізге "ұстап көру" және өзіңіз жасау маңызды.',
                    en: 'You learn through practice and sensations. You need to "touch" and do it yourself.'
                },
                tips: {
                    ru: 'Используйте модели, карточки и делайте частые перерывы для движения.',
                    kk: 'Модельдерді, карточкаларды қолданыңыз және қозғалыс үшін жиі үзіліс жасаңыз.',
                    en: 'Use models, flashcards, and take frequent breaks to move.'
                }
            }
        };
        return details[style];
    }
}

window.cognitiveService = new CognitiveService();
