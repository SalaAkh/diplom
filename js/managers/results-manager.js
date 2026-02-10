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
            console.error('Нәтижелерді есептеу қатесі (Error calculating results):', error);
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
                console.error('Асинхронды нәтижелерді өңдеу сәтсіз аяқталды (Async results processing failed):', error);
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
     * @param {string} format 'html', 'text'
     */
    downloadResults(format = 'html') {
        // 1. Determine Data Source
        // Use activeResults if available (viewing history or current test)
        // Otherwise fallback to live analyzer data
        const sourceData = this.app.activeResults || {};

        const profile = sourceData.profile || this.analyzer.generateProfile();
        const scores = sourceData.scores || this.analyzer.getPercentageScores();
        const normalizedScores = sourceData.normalizedScores || this.analyzer.getNormalizedScores();

        // 2. Prepare Statistics
        let stats = sourceData.statistics;
        if (!stats) {
            // Fallback: Calculate fresh statistics
            stats = this.analyzer.getStatistics();
        }

        // 3. Generate HTML Report
        try {
            // Lazy load ReportGenerator if not present in app
            // Or use global if not registered
            let generator;
            if (this.app.reportGenerator) {
                generator = this.app.reportGenerator;
            } else if (window.ReportGenerator) {
                generator = new window.ReportGenerator(this.app);
                // Register for future use
                this.app.reportGenerator = generator;
            }

            if (generator) {
                const htmlContent = generator.generateHTML({
                    profile,
                    scores,
                    normalizedScores,
                    statistics: stats
                });

                const filename = `personality-results-${Date.now()}.html`;
                generator.download(filename, htmlContent);

                // Toast notification
                if (this.app.toast) {
                    this.app.toast.show(window.t ? window.t('resultsDownloaded') || 'Результаты скачаны' : 'Result downloaded', 'success');
                }
            } else {
                console.error('ReportGenerator not available');
                alert('Export service not available');
            }

        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed: ' + error.message);
        }
    }
}

// Export to global scope for non-module usage
if (typeof window !== 'undefined') {
    window.ResultsManager = ResultsManager;
}
