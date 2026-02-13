"use client";

import { useRef } from "react";
import { usePresentationStore } from "@/lib/store/presentationStore";
import { Trash2 } from "lucide-react";
import { useDrag } from "react-dnd";
import React from "react";
import { cn } from "@/lib/utils";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import type {
	SlideElement as SlideElementType,
	GradientStop,
} from "@/lib/types/presentation";
import ChartElement from "./elements/ChartElement";
import IconElement from "./elements/IconElement";
import TableElement from "./elements/TableElement";
import CodeElement from "./elements/CodeElement";

interface SlideElementProps {
	element: SlideElementType;
	isSelected: boolean;
	onSelect: () => void;
	onResize?: (width: number, height: number) => void;
}

export default function SlideElement({
	element,
	isSelected,
	onSelect,
	onResize,
}: SlideElementProps) {
	const { deleteElement, selectElement } = usePresentationStore();
	const [{ isDragging }, drag] = useDrag({
		type: "element",
		item: { id: element.id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const handleResize = (
		e: any,
		{ size }: { size: { width: number; height: number } },
	) => {
		if (onResize) {
			onResize(size.width, size.height);
		}
	};

	const getElementContent = () => {
		if (element.type === "chart") {
			return <ChartElement element={element} isSelected={isSelected} />;
		}

		if (element.type === "icon") {
			return <IconElement element={element} isSelected={isSelected} />;
		}

		if (element.type === "table") {
			return <TableElement element={element} isSelected={isSelected} />;
		}

		if (element.type === "code") {
			return <CodeElement element={element} isSelected={isSelected} />;
		}

		if (element.type === "text") {
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
				const style: React.CSSProperties = {
					backgroundColor: element.style?.backgroundColor,
				};

				if (
					element.style?.gradientStops &&
					element.style.gradientStops.length > 0
				) {
					const type = element.style.gradientType || "linear";
					const angle = element.style.gradientAngle || 135;
					const stops = element.style.gradientStops
						.map((s) => `${s.color} ${s.offset}%`)
						.join(", ");

					style.backgroundImage =
						type === "linear"
							? `linear-gradient(${angle}deg, ${stops})`
							: `radial-gradient(circle, ${stops})`;
				}

				return style;
			};

			return (
				<div
					className={cn(
						"w-full h-full p-2 overflow-auto",
						element.style?.backgroundColor && "rounded-lg",
					)}
					style={{
						color: element.style?.color,
						fontSize: element.style?.fontSize,
						fontFamily: element.style?.fontFamily,
						fontWeight: element.style?.fontWeight,
						fontStyle: element.style?.fontStyle,
						textDecoration: element.style?.textDecoration,
						textAlign: element.style?.textAlign as any,
						...getBackgroundStyle(),
						lineHeight: element.style?.lineHeight,
						letterSpacing: element.style?.letterSpacing,
						borderColor: element.style?.borderColor,
						borderWidth: element.style?.borderWidth,
						borderStyle: element.style?.borderStyle,
						borderRadius: element.style?.borderRadius,
						boxShadow: element.style?.boxShadow,
						opacity: element.style?.opacity,
						padding: element.style?.padding || "8px",
						whiteSpace: "pre-wrap",
						...filterStyles,
					}}
				>
					{element.content}
				</div>
			);
		}

		if (element.type === "image") {
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

			return (
				<img
					src={element.content}
					alt="Slide element"
					className="w-full h-full"
					style={{
						borderRadius: element.style?.borderRadius,
						objectFit: element.style?.objectFit as any,
						...filterStyles,
					}}
				/>
			);
		}

		if (element.type === "shape") {
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

			const getShapeStyle = (): React.CSSProperties => {
				const getBackgroundImage = () => {
					if (
						element.style?.gradientStops &&
						element.style.gradientStops.length > 0
					) {
						const type = element.style.gradientType || "linear";
						const angle = element.style.gradientAngle || 135;
						const stops = element.style.gradientStops
							.map((s: GradientStop) => `${s.color} ${s.offset}%`)
							.join(", ");

						return type === "linear"
							? `linear-gradient(${angle}deg, ${stops})`
							: `radial-gradient(circle, ${stops})`;
					}
					return undefined;
				};

				const baseStyle: React.CSSProperties = {
					backgroundColor: element.style?.backgroundColor || "#3b82f6",
					backgroundImage: getBackgroundImage(),
					borderColor: element.style?.borderColor,
					borderWidth: element.style?.borderWidth || 0,
					borderStyle: (element.style?.borderStyle as any) || "solid",
					borderRadius: element.style?.borderRadius || 0,
					boxShadow: element.style?.boxShadow,
					...filterStyles,
				};

				if (element.content === "circle") {
					return { ...baseStyle, borderRadius: "50%" };
				}

				if (element.content === "triangle") {
					return {
						...baseStyle,
						backgroundColor: "transparent",
						backgroundImage: "none",
						borderLeft: `${element.size.width / 2}px solid transparent`,
						borderRight: `${element.size.width / 2}px solid transparent`,
						borderBottom: `${element.size.height}px solid ${element.style?.backgroundColor || "#3b82f6"}`,
					};
				}

				if (element.content === "heart") {
					return {
						...baseStyle,
						position: "relative",
						backgroundColor: "transparent",
						backgroundImage: "none",
					};
				}

				return baseStyle;
			};

			return (
				<div className="w-full h-full" style={getShapeStyle()}>
					{element.content === "heart" && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div
								style={{
									color: element.style?.backgroundColor || "#ec4899",
									fontSize:
										Math.min(element.size.width, element.size.height) * 0.6,
								}}
							>
								❤️
							</div>
						</div>
					)}
				</div>
			);
		}

		if (element.type === "video") {
			return (
				<div className="w-full h-full bg-muted rounded-lg overflow-hidden border border-border">
					<div className="w-full h-full flex items-center justify-center">
						<div className="text-muted-foreground text-center">
							<div className="text-4xl mb-2">▶️</div>
							<div className="text-sm">Video: {element.content}</div>
						</div>
					</div>
				</div>
			);
		}

		return null;
	};

	if (element.type === "chart") {
		return getElementContent();
	}

	return (
		<ResizableBox
			width={element.size.width}
			height={element.size.height}
			minConstraints={[50, 50]}
			maxConstraints={[800, 600]}
			onResize={handleResize}
			resizeHandles={isSelected ? ["se"] : []}
			handleSize={[8, 8]}
		>
			<div
				ref={(node) => {
					if (node) drag(node);
				}}
				className={cn(
					"absolute cursor-move",
					isSelected && "ring-2 ring-primary ring-offset-2",
					isDragging && "opacity-50",
				)}
				style={{
					left: element.position.x,
					top: element.position.y,
					transform: `rotate(${element.rotation || 0}deg)`,
					opacity: element.style?.opacity || 1,
				}}
				onClick={onSelect}
			>
				{getElementContent()}

				{isSelected && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							if (confirm("Are you sure you want to delete this element?")) {
								deleteElement(element.id);
								selectElement(null);
							}
						}}
						className="absolute -top-12 left-1/2 -translate-x-1/2 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg z-50 hover:scale-110 active:scale-95 transition-all"
						title="Delete element"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				)}
			</div>
		</ResizableBox>
	);
}
