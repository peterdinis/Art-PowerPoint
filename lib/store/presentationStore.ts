import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Presentation, Slide, SlideElement } from '@/lib/types/presentation';
import { getTemplateById } from '@/lib/templates/presentationTemplates';

interface PresentationStore {
  presentations: Presentation[];
  currentPresentation: Presentation | null;
  currentSlideIndex: number;
  
  // Presentation actions
  createPresentation: (title: string, description?: string, templateId?: string) => string;
  updatePresentation: (id: string, updates: Partial<Presentation>) => void;
  deletePresentation: (id: string) => void;
  selectPresentation: (id: string) => void;
  loadPresentations: () => void;
  savePresentations: () => void;
  
  // Slide actions
  addSlide: () => void;
  deleteSlide: (slideId: string) => void;
  duplicateSlide: (slideId: string) => void;
  selectSlide: (index: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  
  // Element actions
  addElement: (element: Omit<SlideElement, 'id'>) => void;
  updateElement: (elementId: string, updates: Partial<SlideElement>) => void;
  deleteElement: (elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  selectedElementId: string | null;
}

const createDefaultSlide = (): Slide => ({
  id: uuidv4(),
  elements: [],
  background: { color: '#ffffff' },
});

export const usePresentationStore = create<PresentationStore>((set, get) => ({
  presentations: [],
  currentPresentation: null,
  currentSlideIndex: 0,
  selectedElementId: null,

  createPresentation: (title: string, description?: string, templateId?: string) => {
    let slides: Slide[] = [createDefaultSlide()];
    
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        // Deep clone slides with new IDs
        slides = template.slides.map(slide => ({
          ...slide,
          id: uuidv4(),
          elements: slide.elements.map(el => ({
            ...el,
            id: uuidv4(),
          })),
        }));
      }
    }
    
    const newPresentation: Presentation = {
      id: uuidv4(),
      title,
      description,
      slides,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      presentations: [...state.presentations, newPresentation],
      currentPresentation: newPresentation,
      currentSlideIndex: 0,
    }));
    
    get().savePresentations();
    return newPresentation.id;
  },

  updatePresentation: (id: string, updates: Partial<Presentation>) => {
    set((state) => {
      const updated = state.presentations.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      );
      
      const current = state.currentPresentation?.id === id
        ? { ...state.currentPresentation, ...updates, updatedAt: new Date() }
        : state.currentPresentation;
      
      return {
        presentations: updated,
        currentPresentation: current,
      };
    });
    
