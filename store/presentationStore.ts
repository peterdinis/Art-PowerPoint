"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type {
	Presentation,
	PresentationSummary,
	Slide,
	SlideElement,
} from "@/types/presentation";
import type { PresentationTemplate } from "@/lib/templates/presentationTemplates";
import { getTemplateById } from "@/lib/templates/presentationTemplates";
import { toast } from "sonner";
import localforage from "localforage";

// Initialize localforage
localforage.config({
	name: "PresentationBuilder",
	storeName: "presentations_store",
});

const templateCache = new Map<string, PresentationTemplate>();

interface PresentationStore {
	presentations: PresentationSummary[];
	currentPresentation: Presentation | null;
	currentSlideIndex: number;
	selectedElementId: string | null;
	lastAddedElementId: string | null;
	presentationOrder: string[];
	isLoading: boolean;
	hasLoadedFromStorage: boolean;
	zoomLevel: number;
	showGrid: boolean;

	// Presentation actions
	setPresentations: (presentations: PresentationSummary[]) => void;
	addPresentation: (presentation: Presentation) => void;
	createPresentation: (
		title: string,
		description?: string,
		templateId?: string,
	) => string;
	updatePresentation: (id: string, updates: Partial<Presentation>) => void;
	deletePresentation: (id: string) => void;
	restorePresentation: (id: string) => void;
	permanentlyDeletePresentation: (id: string) => void;
	selectPresentation: (id: string) => Promise<void>;
	loadPresentations: () => Promise<void>;
	savePresentations: () => void;

	// Drag & Drop ordering
	reorderPresentations: (fromIndex: number, toIndex: number) => void;
	reorderPresentationsByIds: (orderedIds: string[]) => void;
	updatePresentationOrder: (newOrder: string[]) => void;
	resetPresentationOrder: () => void;

	// Slide actions
	addSlide: (presentationId: string) => void;
	deleteSlide: (slideId: string) => void;
	duplicateSlide: (slideId: string) => void;
	selectSlide: (index: number) => void;
	reorderSlides: (fromIndex: number, toIndex: number) => void;

	// Element actions
	addElement: (element: Omit<SlideElement, "id">) => void;
	addElementToSlide: (slideId: string, element: SlideElement) => void;
	updateElement: (elementId: string, updates: DeepPartial<SlideElement>) => void;
	deleteElement: (elementId: string) => void;
	selectElement: (elementId: string | null) => void;
	clearLastAddedElementId: () => void;
	moveElementLayer: (
		elementId: string,
		direction: "front" | "back" | "forward" | "backward",
	) => void;
	alignElement: (
		elementId: string,
		alignment: "left" | "center" | "right" | "top" | "middle" | "bottom",
	) => void;
	previousSlide: () => void;
	nextSlide: () => void;
	setZoomLevel: (zoom: number) => void;
	toggleGrid: () => void;
	compressPresentation: () => void;
}

const createDefaultSlide = (): Slide => ({
	id: uuidv4(),
	elements: [],
	background: { type: "color", color: "#ffffff" },
});

