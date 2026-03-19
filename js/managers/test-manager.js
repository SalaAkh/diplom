/**
 * Test Manager
 * Handles the logic and state of the personality test (both Basic and Advanced).
 * Manages loading data, tracking progress, and recording answers.
 */
class TestManager {
    constructor(app) {
        this.app = app;
        this.scenarios = [];
        this.advancedQuestions = [];
        this.completedScenarios = [];
        this.cognitiveAnswers = [];
        this.currentScenarioIndex = 0;
        this.currentQuestionIndex = 0;
        this.testMode = null; // 'basic' or 'advanced' or 'cognitive'
        this.currentScenarioStartTime = null;
        this.currentSituationalStep = {}; // {questionId: stepIndex}
        this.isTransitioning = false; // Flag to prevent rapid clicking
    }

    /**
     * Reset test state
     */
    reset() {
        this.currentScenarioIndex = 0;
        this.currentQuestionIndex = 0;
        this.completedScenarios = [];
        this.currentSituationalStep = {};
        this.cognitiveAnswers = [];
        this.testMode = null;
        this.isTransitioning = false;
    }

    /**
     * Helper to get dependencies
     */
    get analyzer() { return this.app.analyzer; }
    get storage() { return this.app.storage; }
    get ui() { return this.app.ui; }

    /**
     * Load scenarios data ( Basic or Advanced)
     */
    async loadData() {
        if (this.scenarios && this.scenarios.length > 0) return;

        try {
            if (typeof window === 'undefined' || typeof window.SCENARIOS_DATA === 'undefined') {
                console.log('scenarios-data.js динамикалық түрде жүктелуде (Dynamically loading scenarios-data.js)');
                await import('../data/scenarios-data.js');
            }
            if (window.SCENARIOS_DATA && window.SCENARIOS_DATA.scenarios) {
                this.scenarios = window.SCENARIOS_DATA.scenarios;
                this.app.scenarios = this.scenarios;
            } else {
                throw new Error('SCENARIOS_DATA is missing after import');
            }
        } catch (error) {
            console.error('Failed to load scenarios-data.js dynamically:', error);
            // Fallback to app.scenarios if available
            if (this.app.scenarios && this.app.scenarios.length > 0) {
                this.scenarios = this.app.scenarios;
            } else {
                this.scenarios = [];
            }
        }
    }

    /**
     * Load Advanced Scenarios
     */
    async loadAdvancedData() {
        try {
            let data = null;

            if (typeof window !== 'undefined' && window.ADVANCED_SCENARIOS_DATA && window.ADVANCED_SCENARIOS_DATA.questions) {
                console.log('window.ADVANCED_SCENARIOS_DATA қолданылуда (Using window.ADVANCED_SCENARIOS_DATA)');
                data = window.ADVANCED_SCENARIOS_DATA;
            } else {
                console.log('advanced-scenarios-data.js динамикалық түрде жүктелуде (Dynamically loading advanced-scenarios-data.js)');
                try {
                    await import('../data/advanced-scenarios-data.js');
                    if (window.ADVANCED_SCENARIOS_DATA) {
                        data = window.ADVANCED_SCENARIOS_DATA;
                    } else {
                        throw new Error('ADVANCED_SCENARIOS_DATA not found after import');
                    }
                } catch (importError) {
                    console.error('Dynamic import failed, falling back to fetch:', importError);
                    const response = await fetch('data/advanced-scenarios.json');
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    data = await response.json();
                }
            }

            if (!data || !data.questions) throw new Error('Invalid advanced test data structure.');

            this.advancedQuestions = data.questions;
            return data;
        } catch (error) {
            console.error('Error loading advanced data:', error);
            throw error;
        }
    }

