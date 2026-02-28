import { v4 as uuidv4 } from "uuid";
import type {
    SlideElement,
    SlideElementType,
    ShapeType,
    FontWeight,
    FontStyle,
    TextAlign
} from "@/types/presentation";

export type TextType =
    | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    | "body" | "quote" | "code" | "title" | "subtitle";

interface ElementOptions {
    position?: { x: number; y: number };
    textColor?: string;
    backgroundColor?: string;
}

export const createTextElement = (
    textType: TextType = "body",
    options: ElementOptions = {}
): SlideElement => {
    const { position = { x: 100, y: 100 }, textColor = "#212121" } = options;

    const styles: Record<string, { fontSize: number; fontWeight?: FontWeight; fontStyle?: FontStyle; fontFamily?: string; color?: string }> = {
        title: { fontSize: 64, fontWeight: "bold", color: "#1e40af" },
        h1: { fontSize: 48, fontWeight: "bold" },
        h2: { fontSize: 36, fontWeight: "bold" },
        h3: { fontSize: 30, fontWeight: "bold" },
        h4: { fontSize: 24, fontWeight: "bold" },
        h5: { fontSize: 20, fontWeight: "bold" },
        h6: { fontSize: 18, fontWeight: "bold" },
        subtitle: { fontSize: 32, fontStyle: "italic", color: "#6b7280" },
        body: { fontSize: 24, fontWeight: "normal" },
        quote: { fontSize: 28, fontStyle: "italic", color: "#6b7280" },
        code: { fontSize: 20, fontFamily: "Courier New", color: "#059669" },
    };

    const contents: Record<string, string> = {
        title: "Presentation Title",
        h1: "Heading 1",
        h2: "Heading 2",
        h3: "Heading 3",
        h4: "Heading 4",
        h5: "Heading 5",
        h6: "Heading 6",
        subtitle: "Presentation Subtitle",
        body: "Add your text here...",
        quote: "The only way to do great work is to love what you do.",
        code: "console.log('Hello, World!');",
    };

    const styleConfig = styles[textType];

    return {
        id: uuidv4(),
        type: "text",
        position,
        size: {
            width: textType === "title" ? 800 : textType === "subtitle" ? 600 : 400,
            height: textType === "title" ? 120 : textType === "subtitle" ? 80 : 60,
        },
        content: contents[textType],
        style: {
            fontSize: styleConfig.fontSize,
            color: styleConfig.color || textColor,
            fontFamily: styleConfig.fontFamily || "Arial",
            fontWeight: styleConfig.fontWeight || "normal",
            fontStyle: styleConfig.fontStyle || (textType === "quote" ? "italic" : "normal"),
            textAlign: "left" as TextAlign,
        },
    };
};

export const createShapeElement = (
    shapeType: ShapeType,
    options: ElementOptions = {}
): SlideElement => {
    const { position = { x: 100, y: 100 } } = options;

    const sizes: Record<ShapeType, { width: number; height: number }> = {
        square: { width: 200, height: 200 },
        circle: { width: 200, height: 200 },
        triangle: { width: 200, height: 200 },
        rectangle: { width: 300, height: 150 },
        rounded: { width: 250, height: 150 },
        star: { width: 200, height: 200 },
        heart: { width: 200, height: 180 },
        hexagon: { width: 200, height: 200 },
        octagon: { width: 200, height: 200 },
        diamond: { width: 200, height: 200 },
        ellipse: { width: 300, height: 150 },
        arrow: { width: 200, height: 100 },
    };

    const colors: Record<string, string> = {
        square: "#3b82f6",
        circle: "#10b981",
        triangle: "#f59e0b",
        rectangle: "#8b5cf6",
        rounded: "#ef4444",
        star: "#fbbf24",
        heart: "#ec4899",
        hexagon: "#06b6d4",
        octagon: "#84cc16",
        diamond: "#6366f1",
    };

    return {
        id: uuidv4(),
        type: "shape",
        position,
        size: sizes[shapeType] || { width: 200, height: 200 },
        content: shapeType,
        style: {
            backgroundColor: colors[shapeType] || "#3b82f6",
            borderWidth: 0,
            borderColor: "#000000",
            ...(shapeType === "rounded" && { borderRadius: 12 }),
        },
    };
};

export const createImageElement = (
    url: string,
    options: ElementOptions = {}
): SlideElement => {
    const { position = { x: 100, y: 100 } } = options;
    return {
        id: uuidv4(),
        type: "image",
        position,
        size: { width: 400, height: 300 },
        content: url,
        style: {
            borderRadius: 8,
            objectFit: "cover",
        },
    };
};

export const createVideoElement = (
    url: string,
    options: ElementOptions = {}
): SlideElement => {
    const { position = { x: 100, y: 100 } } = options;
    return {
        id: uuidv4(),
        type: "video",
        position,
        size: { width: 640, height: 360 },
        content: url,
        style: {
            borderRadius: 8,
        },
    };
};

export const createTableElement = (
    rows: number = 3,
    cols: number = 3,
    options: ElementOptions = {}
): SlideElement => {
    const { position = { x: 100, y: 100 } } = options;
    const tableData = Array(rows)
        .fill(null)
        .map((_, rowIndex) =>
            Array(cols)
                .fill(null)
                .map((_, colIndex) => ({
                    content: `Cell ${rowIndex + 1}-${colIndex + 1}`,
                })),
        );

    return {
        id: uuidv4(),
        type: "table",
        position,
        size: { width: 500, height: 300 },
        content: "",
        style: {
            rows,
            cols,
            tableData,
            headerRow: true,
            stripeRows: true,
            borderColor: "#e5e7eb",
            borderWidth: 1,
            backgroundColor: "#ffffff",
        },
    };
};

export const createChartElement = (
    chartType: "bar" | "line" | "pie" | "area",
    chartTitle: string,
    labels: string[],
    values: number[],
    colors: string[],
    options: ElementOptions = {}
): SlideElement => {
    const { position = { x: 100, y: 100 } } = options;
    const chartData = {
        type: chartType,
        chartTitle,
        labels,
        values,
        colors,
    };

    return {
        id: uuidv4(),
        type: "chart",
        position,
        size: { width: 500, height: 350 },
        content: JSON.stringify(chartData),
        style: {
            chartType,
            chartTitle,
            backgroundColor: "#ffffff",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#e5e7eb",
        },
    };
};

export const createIconElement = (
    iconName: string,
    options: ElementOptions = {}
): SlideElement => {
    const { position = { x: 100, y: 100 } } = options;
    return {
        id: uuidv4(),
        type: "icon",
        position,
        size: { width: 100, height: 100 },
        content: "",
        style: {
            iconName,
            color: "#3b82f6",
        },
    };
};

export const createCodeElement = (
    language: string = "javascript",
    options: ElementOptions = {}
): SlideElement => {
    const { position = { x: 100, y: 100 } } = options;
    return {
        id: uuidv4(),
        type: "code",
        position,
        size: { width: 600, height: 400 },
        content: "// Write your code here...",
        style: {
            language,
            theme: "dark",
            lineNumbers: true,
            fontSize: 14,
            borderRadius: 8,
        },
    };
};
