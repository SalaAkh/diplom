# Self-Discovery System — Personality Preference Analysis

**Author:** Akhmedyanov Salamat, KPO 9/22-2  
**Year:** 2026  
**Educational Institution:** Innovative Technologies College of KarTU named after Abylkas Saginov

---

## 📋 Project Description

This diploma project is a digital system for analyzing user personality preferences and development directions through interactive choice scenarios. The system is written in HTML, CSS, and JavaScript, operating entirely client-side in the browser (serverless).

### Key Features

- **Interactive Scenarios** — 12 dilemmas with 3–4 choice options
- **Cognitive Test** — determination of cognitive style across 6 dimensions
- **Extended Test** — in-depth dilemma scenarios
- **Dynamic Logic** — adaptive selection of subsequent questions based on previous answers
- **Pattern Analysis** — automatic analysis of user choices across 6 dimensions
- **Profile Evolution** — tracking changes in results between sessions
- **Celebrity Comparison** — comparing the profile with famous personalities
- **Result Visualization** — displaying personality profile through charts and graphs
- **Localization** — support for Kazakh, Russian, and English languages (KK / RU / EN)
- **Accessibility** — high contrast, text size adjustment, audio feedback, text-to-speech
- **Local Processing** — all data is stored in the browser, no server required

---

## 🎯 Project Goal

To create an interactive system serving as a tool for user self-discovery:

- Identifying personal preferences in decision-making
- Exploring thinking patterns
- Providing specific recommendations for development directions
- Visualizing personality profile

---

## 🔬 Analysis Model — 6 Dimensions

| # | Dimension | Description |
|---|---|---|
| 1 | **Strategic Thinking** | Long-term planning and systematic thinking |
| 2 | **Explorer** | Openness to new experiences, desire to explore the unknown |
| 3 | **Individualism** | Balance between independence and collective thinking |
| 4 | **Rationality** | Priority of logic and analysis in decision-making |
| 5 | **Control** | Desire to manage the situation |
| 6 | **Meaning Search** | Search for deep meaning in actions and events |

---

## 📁 Project Structure

```text
diplom-main/
├── index.html                   # Main page (landing + test)
├── about.html                   # About system page
├── profile.html                 # User profile page
├── manifest.json                # PWA Manifest
├── sw.js                        # Service Worker
├── .eslintrc.json               # ESLint configuration
│
├── css/
│   ├── design-tokens.css        # Design system variables
│   ├── typography.css           # Typography styles
│   ├── layout.css               # Layout styles
│   ├── navigation.css           # Navigation styles
│   ├── pages.css                # Page styles
│   ├── styles.css               # Main styles
│   ├── themes.css               # Light/Dark theme
│   ├── landing.css              # Landing page styles
│   ├── modal.css                # Modal windows
│   ├── transitions.css          # Animations and transitions
│   ├── accessibility.css        # Accessibility styles
│   └── google-auth.css          # Google Auth styles
│
├── js/
│   ├── app.js                   # Main application module (entry point)
│   │
│   ├── core/
│   │   ├── EventBus.js          # Event bus
│   │   └── AppState.js          # App state management
│   │
│   ├── config/
│   │   └── config.js            # Configuration file
│   │
│   ├── data/
│   │   ├── scenarios-data.js        # Main scenario data
│   │   ├── advanced-scenarios-data.js # Advanced scenarios
│   │   ├── cognitive-test-data.js   # Cognitive test data
│   │   ├── dynamic-scenarios.js     # Dynamic scenario logic
│   │   ├── advanced-test-organizer.js # Advanced test organizer
│   │   └── celebrity-profiles.js    # Celebrity profiles
│   │
│   ├── analysis/
│   │   ├── analysis.js              # Main analysis module
│   │   ├── advanced-analysis.js     # Advanced AI analysis
│   │   ├── comparative-analysis.js  # Comparative analysis
│   │   └── evolution-tracker.js     # Profile evolution tracker
│   │
│   ├── services/
│   │   ├── localization.js          # Localization (KK/RU/EN)
│   │   ├── localization-patch.js    # Localization patch
│   │   ├── storage.js               # localStorage management
│   │   ├── auth.js                  # Google OAuth authorization
│   │   ├── data-loader.js           # Data loader
│   │   ├── report-generator.js      # PDF/Report generator
│   │   ├── accessibility-service.js # Accessibility service
│   │   ├── audio-feedback.js        # Audio feedback
│   │   ├── voice-control.js         # Voice control
│   │   ├── keyboard-navigation.js   # Keyboard navigation
│   │   ├── feedback.js              # User feedback
│   │   ├── celebrity-service.js     # Celebrity service
│   │   ├── error-handler.js         # Error handling
│   │   ├── resource-loader.js       # Resource loader
│   │   └── logger.js                # Logging service
│   │
│   ├── managers/
│   │   ├── test-manager.js          # Test flow management
│   │   └── results-manager.js       # Results management
│   │
│   ├── ui/
│   │   ├── ui-controller.js         # UI controller
│   │   ├── navigation-controller.js # Navigation controller
│   │   ├── profile-extensions.js    # Profile extensions
│   │   ├── toast-manager.js         # Toast notifications
│   │   └── views/
│   │       ├── BaseView.js          # Base view class
│   │       ├── IntroView.js         # Intro screen
│   │       ├── TestSelectionView.js # Test selection screen
│   │       ├── ScenarioView.js      # Scenario screen
│   │       └── ResultsView.js       # Results screen
│   │
│   └── vis/
│       ├── visualization.js         # Chart.js diagrams
│       └── particles-background.js  # Background particles animation
│
├── data/
│   ├── scenarios.json           # Scenario data (backup)
│   └── advanced-scenarios.json  # Advanced scenarios (backup)
│
├── icons/                       # PWA icons
├── i18n/                        # Translation files
├── docs/                        # Additional documentation
└── ACCESSIBILITY.md             # Accessibility guide
```

