"use client";

import { useMemo } from "react";
import { usePresentationStore } from "@/store/presentationStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Trash2 } from "lucide-react";
import { useDrag } from "react-dnd";
import React from "react";
import { cn } from "@/lib/utils";
import { ResizableBox } from "react-resizable";
import { Easing, motion } from "framer-motion";
import "react-resizable/css/styles.css";
import type {
	SlideElement as SlideElementType,
	GradientStop,
	AnimationType,
	TextAlign,
	ObjectFit,
	BorderStyle,
} from "@/types/presentation";
import type { Variants } from "framer-motion";
import ChartElement from "./elements/ChartElement";
import IconElement from "./elements/IconElement";
import TableElement from "./elements/TableElement";
import CodeElement from "./elements/CodeElement";

interface SlideElementProps {
	element: SlideElementType;
	isSelected: boolean;
	onSelect: (id: string) => void;
	onResize?: (id: string, width: number, height: number) => void;
}

const getAnimationVariants = (type?: AnimationType): Variants => {
	switch (type) {
		case "fadeIn":
			return { initial: { opacity: 0 }, animate: { opacity: 1 } };
		case "slideIn":
			return {
				initial: { x: -100, opacity: 0 },
				animate: { x: 0, opacity: 1 },
			};
		case "zoomIn":
			return {
				initial: { scale: 0, opacity: 0 },
				animate: { scale: 1, opacity: 1 },
			};
		case "bounce":
			return {
				initial: { scale: 0.3, opacity: 0 },
				animate: {
					scale: 1,
					opacity: 1,
					transition: { type: "spring", stiffness: 260, damping: 20 },
				},
			};
		case "rotate":
			return {
				initial: { rotate: -180, opacity: 0 },
				animate: { rotate: 0, opacity: 1 },
			};
		case "rotate3d":
			return {
				initial: { rotateY: 90, opacity: 0 },
				animate: { rotateY: 0, opacity: 1 },
			};
		case "floating":
			return {
				animate: {
					y: [0, -15, 0],
					transition: {
						duration: 3,
						repeat: Infinity,
						ease: "easeInOut",
					},
				},
			};
		case "glitch":
			return {
				animate: {
					x: [0, -2, 2, -2, 2, 0],
					transition: {
						duration: 0.2,
						repeat: Infinity,
						repeatDelay: 3,
					},
				},
			};
		case "pulse":
			return {
				animate: {
					scale: [1, 1.05, 1],
					transition: { duration: 2, repeat: Infinity },
				},
			};
		default:
			return { initial: {}, animate: {} };
	}
};

import { memo } from "react";

const SlideElement = memo(function SlideElement({
	element,
	isSelected,
	onSelect,
	onResize,
}: SlideElementProps) {
	const deleteElement = usePresentationStore((state) => state.deleteElement);
	const selectElement = usePresentationStore((state) => state.selectElement);
	const performance = useSettingsStore((state) => state.performance);

	const [{ isDragging }, drag] = useDrag({
		type: "element",
		item: { id: element.id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const animationVariants = useMemo(
		() =>
			performance.complexAnimations
				? getAnimationVariants(element.animation?.type)
				: { initial: {}, animate: {} },
		[element.animation?.type, performance.complexAnimations],
	);

	const handleResize = (
		_e: unknown,
		{ size }: { size: { width: number; height: number } },
	) => {
		if (onResize) {
			onResize(element.id, size.width, size.height);
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
						textAlign: element.style?.textAlign as unknown as TextAlign,
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
			return (
				<img
					src={element.content}
					alt="Slide element"
					className="w-full h-full"
					style={{
						borderRadius: element.style?.borderRadius,
						objectFit: element.style?.objectFit as unknown as ObjectFit,
					}}
				/>
			);
		}

		if (element.type === "shape") {
			const getShapeStyle = (): React.CSSProperties => {
				const baseStyle: React.CSSProperties = {
					backgroundColor: element.style?.backgroundColor || "#3b82f6",
					borderColor: element.style?.borderColor,
					borderWidth: element.style?.borderWidth || 0,
					borderStyle:
						(element.style?.borderStyle as unknown as BorderStyle) || "solid",
					borderRadius: element.style?.borderRadius || 0,
					boxShadow: element.style?.boxShadow,
				};

				if (element.content === "circle")
					return { ...baseStyle, borderRadius: "50%" };
				if (element.content === "triangle") {
					return {
						...baseStyle,
						backgroundColor: "transparent",
						borderLeft: `${element.size.width / 2}px solid transparent`,
						borderRight: `${element.size.width / 2}px solid transparent`,
						borderBottom: `${element.size.height}px solid ${element.style?.backgroundColor || "#3b82f6"}`,
					};
				}
				return baseStyle;
			};

			return <div className="w-full h-full" style={getShapeStyle()} />;
		}

		if (element.type === "video") {
			return (
				<div className="w-full h-full bg-muted rounded-lg flex items-center justify-center border">
					<div className="text-sm">Video: {element.content}</div>
				</div>
			);
		}

		return null;
	};

	const elementStyles: React.CSSProperties = {
		left: element.position.x,
		top: element.position.y,
		zIndex: element.style?.zIndex || 1,
		transform: `rotate(${element.rotation || 0}deg) ${performance.hardwareAcceleration ? "translate3d(0,0,0)" : ""}`,
		opacity: element.style?.opacity || 1,
		willChange: performance.hardwareAcceleration
			? "transform, opacity"
			: "auto",
	};

	return (
		<ResizableBox
			width={element.size.width}
			height={element.size.height}
			minConstraints={[50, 50]}
			maxConstraints={[800, 600]}
			onResize={handleResize}
			resizeHandles={
				isSelected ? ["s", "w", "e", "n", "sw", "nw", "se", "ne"] : []
			}
			handleSize={[8, 8]}
		>
			<motion.div
				ref={(node) => {
					if (node) drag(node);
				}}
				className={cn(
					"absolute cursor-move overflow-visible",
					isSelected && "ring-2 ring-primary ring-offset-2 z-1000",
					isDragging && "opacity-50",
				)}
				style={elementStyles}
				variants={animationVariants}
				initial="initial"
				animate="animate"
				whileHover={
					!isSelected && performance.complexAnimations
						? {
								scale: 1.05,
								rotateY: 10,
								rotateX: -5,
								boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
							}
						: {}
				}
				transition={{
					duration: (element.animation?.duration || 500) / 1000,
					delay: (element.animation?.delay || 0) / 1000,
					ease: (element.animation?.easing || "easeOut") as unknown as Easing,
				}}
				onClick={() => onSelect(element.id)}
			>
				{getElementContent()}

				{isSelected && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							if (
								confirm(
									useSettingsStore.getState().language === "sk"
										? "Naozaj odstrániť tento prvok?"
										: "Really delete this element?",
								)
							) {
								deleteElement(element.id);
								selectElement(null);
							}
						}}
						className="absolute -top-12 left-1/2 -translate-x-1/2 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg z-50 transition-all hover:scale-110"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				)}
			</motion.div>
		</ResizableBox>
	);
});

export default SlideElement;
