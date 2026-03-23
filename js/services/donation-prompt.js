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
                title: "Поддержать дипломный проект",
                text: "Нравится Neural Constellation? Это моя дипломная работа. Вы можете поддержать автора!",
                btnBoosty: "Boosty",
                btnPatreon: "Patreon",
                copied: "Номер скопирован"
            },
            en: {
                title: "Support the Thesis Project",
                text: "Enjoying Neural Constellation? This is my diploma project. You can support the author!",
                btnBoosty: "Boosty",
                btnPatreon: "Patreon",
                copied: "Card copied"
            },
            kk: {
                title: "Дипломдық жобаға қолдау көрсету",
                text: "Neural Constellation ұнай ма? Бұл менің дипломдық жұмысым. Авторға қолдау көрсете аласыз!",
                btnBoosty: "Boosty",
                btnPatreon: "Patreon",
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
            @keyframes pulse-glow {
                0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
                100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
            }
            .global-donation-prompt {
                position: fixed;
                bottom: -150px;
                right: 24px;
                width: 360px;
                background: linear-gradient(145deg, rgba(16, 20, 38, 0.85), rgba(30, 25, 50, 0.7));
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-top: 1px solid rgba(74, 144, 226, 0.3);
                border-radius: 20px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
                padding: 1.5rem;
                z-index: 99999;
                transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease;
                opacity: 0;
            }
            body:not(.dark-theme) .global-donation-prompt {
                background: linear-gradient(145deg, rgba(165, 185, 210, 0.95), rgba(145, 168, 198, 0.9));
                border: 1px solid rgba(100, 140, 190, 0.3);
                border-top: 1px solid rgba(74, 144, 226, 0.5);
                box-shadow: 0 20px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
                color: #1a2533;
            }
            body:not(.dark-theme) .donation-prompt-text {
                color: #2c3e50;
            }
            body:not(.dark-theme) .donation-prompt-close {
                background: rgba(0,0,0,0.08);
                border-color: rgba(0,0,0,0.15);
                color: #2c3e50;
            }
            body:not(.dark-theme) .donation-btn-bmc,
            body:not(.dark-theme) .donation-btn-kaspi {
                background: rgba(255,255,255,0.3);
                color: #1a2533;
                border: 1px solid rgba(0,0,0,0.15);
            }
            .global-donation-prompt::before {
                content: '';
                position: absolute;
                top: -30px;
                left: -30px;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, rgba(74, 144, 226, 0.15) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
            }
            .global-donation-prompt.show {
                transform: translateY(-174px);
                opacity: 1;
            }
            @media(max-width: 600px) {
                .global-donation-prompt {
                    right: 50%;
                    transform: translateX(50%) translateY(0);
                    width: calc(100% - 32px);
                    max-width: 400px;
                }
                .global-donation-prompt.show {
                    transform: translateX(50%) translateY(-100px);
                }
            }
            .donation-prompt-close {
                position: absolute;
                top: 14px;
                right: 14px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: rgba(255,255,255,0.6);
                cursor: pointer;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .donation-prompt-close:hover {
                background: rgba(74,144,226,0.15);
                color: #fff;
                transform: rotate(90deg);
                border-color: rgba(74,144,226,0.3);
            }
            .donation-prompt-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Space Grotesk', sans-serif;
                background: linear-gradient(135deg, #4a90e2, #7e57c2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 700;
                font-size: 1.15rem;
                margin-top: 0;
                margin-bottom: 10px;
            }
            .donation-prompt-heart {
                color: #4a90e2;
                animation: pulse-glow 2s infinite;
                border-radius: 50%;
                background: rgba(74, 144, 226, 0.1);
            }
            .donation-prompt-text {
                color: var(--text-secondary, rgba(255,255,255,0.7));
                font-size: 0.95rem;
                line-height: 1.5;
                margin-bottom: 1.25rem;
            }
            .donation-prompt-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }
            .donation-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px 12px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                text-decoration: none;
                border: none;
                position: relative;
                overflow: hidden;
            }
            .donation-btn::after {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: linear-gradient(rgba(255,255,255,0.2), transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }
            .donation-btn:hover::after {
                opacity: 1;
            }
            .donation-btn-boosty {
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            .donation-btn-boosty:hover {
                transform: translateY(-3px);
                background: rgba(255, 102, 0, 0.15);
                border-color: rgba(255, 102, 0, 0.4);
                box-shadow: 0 8px 20px rgba(255, 102, 0, 0.2);
                color: #ff7a1a;
            }
            .donation-btn-patreon {
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            .donation-btn-patreon:hover {
                transform: translateY(-3px);
                background: rgba(255, 66, 77, 0.15);
                border-color: rgba(255, 66, 77, 0.4);
                box-shadow: 0 8px 20px rgba(255, 66, 77, 0.2);
                color: #ff656f;
            }
            .boosty-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                background: linear-gradient(135deg, #ff6600, #ff9900);
                color: white;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 800;
                font-style: italic;
            }
            .patreon-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                background: linear-gradient(135deg, #FF424D, #C0392B);
                color: white;
                border-radius: 50%;
                font-size: 11px;
                font-weight: 800;
            }
            body:not(.dark-theme) .donation-btn-boosty,
            body:not(.dark-theme) .donation-btn-patreon {
                background: rgba(255,255,255,0.3);
                color: #1a2533;
                border: 1px solid rgba(0,0,0,0.15);
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
                <span class="material-symbols-rounded donation-prompt-heart" style="font-size: 1.2rem;">school</span>
                ${t.title}
            </h4>
            <div class="donation-prompt-text">
                ${t.text}
            </div>
            <div class="donation-prompt-actions">
                <a href="https://boosty.to/sala_ah" target="_blank" class="donation-btn donation-btn-boosty">
                    <span class="boosty-icon">B</span>
                    ${t.btnBoosty}
                </a>
                <a href="https://www.patreon.com/c/Sala_ah" target="_blank" class="donation-btn donation-btn-patreon">
                    <span class="patreon-icon">P</span>
                    ${t.btnPatreon}
                </a>
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

    // Start 3-minute interval timer (180,000 ms)
    setInterval(() => {
        createDonationPromptElement();
    }, 180000);

    // Initial delay: Show immediately upon first entry (wait 1.5s for page to settle)
    setTimeout(() => {
        createDonationPromptElement();
    }, 1500);

})();
