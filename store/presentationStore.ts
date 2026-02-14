import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type {
	Presentation,
	Slide,
	SlideElement,
} from "@/lib/types/presentation";
import { getTemplateById } from "@/lib/templates/presentationTemplates";

interface PresentationStore {
	presentations: Presentation[];
	currentPresentation: Presentation | null;
	currentSlideIndex: number;
	selectedElementId: string | null;
	presentationOrder: string[];
	isLoading: boolean;
	zoomLevel: number; // Added
	showGrid: boolean; // Added

	// Presentation actions
	createPresentation: (
		title: string,
		description?: string,
		templateId?: string,
	) => string;
	updatePresentation: (id: string, updates: Partial<Presentation>) => void;
	deletePresentation: (id: string) => void;
	restorePresentation: (id: string) => void;
	permanentlyDeletePresentation: (id: string) => void;
	selectPresentation: (id: string) => void;
	loadPresentations: () => void;
	savePresentations: () => void;

	// Drag & Drop ordering
	reorderPresentations: (fromIndex: number, toIndex: number) => void;
	reorderPresentationsByIds: (orderedIds: string[]) => void;
	updatePresentationOrder: (newOrder: string[]) => void;
	resetPresentationOrder: () => void;

	// Slide actions
	addSlide: () => void;
	deleteSlide: (slideId: string) => void;
	duplicateSlide: (slideId: string) => void;
	selectSlide: (index: number) => void;
	reorderSlides: (fromIndex: number, toIndex: number) => void;

	// Element actions
	addElement: (element: Omit<SlideElement, "id">) => void;
	addElementToSlide: (slideId: string, element: any) => void;
	updateElement: (elementId: string, updates: Partial<SlideElement>) => void;
	deleteElement: (elementId: string) => void;
	selectElement: (elementId: string | null) => void;
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
	setZoomLevel: (zoom: number) => void; // Added
	toggleGrid: () => void; // Added
	compressPresentation: () => void; // Added
}

const createDefaultSlide = (): Slide => ({
	id: uuidv4(),
	elements: [],
	background: { color: undefined },
});

