# Performance Optimization Plan

🤖 **Applying knowledge of @[frontend-specialist]...**

## Analysis

According to the frontend-specialist rules and the user's desire to optimize the app while keeping it an SPA:

1. **Index HTML is bloated**: `index.html` contains large templates that slow down initial parsing.
2. **Memory Leaks**: Views like `ScenarioView` don't clean up their event listeners when the user navigates away.
3. **Eager Loading**: Heavy data files (thousands of lines of scenarios) are loaded immediately on app startup, even if the user just wants to view their profile.

## Proposed Changes

1. **`index.html`**:
   - Delete the `<template id="landing-template">`.
   - Remove `<script src="js/data/*.js">` tags from the `<head>`/`<body>` initially so they can be lazy-loaded.

2. **`js/ui/views/IntroView.js`**:
   - Move the HTML from the deleted template into `getHTML()`.

3. **`js/ui/views/BaseView.js`**:
   - Add `destroy()` method to clean up `this.container.innerHTML` and remove event listeners.

4. **`js/ui/ui-controller.js` (or Navigation manager)**:
   - Ensure that when a new View is rendered, the previous View's `destroy()` is called.

5. **`js/managers/test-manager.js`**:
   - Implement dynamic imports: `await import('../../data/scenarios-data.js')` instead of relying on globals.
