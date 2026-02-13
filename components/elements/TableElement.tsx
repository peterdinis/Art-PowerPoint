"use client";

import { cn } from "@/lib/utils";
import { SlideElement, TableCell } from "@/lib/types/presentation";

interface TableElementProps {
    element: SlideElement;
    isSelected: boolean;
}

export default function TableElement({ element, isSelected }: TableElementProps) {
    const rows = element.style?.rows || 3;
    const cols = element.style?.cols || 3;
    const tableData = element.style?.tableData ||
        Array(rows).fill(null).map(() =>
            Array(cols).fill(null).map(() => ({ content: "" }))
        );

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
            backgroundColor: element.style?.backgroundColor || "transparent"
        };
    };

    return (
        <div
            className={cn(
                "w-full h-full overflow-auto p-2",
                element.style?.backgroundColor && "rounded-lg"
            )}
            style={{
                ...getBackgroundStyle(),
                opacity: element.style?.opacity,
                borderColor: element.style?.borderColor,
                borderWidth: element.style?.borderWidth,
                borderStyle: element.style?.borderStyle,
                borderRadius: element.style?.borderRadius,
                boxShadow: element.style?.boxShadow,
                ...filterStyles
            }}
        >
            <table className="w-full h-full border-collapse">
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={cn(
                                element.style?.stripeRows && rowIndex % 2 === 1 && "bg-muted/30"
                            )}
                        >
                            {row.map((cell: TableCell, colIndex: number) => {
                                const isHeader =
                                    (element.style?.headerRow && rowIndex === 0) ||
                                    (element.style?.headerCol && colIndex === 0);

                                return (
                                    <td
                                        key={colIndex}
                                        className={cn(
                                            "border border-border p-2",
                                            isHeader && "font-bold bg-muted/50"
                                        )}
                                        style={{
                                            ...cell.style,
                                            textAlign: cell.style?.textAlign || "left"
                                        }}
                                    >
                                        {cell.content}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
