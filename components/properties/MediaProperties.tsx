"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import type { SlideElement, ObjectFit } from "@/types/presentation";

interface MediaPropertiesProps {
    element: SlideElement;
    onUpdate: (updates: Partial<SlideElement>) => void;
}

export function MediaProperties({ element, onUpdate }: MediaPropertiesProps) {
    if (element.type === "image") {
        return (
            <div className="space-y-6">
                <div>
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input
                        id="image-url"
                        value={element.content || ""}
                        onChange={(e) => onUpdate({ content: e.target.value })}
                        className="mt-2"
                        placeholder="https://..."
                    />
                    {element.content && (
                        <div className="mt-3 rounded-lg overflow-hidden border">
                            <img
                                src={element.content}
                                alt="Preview"
                                className="w-full h-32 object-cover"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <Label htmlFor="image-fit">Image Fit</Label>
                    <Select
                        value={element.style?.objectFit || "cover"}
                        onValueChange={(value: ObjectFit) => onUpdate({
                            style: { ...element.style, objectFit: value }
                        })}
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select fit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cover">Cover</SelectItem>
                            <SelectItem value="contain">Contain</SelectItem>
                            <SelectItem value="fill">Fill</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="scale-down">Scale Down</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        );
    }

    if (element.type === "video") {
        return (
            <div className="space-y-6">
                <div>
                    <Label htmlFor="video-url">Video URL</Label>
                    <Input
                        id="video-url"
                        value={element.content || ""}
                        onChange={(e) => onUpdate({ content: e.target.value })}
                        className="mt-2"
                        placeholder="https://..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Autoplay</Label>
                        <Select
                            value={String(!!element.autoplay)}
                            onValueChange={(val) => onUpdate({ autoplay: val === "true" })}
                        >
                            <SelectTrigger className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Controls</Label>
                        <Select
                            value={String(element.controls !== false)}
                            onValueChange={(val) => onUpdate({ controls: val === "true" })}
                        >
                            <SelectTrigger className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label>Loop</Label>
                    <Select
                        value={String(!!element.loop)}
                        onValueChange={(val) => onUpdate({ loop: val === "true" })}
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        );
    }

    return null;
}
