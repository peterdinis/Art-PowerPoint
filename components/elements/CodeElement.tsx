"use client";

import { cn } from "@/lib/utils";
import { SlideElement } from "@/lib/types/presentation";

interface CodeElementProps {
	element: SlideElement;
	isSelected: boolean;
}

export default function CodeElement({ element, isSelected }: CodeElementProps) {
	const language = element.style?.language || "javascript";
	const theme = element.style?.theme || "dark";
	const lineNumbers = element.style?.lineNumbers ?? true;

	const filterStyles = element.style?.filters
		? {
				filter: [
					element.style.filters.blur
						? `blur(${element.style.filters.blur}px)`
						: "",
					element.style.filters.brightness
						? `brightness(${element.style.filters.brightness})`
						: "",
					element.style.filters.contrast
						? `contrast(${element.style.filters.contrast})`
						: "",
					element.style.filters.grayscale
						? `grayscale(${element.style.filters.grayscale})`
						: "",
					element.style.filters.sepia
						? `sepia(${element.style.filters.sepia})`
						: "",
					element.style.filters.hueRotate
						? `hue-rotate(${element.style.filters.hueRotate}deg)`
						: "",
					element.style.filters.saturate
						? `saturate(${element.style.filters.saturate})`
						: "",
					element.style.filters.invert
						? `invert(${element.style.filters.invert})`
						: "",
				].join(" "),
			}
		: {};

	const getBackgroundStyle = () => {
		if (
			element.style?.gradientStops &&
			element.style.gradientStops.length > 0
		) {
			const type = element.style.gradientType || "linear";
			const angle = element.style.gradientAngle || 135;
			const stops = element.style.gradientStops
				.map((s) => `${s.color} ${s.offset}%`)
				.join(", ");

			return {
				background:
					type === "linear"
						? `linear-gradient(${angle}deg, ${stops})`
						: `radial-gradient(circle, ${stops})`,
			};
		}
		return {
			backgroundColor:
				element.style?.backgroundColor ||
				(theme === "dark" ? "#1e1e1e" : "#f5f5f5"),
		};
	};

	const lines = element.content.split("\n");

	return (
		<div
			className={cn(
				"w-full h-full overflow-auto p-4 font-mono text-sm",
				element.style?.backgroundColor ? "rounded-lg" : "rounded-md",
			)}
			style={{
				...getBackgroundStyle(),
				color:
					element.style?.color || (theme === "dark" ? "#d4d4d4" : "#333333"),
				opacity: element.style?.opacity,
				borderColor: element.style?.borderColor,
				borderWidth: element.style?.borderWidth,
				borderStyle: element.style?.borderStyle,
				borderRadius: element.style?.borderRadius,
				boxShadow: element.style?.boxShadow,
				...filterStyles,
			}}
		>
			<div className="flex items-center justify-between mb-2 text-xs opacity-50 border-b border-white/10 pb-1">
				<span>{language}</span>
				{theme === "dark" && (
					<span className="w-2 h-2 rounded-full bg-yellow-500" />
				)}
			</div>
			<pre className="m-0 flex">
				{lineNumbers && (
					<div className="mr-4 text-right opacity-30 select-none">
						{lines.map((_, i) => (
							<div key={i}>{i + 1}</div>
						))}
					</div>
				)}
				<code className="block flex-1 whitespace-pre">{element.content}</code>
			</pre>
		</div>
	);
}
