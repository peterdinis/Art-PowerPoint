export type SlideElementType = "text" | "image" | "shape" | "video";

export type TransitionType = "none" | "fade" | "slide" | "zoom" | "blur";
export type AnimationType =
	| "none"
	| "fadeIn"
	| "slideIn"
	| "zoomIn"
	| "bounce"
	| "rotate";

export interface Position {
	x: number;
	y: number;
}

export interface Size {
	width: number;
	height: number;
}

export interface SlideElement {
	id: string;
	type: SlideElementType;
	position: Position;
	size: Size;
	content: string;
	style?: {
		fontSize?: number;
		color?: string;
		backgroundColor?: string;
		fontFamily?: string;
		fontWeight?: string | number;
		fontStyle?: string;
		textDecoration?: string;
		textAlign?: "left" | "center" | "right";
		borderColor?: string;
		borderWidth?: number;
		borderRadius?: string;
	};
	animation?: {
		type: AnimationType;
		duration?: number;
		delay?: number;
	};
}

export interface Slide {
	id: string;
	elements: SlideElement[];
	background?: {
		color?: string;
		image?: string;
		gradient?: string;
	};
	notes?: string;
	transition?: {
		type: TransitionType;
		duration?: number;
	};
}

export interface Presentation {
	id: string;
	title: string;
	description?: string;
	slides: Slide[];
	createdAt: Date;
	updatedAt: Date;
	thumbnail?: string;
}