---

## 🚀 Project Launch

1. Clone or download the project.
2. Open `index.html` in a modern browser.
3. Start the test.

**Requirements:**

- Modern browser with ES6+ support (Chrome, Firefox, Edge, Safari)
- Internet connection (to load Chart.js from CDN)

> **Note:** The main data source is `js/data/scenarios-data.js`. The file `data/scenarios.json` is used as a fallback when running via a web server.

---

## 🔧 Technologies

| Technology | Purpose |
|---|---|
| **HTML5** | Application structure |
| **CSS3** | Styling, responsive design, animations |
| **JavaScript ES6+** | Application logic, modular architecture |
| **Chart.js** | Data visualization (charts) |
| **localStorage** | Local results storage |
| **Service Worker** | PWA functionality |
| **Google OAuth** | User authorization (optional) |

---

## 🌐 Localization

The system supports 3 languages:

- 🇰🇿 **Kazakh** (`kk`) — primary language
- 🇷🇺 **Russian** (`ru`)
- 🇬🇧 **English** (`en`)

Translations are stored in `js/services/localization.js` and `js/services/localization-patch.js`.

---

## ⚙️ Accessibility

- **High Contrast Mode** — for visually impaired users
- **Text Size Adjustment** — 4 levels (small, normal, large, extra large)
- **Audio Feedback** — sound confirmation of actions
- **Read Aloud** — using Text-to-Speech (TTS) for results
- **Keyboard Navigation** — full navigation without a mouse
- **ARIA Attributes** — full compatibility with Screen Readers
- **Forms Accessibility** — `autocomplete` attributes and associated `<label>` tags for all input fields
- **Eye Strain Reduction** — optimized color balance for light and dark themes

Full guide: [ACCESSIBILITY.md](ACCESSIBILITY.md)

---

## 📊 Scenario Data Structure

Each scenario in `scenarios-data.js`:

```js
{
  id: 1,
  title: "Dilemma Title",
  description: "Situation Description",
  options: [
    {
      text: "Option A Text",
      weights: {
        strategic: 0.7,      // Strategic Thinking
        explorer: -0.4,      // Explorer
        rationality: 0.3,    // Rationality
        individualism: 0.5,  // Individualism
        control: -0.2,       // Control
        meaning: 0.6         // Meaning Search
      }
    },
    // ...
  ]
}
```

**Weights** — determine the impact of choice on each dimension:

- Range: from `-1.0` to `+1.0`
- Positive value — increases tendency towards the dimension
- Negative value — decreases it

---

## 🎓 For Diploma Defense

### Scientific Novelty

- Combination of 6 independent dimensions in one model
- Quantitative analysis of choices through weight coefficients
- Interactive approach through dilemma scenarios
- Profile evolution tracking system

### Practical Significance

- Working web system (serverless)
- Private data processing (local)
- Support for 3 languages
- Full accessibility (WCAG standards)

### Expected Defense Questions

**Why these exact 6 dimensions?**  
→ A comprehensive approach covering key aspects of decision-making.

**How were the weights in scenarios determined?**  
→ Based on theoretical models; can be refined through empirical research.

**Validity of results?**  
→ The system is designed for self-discovery, not clinical diagnosis. Results are advisory in nature.

**Why local processing?**  
→ User data privacy, independence from server infrastructure.

---

## 📈 Development Perspectives

1. Adding new dimensions and scenarios
2. Profile comparison capability
3. PDF Export
4. Mobile app version
5. Cloud synchronization (optional)

---

**Author:** Akhmedyanov Salamat, KPO 9/22-2  
**Year:** 2026  
**Educational Institution:** Innovative Technologies College of KarTU named after Abylkas Saginov