    get().savePresentations();
  },

  deletePresentation: (id: string) => {
    set((state) => ({
      presentations: state.presentations.filter((p) => p.id !== id),
      currentPresentation:
        state.currentPresentation?.id === id ? null : state.currentPresentation,
    }));
    
    get().savePresentations();
  },

  selectPresentation: (id: string) => {
    const presentation = get().presentations.find((p) => p.id === id);
    if (presentation) {
      set({
        currentPresentation: presentation,
        currentSlideIndex: 0,
        selectedElementId: null,
      });
    }
  },

  loadPresentations: () => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('presentations');
      if (stored) {
        const presentations = JSON.parse(stored).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }));
        set({ presentations });
      }
    } catch (error) {
      console.error('Error loading presentations:', error);
    }
  },

  savePresentations: () => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('presentations', JSON.stringify(get().presentations));
    } catch (error) {
      console.error('Error saving presentations:', error);
    }
  },

  addSlide: () => {
    const state = get();
    if (!state.currentPresentation) return;
    
    const newSlide: Slide = createDefaultSlide();
    
    set((state) => {
      if (!state.currentPresentation) return state;
      
      return {
        currentPresentation: {
          ...state.currentPresentation,
          slides: [...state.currentPresentation.slides, newSlide],
          updatedAt: new Date(),
        },
        currentSlideIndex: state.currentPresentation.slides.length,
        selectedElementId: null,
      };
    });
    
    get().savePresentations();
  },

  deleteSlide: (slideId: string) => {
    const state = get();
    if (!state.currentPresentation) return;
    
    const slideIndex = state.currentPresentation.slides.findIndex(
      (s) => s.id === slideId
    );
    
    if (slideIndex === -1) return;
    
    set((state) => {
      if (!state.currentPresentation) return state;
      
      const newSlides = state.currentPresentation.slides.filter(
        (s) => s.id !== slideId
      );
      
      const newIndex = Math.min(
        state.currentSlideIndex,
        newSlides.length - 1
      );
      
      return {
        currentPresentation: {
          ...state.currentPresentation,
          slides: newSlides,
          updatedAt: new Date(),
        },
        currentSlideIndex: Math.max(0, newIndex),
        selectedElementId: null,
      };
    });
    
    get().savePresentations();
  },

  duplicateSlide: (slideId: string) => {
    const state = get();
    if (!state.currentPresentation) return;
    
    const slideIndex = state.currentPresentation.slides.findIndex(
      (s) => s.id === slideId
    );
    
    if (slideIndex === -1) return;
    
    const slideToDuplicate = state.currentPresentation.slides[slideIndex];
    const duplicatedSlide: Slide = {
      ...slideToDuplicate,
      id: uuidv4(),
      elements: slideToDuplicate.elements.map((el) => ({
        ...el,
        id: uuidv4(),
      })),
    };
    
    set((state) => {
      if (!state.currentPresentation) return state;
      
      const newSlides = [...state.currentPresentation.slides];
      newSlides.splice(slideIndex + 1, 0, duplicatedSlide);
      
      return {
        currentPresentation: {
          ...state.currentPresentation,
          slides: newSlides,
          updatedAt: new Date(),
        },
        currentSlideIndex: slideIndex + 1,
      };
    });
    
    get().savePresentations();
  },

  selectSlide: (index: number) => {
    set({
      currentSlideIndex: index,
      selectedElementId: null,
    });
  },

  reorderSlides: (fromIndex: number, toIndex: number) => {
    const state = get();
    if (!state.currentPresentation) return;
    
    const newSlides = [...state.currentPresentation.slides];
    const [removed] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, removed);
    
    set((state) => {
      if (!state.currentPresentation) return state;
      
      return {
        currentPresentation: {
          ...state.currentPresentation,
          slides: newSlides,
          updatedAt: new Date(),
        },
        currentSlideIndex: toIndex,
      };
    });
    
    get().savePresentations();
  },

  addElement: (element: Omit<SlideElement, 'id'>) => {
    const state = get();
    if (!state.currentPresentation) return;
    
    const currentSlide = state.currentPresentation.slides[state.currentSlideIndex];
    if (!currentSlide) return;
    
    const newElement: SlideElement = {
      ...element,
      id: uuidv4(),
    };
    
    set((state) => {
      if (!state.currentPresentation) return state;
      
      const slides = state.currentPresentation.slides.map((slide, index) =>
        index === state.currentSlideIndex
          ? { ...slide, elements: [...slide.elements, newElement] }
          : slide
      );
      
      return {
        currentPresentation: {
          ...state.currentPresentation,
          slides,
          updatedAt: new Date(),
        },
        selectedElementId: newElement.id,
      };
    });
    
    get().savePresentations();
  },

  updateElement: (elementId: string, updates: Partial<SlideElement>) => {
    const state = get();
    if (!state.currentPresentation) return;
    
    set((state) => {
      if (!state.currentPresentation) return state;
      
      const slides = state.currentPresentation.slides.map((slide) => ({
        ...slide,
        elements: slide.elements.map((el) =>
          el.id === elementId ? { ...el, ...updates } : el
        ),
      }));
      
      return {
        currentPresentation: {
          ...state.currentPresentation,
          slides,
          updatedAt: new Date(),
        },
      };
    });
    
    get().savePresentations();
  },

  deleteElement: (elementId: string) => {
    const state = get();
    if (!state.currentPresentation) return;
    
    set((state) => {
      if (!state.currentPresentation) return state;
      
      const slides = state.currentPresentation.slides.map((slide) => ({
        ...slide,
        elements: slide.elements.filter((el) => el.id !== elementId),
      }));
      
      return {
        currentPresentation: {
          ...state.currentPresentation,
          slides,
          updatedAt: new Date(),
        },
        selectedElementId: null,
      };
    });
    
    get().savePresentations();
  },

  selectElement: (elementId: string | null) => {
    set({ selectedElementId: elementId });
  },
}));
