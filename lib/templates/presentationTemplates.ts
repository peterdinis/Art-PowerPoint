import type {
	Presentation,
	Slide,
	SlideElement,
	TextAlign,
	FontWeight,
	FontStyle,
	ShapeType,
} from "@/lib/types/presentation";
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
		name: "Prázdna prezentácia",
		description: "Začnite s prázdnou prezentáciou",
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
		description: "Profesionálna šablóna pre business prezentácie",
		thumbnail: "business",
		category: "business",
		slides: [
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"NÁZOV PREZENTÁCIE",
						100,
						150,
						760,
						100,
						48,
						"#1a1a1a",
						"center",
					),
					createTextElement(
						"Podnadpis alebo popis",
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
					createTextElement("O nás", 100, 100, 760, 60, 36, "#1a1a1a", "left"),
					createTextElement(
						"Stručný popis vašej spoločnosti a jej poslania.",
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
						"Naše služby",
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
						"Služba 1",
						100,
						370,
						200,
						40,
						20,
						"#1a1a1a",
						"center",
					),
					createShapeElement("rounded", 380, 200, 200, 150, "#764ba2"),
					createTextElement(
						"Služba 2",
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
						"Služba 3",
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
		name: "Vzdelávacia prezentácia",
		description: "Šablóna vhodná pre výučbu a školské prezentácie",
		thumbnail: "education",
		category: "education",
		slides: [
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"NÁZOV PREDMETU",
						100,
						100,
						760,
						80,
						42,
						"#ffffff",
						"center",
					),
					createTextElement(
						"Téma prezentácie",
						100,
						220,
						760,
						60,
						28,
						"#ffffff",
						"center",
					),
					createTextElement(
						"Meno prednášajúceho",
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
					createTextElement("Úvod", 100, 80, 760, 50, 32, "#1a1a1a", "left"),
					createTextElement(
						"• Prvý bod",
						120,
						160,
						700,
						40,
						20,
						"#333333",
						"left",
					),
					createTextElement(
						"• Druhý bod",
						120,
						220,
						700,
						40,
						20,
						"#333333",
						"left",
					),
					createTextElement(
						"• Tretí bod",
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
						"Hlavný obsah",
						100,
						80,
						760,
						50,
						32,
						"#1a1a1a",
						"left",
					),
					createTextElement(
						"Tu môžete pridať hlavný obsah vašej prezentácie.",
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
		name: "Kreatívna prezentácia",
		description: "Moderná a farebná šablóna pre kreatívne projekty",
		thumbnail: "creative",
		category: "creative",
		slides: [
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"KREATÍVNY NÁZOV",
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
					createTextElement(
						"NÁPAD",
						100,
						100,
						760,
						80,
						48,
						"#1a1a1a",
						"center",
					),
					createShapeElement("rounded", 200, 220, 200, 150, "#fa709a"),
					createShapeElement("rounded", 560, 220, 200, 150, "#fee140"),
				],
				background: { color: "#ffffff" },
			},
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"Výsledok",
						100,
						80,
						760,
						50,
						32,
						"#ffffff",
						"left",
					),
					createTextElement(
						"Popis vášho kreatívneho projektu",
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
		name: "Minimalistická",
		description: "Čistá a jednoduchá šablóna",
		thumbnail: "minimal",
		category: "minimal",
		slides: [
			{
				id: uuidv4(),
				elements: [
					createTextElement(
						"NÁZOV",
						100,
						200,
						760,
						80,
						56,
						"#1a1a1a",
						"center",
					),
					createTextElement(
						"Podnadpis",
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
					createTextElement("Sekcia", 100, 100, 760, 50, 36, "#1a1a1a", "left"),
					createTextElement(
						"Obsah sekcie",
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