export const usePresentationStore = create<PresentationStore>((set, get) => ({
	presentations: [],
	currentPresentation: null,
	currentSlideIndex: 0,
	selectedElementId: null,
	presentationOrder: [],
	isLoading: false,
	zoomLevel: 1,
	showGrid: false,

	createPresentation: (
		title: string,
		description?: string,
		templateId?: string,
	) => {
		let slides: Slide[] = [createDefaultSlide()];

		if (templateId) {
			const template = getTemplateById(templateId);
			if (template) {
				slides = template.slides.map((slide) => ({
					...slide,
					id: uuidv4(),
					elements: slide.elements.map((el: any) => ({
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
			presentationOrder: [...state.presentationOrder, newPresentation.id],
			currentPresentation: newPresentation,
			currentSlideIndex: 0,
		}));

		// Odložené uloženie
		setTimeout(() => {
			get().savePresentations();
		}, 0);

		return newPresentation.id;
	},

	updatePresentation: (id: string, updates: Partial<Presentation>) => {
		set((state) => {
			const updated = state.presentations.map((p) =>
				p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p,
			);

			const current =
				state.currentPresentation?.id === id
					? { ...state.currentPresentation, ...updates, updatedAt: new Date() }
					: state.currentPresentation;

			return {
				presentations: updated,
				currentPresentation: current,
			};
		});

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	deletePresentation: (id: string) => {
		set((state) => ({
			presentations: state.presentations.map((p) =>
				p.id === id
					? { ...p, deletedAt: new Date(), updatedAt: new Date() }
					: p,
			),
			presentationOrder: state.presentationOrder.filter(
				(orderId) => orderId !== id,
			),
			currentPresentation:
				state.currentPresentation?.id === id ? null : state.currentPresentation,
		}));

		setTimeout(() => {
			get().savePresentations();
		}, 0);
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
				presentationOrder: [...state.presentationOrder, id],
			};
		});

		setTimeout(() => {
			get().savePresentations();
		}, 0);
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

		setTimeout(() => {
			get().savePresentations();
		}, 0);
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
		if (typeof window === "undefined") return;

		try {
			// Načítanie prezentácií
			const stored = localStorage.getItem("presentations");
			let presentations: Presentation[] = [];

			if (stored) {
				presentations = JSON.parse(stored).map((p: any) => ({
					...p,
					createdAt: new Date(p.createdAt),
					updatedAt: new Date(p.updatedAt),
				}));
			}

			// Načítanie poradia
			const orderStored = localStorage.getItem("presentationOrder");
			let presentationOrder: string[] = [];

			if (orderStored) {
				presentationOrder = JSON.parse(orderStored);

				// Skontrolovať, či všetky ID v poradí existujú
				const validOrder = presentationOrder.filter((orderId) =>
					presentations.some((p: Presentation) => p.id === orderId),
				);

				// Pridať chýbajúce prezentácie na koniec
				const missingPresentations = presentations.filter(
					(p: Presentation) => !validOrder.includes(p.id),
				);

				presentationOrder = [
					...validOrder,
					...missingPresentations.map((p: Presentation) => p.id),
				];
			} else {
				// Ak neexistuje poradie, vytvoriť podľa dátumu vytvorenia
				presentationOrder = [...presentations]
					.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
					)
					.map((p) => p.id);
			}

			// Nastaviť stav naraz
			set({
				presentations,
				presentationOrder,
				isLoading: false,
			});
		} catch (error) {
			console.error("Error loading presentations:", error);
			set({ isLoading: false });
		}
	},

	savePresentations: () => {
		if (typeof window === "undefined") return;

		try {
			const state = get();
			localStorage.setItem(
				"presentations",
				JSON.stringify(state.presentations),
			);
			localStorage.setItem(
				"presentationOrder",
				JSON.stringify(state.presentationOrder),
			);
		} catch (error) {
			console.error("Error saving presentations:", error);
		}
	},

	reorderPresentations: (fromIndex: number, toIndex: number) => {
		const state = get();
		const newOrder = [...state.presentationOrder];
		const [movedItem] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, movedItem);

		// Reorder presentations array based on the new order
		const reorderedPresentations = [...state.presentations].sort((a, b) => {
			const indexA = newOrder.indexOf(a.id);
			const indexB = newOrder.indexOf(b.id);
			return indexA - indexB;
		});

		set({
			presentationOrder: newOrder,
			presentations: reorderedPresentations,
		});

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	reorderPresentationsByIds: (orderedIds: string[]) => {
		const state = get();

		// Skontrolovať, či všetky ID existujú
		const validIds = orderedIds.filter((id) =>
			state.presentations.some((p) => p.id === id),
		);

		// Pridať chýbajúce prezentácie na koniec
		const missingIds = state.presentations
			.filter((p) => !validIds.includes(p.id))
			.map((p) => p.id);

		const finalOrder = [...validIds, ...missingIds];

		// Reorder presentations array
		const reorderedPresentations = [...state.presentations].sort((a, b) => {
			const indexA = finalOrder.indexOf(a.id);
			const indexB = finalOrder.indexOf(b.id);
			return indexA - indexB;
		});

		set({
			presentationOrder: finalOrder,
			presentations: reorderedPresentations,
		});

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	updatePresentationOrder: (newOrder: string[]) => {
		set({ presentationOrder: newOrder });
		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	resetPresentationOrder: () => {
		const state = get();
		const defaultOrder = [...state.presentations]
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
			.map((p) => p.id);

		set({ presentationOrder: defaultOrder });

		setTimeout(() => {
			get().savePresentations();
		}, 0);
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

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	deleteSlide: (slideId: string) => {
		const state = get();
		if (!state.currentPresentation) return;

		const slideIndex = state.currentPresentation.slides.findIndex(
			(s) => s.id === slideId,
		);

		if (slideIndex === -1) return;

		set((state) => {
			if (!state.currentPresentation) return state;

			const newSlides = state.currentPresentation.slides.filter(
				(s: Slide) => s.id !== slideId,
			);

			const newIndex = Math.min(state.currentSlideIndex, newSlides.length - 1);

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

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	duplicateSlide: (slideId: string) => {
		const state = get();
		if (!state.currentPresentation) return;

		const slideIndex = state.currentPresentation.slides.findIndex(
			(s) => s.id === slideId,
		);

		if (slideIndex === -1) return;

		const slideToDuplicate = state.currentPresentation.slides[slideIndex];
		const duplicatedSlide: Slide = {
			...slideToDuplicate,
			id: uuidv4(),
			elements: slideToDuplicate.elements.map((el: SlideElement) => ({
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

		setTimeout(() => {
			get().savePresentations();
		}, 0);
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

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	addElement: (element: Omit<SlideElement, "id">) => {
		const state = get();
		if (!state.currentPresentation) return;

		const currentSlide =
			state.currentPresentation.slides[state.currentSlideIndex];
		if (!currentSlide) return;

		const newElement: SlideElement = {
			...element,
			id: uuidv4(),
		};

		set((state) => {
			if (!state.currentPresentation) return state;

			const slides = state.currentPresentation.slides.map(
				(slide: Slide, index: number) =>
					index === state.currentSlideIndex
						? { ...slide, elements: [...slide.elements, newElement] }
						: slide,
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

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	updateElement: (elementId: string, updates: Partial<SlideElement>) => {
		const state = get();
		if (!state.currentPresentation) return;

		set((state) => {
			if (!state.currentPresentation) return state;

			const slides = state.currentPresentation.slides.map((slide: Slide) => ({
				...slide,
				elements: slide.elements.map((el: SlideElement) =>
					el.id === elementId ? { ...el, ...updates } : el,
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

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	deleteElement: (elementId: string) => {
		const state = get();
		if (!state.currentPresentation) return;

		set((state) => {
			if (!state.currentPresentation) return state;

			const slides = state.currentPresentation.slides.map((slide: Slide) => ({
				...slide,
				elements: slide.elements.filter(
					(el: SlideElement) => el.id !== elementId,
				),
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

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},

	selectElement: (elementId: string | null) => {
		set({ selectedElementId: elementId });
	},

	moveElementLayer: (
		elementId: string,
		direction: "front" | "back" | "forward" | "backward",
	) => {
		set((state) => {
			if (!state.currentPresentation) return state;

			const slides = state.currentPresentation.slides.map((slide) => {
				const element = slide.elements.find((el) => el.id === elementId);
				if (!element) return slide;

				const elements = [...slide.elements];
				const index = elements.indexOf(element);

				if (direction === "front") {
					elements.splice(index, 1);
					elements.push(element);
				} else if (direction === "back") {
					elements.splice(index, 1);
					elements.unshift(element);
				} else if (direction === "forward" && index < elements.length - 1) {
					[elements[index], elements[index + 1]] = [
						elements[index + 1],
						elements[index],
					];
				} else if (direction === "backward" && index > 0) {
					[elements[index], elements[index - 1]] = [
						elements[index - 1],
						elements[index],
					];
				}

				return { ...slide, elements };
			});

			return {
				currentPresentation: {
					...state.currentPresentation,
					slides,
					updatedAt: new Date(),
				},
			};
		});
		setTimeout(() => get().savePresentations(), 0);
	},

	alignElement: (
		elementId: string,
		alignment: "left" | "center" | "right" | "top" | "middle" | "bottom",
	) => {
		set((state) => {
			if (!state.currentPresentation) return state;

			const slides = state.currentPresentation.slides.map((slide) => ({
				...slide,
				elements: slide.elements.map((el) => {
					if (el.id !== elementId) return el;

					const updates: Partial<typeof el.position> = {};
					const canvasWidth = 960;
					const canvasHeight = 540;

					if (alignment === "left") updates.x = 0;
					else if (alignment === "center")
						updates.x = (canvasWidth - el.size.width) / 2;
					else if (alignment === "right")
						updates.x = canvasWidth - el.size.width;
					else if (alignment === "top") updates.y = 0;
					else if (alignment === "middle")
						updates.y = (canvasHeight - el.size.height) / 2;
					else if (alignment === "bottom")
						updates.y = canvasHeight - el.size.height;

					return { ...el, position: { ...el.position, ...updates } };
				}),
			}));

			return {
				currentPresentation: {
					...state.currentPresentation,
					slides,
					updatedAt: new Date(),
				},
			};
		});
		setTimeout(() => get().savePresentations(), 0);
	},

	addElementToSlide: (slideId: string, element: any) => {
		const state = get();
		if (!state.currentPresentation) return;

		const updatedPresentation = {
			...state.currentPresentation,
			slides: state.currentPresentation.slides.map((s) => {
				if (s.id === slideId) {
					return {
						...s,
						elements: [
							...s.elements,
							{ ...element, id: element.id || uuidv4() },
						],
					};
				}
				return s;
			}),
			updatedAt: new Date(),
		};

		set({
			currentPresentation: updatedPresentation,
			presentations: state.presentations.map((p) =>
				p.id === updatedPresentation.id ? updatedPresentation : p,
			),
		});

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},
	previousSlide: () => {
		const state = get();
		if (state.currentPresentation && state.currentSlideIndex > 0) {
			set({
				currentSlideIndex: state.currentSlideIndex - 1,
				selectedElementId: null,
			});
		}
	},

	nextSlide: () => {
		const state = get();
		if (
			state.currentPresentation &&
			state.currentSlideIndex < state.currentPresentation.slides.length - 1
		) {
			set({
				currentSlideIndex: state.currentSlideIndex + 1,
				selectedElementId: null,
			});
		}
	},

	setZoomLevel: (zoom: number) => {
		set({ zoomLevel: Math.max(0.1, Math.min(2, zoom)) });
	},

	toggleGrid: () => {
		set((state) => ({ showGrid: !state.showGrid }));
	},

	compressPresentation: () => {
		const state = get();
		if (!state.currentPresentation) return;

		set((state) => {
			if (!state.currentPresentation) return state;

			const compressedSlides = state.currentPresentation.slides.map(
				(slide: Slide) => ({
					...slide,
					elements: slide.elements
						.filter((el: SlideElement) => {
							// Remove empty text elements
							if (el.type === "text" && !el.content?.trim()) return false;
							return true;
						})
						.map((el: SlideElement) => {
							const cleanedEl = { ...el };

							// Remove potential large/unnecessary properties if they are default
							if (cleanedEl.style) {
								const style = { ...cleanedEl.style };
								// Remove properties that are null or undefined to save space
								Object.keys(style).forEach((key) => {
									if (
										style[key as keyof typeof style] === undefined ||
										style[key as keyof typeof style] === null
									) {
										delete style[key as keyof typeof style];
									}
								});
								cleanedEl.style = style;
							}

							return cleanedEl;
						}),
				}),
			);

			const updatedPresentation = {
				...state.currentPresentation,
				slides: compressedSlides,
				updatedAt: new Date(),
			};

			return {
				currentPresentation: updatedPresentation,
				presentations: state.presentations.map((p) =>
					p.id === updatedPresentation.id ? updatedPresentation : p,
				),
			};
		});

		setTimeout(() => {
			get().savePresentations();
		}, 0);
	},
}));
