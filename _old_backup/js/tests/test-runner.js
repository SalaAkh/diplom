/**
* Simple Client-Side Test Runner
*/
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    describe(name, fn) {
        console.group(name);
        try {
            fn();
        } catch (e) {
            console.error(e);
        }
        console.groupEnd();
    }

    it(name, fn) {
        try {
            fn();
            console.log(`%c✓ ${name}`, 'color: green');
            this.addResult(name, true);
        } catch (e) {
            console.error(`%c✗ ${name}`, 'color: red');
            console.error(e);
            this.addResult(name, false, e);
        }
    }

    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected} but got ${actual}`);
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
                }
            },
            toBeGreaterThan: (expected) => {
                if (!(actual > expected)) {
                    throw new Error(`Expected ${actual} to be greater than ${expected}`);
                }
            },
            toBeTruthy: () => {
                if (!actual) {
                    throw new Error(`Expected ${actual} to be truthy`);
                }
            }
        };
    }

    addResult(name, passed, error = null) {
        if (passed) {
            this.passed++;
        } else {
            this.failed++;
        }

        const resultsDiv = document.getElementById('test-results');
        if (resultsDiv) {
            const el = document.createElement('div');
            el.className = `test-result ${passed ? 'passed' : 'failed'}`;
            el.innerHTML = `
                <span class="status">${passed ? '✓' : '✗'}</span>
                <span class="name">${name}</span>
                ${error ? `<pre class="error">${error.message}</pre>` : ''}
            `;
            resultsDiv.appendChild(el);

            this.updateSummary();
        }
    }

    updateSummary() {
        const summaryDiv = document.getElementById('test-summary');
        if (summaryDiv) {
            summaryDiv.innerHTML = `
                Total: ${this.passed + this.failed} | 
                <span style="color: green">Passed: ${this.passed}</span> | 
                <span style="color: red">Failed: ${this.failed}</span>
            `;
        }
    }
}

window.api = new TestRunner();
window.describe = window.api.describe.bind(window.api);
window.it = window.api.it.bind(window.api);
window.expect = window.api.expect.bind(window.api);