    /**
     * Start Basic Test
     */
    async startBasicTest() {
        this.testMode = 'basic';
        this.currentScenarioIndex = 0;
        this.currentQuestionIndex = 0;
        this.completedScenarios = [];

        // Load scenarios dynamically first
        await this.loadData();

        // Ensure we use the Basic Analyzer
        this.app.analyzer = new PersonalityAnalyzer({
            scenarios: this.scenarios,
            dimensions: this.app.dimensions || (this.app.scenarios ? this.app.scenarios.dimensions : {})
        });

        // Reset Analyzer & Storage
        this.analyzer.reset();
        if (this.storage) this.storage.clearAll();

        this.app.state = 'testing';
        this.showNext();
    }

    /**
     * Start Advanced Test
     */
    async startAdvancedTest() {
        try {
            // Load data if not loaded
            if (!this.advancedQuestions || this.advancedQuestions.length === 0) {
                const data = await this.loadAdvancedData();
                // Init Advanced Analyzer if needed
                if (typeof AdvancedPersonalityAnalyzer !== 'undefined') {
                    this.app.analyzer = new AdvancedPersonalityAnalyzer(data);
                }
            }

            this.testMode = 'advanced';
            this.currentScenarioIndex = 0;
            this.currentQuestionIndex = 0;
            this.completedScenarios = [];

            // Reset Storage
            if (this.storage) this.storage.clearAll();

            this.app.state = 'testing';
            this.showNext();

        } catch (error) {
            console.error('Failed to start advanced test:', error);
            const t = this.app?.i18n?.t.bind(this.app.i18n);
            alert((t && t('failedToLoadAdvancedTestData')) || 'Failed to load advanced test data.');
            this.app.showTestTypeSelection();
        }
    }

    /**
     * Start Cognitive Test
     */
    async startCognitiveTest() {
        this.testMode = 'cognitive';
        this.currentQuestionIndex = 0;
        this.cognitiveAnswers = [];

        if (typeof window === 'undefined' || !window.COGNITIVE_QUESTIONS) {
            console.log('cognitive-test-data.js динамикалық түрде жүктелуде (Dynamically loading cognitive-test-data.js)');
            try {
                await import('../data/cognitive-test-data.js');
            } catch (error) {
                console.error('Failed to load cognitive test data:', error);
                const t = this.app?.i18n?.t.bind(this.app.i18n);
                alert((t && t('testDataNotLoaded')) || 'Test data is not loaded.');
                return;
            }
        }


        // Try to restore progress
        const savedProgress = this.storage.loadProgress();
        if (savedProgress && (savedProgress.testMode === 'cognitive' || savedProgress.mode === 'cognitive')) {
            this.currentQuestionIndex = savedProgress.currentQuestionIndex || 0;
            this.cognitiveAnswers = savedProgress.cognitive || [];
            console.log('Restored cognitive test progress:', this.currentQuestionIndex, 'answers:', this.cognitiveAnswers.length);
        }

        this.app.state = 'testing';
        this.showNext();
    }

    /**
     * Show next question/scenario based on mode
     */
    showNext() {
        this.isTransitioning = false; // Reset transition flag to allow new input

        if (this.testMode === 'advanced') {
            this.showAdvancedQuestion();
        } else if (this.testMode === 'cognitive') {
            this.showCognitiveQuestion();
        } else {
            this.showBasicScenario();
        }
    }

    /**
     * Logic for Basic Scenario Selection
     */
    showBasicScenario() {
        // Use Dynamic Selector from App
        if (!this.app.dynamicSelector) {
            console.error('DynamicSelector not initialized');
            return;
        }

        const currentScores = this.analyzer.getNormalizedScores();
        const nextScenario = this.app.dynamicSelector.selectNextScenario(
            this.completedScenarios,
            this.analyzer.choices,
            currentScores
        );

        if (!nextScenario) {
            this.finishTest();
            return;
        }

        // Calculate progress
        const total = this.scenarios.length;
        const current = this.completedScenarios.length;
        const progress = ((current + 1) / total) * 100;

        // Delegate rendering to UI
        if (this.ui) {
            this.currentScenario = nextScenario; // Store for re-rendering
            this.ui.showScenario(nextScenario, {
                current: current + 1,
                total: total,
                percent: Math.round(progress)
            });
            this.currentScenarioStartTime = Date.now();
        }
    }

