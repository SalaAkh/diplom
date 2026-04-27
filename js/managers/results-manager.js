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
            console.error('ÐÓ™Ñ‚Ð¸Ð¶ÐµÐ»ÐµÑ€Ð´Ñ– ÐµÑÐµÐ¿Ñ‚ÐµÑƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error calculating results):', error);
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
                    try {
                        aiAnalysis = await this.aiAnalyzer.deepAnalyze(
                            results.normalizedScores,
                            results.profile,
                            results.choices
                        );
                        results.aiAnalysis = aiAnalysis;
                    } catch (e) {
                        console.warn('AI Analysis error', e);
                    }
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
                console.error('ÐÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð´Ñ‹ Ð½Ó™Ñ‚Ð¸Ð¶ÐµÐ»ÐµÑ€Ð´Ñ– Ó©Ò£Ð´ÐµÑƒ ÑÓ™Ñ‚ÑÑ–Ð· Ð°ÑÒ›Ñ‚Ð°Ð»Ð´Ñ‹ (Async results processing failed):', error);
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
        const t = this.i18n?.t ? this.i18n.t.bind(this.i18n) : null;

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
                    this.app.toast.show(window.t ? window.t('resultsDownloaded') || 'Results downloaded' : 'Results downloaded', 'success');
                }
            } else {
                console.error('ReportGenerator not available');
                alert((t && t('exportServiceUnavailable')) || 'Export service is unavailable.');
            }

        } catch (error) {
            console.error('Export failed:', error);
            const message = error?.message || (t ? t('unknownError') : 'Unknown error');
            alert((t && t('exportFailed', { message })) || `Export failed: ${message}`);
        }
    }

    /**
     * Download Cognitive Test Results
     * @param {Object} results - Cognitive test results
     */
    downloadCognitiveResults(results) {
        if (!results) return;

        const t = this.i18n.t.bind(this.i18n);

        try {
            const lang = this.i18n.getLanguage();
            const details = results.details || {};
            const title = details.title && details.title[lang] ? details.title[lang] : (results.dominant || t('cognitiveTest'));
            const desc = details.description && details.description[lang] ? details.description[lang] : '';
            const tips = details.tips && details.tips[lang] ? details.tips[lang] : '';

            // --- Defensive: handle missing breakdown ---
            const breakdown = results.breakdown || {};
            const visual = typeof breakdown.visual === 'number' ? breakdown.visual : 0;
            const auditory = typeof breakdown.auditory === 'number' ? breakdown.auditory : 0;
            const kinesthetic = typeof breakdown.kinesthetic === 'number' ? breakdown.kinesthetic : 0;

            const htmlContent = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t('cognitiveTest')} - ${t('resultsTitle')}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f5f5f5; padding: 30px 20px; }
        .page-wrap { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #9333ea, #c026d3); color: white; text-align: center; padding: 40px 30px 30px; }
        .header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
        .header .date { opacity: 0.85; font-size: 0.95rem; }
        .content { padding: 30px; }
        .result-card { background: #faf5ff; border-radius: 12px; padding: 28px; margin-bottom: 24px; border: 1px solid #e9d5ff; }
        .dominant-title { font-size: 1.5rem; font-weight: 700; color: #7c3aed; margin-bottom: 10px; }
        .dominant-desc { color: #555; font-size: 1rem; line-height: 1.7; }
        .breakdown { display: flex; justify-content: space-around; margin-top: 28px; gap: 16px; }
        .breakdown-item { text-align: center; flex: 1; background: white; border-radius: 10px; padding: 16px 10px; border: 1px solid #e9d5ff; }
        .breakdown-label { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #7c3aed; margin-bottom: 6px; }
        .breakdown-value { font-size: 2rem; font-weight: 700; color: #9333ea; }
        .bar-container { background: #e9d5ff; height: 8px; border-radius: 4px; margin-top: 8px; overflow: hidden; }
        .bar-fill { height: 100%; background: linear-gradient(90deg, #9333ea, #c026d3); border-radius: 4px; }
        .tips { background: #f0f4f8; padding: 24px; border-radius: 12px; border-left: 5px solid #9333ea; margin-bottom: 24px; }
        .tips h3 { color: #7c3aed; margin-bottom: 10px; font-size: 1.1rem; }
        .tips p { color: #444; font-size: 0.97rem; line-height: 1.8; }
        .footer { text-align: center; padding: 24px 30px; background: #f8f5ff; border-top: 1px solid #e9d5ff; color: #888; font-size: 0.85rem; }
        .footer p { margin-bottom: 4px; }
        .footer .brand { color: #9333ea; font-weight: 600; }
    </style>
</head>
<body>
    <div class="page-wrap">
        <div class="header">
            <h1>${t('cognitiveTest')}</h1>
            <div class="date">${new Date().toLocaleDateString(lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div class="content">
            <div class="result-card">
                <h2 class="dominant-title">${title}</h2>
                <p class="dominant-desc">${desc}</p>
                <div class="breakdown">
                    <div class="breakdown-item">
                        <div class="breakdown-label">${t('cognitiveVisual')}</div>
                        <div class="breakdown-value">${visual}%</div>
                        <div class="bar-container"><div class="bar-fill" style="width: ${visual}%"></div></div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">${t('cognitiveAuditory')}</div>
                        <div class="breakdown-value">${auditory}%</div>
                        <div class="bar-container"><div class="bar-fill" style="width: ${auditory}%"></div></div>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">${t('cognitiveKinesthetic')}</div>
                        <div class="breakdown-value">${kinesthetic}%</div>
                        <div class="bar-container"><div class="bar-fill" style="width: ${kinesthetic}%"></div></div>
                    </div>
                </div>
            </div>
            <div class="tips">
                <h3>${t('learningTips')}</h3>
                <p>${tips}</p>
            </div>
        </div>
        <div class="footer">
            <p>${t('reportGeneratedBy')}</p>
            <p>Akhmedyanov Salamat, KPO 9/22-2 &nbsp;&bull;&nbsp; ${t('project')}</p>
            <p class="brand">&copy; 2026 ${t('appName')}</p>
        </div>
    </div>
</body>
</html>`;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cognitive-style-${Date.now()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Toast notification
            if (this.app.toast) {
                this.app.toast.show(t('resultsDownloaded') || 'Results downloaded', 'success');
            }

        } catch (error) {
            console.error('Cognitive export failed:', error);
            const message = error?.message || t('unknownError');
            alert(t('exportFailed', { message }) || `Export failed: ${message}`);
        }
    }
}

// Export to global scope for non-module usage
if (typeof window !== 'undefined') {
    window.ResultsManager = ResultsManager;
}


