const test = require('node:test');
const assert = require('node:assert/strict');
const PortfolioLogic = require('./script');

test('shouldNavbarBeScrolled returns true only above threshold', () => {
    assert.equal(PortfolioLogic.shouldNavbarBeScrolled(51), true);
    assert.equal(PortfolioLogic.shouldNavbarBeScrolled(50), false);
    assert.equal(PortfolioLogic.shouldNavbarBeScrolled(10), false);
    assert.equal(PortfolioLogic.shouldNavbarBeScrolled(80, 70), true);
});

test('getActiveSectionId returns null when no entries intersect', () => {
    const entries = [
        { isIntersecting: false, target: { id: 'home' } },
        { isIntersecting: false, target: { id: 'about' } }
    ];
    assert.equal(PortfolioLogic.getActiveSectionId(entries), null);
});

test('getActiveSectionId returns the last intersecting section id', () => {
    const entries = [
        { isIntersecting: true, target: { id: 'home' } },
        { isIntersecting: false, target: { id: 'about' } },
        { isIntersecting: true, target: { id: 'projects' } }
    ];
    assert.equal(PortfolioLogic.getActiveSectionId(entries), 'projects');
});

test('getTypewriterNextState grows text while typing', () => {
    const next = PortfolioLogic.getTypewriterNextState({
        words: ['Hi'],
        txt: '',
        wordIndex: 0,
        isDeleting: false,
        wait: 3000
    });

    assert.deepEqual(next, {
        txt: 'H',
        wordIndex: 0,
        isDeleting: false,
        typeSpeed: 100
    });
});

test('getTypewriterNextState switches to deleting at full word', () => {
    const next = PortfolioLogic.getTypewriterNextState({
        words: ['Hi'],
        txt: 'H',
        wordIndex: 0,
        isDeleting: false,
        wait: 3000
    });

    assert.deepEqual(next, {
        txt: 'Hi',
        wordIndex: 0,
        isDeleting: true,
        typeSpeed: 3000
    });
});

test('getTypewriterNextState deletes text with faster speed', () => {
    const next = PortfolioLogic.getTypewriterNextState({
        words: ['Hi'],
        txt: 'Hi',
        wordIndex: 0,
        isDeleting: true,
        wait: 3000
    });

    assert.deepEqual(next, {
        txt: 'H',
        wordIndex: 0,
        isDeleting: true,
        typeSpeed: 50
    });
});

test('getTypewriterNextState advances to next word after deletion completes', () => {
    const next = PortfolioLogic.getTypewriterNextState({
        words: ['Hi', 'Bye'],
        txt: 'H',
        wordIndex: 0,
        isDeleting: true,
        wait: 3000
    });

    assert.deepEqual(next, {
        txt: '',
        wordIndex: 1,
        isDeleting: false,
        typeSpeed: 500
    });
});

test('getNavToggleSpanStyle returns active styles for all burger lines', () => {
    assert.deepEqual(PortfolioLogic.getNavToggleSpanStyle(0, true), {
        transform: 'rotate(-45deg) translate(-5px, 6px)',
        opacity: '1'
    });
    assert.deepEqual(PortfolioLogic.getNavToggleSpanStyle(1, true), {
        transform: 'none',
        opacity: '0'
    });
    assert.deepEqual(PortfolioLogic.getNavToggleSpanStyle(2, true), {
        transform: 'rotate(45deg) translate(-5px, -6px)',
        opacity: '1'
    });
});

test('getNavToggleSpanStyle resets styles when menu is inactive', () => {
    assert.deepEqual(PortfolioLogic.getNavToggleSpanStyle(0, false), {
        transform: 'none',
        opacity: '1'
    });
    assert.deepEqual(PortfolioLogic.getNavToggleSpanStyle(1, false), {
        transform: 'none',
        opacity: '1'
    });
});

test('carousel helpers wrap and format correctly', () => {
    assert.equal(PortfolioLogic.getNextCarouselIndex(0, 3), 1);
    assert.equal(PortfolioLogic.getNextCarouselIndex(2, 3), 0);
    assert.equal(PortfolioLogic.getPrevCarouselIndex(0, 3), 2);
    assert.equal(PortfolioLogic.getPrevCarouselIndex(2, 3), 1);
    assert.equal(PortfolioLogic.getCarouselTransform(0), 'translateX(-0%)');
    assert.equal(PortfolioLogic.getCarouselTransform(2), 'translateX(-200%)');
});
