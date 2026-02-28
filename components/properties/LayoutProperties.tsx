"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import type { SlideElement } from "@/types/presentation";

interface LayoutPropertiesProps {
    element: SlideElement;
    onUpdate: (updates: Partial<SlideElement>) => void;
}

export function LayoutProperties({ element, onUpdate }: LayoutPropertiesProps) {
    const [localX, setLocalX] = useState(element.position?.x || 0);
    const [localY, setLocalY] = useState(element.position?.y || 0);
    const [localW, setLocalW] = useState(element.size?.width || 100);
    const [localH, setLocalH] = useState(element.size?.height || 100);
    const [localRotation, setLocalRotation] = useState(element.rotation || 0);
    const [localOpacity, setLocalOpacity] = useState((element.style?.opacity || 1) * 100);

    // Sync with store when element changes or externally updated
    useEffect(() => {
        setLocalX(element.position?.x || 0);
        setLocalY(element.position?.y || 0);
        setLocalW(element.size?.width || 100);
        setLocalH(element.size?.height || 100);
        setLocalRotation(element.rotation || 0);
        setLocalOpacity((element.style?.opacity || 1) * 100);
    }, [element.id, element.position?.x, element.position?.y, element.size?.width, element.size?.height, element.rotation, element.style?.opacity]);

    return (
        <div className="space-y-6">
            <div>
                <Label className="mb-3">Position</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                        <Label htmlFor="pos-x" className="text-xs text-muted-foreground">X</Label>
                        <Input
                            id="pos-x"
                            type="number"
                            value={localX}
                            onChange={(e) => setLocalX(Number(e.target.value))}
                            onBlur={() => onUpdate({
                                position: { x: localX, y: element.position?.y || 0 }
                            })}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="pos-y" className="text-xs text-muted-foreground">Y</Label>
                        <Input
                            id="pos-y"
                            type="number"
                            value={localY}
                            onChange={(e) => setLocalY(Number(e.target.value))}
                            onBlur={() => onUpdate({
                                position: { x: element.position?.x || 0, y: localY }
                            })}
                            className="mt-1"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <Label className="mb-3">Size</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                        <Label htmlFor="size-w" className="text-xs text-muted-foreground">Width</Label>
                        <Input
                            id="size-w"
                            type="number"
                            value={localW}
                            onChange={(e) => setLocalW(Number(e.target.value))}
                            onBlur={() => onUpdate({
                                size: { width: Math.max(10, localW), height: element.size?.height || 100 }
                            })}
                            min="10"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="size-h" className="text-xs text-muted-foreground">Height</Label>
                        <Input
                            id="size-h"
                            type="number"
                            value={localH}
                            onChange={(e) => setLocalH(Number(e.target.value))}
                            onBlur={() => onUpdate({
                                size: { width: element.size?.width || 100, height: Math.max(10, localH) }
                            })}
                            min="10"
                            className="mt-1"
                        />
                    </div>
                </div>
            </div>

            <div>
                <Label htmlFor="rotation">Rotation</Label>
                <div className="flex items-center gap-2 mt-2">
                    <Input
                        id="rotation"
                        type="range"
                        min="0"
                        max="360"
                        value={localRotation}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setLocalRotation(val);
                            onUpdate({ rotation: val });
                        }}
                        className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">{localRotation}°</span>
                </div>
            </div>

            <div>
                <Label htmlFor="opacity">Opacity</Label>
                <div className="flex items-center gap-2 mt-2">
                    <Input
                        id="opacity"
                        type="range"
                        min="0"
                        max="100"
                        value={localOpacity}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setLocalOpacity(val);
                            onUpdate({
                                style: { ...element.style, opacity: val / 100 }
                            });
                        }}
                        className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">
                        {Math.round(localOpacity)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
