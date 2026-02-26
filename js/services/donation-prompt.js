/**
 * Global Donation Prompt System
 * Shows a beautiful "Buy me a coffee / Kaspi Gold" notification every 5 minutes across all pages.
 */

(function () {
    // Show prompt every 5 minutes (300,000 ms)
    const PROMPT_INTERVAL = 300000;

    // Check if we already have a timer running
    if (window._donationPromptInitialized) return;
    window._donationPromptInitialized = true;

    function getTranslations() {
        const lang = (window.i18n && typeof window.i18n.getLanguage === 'function')
            ? window.i18n.getLanguage()
            : (localStorage.getItem('language') || 'ru');

        const translations = {
            ru: {
                title: "Поддержать проект",
                text: "Нравится Neural Constellation? Вы можете разово поддержать автора!",
                btnBMC: "Купить кофе",
                btnKaspi: "Kaspi Gold",
                copied: "Номер скопирован"
            },
            en: {
                title: "Support the Project",
                text: "Enjoying Neural Constellation? You can support the author!",
                btnBMC: "Buy a coffee",
                btnKaspi: "Kaspi Gold",
                copied: "Card copied"
            },
            kk: {
                title: "Жобаға қолдау көрсету",
                text: "Neural Constellation ұнай ма? Авторға қолдау көрсете аласыз!",
                btnBMC: "Кофе алып беріңіз",
                btnKaspi: "Kaspi Gold",
                copied: "Нөмір көшірілді"
            }
        };

        return translations[lang] || translations.ru;
    }

    function createPromptStyles() {
        if (document.getElementById('donation-prompt-styles')) return;

        const style = document.createElement('style');
        style.id = 'donation-prompt-styles';
        style.textContent = `
            .global-donation-prompt {
                position: fixed;
                bottom: -150px;
                right: 20px;
                width: 340px;
                background: linear-gradient(135deg, rgba(20, 24, 44, 0.95), rgba(42, 35, 66, 0.95));
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(245, 158, 11, 0.2);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(245, 158, 11, 0.1);
                padding: 1.25rem;
                z-index: 99999;
                transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s;
                opacity: 0;
            }
            .global-donation-prompt.show {
                transform: translateY(-170px);
                opacity: 1;
            }
            @media(max-width: 600px) {
                .global-donation-prompt {
                    right: 50%;
                    transform: translateX(50%) translateY(0);
                    width: calc(100% - 40px);
                }
                .global-donation-prompt.show {
                    transform: translateX(50%) translateY(-170px);
                }
            }
            .donation-prompt-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                color: rgba(255,255,255,0.5);
                cursor: pointer;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .donation-prompt-close:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }
            .donation-prompt-title {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #fbbf24;
                font-weight: 700;
                font-size: 1.1rem;
                margin-top: 0;
                margin-bottom: 8px;
            }
            .donation-prompt-text {
                color: rgba(255,255,255,0.8);
                font-size: 0.9rem;
                line-height: 1.4;
                margin-bottom: 15px;
            }
            .donation-prompt-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
            .donation-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 8px;
                border-radius: 10px;
                font-weight: 600;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.2s;
                text-decoration: none;
                border: none;
            }
            .donation-btn-bmc {
                background: #FFDD00;
                color: #000;
            }
            .donation-btn-bmc:hover {
                background: #ffea5c;
                transform: translateY(-2px);
            }
            .donation-btn-kaspi {
                background: rgba(241, 70, 53, 0.15);
                color: #fff;
                border: 1px solid rgba(241, 70, 53, 0.4);
            }
            .donation-btn-kaspi:hover {
                background: rgba(241, 70, 53, 0.3);
                border-color: rgba(241, 70, 53, 0.6);
            }
            .kaspi-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                background: #F14635;
                color: white;
                border-radius: 50%;
                font-size: 10px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    function createDonationPromptElement() {
        // Remove existing if any
        const existing = document.getElementById('global-donation-prompt');
        if (existing) existing.remove();

        const t = getTranslations();

        const el = document.createElement('div');
        el.id = 'global-donation-prompt';
        el.className = 'global-donation-prompt';

        el.innerHTML = `
            <button class="donation-prompt-close" aria-label="Close" onclick="this.parentElement.classList.remove('show'); setTimeout(()=>this.parentElement.remove(), 600);">
                <span class="material-symbols-rounded" style="font-size: 16px;">close</span>
            </button>
            <h4 class="donation-prompt-title">
                <span class="material-symbols-rounded" style="font-size: 1.2rem;">volunteer_activism</span>
                ${t.title}
            </h4>
            <div class="donation-prompt-text">
                ${t.text}
            </div>
            <div class="donation-prompt-actions">
                <a href="https://buymeacoffee.com/sala_ah" target="_blank" class="donation-btn donation-btn-bmc">
                    <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="BMC" style="height: 14px;">
                    ${t.btnBMC}
                </a>
                <button class="donation-btn donation-btn-kaspi" onclick="
                    navigator.clipboard.writeText('4400430320985507'); 
                    const orig = this.innerHTML; 
                    this.innerHTML = '<span class=\\'material-symbols-rounded\\' style=\\'font-size:14px; color:#10b981;\\'>check_circle</span> ${t.copied}';
                    this.style.background = 'rgba(16,185,129,0.15)';
                    this.style.borderColor = 'rgba(16,185,129,0.4)';
                    setTimeout(() => {
                        this.innerHTML = orig;
                        this.style = '';
                    }, 2500);
                ">
                    <span class="kaspi-icon">K</span>
                    Kaspi Gold
                </button>
            </div>
        `;

        document.body.appendChild(el);

        // Trigger reflow for animation
        void el.offsetWidth;

        // Show
        el.classList.add('show');

        // Auto-hide after 15 seconds
        setTimeout(() => {
            if (el && el.classList.contains('show')) {
                el.classList.remove('show');
                setTimeout(() => el.remove(), 600);
            }
        }, 15000);
    }

    // Initialize
    createPromptStyles();

    // Start 5-minute interval timer
    setInterval(() => {
        createDonationPromptElement();
    }, PROMPT_INTERVAL);

    // Initial delay for demo (wait 2 minutes on first load before aggressive prompts)
    setTimeout(() => {
        // Optional: uncomment below to show exactly on first run after 2 mins
        // createDonationPromptElement();
    }, 120000);

})();