    /**
     * Logic for Cognitive Question Selection
     */
    showCognitiveQuestion() {
        const questions = window.COGNITIVE_QUESTIONS;
        if (!questions || this.currentQuestionIndex >= questions.length) {
            this.finishTest();
            return;
        }

        const question = { ...questions[this.currentQuestionIndex], type: 'cognitive' };
        const total = questions.length;
        const progress = ((this.currentQuestionIndex + 1) / total) * 100;

        if (this.ui) {
            this.ui.showQuestion(question, {
                current: this.currentQuestionIndex + 1,
                total: total,
                percent: progress
            });
        }
    }

    /**
     * Logic for Advanced Question Selection
     */
    showAdvancedQuestion() {
        if (this.currentQuestionIndex >= this.advancedQuestions.length) {
            this.finishTest();
            return;
        }

        const originalQuestion = this.advancedQuestions[this.currentQuestionIndex];
        // Shallow copy to safely inject UI state
        const question = { ...originalQuestion };

        if (question.type === 'situational') {
            question.currentStepIndex = this.currentSituationalStep[question.id] || 0;
        }

        const total = this.advancedQuestions.length;
        const progress = ((this.currentQuestionIndex + 1) / total) * 100;

        if (this.ui) {
            this.ui.showQuestion(question, {
                current: this.currentQuestionIndex + 1,
                total: total,
                percent: progress
            });
            this.currentScenarioStartTime = Date.now();
        }
    }

    /**
     * Record Answer (Basic)
     */
    recordBasicAnswer(choice, scenarioId) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        if (window.audioFeedback) window.audioFeedback.playClick();

        // Validation moved from app.js
        const choiceData = { scenarioId, choice };

        // Quality Control & Calibration logic
        if (this.app.qualityControl && this.currentScenarioStartTime) {
            const choiceWithTime = this.app.qualityControl.addTimestamps(choiceData, this.currentScenarioStartTime);
            // Update local logic if needed
        }

        this.analyzer.recordChoice(scenarioId, choice);

        // Track completion
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        if (scenario && !this.completedScenarios.find(s => s.id === scenarioId)) {
            this.completedScenarios.push(scenario);
        }

        // Increment index BEFORE saving so we resume at the next question
        this.currentScenarioIndex++;
        this.storage.saveProgress(this.analyzer.choices, 'basic', this.currentScenarioIndex);
        this.currentScenarioStartTime = null;

