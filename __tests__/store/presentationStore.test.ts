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
        const store = usePresentationStore.getState();
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
        const store = usePresentationStore.getState();
        const id = store.createPresentation('Test Presentation', 'Test Description');

        const state = usePresentationStore.getState();
        expect(state.presentations).toHaveLength(1);
        expect(state.presentations[0].title).toBe('Test Presentation');
        expect(state.currentPresentation).not.toBeNull();
        expect(state.currentPresentation?.id).toBe(id);
        expect(state.currentPresentation?.slides).toHaveLength(1);
    });

    it('should add a slide to the current presentation', () => {
        const store = usePresentationStore.getState();
        const id = store.createPresentation('Test');

        store.addSlide(id);

        const state = usePresentationStore.getState();
        expect(state.currentPresentation?.slides).toHaveLength(2);
        expect(state.currentSlideIndex).toBe(1);
    });

    it('should delete a slide', () => {
        const store = usePresentationStore.getState();
        const id = store.createPresentation('Test');
        store.addSlide(id);

        const slideIdToDelete = usePresentationStore.getState().currentPresentation?.slides[1].id;
        if (slideIdToDelete) {
            store.deleteSlide(slideIdToDelete);
        }

        const state = usePresentationStore.getState();
        expect(state.currentPresentation?.slides).toHaveLength(1);
        expect(state.currentSlideIndex).toBe(0);
    });

    it('should add an element to the current slide', () => {
        const store = usePresentationStore.getState();
        store.createPresentation('Test');

        const newElement = {
            type: 'text' as const,
            content: 'Hello World',
            position: { x: 10, y: 10 },
            size: { width: 100, height: 50 },
            style: { fontSize: 20 },
        };

        store.addElement(newElement);

        const state = usePresentationStore.getState();
        const currentSlide = state.currentPresentation?.slides[state.currentSlideIndex];
        expect(currentSlide?.elements).toHaveLength(1);
        expect(currentSlide?.elements[0].content).toBe('Hello World');
        expect(state.selectedElementId).toBe(currentSlide?.elements[0].id);
    });

    it('should update an element', () => {
        const store = usePresentationStore.getState();
        store.createPresentation('Test');
        store.addElement({
            type: 'text' as const,
            content: 'Old Text',
            position: { x: 0, y: 0 },
            size: { width: 10, height: 10 },
            style: {},
        });

        const elementId = usePresentationStore.getState().selectedElementId!;
        store.updateElement(elementId, { content: 'New Text' });

        const state = usePresentationStore.getState();
        const element = state.currentPresentation?.slides[0].elements[0];
        expect(element?.content).toBe('New Text');
    });

    it('should toggle grid', () => {
        const store = usePresentationStore.getState();
        expect(store.showGrid).toBe(false);
        store.toggleGrid();
        expect(usePresentationStore.getState().showGrid).toBe(true);
    });
});
