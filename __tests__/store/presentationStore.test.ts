import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePresentationStore } from '@/store/presentationStore';

// Mock localforage to avoid errors during tests
vi.mock('localforage', () => ({
    default: {
        config: vi.fn(),
        setItem: vi.fn().mockResolvedValue(null),
        getItem: vi.fn().mockResolvedValue(null),
        removeItem: vi.fn().mockResolvedValue(null),
    },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        info: vi.fn(),
        success: vi.fn(),
    },
}));

describe('presentationStore', () => {
    beforeEach(() => {
        // Reset the store state before each test
        usePresentationStore.setState({
            presentations: [],
            currentPresentation: null,
            currentSlideIndex: 0,
            selectedElementId: null,
            presentationOrder: [],
            isLoading: false,
            hasLoadedFromStorage: false,
            zoomLevel: 1,
            showGrid: false,
        });
    });

    it('should create a new presentation', () => {
        const id = usePresentationStore.getState().createPresentation('Test Presentation', 'Test Description');

        const state = usePresentationStore.getState();
        expect(state.presentations).toHaveLength(1);
        expect(state.presentations[0].title).toBe('Test Presentation');
        expect(state.currentPresentation).not.toBeNull();
        expect(state.currentPresentation?.id).toBe(id);
        expect(state.currentPresentation?.slides).toHaveLength(1);
    });

    it('should add a slide to the current presentation', () => {
        const initialStore = usePresentationStore.getState();
        const id = initialStore.createPresentation('Test');

        usePresentationStore.getState().addSlide(id);

        const state = usePresentationStore.getState();
        expect(state.currentPresentation?.slides).toHaveLength(2);
        expect(state.currentSlideIndex).toBe(1);
    });

    it('should delete a slide', () => {
        const initialStore = usePresentationStore.getState();
        const id = initialStore.createPresentation('Test');
        usePresentationStore.getState().addSlide(id);

        const stateWithSlides = usePresentationStore.getState();
        const slideIdToDelete = stateWithSlides.currentPresentation?.slides[1].id;
        if (slideIdToDelete) {
            stateWithSlides.deleteSlide(slideIdToDelete);
        }

        const state = usePresentationStore.getState();
        expect(state.currentPresentation?.slides).toHaveLength(1);
        expect(state.currentSlideIndex).toBe(0);
    });

    it('should add an element to the current slide', () => {
        usePresentationStore.getState().createPresentation('Test');

        const newElement = {
            type: 'text' as const,
            content: 'Hello World',
            position: { x: 10, y: 10 },
            size: { width: 100, height: 50 },
            style: { fontSize: 20 },
        };

        usePresentationStore.getState().addElement(newElement);

        const state = usePresentationStore.getState();
        const currentSlide = state.currentPresentation?.slides[state.currentSlideIndex];
        expect(currentSlide?.elements).toHaveLength(1);
        expect(currentSlide?.elements[0].content).toBe('Hello World');
        expect(state.selectedElementId).toBe(currentSlide?.elements[0].id);
    });

    it('should update an element', () => {
        usePresentationStore.getState().createPresentation('Test');
        usePresentationStore.getState().addElement({
            type: 'text' as const,
            content: 'Old Text',
            position: { x: 0, y: 0 },
            size: { width: 10, height: 10 },
            style: {},
        });

        const elementId = usePresentationStore.getState().selectedElementId!;
        usePresentationStore.getState().updateElement(elementId, { content: 'New Text' });

        const state = usePresentationStore.getState();
        const element = state.currentPresentation?.slides[0].elements[0];
        expect(element?.content).toBe('New Text');
    });

    it('should toggle grid', () => {
        expect(usePresentationStore.getState().showGrid).toBe(false);
        usePresentationStore.getState().toggleGrid();
        expect(usePresentationStore.getState().showGrid).toBe(true);
    });

    describe('layer management', () => {
        beforeEach(() => {
            const store = usePresentationStore.getState();
            store.createPresentation('Layer Test');
            // Add three elements - reuse state each time to be safe
            usePresentationStore.getState().addElement({ type: 'text', content: 'Element 1', position: { x: 0, y: 0 }, size: { width: 10, height: 10 }, style: {} });
            usePresentationStore.getState().addElement({ type: 'text', content: 'Element 2', position: { x: 0, y: 0 }, size: { width: 10, height: 10 }, style: {} });
            usePresentationStore.getState().addElement({ type: 'text', content: 'Element 3', position: { x: 0, y: 0 }, size: { width: 10, height: 10 }, style: {} });
        });

        it('should move element to front', () => {
            const elements = usePresentationStore.getState().currentPresentation!.slides[0].elements;
            const element1Id = elements[0].id; // index 0

            usePresentationStore.getState().moveElementLayer(element1Id, 'front');

            const updatedElements = usePresentationStore.getState().currentPresentation!.slides[0].elements;
            expect(updatedElements[2].id).toBe(element1Id);
        });

        it('should move element to back', () => {
            const elements = usePresentationStore.getState().currentPresentation!.slides[0].elements;
            const element3Id = elements[2].id; // index 2

            usePresentationStore.getState().moveElementLayer(element3Id, 'back');

            const updatedElements = usePresentationStore.getState().currentPresentation!.slides[0].elements;
            expect(updatedElements[0].id).toBe(element3Id);
        });

        it('should move element forward', () => {
            const elements = usePresentationStore.getState().currentPresentation!.slides[0].elements;
            const element1Id = elements[0].id;

            usePresentationStore.getState().moveElementLayer(element1Id, 'forward');

            const updatedElements = usePresentationStore.getState().currentPresentation!.slides[0].elements;
            expect(updatedElements[1].id).toBe(element1Id);
        });

        it('should move element backward', () => {
            const elements = usePresentationStore.getState().currentPresentation!.slides[0].elements;
            const element3Id = elements[2].id;

            usePresentationStore.getState().moveElementLayer(element3Id, 'backward');

            const updatedElements = usePresentationStore.getState().currentPresentation!.slides[0].elements;
            expect(updatedElements[1].id).toBe(element3Id);
        });
    });

    describe('alignment actions', () => {
        let elementId: string;
        beforeEach(() => {
            usePresentationStore.getState().createPresentation('Align Test');
            usePresentationStore.getState().addElement({
                type: 'text',
                content: 'Test',
                position: { x: 100, y: 100 },
                size: { width: 200, height: 100 },
                style: {}
            });
            elementId = usePresentationStore.getState().selectedElementId!;
        });

        it('should align left', () => {
            usePresentationStore.getState().alignElement(elementId, 'left');
            expect(usePresentationStore.getState().currentPresentation!.slides[0].elements[0].position.x).toBe(0);
        });

        it('should align center', () => {
            usePresentationStore.getState().alignElement(elementId, 'center');
            // (960 - 200) / 2 = 380
            expect(usePresentationStore.getState().currentPresentation!.slides[0].elements[0].position.x).toBe(380);
        });

        it('should align right', () => {
            usePresentationStore.getState().alignElement(elementId, 'right');
            // 960 - 200 = 760
            expect(usePresentationStore.getState().currentPresentation!.slides[0].elements[0].position.x).toBe(760);
        });

        it('should align top', () => {
            usePresentationStore.getState().alignElement(elementId, 'top');
            expect(usePresentationStore.getState().currentPresentation!.slides[0].elements[0].position.y).toBe(0);
        });

        it('should align middle', () => {
            usePresentationStore.getState().alignElement(elementId, 'middle');
            // (540 - 100) / 2 = 220
            expect(usePresentationStore.getState().currentPresentation!.slides[0].elements[0].position.y).toBe(220);
        });

        it('should align bottom', () => {
            usePresentationStore.getState().alignElement(elementId, 'bottom');
            // 540 - 100 = 440
            expect(usePresentationStore.getState().currentPresentation!.slides[0].elements[0].position.y).toBe(440);
        });
    });

    describe('slide operations and navigation', () => {
        beforeEach(() => {
            usePresentationStore.getState().createPresentation('Slide Ops Test');
            // Already has 1 slide
        });

        it('should duplicate a slide', () => {
            const originalSlideId = usePresentationStore.getState().currentPresentation!.slides[0].id;
            usePresentationStore.getState().addElement({ type: 'text', content: 'Test', position: { x: 0, y: 0 }, size: { width: 10, height: 10 }, style: {} });

            usePresentationStore.getState().duplicateSlide(originalSlideId);

            const state = usePresentationStore.getState();
            expect(state.currentPresentation!.slides).toHaveLength(2);
            expect(state.currentSlideIndex).toBe(1);
            expect(state.currentPresentation!.slides[1].elements).toHaveLength(1);
            expect(state.currentPresentation!.slides[1].id).not.toBe(originalSlideId);
        });

        it('should reorder slides', () => {
            const currentPresId = usePresentationStore.getState().currentPresentation!.id;
            usePresentationStore.getState().addSlide(currentPresId); // Now has 2 slides

            const stateWithSlides = usePresentationStore.getState();
            const slide2Id = stateWithSlides.currentPresentation!.slides[1].id;

            stateWithSlides.reorderSlides(1, 0);

            const finalState = usePresentationStore.getState();
            expect(finalState.currentPresentation!.slides[0].id).toBe(slide2Id);
        });

        it('should navigate between slides', () => {
            const id = usePresentationStore.getState().currentPresentation!.id;
            usePresentationStore.getState().addSlide(id);
            usePresentationStore.getState().addSlide(id); // total 3 slides, index at 2

            usePresentationStore.getState().previousSlide();
            expect(usePresentationStore.getState().currentSlideIndex).toBe(1);

            usePresentationStore.getState().previousSlide();
            expect(usePresentationStore.getState().currentSlideIndex).toBe(0);

            usePresentationStore.getState().nextSlide();
            expect(usePresentationStore.getState().currentSlideIndex).toBe(1);
        });
    });
});
