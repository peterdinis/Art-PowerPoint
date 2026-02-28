"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { SlideElement } from "@/types/presentation";

interface LayoutPropertiesProps {
    element: SlideElement;
    onUpdate: (updates: Partial<SlideElement>) => void;
}

export function LayoutProperties({ element, onUpdate }: LayoutPropertiesProps) {
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
                            value={element.position?.x || 0}
                            onChange={(e) => onUpdate({
                                position: { x: Number(e.target.value), y: element.position?.y || 0 }
                            })}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="pos-y" className="text-xs text-muted-foreground">Y</Label>
                        <Input
                            id="pos-y"
                            type="number"
                            value={element.position?.y || 0}
                            onChange={(e) => onUpdate({
                                position: { x: element.position?.x || 0, y: Number(e.target.value) }
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
                            value={element.size?.width || 100}
                            onChange={(e) => onUpdate({
                                size: { width: Math.max(10, Number(e.target.value)), height: element.size?.height || 100 }
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
                            value={element.size?.height || 100}
                            onChange={(e) => onUpdate({
                                size: { width: element.size?.width || 100, height: Math.max(10, Number(e.target.value)) }
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
                        value={element.rotation || 0}
                        onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
                        className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">{element.rotation || 0}°</span>
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
                        value={(element.style?.opacity || 1) * 100}
                        onChange={(e) => onUpdate({
                            style: { ...element.style, opacity: Number(e.target.value) / 100 }
                        })}
                        className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">
                        {Math.round((element.style?.opacity || 1) * 100)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
