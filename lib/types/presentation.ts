export type SlideElementType = "text" | "image" | "shape" | "video" | "chart";
export type TextAlign = "left" | "center" | "right" | "justify";
export type FontWeight = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
export type FontStyle = "normal" | "italic" | "oblique";
export type TextDecoration = "none" | "underline" | "line-through" | "overline";
export type ObjectFit = "fill" | "contain" | "cover" | "none" | "scale-down";
export type BorderStyle = "solid" | "dashed" | "dotted" | "double";

export type AnimationType =
	| "none"
	| "fadeIn"
	| "slideIn"
	| "zoomIn"
	| "bounce"
	| "rotate"
	| "fadeOut"
	| "slideOut"
	| "zoomOut"
	| "pulse"
	| "shake";

export type SlideTransitionType =
	| "none"
	| "fade"
	| "slide"
	| "zoom"
	| "blur"
	| "cube"
	| "flip";

export type ShapeType =
	| "square"
	| "circle"
	| "triangle"
	| "rectangle"
	| "rounded"
	| "star"
	| "ellipse"
	| "hexagon"
	| "arrow"
	| "heart"
	| "octagon"
	| "diamond";

export interface SlideElement {
	id: string;
	type: SlideElementType;
	content: string;
	position: { x: number; y: number };
	size: { width: number; height: number };
	rotation?: number;
	style?: {
		// Text styles
		color?: string;
		fontSize?: number;
		fontFamily?: string;
		fontWeight?: FontWeight;
		fontStyle?: FontStyle;
		textDecoration?: TextDecoration;
		textAlign?: TextAlign;
		lineHeight?: number;
		letterSpacing?: number;

		// Shape and image styles
		backgroundColor?: string;
		borderColor?: string;
		borderWidth?: number;
		borderStyle?: BorderStyle;
		borderRadius?: number;
		boxShadow?: string;

		// Image specific
		objectFit?: ObjectFit;

		// Common
		opacity?: number;
		padding?: string;

		// Chart specific
		chartType?: "bar" | "line" | "pie" | "area";
		chartTitle?: string;
	};
	animation?: {
		type: AnimationType;
		duration: number;
		delay?: number;
		easing?: string;
		direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
	};
	autoplay?: boolean;
	controls?: boolean;
	loop?: boolean;
}

export interface Slide {
	id: string;
	elements: SlideElement[];
	background?: {
		type?: string;
		color?: string;
		image?: string;
		gradient?: string;
	};
	notes?: string;
	transition?: {
		type: SlideTransitionType;
		duration: number;
		direction?: string;
	};
}

export interface Presentation {
	id: string;
	title: string;
	description?: string;
	slides: Slide[];
	selectedSlideId?: string;
	createdAt: Date;
	updatedAt: Date;
}
