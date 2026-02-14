import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
import type {
	Presentation,
	Slide,
	SlideElement,
} from "@/types/presentation";

/**
 * Utility to import .pptx files and convert them to internal Presentation format.
 */
export async function importPPTX(file: File): Promise<Partial<Presentation>> {
	const zip = await JSZip.loadAsync(file);
	const slideFiles = Object.keys(zip.files).filter(
		(name) => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"),
	);

	// Sort slides numerically
	slideFiles.sort((a, b) => {
		const numA = parseInt(a.replace(/[^\d]/g, ""));
		const numB = parseInt(b.replace(/[^\d]/g, ""));
		return numA - numB;
	});

	const slides: Slide[] = [];

	for (const slideFile of slideFiles) {
		const slideId = slideFile.replace(/[^\d]/g, "");
		const slideXmlText = await zip.file(slideFile)?.async("text");
		const relsFile = `ppt/slides/_rels/slide${slideId}.xml.rels`;
		const relsXmlText = (await zip.file(relsFile)?.async("text")) || "";

		if (slideXmlText) {
			const slide = await parseSlideXml(slideXmlText, relsXmlText, zip);
			slides.push(slide);
		}
	}

	return {
		title: file.name.replace(".pptx", ""),
		slides,
	};
}

async function parseSlideXml(
	xmlText: string,
	relsXmlText: string,
	zip: JSZip,
): Promise<Slide> {
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xmlText, "text/xml");
	const relsDoc = parser.parseFromString(relsXmlText, "text/xml");

	const elements: SlideElement[] = [];

	// PPTX uses EMUs (English Metric Units)
	// 1 inch = 914400 EMUs
	// 1 cm = 360000 EMUs
	// Standard slide size is usually 10 x 5.625 inches (16:9)
	const emuToPx = (emu: string | null) => {
		if (!emu) return 0;
		return (parseInt(emu) / 914400) * 96; // 96 DPI
	};

	// Parse Text Shapes
	const shapes = xmlDoc.getElementsByTagName("p:sp");
	for (let i = 0; i < shapes.length; i++) {
		const shape = shapes[i];
		const txBody = shape.getElementsByTagName("p:txBody")[0];
		if (!txBody) continue;

		const xfrm = shape.getElementsByTagName("a:xfrm")[0];
		const off = xfrm?.getElementsByTagName("a:off")[0];
		const ext = xfrm?.getElementsByTagName("a:ext")[0];

		const x = emuToPx(off?.getAttribute("x"));
		const y = emuToPx(off?.getAttribute("y"));
		const width = emuToPx(ext?.getAttribute("cx"));
		const height = emuToPx(ext?.getAttribute("cy"));

		const paragraphs = txBody.getElementsByTagName("a:p");
		let text = "";
		for (let j = 0; j < paragraphs.length; j++) {
			const texts = paragraphs[j].getElementsByTagName("a:t");
			for (let k = 0; k < texts.length; k++) {
				text += texts[k].textContent || "";
			}
			if (j < paragraphs.length - 1) text += "\n";
		}

		if (text.trim()) {
			elements.push({
				id: uuidv4(),
				type: "text",
				content: text,
				position: { x, y },
				size: { width, height },
				style: {
					fontSize: 24,
					color: "#000000",
					textAlign: "left",
				},
			});
		}
	}

	// Parse Images
	const pics = xmlDoc.getElementsByTagName("p:pic");
	for (let i = 0; i < pics.length; i++) {
		const pic = pics[i];
		const blip = pic.getElementsByTagName("a:blip")[0];
		const rId = blip?.getAttribute("r:link") || blip?.getAttribute("r:embed");

		if (rId) {
			const rels = relsDoc.getElementsByTagName("Relationship");
			let target = "";
			for (let j = 0; j < rels.length; j++) {
				if (rels[j].getAttribute("Id") === rId) {
					target = rels[j].getAttribute("Target") || "";
					break;
				}
			}

			if (target) {
				// Relationships targets are usually relative to the rels file, e.g., "../media/image1.png"
				const cleanTarget = target.replace("../", "ppt/");
				const imageFile = zip.file(cleanTarget);

				if (imageFile) {
					const base64 = await imageFile.async("base64");
					const mimeType = getMimeType(cleanTarget);
					const src = `data:${mimeType};base64,${base64}`;

					const xfrm = pic
						.getElementsByTagName("p:spPr")[0]
						?.getElementsByTagName("a:xfrm")[0];
					const off = xfrm?.getElementsByTagName("a:off")[0];
					const ext = xfrm?.getElementsByTagName("a:ext")[0];

					const x = emuToPx(off?.getAttribute("x"));
					const y = emuToPx(off?.getAttribute("y"));
					const width = emuToPx(ext?.getAttribute("cx"));
					const height = emuToPx(ext?.getAttribute("cy"));

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
	}

	return {
		id: uuidv4(),
		elements,
		background: { color: "#ffffff" },
	};
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
