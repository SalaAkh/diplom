/**
 * Өндіріске қауіпсіз логгер (Production-safe Logger)
 * Өндіріс режимінде логтарды автоматты түрде өшіреді (Automatically disables logs in production)
 */

const IS_PRODUCTION = window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    !window.location.hostname.includes('192.168');

const logger = {
    log: IS_PRODUCTION ? () => { } : console.log.bind(console),
    warn: console.warn.bind(console), // Ескертулерді әрқашан көрсетеміз (Always show warnings)
    error: console.error.bind(console), // Қателерді әрқашан көрсетеміз (Always show errors)
    debug: IS_PRODUCTION ? () => { } : console.log.bind(console, '[DEBUG]'),
    info: IS_PRODUCTION ? () => { } : console.info.bind(console)
};

// Басқа модульдерде қолдану үшін экспорттау (Export for use in other modules)
if (typeof window !== 'undefined') {
    window.logger = logger;
}