        // Next
        setTimeout(() => {
            this.showNext();
        }, 500);
    }

    /**
     * Record Answer (Advanced - Scenario Type)
     */
    recordAdvancedAnswer(choice, questionId) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        if (window.audioFeedback) window.audioFeedback.playClick();

        this.analyzer.recordChoice(questionId, choice);

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.storage.saveProgress(this.analyzer.choices, this.testMode, this.currentQuestionIndex);
            this.showNext();
        }, 500);
    }

    /**
     * Record Answer (Advanced - Scale Type)
     */
    recordScaleAnswer(questionId, value) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.analyzer.recordScaleAnswer(questionId, value);

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.storage.saveProgress({
                scales: this.analyzer.scaleAnswers,
                choices: this.analyzer.choices
            }, this.testMode, this.currentQuestionIndex);
            this.showNext();
        }, 300);
    }

    /**
     * Record Answer (Advanced - Open Type)
     */
    recordOpenAnswer(questionId, text) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Analyzer doesn't store open answers in basic version, 
        // but assuming AdvancedAnalyzer does or we just store in storage
        // For now, assume AdvancedAnalyzer has a method or we fallback
        if (this.analyzer.recordOpenAnswer) {
            this.analyzer.recordOpenAnswer(questionId, text);
        }

        setTimeout(() => {
            this.currentQuestionIndex++;
            // Save progress
            this.storage.saveProgress({
                open: this.analyzer.openAnswers || {},
                choices: this.analyzer.choices
            }, this.testMode, this.currentQuestionIndex);
            this.showNext();
        }, 300);
    }

    /**
     * Record Answer (Advanced - Situational Type)
     */
    recordSituationalAnswer(questionId, stepId, choice) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        if (!this.analyzer) {
            this.isTransitioning = false;
            return;
        }

        // Record locally (if separate tracking needed) and in analyzer
        if (this.analyzer.recordSituationalAnswer) {
            this.analyzer.recordSituationalAnswer(questionId, stepId, choice);
        } else {
            console.warn('AdvancedAnalyzer missing recordSituationalAnswer');
        }

        // Check if next step or next question
        const question = this.advancedQuestions.find(q => q.id === questionId);
        if (question && question.steps) {
            const currentStepIndex = this.currentSituationalStep[questionId] || 0;

            // If there are more steps
            if (currentStepIndex + 1 < question.steps.length) {
                // Advance to next step
                this.currentSituationalStep[questionId] = currentStepIndex + 1;

                this.storage.saveProgress({
                    situational: this.analyzer.situationalAnswers,
                    choices: this.analyzer.choices
                }, this.testMode, this.currentQuestionIndex);

                // Re-render immediately for next step
                this.showNext();
            } else {
                // Finished all steps for this question
                setTimeout(() => {
                    this.currentQuestionIndex++;
                    this.storage.saveProgress({
                        situational: this.analyzer.situationalAnswers,
                        choices: this.analyzer.choices
                    }, this.testMode, this.currentQuestionIndex);
                    // Clean up step state for this question (optional, but good for replay)
                    // this.currentSituationalStep[questionId] = 0; 
                    this.showNext();
                }, 300);
            }
        } else {
            // Fallback if no steps structure (shouldn't happen for situational)
            this.currentQuestionIndex++;
            this.showNext();
        }
    }

    /**
     * Record Answer (Cognitive)
     */
    recordCognitiveAnswer(choiceId, questionId) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        if (window.audioFeedback) window.audioFeedback.playClick();

        const questions = window.COGNITIVE_QUESTIONS;
        const question = questions.find(q => q.id === questionId);

        if (question) {
            const choice = question.options.find(o => o.id === choiceId);
            this.cognitiveAnswers.push({
                questionId: questionId,
                choice: choice // Includes type
            });
        }

        setTimeout(() => {
            this.currentQuestionIndex++;
            // Save progress
            this.storage.saveProgress({
                cognitive: this.cognitiveAnswers
            }, this.testMode, this.currentQuestionIndex);
            this.showNext();
        }, 300);
    }

    /**
     * Finish Test
     */
    finishTest() {
        this.app.state = 'results';
        if (window.audioFeedback) window.audioFeedback.playSuccess();

        // Clear progress from storage since test is finished
        if (this.storage) {
            this.storage.clearAll(); // Clears 'testProgress'
            console.log('✅ Тест аяқталды, прогресс тазартылды (✅ Test finished, progress cleared)');
        }

        if (this.testMode === 'cognitive') {
            if (this.app.showCognitiveResults && window.cognitiveService) {
                const results = window.cognitiveService.analyze(this.cognitiveAnswers);
                this.app.showCognitiveResults(results);
                return;
            }
        }

        if (this.ui) {
            // UI Controller creates the visualizer, but App might still hold the method
            // Ideally UIController should handle showResults, but for now delegating back to App 
            // if it hasn't been moved yet, OR checking if UI has it. 
            // In the plan, we didn't explicitly move showResults to UIController yet, 
            // but app.showResults() exists.
            this.app.showResults();
        }
    }
}

// Export to global scope for non-module usage
if (typeof window !== 'undefined') {
    window.TestManager = TestManager;
}
