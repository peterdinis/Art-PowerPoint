"use client";

import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import type { SlideElement as SlideElementType } from "@/lib/types/presentation";
import ChartElement from "./ChartElement";

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

		if (element.type === "text") {
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
						backgroundColor: element.style?.backgroundColor,
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
					}}
				>
					{element.content}
				</div>
			);
		}

		if (element.type === "image") {
			return (
				<img
					src={element.content}
					alt="Slide element"
					className="w-full h-full object-cover"
					style={{
						borderRadius: element.style?.borderRadius,
						objectFit: element.style?.objectFit as any,
					}}
				/>
			);
		}

		if (element.type === "shape") {
			const getShapeStyle = () => {
				const baseStyle = {
					backgroundColor: element.style?.backgroundColor || "#3b82f6",
					borderColor: element.style?.borderColor,
					borderWidth: element.style?.borderWidth || 0,
					borderStyle: element.style?.borderStyle || "solid",
					borderRadius: element.style?.borderRadius || 0,
					boxShadow: element.style?.boxShadow,
				};

				if (element.content === "circle") {
					return { ...baseStyle, borderRadius: "50%" };
				}

				if (element.content === "triangle") {
					return {
						...baseStyle,
						backgroundColor: "transparent",
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
				<div className="w-full h-full bg-black rounded-lg overflow-hidden">
					<div className="w-full h-full flex items-center justify-center">
						<div className="text-white text-center">
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
				ref={drag}
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
			</div>
		</ResizableBox>
	);
}
