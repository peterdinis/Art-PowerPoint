"use client";

import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { SlideElement } from "@/lib/types/presentation";

interface IconElementProps {
    element: SlideElement;
    isSelected: boolean;
}

export default function IconElement({ element, isSelected }: IconElementProps) {
    const iconName = element.style?.iconName || "HelpCircle";
    // @ts-ignore - Lucide icons are indexed by name
    const IconComponent = Icons[iconName] || Icons.HelpCircle;

    const filterStyles = element.style?.filters ? {
        filter: [
            element.style.filters.blur ? `blur(${element.style.filters.blur}px)` : "",
            element.style.filters.brightness ? `brightness(${element.style.filters.brightness})` : "",
            element.style.filters.contrast ? `contrast(${element.style.filters.contrast})` : "",
            element.style.filters.grayscale ? `grayscale(${element.style.filters.grayscale})` : "",
            element.style.filters.sepia ? `sepia(${element.style.filters.sepia})` : "",
            element.style.filters.hueRotate ? `hue-rotate(${element.style.filters.hueRotate}deg)` : "",
            element.style.filters.saturate ? `saturate(${element.style.filters.saturate})` : "",
            element.style.filters.invert ? `invert(${element.style.filters.invert})` : "",
        ].join(" ")
    } : {};

    const getBackgroundStyle = () => {
        if (element.style?.gradientStops && element.style.gradientStops.length > 0) {
            const type = element.style.gradientType || "linear";
            const angle = element.style.gradientAngle || 135;
            const stops = element.style.gradientStops
                .map((s) => `${s.color} ${s.offset}%`)
                .join(", ");

            return {
                background: type === "linear"
                    ? `linear-gradient(${angle}deg, ${stops})`
                    : `radial-gradient(circle, ${stops})`
            };
        }
        return {
            backgroundColor: element.style?.backgroundColor
        };
    };

    return (
        <div
            className={cn(
                "w-full h-full flex items-center justify-center overflow-hidden",
                element.style?.backgroundColor && "rounded-lg"
            )}
            style={{
                ...getBackgroundStyle(),
                color: element.style?.color || "#000000",
                opacity: element.style?.opacity,
                borderColor: element.style?.borderColor,
                borderWidth: element.style?.borderWidth,
                borderStyle: element.style?.borderStyle,
                borderRadius: element.style?.borderRadius,
                boxShadow: element.style?.boxShadow,
                padding: element.style?.padding || "0px",
                ...filterStyles
            }}
        >
            <IconComponent
                size={Math.min(element.size.width, element.size.height) * 0.8}
                strokeWidth={2}
            />
        </div>
    );
}
