/**
 * Resource Loader Service
 * Handles lazy loading of external scripts and styles
 */
class ResourceLoader {
    constructor() {
        this.loadedResources = new Set();
        this.promises = new Map();
    }

    /**
     * Load a script dynamically
     * @param {string} url - URL of the script
     * @param {Object} options - Loading options (id, async, defer)
     * @returns {Promise}
     */
    loadScript(url, options = {}) {
        if (this.loadedResources.has(url)) {
            return Promise.resolve();
        }

        if (this.promises.has(url)) {
            return this.promises.get(url);
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = options.async !== undefined ? options.async : true;
            script.defer = options.defer !== undefined ? options.defer : true;
            if (options.id) script.id = options.id;
            if (options.type) script.type = options.type;
            if (options.crossorigin) script.crossOrigin = options.crossorigin;

            script.onload = () => {
                this.loadedResources.add(url);
                this.promises.delete(url);
                resolve();
            };

            script.onerror = () => {
                this.promises.delete(url);
                reject(new Error(`Failed to load script: ${url}`));
            };

            document.head.appendChild(script);
        });

        this.promises.set(url, promise);
        return promise;
    }

    /**
     * Load multiple scripts sequentially or in parallel
     * @param {string[]} urls 
     * @param {boolean} parallel 
     */
    async loadScripts(urls, parallel = true) {
        if (parallel) {
            return Promise.all(urls.map(url => this.loadScript(url)));
        } else {
            for (const url of urls) {
                await this.loadScript(url);
            }
        }
    }

    /**
     * Load a stylesheet dynamically
     * @param {string} url 
     */
    loadStyle(url) {
        if (this.loadedResources.has(url)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            link.onload = () => {
                this.loadedResources.add(url);
                resolve();
            };

            link.onerror = () => {
                reject(new Error(`Failed to load style: ${url}`));
            };

            document.head.appendChild(link);
        });
    }
}

// Export a singleton instance
window.resourceLoader = new ResourceLoader();
