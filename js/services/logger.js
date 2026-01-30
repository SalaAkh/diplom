/**
 * Production-safe Logger
 * Автоматически отключает логи в production
 */

const IS_PRODUCTION = window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    !window.location.hostname.includes('192.168');

const logger = {
    log: IS_PRODUCTION ? () => { } : console.log.bind(console),
    warn: console.warn.bind(console), // Всегда показываем warnings
    error: console.error.bind(console), // Всегда показываем errors
    debug: IS_PRODUCTION ? () => { } : console.log.bind(console, '[DEBUG]'),
    info: IS_PRODUCTION ? () => { } : console.info.bind(console)
};

// Экспорт для использования в других модулях
if (typeof window !== 'undefined') {
    window.logger = logger;
}
