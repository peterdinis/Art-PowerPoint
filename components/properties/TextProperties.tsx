"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { SlideElement, FontWeight, FontStyle, TextDecoration, TextAlign } from "@/types/presentation";

interface TextPropertiesProps {
    element: SlideElement;
    onUpdate: (updates: Partial<SlideElement>) => void;
    getDefaultTextColor: () => string;
}

const FONTS = [
    "Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana",
    "Georgia", "Palatino", "Garamond", "Roboto", "Open Sans", "Montserrat", "Lato"
];

export function TextProperties({ element, onUpdate, getDefaultTextColor }: TextPropertiesProps) {
    const style = element.style || {};
    const [localContent, setLocalContent] = useState(element.content || "");

    // Sync local content when the element changes (e.g., if another element is selected)
    useEffect(() => {
        setLocalContent(element.content || "");
    }, [element.id]);

    const handleStyleUpdate = (prop: string, value: any) => {
        onUpdate({
            style: { ...style, [prop]: value }
        });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setLocalContent(value);

        // Debounce the update to the store
        const timeout = setTimeout(() => {
            onUpdate({ content: value });
        }, 500);

        return () => clearTimeout(timeout);
    };

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="text-content">Content</Label>
                <Textarea
                    id="text-content"
                    value={localContent}
                    onChange={handleContentChange}
                    onBlur={() => onUpdate({ content: localContent })}
                    className="mt-2 resize-none"
                    rows={4}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="font-size">Font Size</Label>
                    <div className="flex items-center gap-2 mt-2">
                        <Input
                            id="font-size"
                            type="number"
                            value={style.fontSize || 16}
                            onChange={(e) => handleStyleUpdate("fontSize", Math.max(8, Number(e.target.value)))}
                            min="8"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="line-height">Line Height</Label>
                    <Input
                        id="line-height"
                        type="number"
                        step="0.1"
                        value={style.lineHeight || 1.2}
                        onChange={(e) => handleStyleUpdate("lineHeight", Number(e.target.value))}
                        min="0.5"
                        max="3"
                        className="mt-2"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="text-color">Color</Label>
                    <Input
                        id="text-color"
                        type="color"
                        value={style.color || getDefaultTextColor()}
                        onChange={(e) => handleStyleUpdate("color", e.target.value)}
                        className="w-full h-10 mt-2 cursor-pointer p-1"
                    />
                </div>
                <div>
                    <Label htmlFor="bg-color">Background</Label>
                    <Input
                        id="bg-color"
                        type="color"
                        value={style.backgroundColor || "#ffffff"}
                        onChange={(e) => handleStyleUpdate("backgroundColor", e.target.value)}
                        className="w-full h-10 mt-2 cursor-pointer p-1"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                    value={style.fontFamily || "Arial"}
                    onValueChange={(value) => handleStyleUpdate("fontFamily", value)}
                >
                    <SelectTrigger id="font-family" className="mt-2">
                        <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                        {FONTS.map(font => (
                            <SelectItem key={font} value={font}>{font}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex border rounded-md overflow-hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-full rounded-none", style.fontWeight === "bold" && "bg-accent")}
                        onClick={() => handleStyleUpdate("fontWeight", style.fontWeight === "bold" ? "normal" : "bold")}
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-full rounded-none border-l", style.fontStyle === "italic" && "bg-accent")}
                        onClick={() => handleStyleUpdate("fontStyle", style.fontStyle === "italic" ? "normal" : "italic")}
                    >
                        <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-full rounded-none border-l", style.textDecoration === "underline" && "bg-accent")}
                        onClick={() => handleStyleUpdate("textDecoration", style.textDecoration === "underline" ? "none" : "underline")}
                    >
                        <Underline className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex border rounded-md overflow-hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-full rounded-none", (!style.textAlign || style.textAlign === "left") && "bg-accent")}
                        onClick={() => handleStyleUpdate("textAlign", "left")}
                    >
                        <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-full rounded-none border-l", style.textAlign === "center" && "bg-accent")}
                        onClick={() => handleStyleUpdate("textAlign", "center")}
                    >
                        <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-full rounded-none border-l", style.textAlign === "right" && "bg-accent")}
                        onClick={() => handleStyleUpdate("textAlign", "right")}
                    >
                        <AlignRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
