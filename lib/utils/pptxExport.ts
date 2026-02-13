"use client";

import type { Presentation, Slide, SlideElement } from "../types/presentation";

export const exportToPPTX = async (presentation: Presentation) => {
	let pptxgen;
	try {
		// @ts-ignore
		const module = await import("pptxgenjs");
		pptxgen = module.default;
	} catch (e) {
		console.log("Local pptxgenjs not found, attempting to load from CDN...");
		// Fallback to CDN injection if needed, but since this is a server/client mixed env,
		// we'll try to use the global if it was loaded via script tag elsewhere,
		// or just throw a more descriptive error.
		const windowAny = window as any;
		if (windowAny.pptxgen) {
			pptxgen = windowAny.pptxgen;
		} else {
			// Try to load it dynamically
			await new Promise((resolve, reject) => {
				const script = document.createElement("script");
				script.src =
					"https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.bundle.js";
				script.onload = resolve;
				script.onerror = reject;
				document.head.appendChild(script);
			});
			pptxgen = (window as any).PptxGenJS;
		}
	}

	if (!pptxgen) throw new Error("Could not load pptxgenjs");
	const pptx = new pptxgen();

	// Set presentation metadata
	pptx.title = presentation.title;
	pptx.subject = "Presentation";
	pptx.author = "Art-PowerPoint";

	// Process each slide
	for (const slide of presentation.slides) {
		const pptxSlide = pptx.addSlide();

		// Handle slide background
		if (slide.background) {
			if (slide.background.color) {
				// Convert hsl/rgb to hex if needed, pptxgen prefers hex
				// For now, assume it's hex or a standard color name
				pptxSlide.background = {
					fill: slide.background.color.replace("#", ""),
				};
			}
			// pptxgen support for gradients and images as backgrounds exists but is more complex
		}

		// Process elements
		for (const el of slide.elements) {
			const x = (el.position.x / 960) * 10; // Map 960px to 10 inches (standard PPTX width)
			const y = (el.position.y / 540) * 5.625; // Map 540px to 5.625 inches (16:9)
			const w = (el.size.width / 960) * 10;
			const h = (el.size.height / 540) * 5.625;

			switch (el.type) {
				case "text":
					pptxSlide.addText(el.content, {
						x,
						y,
						w,
						h,
						fontSize: el.style?.fontSize ? el.style.fontSize * 0.75 : 18, // approximate px to pt
						color: el.style?.color?.replace("#", "") || "000000",
						bold: el.style?.fontWeight === "bold",
						italic: el.style?.fontStyle === "italic",
						underline: {
							style: el.style?.textDecoration === "underline" ? "sng" : "none",
						},
						align: (el.style?.textAlign as any) || "left",
						valign: "middle",
						fill: el.style?.backgroundColor
							? { color: el.style.backgroundColor.replace("#", "") }
							: undefined,
					});
					break;
				case "image":
					pptxSlide.addImage({
						path: el.content,
						x,
						y,
						w,
						h,
					});
					break;
				case "shape":
					let shapeType: any = pptx.ShapeType.rect;
					if (el.content === "circle") shapeType = pptx.ShapeType.ellipse;
					if (el.content === "triangle") shapeType = pptx.ShapeType.triangle;

					pptxSlide.addShape(shapeType, {
						x,
						y,
						w,
						h,
						fill: {
							color: el.style?.backgroundColor?.replace("#", "") || "3b82f6",
						},
						line: {
							color: el.style?.borderColor?.replace("#", "") || "000000",
							width: el.style?.borderWidth || 0,
						},
					});
					break;
			}
		}
	}

	// Save the file
	await pptx.writeFile({ fileName: `${presentation.title}.pptx` });
};
