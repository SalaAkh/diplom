/**
 * Lightweight Particle Network Animation
 * Theme-aware: auto-updates colors on light/dark switch
 * Responsive: adapts particle count & size to viewport
 */
class ParticleNetwork {
    constructor(options = {}) {
        this.options = {
            containerId: options.containerId || 'particles-container',
            particleAmount: options.particleAmount || 40,
            defaultSpeed: options.defaultSpeed || 0.5,
            maxConnectDist: options.maxConnectDist || 150,
            ...options
        };

        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.particles = [];
        this.animationFrame = null;
        this.container = null;
        this._resizeTimer = null;
        this._themeObserver = null;

        // Colors will be set dynamically
        this.particleColor = '';
        this.lineColor = '';

        this.init();
    }

    /**
     * Detect current theme and return appropriate colors.
     * Light theme: dark blue particles that contrast against light/gradient bg.
     * Dark theme: bright white/cyan particles that glow on dark bg.
     */
    _getThemeColors() {
        const isDark = document.body.classList.contains('dark-theme');
        if (isDark) {
            return {
                particle: 'rgba(0, 198, 251, 0.6)',   // cyan glow
                line: 'rgba(0, 198, 251, 0.12)'
            };
        } else {
            // Light theme — use DARK particles so they're visible on light/gradient bg
            return {
                particle: 'rgba(30, 60, 120, 0.55)',  // dark navy blue
                line: 'rgba(30, 60, 120, 0.12)'
            };
        }
    }

    /**
     * Update colors to match current theme (called on init + theme switch).
     */
    updateColors() {
        const colors = this._getThemeColors();
        this.particleColor = colors.particle;
        this.lineColor = colors.line;
    }

    init() {
        // Find or create container
        let container = document.getElementById(this.options.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = this.options.containerId;
            container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
            document.body.prepend(container);
        }
        this.container = container;

        // Create Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'width:100%;height:100%;display:block;';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Set initial colors
        this.updateColors();

        // Observe theme changes via MutationObserver on body class
        this._themeObserver = new MutationObserver(() => this.updateColors());
        this._themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        this.resize();

        // Debounced resize — recreate particles on resize for proper coverage
        window.addEventListener('resize', () => {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 300);
        });

        this.createParticles();
        this.animate();
    }

    resize() {
        // Use window dimensions for fixed-position canvases
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        // Apply devicePixelRatio for crisp rendering on HiDPI
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    createParticles() {
        this.particles = [];
        // Scale count by viewport area, with a healthy minimum
        const area = this.width * this.height;
        const density = area / 18000; // ~1 particle per 18k px²
        const count = Math.max(20, Math.min(this.options.particleAmount, Math.round(density)));

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * this.options.defaultSpeed,
                vy: (Math.random() - 0.5) * this.options.defaultSpeed,
                size: Math.random() * 2.5 + 1.2  // slightly larger for visibility
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const maxDist = this.options.maxConnectDist;
        const maxDistSq = maxDist * maxDist;
        const pColor = this.particleColor;
        const lColor = this.lineColor;

        // Update and draw particles
        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            // Clamp to bounds
            p.x = Math.max(0, Math.min(this.width, p.x));
            p.y = Math.max(0, Math.min(this.height, p.y));

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = pColor;
            this.ctx.fill();

            // Connect lines (using distance² to skip sqrt where unneeded)
            for (let j = index + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const distance = Math.sqrt(distSq);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = lColor;
                    this.ctx.lineWidth = 0.6 * (1 - distance / maxDist);
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        });

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        clearTimeout(this._resizeTimer);
        cancelAnimationFrame(this.animationFrame);
        if (this._themeObserver) {
            this._themeObserver.disconnect();
            this._themeObserver = null;
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Global initialization
window.initParticles = () => {
    // Destroy previous instance if exists
    if (window.particleSystem) {
        window.particleSystem.destroy();
        window.particleSystem = null;
    }

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 30 : 55;

    window.particleSystem = new ParticleNetwork({
        particleAmount: count,
        defaultSpeed: 0.4,
        maxConnectDist: isMobile ? 100 : 150
    });
};

// Auto-init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initParticles);
} else {
    window.initParticles();
}
