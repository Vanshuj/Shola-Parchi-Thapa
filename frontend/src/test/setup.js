import '@testing-library/jest-dom';
// jsdom does not implement matchMedia; provide a default "no preference" stub
// so components using useReducedMotion/useNostalgia can mount in tests.
if (!window.matchMedia) {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    });
}
