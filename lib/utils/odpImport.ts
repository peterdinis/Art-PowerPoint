import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
import type { Presentation, Slide, SlideElement } from "@/types/presentation";

/**
 * Utility to import .odp files (LibreOffice Impress) and convert them to internal Presentation format.
 */
export async function importODP(file: File): Promise<Partial<Presentation>> {
    const zip = await JSZip.loadAsync(file);

    // ODP stores main content in content.xml
    const contentXmlFile = zip.file("content.xml");
    if (!contentXmlFile) {
        throw new Error("Invalid ODP file: content.xml is missing.");
    }
    const contentXmlText = await contentXmlFile.async("text");

    // ODP optionally stores style details in styles.xml
    const stylesXmlFile = zip.file("styles.xml");
    const stylesXmlText = stylesXmlFile ? await stylesXmlFile.async("text") : "";

    const slides = await parseOdpContent(contentXmlText, stylesXmlText, zip);

    return {
        title: file.name.replace(".odp", ""),
        slides,
    };
}

async function parseOdpContent(
    contentXmlText: string,
    stylesXmlText: string,
    zip: JSZip,
): Promise<Slide[]> {
    const parser = new DOMParser();
    const contentDoc = parser.parseFromString(contentXmlText, "text/xml");
    const _stylesDoc = stylesXmlText ? parser.parseFromString(stylesXmlText, "text/xml") : null;

    const slides: Slide[] = [];

    // Map ODP units (cm/in/pt) to pixels (assuming 96 DPI)
    const toPx = (val: string | null) => {
        if (!val) return 0;
        if (val.endsWith("cm")) return (parseFloat(val) / 2.54) * 96;
        if (val.endsWith("in")) return parseFloat(val) * 96;
        if (val.endsWith("pt")) return (parseFloat(val) / 72) * 96;
        if (val.endsWith("mm")) return (parseFloat(val) / 25.4) * 96;
        return parseFloat(val); // fallback
    };

    // Get automatic styles from content.xml to extract slide backgrounds if present
    const autoStyles = contentDoc.getElementsByTagName("office:automatic-styles")[0];
    const styleMap: Record<string, string> = {}; // Maps style-name to background color

    if (autoStyles) {
        const pageLayouts = autoStyles.getElementsByTagName("style:page-layout");
        for (let i = 0; i < pageLayouts.length; i++) {
            const layout = pageLayouts[i];
            const styleName = layout.getAttribute("style:name");
            const props = layout.getElementsByTagName("style:page-layout-properties")[0];
            if (styleName && props) {
                const bgColor = props.getAttribute("fo:background-color");
                if (bgColor && bgColor !== "transparent") {
                    styleMap[styleName] = bgColor;
                }
            }
        }

        // Also grab draw:fill-color from drawing styles for shape backgrounds if needed
        const drawingStyles = autoStyles.getElementsByTagName("style:style");
        for (let i = 0; i < drawingStyles.length; i++) {
            const style = drawingStyles[i];
            if (style.getAttribute("style:family") === "drawing-page") {
                const styleName = style.getAttribute("style:name");
                const props = style.getElementsByTagName("style:drawing-page-properties")[0];
                if (styleName && props) {
                    const bgColor = props.getAttribute("draw:fill-color");
                    if (bgColor) {
                        styleMap[styleName] = bgColor;
                    }
                }
            }
        }
    }

    // 1. Iterate over <draw:page> which represents each slide
    const pages = contentDoc.getElementsByTagName("draw:page");

    for (let pIndex = 0; pIndex < pages.length; pIndex++) {
        const page = pages[pIndex];
        const elements: SlideElement[] = [];
        let backgroundColor = "#ffffff";

        // Try to deduce background color from the page's master-page or draw:style-name
        const styleName = page.getAttribute("draw:style-name") || page.getAttribute("draw:master-page-name");
        if (styleName && styleMap[styleName]) {
            backgroundColor = styleMap[styleName];
        }

        // 2. Iterate over <draw:frame> elements inside the slide page
        const frames = page.getElementsByTagName("draw:frame");

        for (let fIndex = 0; fIndex < frames.length; fIndex++) {
            const frame = frames[fIndex];

            const x = toPx(frame.getAttribute("svg:x"));
            const y = toPx(frame.getAttribute("svg:y"));
            let width = toPx(frame.getAttribute("svg:width"));
            let height = toPx(frame.getAttribute("svg:height"));

            // Optional Check: Is it a Text Box?
            const textBox = frame.getElementsByTagName("draw:text-box")[0];
            if (textBox) {
                const paragraphs = textBox.getElementsByTagName("text:p");
                let text = "";
                for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
                    // text:p might contain text:span or just raw text
                    text += paragraphs[pIdx].textContent || "";
                    if (pIdx < paragraphs.length - 1) text += "\n";
                }

                if (text.trim()) {
                    elements.push({
                        id: uuidv4(),
                        type: "text",
                        content: text,
                        position: { x, y },
                        size: { width: width || 400, height: height || 100 },
                        style: {
                            fontSize: 24, // generic fallback
                            color: "#000000",
                            textAlign: "left",
                        },
                    });
                }
                continue;
            }

            // Optional Check: Is it an Image?
            const imageNode = frame.getElementsByTagName("draw:image")[0];
            if (imageNode) {
                // Internal path, e.g. "Pictures/100000.png"
                const href = imageNode.getAttribute("xlink:href");
                if (href) {
                    const zipImgFile = zip.file(href);
                    if (zipImgFile) {
                        const base64 = await zipImgFile.async("base64");
                        const mimeType = getMimeType(href);
                        if (mimeType) {
                            const src = `data:${mimeType};base64,${base64}`;
                            elements.push({
                                id: uuidv4(),
                                type: "image",
                                content: src,
                                position: { x, y },
                                size: { width: width || 400, height: height || 300 },
                            });
                        }
                    }
                }
                continue;
            }
        }

        slides.push({
            id: uuidv4(),
            elements,
            background: { color: backgroundColor },
        });
    }

    return slides;
}

function getMimeType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
        case "png":
            return "image/png";
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "gif":
            return "image/gif";
        case "svg":
            return "image/svg+xml";
        default:
            return "application/octet-stream";
    }
}
