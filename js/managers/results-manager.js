/**
 * Results Manager
 * Handles calculation of test results, AI analysis coordination, and profile data management.
 */
class ResultsManager {
    constructor(app) {
        this.app = app;
    }

    // Dependencies
    get analyzer() { return this.app.analyzer; }
    get aiAnalyzer() { return this.app.aiAnalyzer; }
    get testReliability() { return this.app.testReliability; }
    get statisticalValidation() { return this.app.statisticalValidation; }
    get storage() { return this.app.storage; }
    get auth() { return this.app.auth; }
    get aiCoach() { return this.app.aiCoach; }
    get i18n() { return this.app.i18n; }

    /**
     * Generate Full Results
     * Calculates scores, profile, stats, and triggers AI analysis.
     * @returns {Object} Initial results object (without full AI analysis yet)
     */
    generateResults() {
        let profile, scores, normalizedScores, stats, qualityMetrics = null;

        try {
            // 1. Generate Basic/Advanced Profile
            // Check if we are in advanced mode or if analyzer supports it
            const isAdvanced = this.app.testMode === 'advanced' || (this.analyzer && typeof this.analyzer.generateAdvancedProfile === 'function');

            if (isAdvanced && typeof this.analyzer.generateAdvancedProfile === 'function') {
                profile = this.analyzer.generateAdvancedProfile();
                scores = this.analyzer.getPercentageScores();
                normalizedScores = this.analyzer.getNormalizedScores();
                stats = this.analyzer.getAdvancedStatistics ? this.analyzer.getAdvancedStatistics() : this.analyzer.getStatistics();
            } else {
                profile = this.analyzer.generateProfile();
                scores = this.analyzer.getPercentageScores();
                normalizedScores = this.analyzer.getNormalizedScores();
                stats = this.analyzer.getStatistics();
            }

            // 2. Quality & Reliability Checks
            if (this.testReliability && this.statisticalValidation && this.app.qualityControl) {
                // Reliability
                const scenariosData = { scenarios: this.app.scenarios, dimensions: this.analyzer.dimensions };
                const userId = this.auth.getCurrentUser()?.id || 'anonymous';

                const reliabilityReport = this.testReliability.calculateFullReliabilityReport(
                    this.analyzer.choices,
                    scenariosData,
                    userId
                );

                // Statistical Validation
                const statisticalReport = this.statisticalValidation.fullStatisticalValidation(
                    normalizedScores,
                    reliabilityReport.internalConsistency,
                    Object.values(normalizedScores)
                );

                // Update Population Data
                this.statisticalValidation.updatePopulationData(normalizedScores);

                // Save Test-Retest Data
                if (this.testReliability && userId !== 'anonymous') {
                    this.testReliability.saveTestRetestData({
                        normalizedScores: normalizedScores,
                        choices: this.analyzer.choices
                    }, userId);
                }

                qualityMetrics = {
                    reliability: reliabilityReport,
                    statistical: statisticalReport,
                    quality: reliabilityReport.quality
                };
            }

            // 3. Prepare Result Object
            const results = {
                profile: profile,
                scores: scores,
                normalizedScores: normalizedScores,
                statistics: stats,
                choices: this.analyzer.choices,
                qualityMetrics: qualityMetrics,
                timestamp: Date.now()
            };

            // 4. Trigger Async AI Analysis & Storage
            this.processAsyncResults(results);

            return results;

        } catch (error) {
            console.error('Error calculating results:', error);
            throw error;
        }
    }

    /**
     * Process Async Results (AI Analysis & Storage)
     */
    async processAsyncResults(results) {
        // Use setTimeout to not block UI rendering
        setTimeout(async () => {
            try {
                let aiAnalysis = null;

                // Run AI Analysis
                if (this.aiAnalyzer) {
                    aiAnalysis = await this.aiAnalyzer.deepAnalyze(
                        results.normalizedScores,
                        results.profile,
                        results.choices
                    );
                    results.aiAnalysis = aiAnalysis;
                }

                // Save to Local Storage
                if (this.storage) {
                    this.storage.saveResults(results);
                }

                // Save to User Profile
                const currentUser = this.auth.getCurrentUser();
                if (currentUser) {
                    this.auth.saveTestResults(results);
                }

                // Initialize AI Coach
                if (this.aiCoach) {
                    this.aiCoach.initialize({
                        name: currentUser ? currentUser.username : 'Guest',
                        results: results
                    });
                }

                // Notify UI to update with AI data
                if (this.app.ui && this.app.ui.updateResultsWithAI) {
                    this.app.ui.updateResultsWithAI(results);
                }

            } catch (error) {
                console.error('Async results processing failed:', error);
            }
        }, 100);
    }

    /**
     * Get User Profile Data
     */
    getProfileData() {
        const user = this.auth.getCurrentUser();
        if (!user) return null;

        const history = this.auth.getTestHistory();
        const evolutionReport = this.auth.getEvolutionReport();

        return {
            user,
            history,
            evolutionReport
        };
    }

    /**
     * Download Results
     * @param {string} format 'json', 'html', 'text'
     */
    downloadResults(format = 'html') {
        const profile = this.analyzer.generateProfile();
        const scores = this.analyzer.getPercentageScores();
        const normalizedScores = this.analyzer.getNormalizedScores();
        const stats = this.analyzer.getStatistics();
        // Assuming we can get current AI analysis from storage or cached state
        // For now generating basic structure

        const reportData = {
            title: 'Отчёт о прохождении системы самопознания',
            date: new Date().toLocaleString('ru-RU'),
            statistics: stats,
            profile: profile,
            scores: scores,
            normalizedScores: normalizedScores,
            // aiAnalysis: ... (might need to pass this in or fetch from last result)
        };

        if (this.app.reportGenerator) {
            this.app.reportGenerator.downloadReport(reportData, format);
        } else {
            // Simple fallback
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `personality-report-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
}