export const usePresentationStore = create<PresentationStore>((set, get) => ({
	presentations: [],
	currentPresentation: null,
	currentSlideIndex: 0,
	selectedElementId: null,
	lastAddedElementId: null,
	presentationOrder: [],
	isLoading: false,
	hasLoadedFromStorage: false,
	zoomLevel: 1,
	showGrid: false,

	setPresentations: (presentations: PresentationSummary[]) => {
		set({ presentations });
	},

	createPresentation: (
		title: string,
		description?: string,
		templateId?: string,
	) => {
		let slides: Slide[] = [createDefaultSlide()];

		if (templateId) {
			let template = templateCache.get(templateId);
			if (!template) {
				template = getTemplateById(templateId);
				if (template) templateCache.set(templateId, template);
			}

			if (template) {
				slides = (template.slides || []).map((slide: Slide) => ({
					...slide,
					id: uuidv4(),
					elements: (slide.elements || []).map((el: SlideElement) => ({
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

		get().addPresentation(newPresentation);

		set({
			currentPresentation: newPresentation,
			currentSlideIndex: 0,
		});

		return newPresentation.id;
	},

	addPresentation: (presentation: Presentation) => {
		set((state) => ({
			presentations: [
				{
					id: presentation.id,
					title: presentation.title,
					description: presentation.description,
					updatedAt: presentation.updatedAt,
					createdAt: presentation.createdAt,
					slidesCount: (presentation.slides || []).length,
					deletedAt: presentation.deletedAt,
					visibility: presentation.visibility,
				},
				...state.presentations,
			],
			presentationOrder: [presentation.id, ...state.presentationOrder],
		}));

		localforage.setItem(
			`presentation_content_${presentation.id}`,
			JSON.stringify(presentation),
		);

		setTimeout(() => get().savePresentations(), 0);
	},

	updatePresentation: (id: string, updates: Partial<Presentation>) => {
		set((state) => {
			const updatedPresentations = state.presentations.map((p) => {
				if (p.id === id) {
					const updatedSummary: PresentationSummary = {
						...p,
						...updates,
						updatedAt: new Date(),
						slidesCount: updates.slides ? updates.slides.length : p.slidesCount,
					} as PresentationSummary;
					return updatedSummary;
				}
				return p;
			});

			const currentPresentation =
				state.currentPresentation?.id === id
					? { ...state.currentPresentation, ...updates, updatedAt: new Date() }
					: state.currentPresentation;

			return { presentations: updatedPresentations, currentPresentation };
		});
		setTimeout(() => get().savePresentations(), 0);
	},

	deletePresentation: (id: string) => {
		set((state) => {
			const updatedPresentations = state.presentations.map((p) =>
				p.id === id ? { ...p, deletedAt: new Date(), updatedAt: new Date() } : p,
			);
			return {
				presentations: updatedPresentations,
				currentPresentation:
					state.currentPresentation?.id === id ? null : state.currentPresentation,
			};
		});
		setTimeout(() => get().savePresentations(), 0);
	},

	restorePresentation: (id: string) => {
		set((state) => {
			const presentation = state.presentations.find((p) => p.id === id);
			if (!presentation) return state;

			return {
				presentations: state.presentations.map((p) =>
					p.id === id
						? { ...p, deletedAt: undefined, updatedAt: new Date() }
						: p,
				),
			};
		});

		setTimeout(() => get().savePresentations(), 0);
	},

	permanentlyDeletePresentation: (id: string) => {
		set((state) => ({
			presentations: state.presentations.filter((p) => p.id !== id),
			presentationOrder: state.presentationOrder.filter(
				(orderId) => orderId !== id,
			),
			currentPresentation:
				state.currentPresentation?.id === id ? null : state.currentPresentation,
		}));

		localforage.removeItem(`presentation_content_${id}`);
		setTimeout(() => get().savePresentations(), 0);
	},

	selectPresentation: async (id: string) => {
		const state = get();
		if (state.currentPresentation?.id === id) {
			return;
		}

		const metadata = state.presentations.find((p) => p.id === id);
		if (!metadata) return;

		try {
			const contentStr = await localforage.getItem<string>(`presentation_content_${id}`);
			let presentation: Presentation;

			if (contentStr) {
				presentation = JSON.parse(contentStr);
				presentation.createdAt = new Date(presentation.createdAt);
				presentation.updatedAt = new Date(presentation.updatedAt);

				// Defensive check for slides
				if (!presentation.slides) {
					presentation.slides = [createDefaultSlide()];
				}
			} else {
				toast.error("Failed to load presentation content.");
				return;
			}

			set({
				currentPresentation: {
					...presentation,
					selectedSlideId: presentation.slides[0]?.id,
				},
				currentSlideIndex: 0,
				selectedElementId: null,
			});
		} catch (error) {
			console.error("Error loading presentation content:", error);
			toast.error("Error loading presentation.");
		}
	},

	loadPresentations: async () => {
		if (typeof window === "undefined") return;

		const state = get();
		if (state.hasLoadedFromStorage) return;

		set({ isLoading: true });

		try {
			const metadataStored = await localforage.getItem<string>("presentation_metadata");
			let presentations: PresentationSummary[] = [];

			if (metadataStored) {
				presentations = JSON.parse(metadataStored).map((p: any) => ({
					...p,
					createdAt: new Date(p.createdAt),
					updatedAt: new Date(p.updatedAt),
					deletedAt: p.deletedAt ? new Date(p.deletedAt) : undefined,
				}));
			} else {
				// Migration path
				const oldStored = await localforage.getItem<string>("presentations");
				if (oldStored) {
					const oldPresentations = (JSON.parse(oldStored) as Presentation[]).map((p) => ({
						...p,
						createdAt: new Date(p.createdAt),
						updatedAt: new Date(p.updatedAt),
						deletedAt: p.deletedAt ? new Date(p.deletedAt) : undefined,
					}));

					presentations = oldPresentations.map(p => ({
						id: p.id,
						title: p.title,
						description: p.description,
						updatedAt: p.updatedAt,
						createdAt: p.createdAt,
						slidesCount: (p.slides || []).length,
						deletedAt: p.deletedAt,
						visibility: p.visibility,
					}));

					for (const p of oldPresentations) {
						await localforage.setItem(`presentation_content_${p.id}`, JSON.stringify(p));
					}
					await localforage.setItem("presentation_metadata", JSON.stringify(presentations));
				}
			}

			const orderStored = await localforage.getItem<string>("presentationOrder");
			let presentationOrder: string[] = [];

			if (orderStored) {
				presentationOrder = JSON.parse(orderStored);
				const validOrder = presentationOrder.filter((orderId) =>
					presentations.some((p) => p.id === orderId),
				);
				const missingPresentations = presentations.filter(
					(p) => !validOrder.includes(p.id),
				);
				presentationOrder = [
					...validOrder,
					...missingPresentations.map((p) => p.id),
				];
			} else {
				presentationOrder = [...presentations]
					.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
					.map((p) => p.id);
			}

			set({
				presentations,
				presentationOrder,
				isLoading: false,
				hasLoadedFromStorage: true,
			});
		} catch (error) {
			console.error("Error loading presentations:", error);
			set({ isLoading: false, hasLoadedFromStorage: true });
		}
	},

	savePresentations: () => {
		if (typeof window === "undefined") return;

		const state = get() as any;
		if (state._saveTimeout) {
			clearTimeout(state._saveTimeout);
		}

		const timeout = setTimeout(async () => {
			try {
				const currentState = get();

				const metadata: PresentationSummary[] = currentState.presentations.map(p => ({
					id: p.id,
					title: p.title,
					description: p.description,
					updatedAt: p.updatedAt,
					createdAt: p.createdAt,
					slidesCount: p.slidesCount || 0,
					deletedAt: p.deletedAt,
					visibility: p.visibility,
				}));

				await localforage.setItem("presentation_metadata", JSON.stringify(metadata));

				if (currentState.currentPresentation) {
					await localforage.setItem(
						`presentation_content_${currentState.currentPresentation.id}`,
						JSON.stringify(currentState.currentPresentation)
					);
				}

				await localforage.setItem(
					"presentationOrder",
					JSON.stringify(currentState.presentationOrder),
				);
			} catch (error: unknown) {
				console.error("Error saving presentations:", error);
				toast.error("Failed to save changes.");
			}
		}, 1000);

		set({ _saveTimeout: timeout } as any);
	},

	reorderPresentations: (fromIndex: number, toIndex: number) => {
		set((state) => {
			const newOrder = [...state.presentationOrder];
			const [movedItem] = newOrder.splice(fromIndex, 1);
			newOrder.splice(toIndex, 0, movedItem);

			const reorderedPresentations = [...state.presentations].sort((a, b) => {
				const indexA = newOrder.indexOf(a.id);
				const indexB = newOrder.indexOf(b.id);
				return indexA - indexB;
			});

			return {
				presentationOrder: newOrder,
				presentations: reorderedPresentations,
			};
		});

		setTimeout(() => get().savePresentations(), 0);
	},

	reorderPresentationsByIds: (orderedIds: string[]) => {
		set((state) => {
			const validIds = orderedIds.filter((id) =>
				state.presentations.some((p) => p.id === id),
			);
			const missingIds = state.presentations
				.filter((p) => !validIds.includes(p.id))
				.map((p) => p.id);

			const finalOrder = [...validIds, ...missingIds];

			const reorderedPresentations = [...state.presentations].sort((a, b) => {
				const indexA = finalOrder.indexOf(a.id);
				const indexB = finalOrder.indexOf(b.id);
				return indexA - indexB;
			});

			return {
				presentationOrder: finalOrder,
				presentations: reorderedPresentations,
			};
		});

		setTimeout(() => get().savePresentations(), 0);
	},

	updatePresentationOrder: (newOrder: string[]) => {
		set({ presentationOrder: newOrder });
		setTimeout(() => get().savePresentations(), 0);
	},

	resetPresentationOrder: () => {
		set((state) => {
			const defaultOrder = [...state.presentations]
				.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
				.map((p) => p.id);
			return { presentationOrder: defaultOrder };
		});
		setTimeout(() => get().savePresentations(), 0);
	},

	addSlide: (presentationId: string) => {
		set((state) => {
			if (!state.currentPresentation || state.currentPresentation.id !== presentationId) return state;

			const newSlide = createDefaultSlide();
			const updatedPresentation = {
				...state.currentPresentation,
				slides: [...(state.currentPresentation.slides || []), newSlide],
				selectedSlideId: newSlide.id,
				updatedAt: new Date(),
			};

			return {
				currentPresentation: updatedPresentation,
				presentations: state.presentations.map((p) =>
					p.id === updatedPresentation.id
						? { ...p, slidesCount: updatedPresentation.slides.length, updatedAt: updatedPresentation.updatedAt }
						: p,
				),
				currentSlideIndex: updatedPresentation.slides.length - 1,
				selectedElementId: null,
			};
		});
		setTimeout(() => get().savePresentations(), 0);
	},

	deleteSlide: (slideId: string) => {
		set((state) => {
			if (!state.currentPresentation) return state;

			const newSlides = (state.currentPresentation.slides || []).filter(s => s.id !== slideId);
			if (newSlides.length === (state.currentPresentation.slides || []).length) return state;

			const newIndex = Math.min(state.currentSlideIndex, newSlides.length - 1);
			const updatedPresentation = {
				...state.currentPresentation,
				slides: newSlides,
				selectedSlideId: newSlides[Math.max(0, newIndex)]?.id,
				updatedAt: new Date(),
			};

			return {
				currentPresentation: updatedPresentation,
				presentations: state.presentations.map((p) =>
					p.id === updatedPresentation.id
						? { ...p, slidesCount: updatedPresentation.slides.length, updatedAt: updatedPresentation.updatedAt }
						: p,
				),
				currentSlideIndex: Math.max(0, newIndex),
				selectedElementId: null,
			};
		});
		setTimeout(() => get().savePresentations(), 0);
	},

	duplicateSlide: (slideId: string) => {
		set((state) => {
			if (!state.currentPresentation) return state;

			const slideIndex = (state.currentPresentation.slides || []).findIndex(s => s.id === slideId);
			if (slideIndex === -1) return state;

			const slideToDuplicate = state.currentPresentation.slides[slideIndex];
			const duplicatedSlide: Slide = {
				...slideToDuplicate,
				id: uuidv4(),
				elements: (slideToDuplicate.elements || []).map(el => ({ ...el, id: uuidv4() })),
			};

			const newSlides = [...state.currentPresentation.slides];
			newSlides.splice(slideIndex + 1, 0, duplicatedSlide);

			const updatedPresentation = {
				...state.currentPresentation,
				slides: newSlides,
				selectedSlideId: duplicatedSlide.id,
				updatedAt: new Date(),
			};

			return {
				currentPresentation: updatedPresentation,
				presentations: state.presentations.map((p) =>
					p.id === updatedPresentation.id
						? { ...p, slidesCount: updatedPresentation.slides.length, updatedAt: updatedPresentation.updatedAt }
						: p,
				),
				currentSlideIndex: slideIndex + 1,
			};
		});
		setTimeout(() => get().savePresentations(), 0);
	},

	selectSlide: (index: number) => {
		set((state) => {
			if (!state.currentPresentation) return state;
			const slides = state.currentPresentation.slides || [];
			const slide = slides[index];
			if (!slide) return state;

			return {
				currentPresentation: {
					...state.currentPresentation,
					selectedSlideId: slide.id,
				},
				currentSlideIndex: index,
				selectedElementId: null,
			};
		});
	},

	reorderSlides: (fromIndex: number, toIndex: number) => {
		set((state) => {
			if (!state.currentPresentation) return state;

			const newSlides = [...(state.currentPresentation.slides || [])];
			const [removed] = newSlides.splice(fromIndex, 1);
			newSlides.splice(toIndex, 0, removed);

			const updatedPresentation = {
				...state.currentPresentation,
				slides: newSlides,
				updatedAt: new Date(),
			};

			return {
				currentPresentation: updatedPresentation,
				presentations: state.presentations.map((p) =>
					p.id === updatedPresentation.id
						? { ...p, updatedAt: updatedPresentation.updatedAt }
						: p,
				),
				currentSlideIndex: toIndex,
			};
		});
		setTimeout(() => get().savePresentations(), 0);
	},

	addElement: (element: Omit<SlideElement, "id">) => {
		set((state) => {
			if (!state.currentPresentation) return state;
			const currentSlide = (state.currentPresentation.slides || [])[state.currentSlideIndex];
			if (!currentSlide) return state;

			const newElement: SlideElement = { ...element, id: uuidv4() };
			const updatedSlides = [...state.currentPresentation.slides];
			updatedSlides[state.currentSlideIndex] = {
				...currentSlide,
				elements: [...(currentSlide.elements || []), newElement],
			};

			const updatedPresentation = {
				...state.currentPresentation,
				slides: updatedSlides,
				updatedAt: new Date(),
			};

			return {
				currentPresentation: updatedPresentation,
				presentations: state.presentations.map((p) =>
					p.id === updatedPresentation.id ? { ...p, updatedAt: updatedPresentation.updatedAt } : p,
				),
				selectedElementId: newElement.id,
			};
		});
		get().savePresentations();
	},

	addElementToSlide: (slideId: string, element: SlideElement) => {
		set((state) => {
			if (!state.currentPresentation) return state;
			const slideIndex = (state.currentPresentation.slides || []).findIndex(s => s.id === slideId);
			if (slideIndex === -1) return state;

			const updatedSlides = [...state.currentPresentation.slides];
			updatedSlides[slideIndex] = {
				...updatedSlides[slideIndex],
				elements: [...(updatedSlides[slideIndex].elements || []), element],
			};

			const updatedPresentation = {
				...state.currentPresentation,
				slides: updatedSlides,
				updatedAt: new Date(),
			};

			return {
				currentPresentation: updatedPresentation,
				presentations: state.presentations.map((p) =>
					p.id === updatedPresentation.id ? { ...p, updatedAt: updatedPresentation.updatedAt } : p,
				),
			};
		});
		get().savePresentations();
	},

	updateElement: (elementId: string, updates: Partial<SlideElement>) => {
		set((state) => {
			if (!state.currentPresentation) return state;

			const updatedSlides = (state.currentPresentation.slides || []).map(slide => ({
				...slide,
				elements: (slide.elements || []).map(el => (el.id === elementId ? { ...el, ...updates } : el)),
			}));

			const updatedPresentation = {
				...state.currentPresentation,
				slides: updatedSlides,
				updatedAt: new Date(),
			};

			return {
				currentPresentation: updatedPresentation,
				presentations: state.presentations.map((p) =>
					p.id === updatedPresentation.id ? { ...p, updatedAt: updatedPresentation.updatedAt } : p,
				),
			};
		});
		get().savePresentations();
	},

	deleteElement: (elementId: string) => {
		set((state) => {
			if (!state.currentPresentation) return state;

			const updatedSlides = (state.currentPresentation.slides || []).map(slide => ({
				...slide,
				elements: (slide.elements || []).filter(el => el.id !== elementId),
			}));

			const updatedPresentation = {
				...state.currentPresentation,
				slides: updatedSlides,
				updatedAt: new Date(),
			};

			return {
				currentPresentation: updatedPresentation,
				presentations: state.presentations.map((p) =>
					p.id === updatedPresentation.id ? { ...p, updatedAt: updatedPresentation.updatedAt } : p,
				),
				selectedElementId: null,
			};
		});
		get().savePresentations();
	},

	selectElement: (elementId: string | null) => {
		set({ selectedElementId: elementId });
	},

	moveElementLayer: (elementId, direction) => {
		set((state) => {
			if (!state.currentPresentation) return state;
			const currentSlide = (state.currentPresentation.slides || [])[state.currentSlideIndex];
			if (!currentSlide) return state;

			const elements = [...(currentSlide.elements || [])];
			const index = elements.findIndex(el => el.id === elementId);
			if (index === -1) return state;

			const element = elements.splice(index, 1)[0];
			if (direction === "front") elements.push(element);
			else if (direction === "back") elements.unshift(element);
			else if (direction === "forward") elements.splice(Math.min(index + 1, elements.length), 0, element);
			else if (direction === "backward") elements.splice(Math.max(index - 1, 0), 0, element);

			const updatedSlides = [...state.currentPresentation.slides];
			updatedSlides[state.currentSlideIndex] = { ...currentSlide, elements };

			return {
				currentPresentation: { ...state.currentPresentation, slides: updatedSlides, updatedAt: new Date() },
			};
		});
		get().savePresentations();
	},

	alignElement: (elementId, alignment) => {
		set((state) => {
			if (!state.currentPresentation) return state;
			const currentSlide = (state.currentPresentation.slides || [])[state.currentSlideIndex];
			if (!currentSlide) return state;

			const elements = (currentSlide.elements || []).map(el => {
				if (el.id !== elementId) return el;
				const newPos = { ...el.position };
				if (alignment === "left") newPos.x = 0;
				else if (alignment === "center") newPos.x = (960 - el.size.width) / 2;
				else if (alignment === "right") newPos.x = 960 - el.size.width;
				else if (alignment === "top") newPos.y = 0;
				else if (alignment === "middle") newPos.y = (540 - el.size.height) / 2;
				else if (alignment === "bottom") newPos.y = 540 - el.size.height;
				return { ...el, position: newPos };
			});

			const updatedSlides = [...state.currentPresentation.slides];
			updatedSlides[state.currentSlideIndex] = { ...currentSlide, elements };

			return {
				currentPresentation: { ...state.currentPresentation, slides: updatedSlides, updatedAt: new Date() },
			};
		});
		get().savePresentations();
	},

	previousSlide: () => {
		const { currentSlideIndex, selectSlide } = get();
		if (currentSlideIndex > 0) selectSlide(currentSlideIndex - 1);
	},

	nextSlide: () => {
		const { currentSlideIndex, currentPresentation, selectSlide } = get();
		if (currentPresentation && currentSlideIndex < (currentPresentation.slides || []).length - 1) {
			selectSlide(currentSlideIndex + 1);
		}
	},

	setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
	toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
	compressPresentation: () => {
		toast.info("Compression logic not implemented yet.")
	},
})
);