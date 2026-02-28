"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { SlideElement } from "@/types/presentation";

interface ShapePropertiesProps {
    element: SlideElement;
    onUpdate: (updates: Partial<SlideElement>) => void;
}

export function ShapeProperties({ element, onUpdate }: ShapePropertiesProps) {
    const style = element.style || {};
    const [localBorderWidth, setLocalBorderWidth] = useState(style.borderWidth || 0);
    const [localBorderRadius, setLocalBorderRadius] = useState(style.borderRadius || 0);

    useEffect(() => {
        setLocalBorderWidth(style.borderWidth || 0);
        setLocalBorderRadius(style.borderRadius || 0);
    }, [element.id, style.borderWidth, style.borderRadius]);

    const handleStyleUpdate = (prop: string, value: any) => {
        onUpdate({
            style: { ...style, [prop]: value }
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="shape-bg">Background</Label>
                    <Input
                        id="shape-bg"
                        type="color"
                        value={style.backgroundColor || "#3b82f6"}
                        onChange={(e) => handleStyleUpdate("backgroundColor", e.target.value)}
                        className="w-full h-10 mt-2 cursor-pointer p-1"
                    />
                </div>
                <div>
                    <Label htmlFor="shape-border">Border Color</Label>
                    <Input
                        id="shape-border"
                        type="color"
                        value={style.borderColor || "#000000"}
                        onChange={(e) => handleStyleUpdate("borderColor", e.target.value)}
                        className="w-full h-10 mt-2 cursor-pointer p-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="border-width">Border Width</Label>
                    <Input
                        id="border-width"
                        type="number"
                        min="0"
                        max="20"
                        value={localBorderWidth}
                        onChange={(e) => setLocalBorderWidth(Number(e.target.value))}
                        onBlur={() => handleStyleUpdate("borderWidth", localBorderWidth)}
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="border-radius">Corner Radius</Label>
                    <Input
                        id="border-radius"
                        type="number"
                        min="0"
                        max="100"
                        value={localBorderRadius}
                        onChange={(e) => setLocalBorderRadius(Number(e.target.value))}
                        onBlur={() => handleStyleUpdate("borderRadius", localBorderRadius)}
                        className="mt-2"
                    />
                </div>
            </div>
        </div>
    );
}
