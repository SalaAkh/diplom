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
     * @param {string} format 'json', 'html', 'text', 'pdf'
     */
    downloadResults(format = 'html') {
        const profile = this.analyzer.generateProfile();
        const scores = this.analyzer.getPercentageScores();
        const normalizedScores = this.analyzer.getNormalizedScores();
        // Получаем расширенную статистику, включая геймификацию
        const analyzerStats = this.analyzer.getStatistics();
        const gamificationStats = (this.app.gamification && typeof this.app.gamification.getUserProgress === 'function')
            ? this.app.gamification.getUserProgress()
            : {};
        const stats = { ...analyzerStats, ...gamificationStats };

        // Use the shared instance from app.js to ensure consistency
        let reportGen = this.app.reportGenerator;

        // Fallback: If not found, try to create a new one from global window.ReportGenerator
        if (!reportGen && typeof window !== 'undefined' && window.ReportGenerator) {
            console.log('ResultsManager: Creating new ReportGenerator instance');
            reportGen = new window.ReportGenerator();
            this.app.reportGenerator = reportGen;
        }

        const lang = window.i18n ? window.i18n.getLanguage() : 'ru';
        const user = this.auth ? this.auth.getCurrentUser() : null;
        let filename = null;

        if (user) {
            const history = this.auth.getTestHistory();
            if (history && history.length > 0) {
                const lastTest = history[history.length - 1];
                const safeTitle = (lastTest.title || `Test #${history.length}`).replace(/[^a-zа-яё0-9\s-]/gi, '_');
                const dateStart = new Date().toISOString().split('T')[0];
                filename = `${user.username}_${safeTitle}_${dateStart}_${lang}.${format === 'pdf' ? 'pdf' : format === 'json' ? 'json' : format === 'text' ? 'txt' : 'html'}`;
            }
        }

        if (!filename) {
            filename = `personality-report-${new Date().toISOString().split('T')[0]}_${lang}.${format === 'pdf' ? 'pdf' : format === 'json' ? 'json' : format === 'text' ? 'txt' : 'html'}`;
        }

        const t = (key) => (window.t ? window.t(key) : key);

        // Ensure profile has user name
        if (user && profile) {
            profile.name = user.name || user.username;
            profile.username = user.username;
        }

        const reportData = {
            title: t('reportTitle'),
            userLogin: user ? user.username : (window.t ? window.t('navGuest') : 'Guest'),
            date: new Date().toLocaleString(lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US'),
            statistics: stats,
            profile: profile,
            scores: scores,
            normalizedScores: normalizedScores,
            aiAnalysis: null
        };

        // Try to get AI analysis from history if available
        if (user) {
            const history = this.auth.getTestHistory();
            if (history && history.length > 0) {
                const lastTest = history[history.length - 1];
                if (lastTest.aiAnalysis) {
                    reportData.aiAnalysis = lastTest.aiAnalysis;
                }
            }
        }

        // Попытка захватить изображение графика для отчета
        if (this.app.visualizer && this.app.visualizer.charts && this.app.visualizer.charts.radar) {
            try {
                // Используем белый фон для экспорта изображения, так как PDF белый
                // Но Chart.js toBase64Image сохраняет текущее состояние canvas.
                // Если canvas прозрачный, он будет прозрачным и в PDF.
                reportData.chartImage = this.app.visualizer.charts.radar.toBase64Image();
            } catch (e) {
                console.warn('Не удалось захватить изображение графика:', e);
            }
        }

        if (reportGen) {
            reportGen.downloadReport(reportData, format, filename);
        } else {
            console.error('CRITICAL: ReportGenerator instance not found. Cannot generate report.');
            alert('Ошибка: Модуль генерации отчетов не загружен.');
        }
    }
}
