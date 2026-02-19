/**
 * Lightweight Particle Network Animation
 * Replaces the heavy Three.js background
 */
class ParticleNetwork {
    constructor(options = {}) {
        this.options = {
            containerId: options.containerId || 'particles-container',
            particleColor: options.particleColor || 'rgba(100, 149, 237, 0.5)',
            lineColor: options.lineColor || 'rgba(100, 149, 237, 0.15)',
            particleAmount: options.particleAmount || 40,
            defaultSpeed: options.defaultSpeed || 0.5,
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

        this.init();
    }

    init() {
        // Method 1: Try to find existing container
        let container = document.getElementById(this.options.containerId);

        // Method 2: If not found, create a global fixed background
        if (!container) {
            container = document.createElement('div');
            container.id = this.options.containerId;
            container.style.position = 'fixed'; // Fixed to cover whole screen
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.zIndex = '-1'; // Behind everything
            container.style.pointerEvents = 'none';
            document.body.prepend(container); // Add to start of body
        }
        this.container = container;

        // Create Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        // Debounced resize to avoid reflow storms
        window.addEventListener('resize', () => {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => this.resize(), 300);
        });

        this.createParticles();
        this.animate();
    }

    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticles() {
        this.particles = [];
        const count = Math.min(this.options.particleAmount, (this.width * this.height) / 15000); // Responsive count

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * this.options.defaultSpeed,
                vy: (Math.random() - 0.5) * this.options.defaultSpeed,
                size: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Cache threshold squared to avoid Math.sqrt per pair
        const maxDist = 150;
        const maxDistSq = maxDist * maxDist;

        // Update and draw particles
        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.particleColor;
            this.ctx.fill();

            // Connect lines (using distance² to avoid Math.sqrt)
            for (let j = index + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const distance = Math.sqrt(distSq);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.options.lineColor;
                    this.ctx.lineWidth = 0.5 * (1 - distance / maxDist);
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
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Global initialization
window.initParticles = () => {
    // Only init if not mobile for better performance, or reduce count
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 25 : 50;

    // Check for dark mode to adjust colors
    const isDark = document.body.classList.contains('dark-theme');
    const color = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(100, 149, 237, 0.5)';
    const line = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(100, 149, 237, 0.15)';

    window.particleSystem = new ParticleNetwork({
        particleAmount: count,
        particleColor: color,
        lineColor: line
    });
};

// Auto-init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initParticles);
} else {
    window.initParticles();
}
