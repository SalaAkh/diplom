/**
 * Career Service
 * Determines career compatibility based on personality profile.
 * 
 * Logic: Matches user's dimension scores against ideal profiles for various professions.
 * 
 * @author Salamat Akhmedyanov
 */
class CareerService {
    constructor() {
        this.careers = this.defineCareers();
    }

    /**
     * Define career database with required personality profiles.
     * Weights: -1 to 1 (negative means the trait should be low, positive means high)
     */
    defineCareers() {
        return [
            {
                id: 'software_engineer',
                title: { ru: 'Разработчик ПО', kk: 'Бағдарламалық жасақтама әзірлеушісі', en: 'Software Engineer' },
                category: 'IT',
                weights: { rationality: 0.8, utility: 0.6, individualism: 0.4, intuition: -0.2 }
            },
            {
                id: 'product_manager',
                title: { ru: 'Product Manager', kk: 'Өнім менеджері', en: 'Product Manager' },
                category: 'IT',
                weights: { strategic: 0.7, adaptation: 0.6, explorer: 0.5, rationality: 0.4 }
            },
            {
                id: 'ux_designer',
                title: { ru: 'UX/UI Дизайнер', kk: 'UX/UI Дизайнері', en: 'UX/UI Designer' },
                category: 'Creative',
                weights: { intuition: 0.7, adaptation: 0.5, explorer: 0.6, utility: 0.3 }
            },
            {
                id: 'data_scientist',
                title: { ru: 'Data Scientist', kk: 'Деректер ғалымы', en: 'Data Scientist' },
                category: 'IT',
                weights: { rationality: 0.9, explorer: 0.6, strategic: 0.5 }
            },
            {
                id: 'entrepreneur',
                title: { ru: 'Предприниматель', kk: 'Кәсіпкер', en: 'Entrepreneur' },
                category: 'Business',
                weights: { strategic: 0.8, individualism: 0.7, adaptation: 0.7, explorer: 0.6 }
            },
            {
                id: 'doctor',
                title: { ru: 'Врач', kk: 'Дәрігер', en: 'Doctor' },
                category: 'Medicine',
                weights: { rationality: 0.6, adaptation: 0.7, utility: 0.5, intuition: 0.4 }
            },
            {
                id: 'psychologist',
                title: { ru: 'Психолог', kk: 'Психолог', en: 'Psychologist' },
                category: 'Medicine',
                weights: { intuition: 0.8, meaning: 0.7, adaptation: 0.5 }
            },
            {
                id: 'marketer',
                title: { ru: 'Маркетолог', kk: 'Маркетолог', en: 'Marketer' },
                category: 'Business',
                weights: { explorer: 0.7, intuition: 0.6, adaptation: 0.5, strategic: 0.4 }
            },
            {
                id: 'teacher',
                title: { ru: 'Преподаватель', kk: 'Оқытушы', en: 'Teacher' },
                category: 'Education',
                weights: { meaning: 0.8, adaptation: 0.5, rationality: 0.4 }
            },
            {
                id: 'researcher',
                title: { ru: 'Ученый-исследователь', kk: 'Ғалым-зерттеуші', en: 'Researcher' },
                category: 'Science',
                weights: { explorer: 0.9, rationality: 0.7, individualism: 0.5 }
            },
            {
                id: 'lawyer',
                title: { ru: 'Юрист', kk: 'Заңгер', en: 'Lawyer' },
                category: 'Law',
                weights: { rationality: 0.8, strategic: 0.5, individualism: 0.4 }
            },
            {
                id: 'artist',
                title: { ru: 'Художник/Артист', kk: 'Суретші/Әртіс', en: 'Artist' },
                category: 'Creative',
                weights: { intuition: 0.9, individualism: 0.7, meaning: 0.6, rationality: -0.3 }
            }
        ];
    }

    /**
     * Calculate compatibility for all careers.
     * @param {Object} userScores Normalized scores (e.g. { rationality: 0.5, ... })
     * @returns {Array} Sorted list of careers with match percentage.
     */
    calculateAll(userScores) {
        return this.careers.map(career => {
            const match = this.calculateMatch(userScores, career.weights);
            return {
                ...career,
                match: match,
                matchPercent: Math.round(match * 100)
            };
        }).sort((a, b) => b.match - a.match);
    }

    /**
     * Calculate similarity between user profile and career profile (Cosine Similarity or Weighted Distance).
     * Here using a simplified weighted difference approach.
     */
    calculateMatch(userScores, weights) {
        let totalWeight = 0;
        let scoreSum = 0;

        for (const [dim, weight] of Object.entries(weights)) {
            const userScore = userScores[dim] || 0;
            const absWeight = Math.abs(weight);

            // If weight is positive, we want high user score.
            // If weight is negative, we want low user score.

            let termScore = 0;
            if (weight > 0) {
                // Closer to 1 is better
                termScore = 1 - Math.abs(userScore - 1); // logic: if score is 1, dist is 0, result 1. if score 0, dist 1, result 0.
                // Alternative: just use userScore? 
                // Let's use distance: 1 - |Required - Actual|
                // But "Required" isn't exactly 1.0. It's "High".
                // Let's assume weight is the target value.
                termScore = 1 - Math.abs(userScore - weight); // Simple distance
            } else {
                // Negative weight means we want LOW score.
                // E.g. weight -0.5. We want score around 0 or -1? 
                // Let's simplify: weight indicates direction and importance.
                // If weight 0.8, we want 1.0. Distance = |1.0 - User| * 0.8?

                // Let's use correlation-like logic.
                // Score contribution = 1 - distance
            }

            // Simplest robust logic:
            // 1 - |UserScore - TargetScore|
            // Where TargetScore is usually 1.0 for positive traits, but let's say traits in weights are "Ideal".
            // So if weights.rationality is 0.8, ideally user has 0.8.

            const diff = Math.abs(userScore - (weight > 0 ? 0.8 : -0.5)); // Target 0.8 for high, -0.5 for low?
            // Actually, let's treat weights as Ideal Vector.

            scoreSum += (1 - Math.abs(userScore - weight)) * absWeight;
            totalWeight += absWeight;
        }

        if (totalWeight === 0) return 0;

        let match = scoreSum / totalWeight;
        // Normalize to 0-1 range roughly
        return Math.max(0, Math.min(1, match));
    }

    getTopCareers(userScores, limit = 3) {
        const all = this.calculateAll(userScores);
        return all.slice(0, limit);
    }
}

// Global instance
window.careerService = new CareerService();
