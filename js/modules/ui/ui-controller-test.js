/**
 * UI Controller
 * Manages all UI interactions, rendering, and event handling
 */
class UIController {
    constructor(app) {
        this.app = app;
    }

    /**
     * Helper to get i18n
     */
    get i18n() {
        return this.app.i18n;
    }

    /**
     * Helper to get text based on current language
     */
    getScenarioText(textObj) {
        if (!textObj) return '';
        if (typeof textObj === 'string') return textObj;

        const lang = this.i18n.getLanguage();
        // Fallback chain: specific lang -> ru -> en -> first available key
        return textObj[lang] || textObj['ru'] || textObj['en'] || Object.values(textObj)[0] || '';
    }

    /**
     * Test placeholder - renders simplified test question
     */
    testPlaceholder() {
        alert('UI Controller is working!');
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.UIController = UIController;
}
