import type {
	Presentation,
	Slide,
	SlideElement,
	TextAlign,
	FontWeight,
	FontStyle,
	ShapeType,
} from "@/types/presentation";
import { v4 as uuidv4 } from "uuid";

export interface PresentationTemplate {
	id: string;
	name: string;
	description: string;
	thumbnail: string;
	category: "business" | "education" | "creative" | "minimal";
	slides: Slide[];
}

const createTextElement = (
	content: string,
	x: number,
	y: number,
	width: number,
	height: number,
	fontSize: number = 24,
	color: string = "#000000",
	textAlign: TextAlign = "left",
): SlideElement => ({
	id: uuidv4(),
	type: "text",
	content,
	position: { x, y },
	size: { width, height },
	style: {
		fontSize,
		color,
		textAlign,
		fontFamily: "Arial",
		fontWeight: "normal",
	},
});

const createShapeElement = (
	type: ShapeType,
	x: number,
	y: number,
	width: number,
	height: number,
	backgroundColor: string,
): SlideElement => ({
	id: uuidv4(),
	type: "shape",
	content: type,
	position: { x, y },
	size: { width, height },
	style: {
		backgroundColor,
	},
});

export const templates: PresentationTemplate[] = [
	{
		id: "blank",
		name: "Blank Presentation",
		description: "Start with a blank presentation",
		thumbnail: "blank",
		category: "minimal",
		slides: [
			{
				id: uuidv4(),
				elements: [],
				background: { color: "#ffffff" },
			},
		],
	},
	{
		id: "business-pitch",
		name: "Business Pitch",
		description: "Professional template for business presentations",
		thumbnail: "business",
		category: "business",
		slides: [
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"PRESENTATION TITLE",
						100,
						150,
						760,
						100,
						48,
						"#1a1a1a",
						"center",
					),
					createTextElement(
						"Subtitle or description",
						100,
						280,
						760,
						50,
						24,
						"#666666",
						"center",
					),
				],
				background: {
					gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				},
			},
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"About Us",
						100,
						100,
						760,
						60,
						36,
						"#1a1a1a",
						"left",
					),
					createTextElement(
						"Brief description of your company and its mission.",
						100,
						180,
						760,
						200,
						18,
						"#333333",
						"left",
					),
				],
				background: { color: "#ffffff" },
			},
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"Our Services",
						100,
						100,
						760,
						60,
						36,
						"#1a1a1a",
						"left",
					),
					createShapeElement("rounded", 100, 200, 200, 150, "#667eea"),
					createTextElement(
						"Service 1",
						100,
						370,
						200,
						149,
						20,
						"#1a1a1a",
						"center",
					),
					createShapeElement("rounded", 380, 200, 200, 150, "#764ba2"),
					createTextElement(
						"Service 2",
						380,
						370,
						200,
						40,
						20,
						"#1a1a1a",
						"center",
					),
					createShapeElement("rounded", 660, 200, 200, 150, "#f093fb"),
					createTextElement(
						"Service 3",
						660,
						370,
						200,
						40,
						20,
						"#1a1a1a",
						"center",
					),
				],
				background: { color: "#ffffff" },
			},
		],
	},
	{
		id: "education",
		name: "Educational Presentation",
		description: "Template suitable for teaching and school presentations",
		thumbnail: "education",
		category: "education",
		slides: [
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"SUBJECT TITLE",
						100,
						100,
						760,
						80,
						42,
						"#ffffff",
						"center",
					),
					createTextElement(
						"Presentation Topic",
						100,
						220,
						760,
						60,
						28,
						"#ffffff",
						"center",
					),
					createTextElement(
						"Presenter Name",
						100,
						400,
						760,
						40,
						20,
						"#ffffff",
						"center",
					),
				],
				background: {
					gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
				},
			},
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"Introduction",
						100,
						80,
						760,
						50,
						32,
						"#1a1a1a",
						"left",
					),
					createTextElement(
						"• First point",
						120,
						160,
						700,
						40,
						20,
						"#333333",
						"left",
					),
					createTextElement(
						"• Second point",
						120,
						220,
						700,
						40,
						20,
						"#333333",
						"left",
					),
					createTextElement(
						"• Third point",
						120,
						280,
						700,
						40,
						20,
						"#333333",
						"left",
					),
				],
				background: { color: "#ffffff" },
			},
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"Main Content",
						100,
						80,
						760,
						50,
						32,
						"#1a1a1a",
						"left",
					),
					createTextElement(
						"You can add the main content of your presentation here.",
						100,
						160,
						760,
						200,
						18,
						"#333333",
						"left",
					),
				],
				background: { color: "#ffffff" },
			},
		],
	},
	{
		id: "creative",
		name: "Creative Presentation",
		description: "Modern and colorful template for creative projects",
		thumbnail: "creative",
		category: "creative",
		slides: [
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"CREATIVE TITLE",
						100,
						150,
						760,
						100,
						52,
						"#ffffff",
						"center",
					),
					createShapeElement("circle", 400, 300, 100, 100, "#f093fb"),
				],
				background: {
					gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
				},
			},
			{
				id: uuidv4(),
				elements: [
					createTextElement("IDEA", 100, 100, 760, 80, 48, "#1a1a1a", "center"),
					createShapeElement("rounded", 200, 220, 200, 150, "#fa709a"),
					createShapeElement("rounded", 560, 220, 200, 150, "#fee140"),
				],
				background: { color: "#ffffff" },
			},
			{
				id: uuidv4(),
				elements: [
					createTextElement("Result", 100, 80, 760, 50, 32, "#ffffff", "left"),
					createTextElement(
						"Description of your creative project",
						100,
						160,
						760,
						200,
						20,
						"#ffffff",
						"left",
					),
				],
				background: {
					gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
				},
			},
		],
	},
	{
		id: "minimal",
		name: "Minimalist",
		description: "Clean and simple template",
		thumbnail: "minimal",
		category: "minimal",
		slides: [
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"TITLE",
						100,
						200,
						760,
						80,
						56,
						"#1a1a1a",
						"center",
					),
					createTextElement(
						"Subtitle",
						100,
						320,
						760,
						40,
						20,
						"#666666",
						"center",
					),
				],
				background: { color: "#ffffff" },
			},
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"Section",
						100,
						100,
						760,
						50,
						36,
						"#1a1a1a",
						"left",
					),
					createTextElement(
						"Section Content",
						100,
						180,
						760,
						200,
						18,
						"#333333",
						"left",
					),
				],
				background: { color: "#ffffff" },
			},
		],
	},
];

export const getTemplateById = (
	id: string,
): PresentationTemplate | undefined => {
	return templates.find((t) => t.id === id);
};

export const getTemplatesByCategory = (
	category: string,
): PresentationTemplate[] => {
	return templates.filter((t) => t.category === category);
};
