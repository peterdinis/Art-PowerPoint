"use client";

import { usePresentationStore } from "@/store/presentationStore";
import {
    Type,
    Image as ImageIcon,
    Video as VideoIcon,
    Table2,
    PieChart,
    Shapes,
    Link as LinkIcon,
    Code,
    Plus,
    ChevronDown,
    AlignLeft,
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    Zap,
    Grid,
    ZoomIn,
    ZoomOut,
    Maximize,
    FileDown,
    Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
    createTextElement,
    createShapeElement,
    createCodeElement,
    TextType
} from "@/lib/utils/elementFactory";
import type { ShapeType } from "@/types/presentation";

interface ToolbarSectionsProps {
    onOpenDialog: (dialogName: string) => void;
    getDefaultTextColor: () => string;
}

export function ToolbarSections({ onOpenDialog, getDefaultTextColor }: ToolbarSectionsProps) {
    const {
        addElement,
        zoomLevel,
        setZoomLevel,
        toggleGrid,
        showGrid,
        addSlide
    } = usePresentationStore();

    const handleAddText = (type: TextType) => {
        addElement(createTextElement(type, { textColor: getDefaultTextColor() }));
    };

    const handleAddShape = (type: ShapeType) => {
        addElement(createShapeElement(type));
    };

    const handleAddCode = (lang: string = "javascript") => {
        addElement(createCodeElement(lang));
    };

    return (
        <div className="flex items-center gap-1">
            {/* Insert Section */}
            <div className="flex items-center gap-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1 px-2 h-9">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Add</span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuLabel>Text Elements</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleAddText("title")}>
                            <Heading1 className="h-4 w-4 mr-2" /> Title
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddText("subtitle")}>
                            <Heading2 className="h-4 w-4 mr-2" /> Subtitle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddText("body")}>
                            <AlignLeft className="h-4 w-4 mr-2" /> Body Text
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Media & Shapes</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onOpenDialog("image")}>
                            <ImageIcon className="h-4 w-4 mr-2" /> Image
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenDialog("video")}>
                            <VideoIcon className="h-4 w-4 mr-2" /> Video
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenDialog("table")}>
                            <Table2 className="h-4 w-4 mr-2" /> Table
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenDialog("chart")}>
                            <PieChart className="h-4 w-4 mr-2" /> Chart
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenDialog("icon")}>
                            <Zap className="h-4 w-4 mr-2" /> Icon
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleAddText("body")} title="Add Text">
                    <Type className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => onOpenDialog("image")} title="Add Image">
                    <ImageIcon className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Shapes className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="grid grid-cols-3 gap-1 p-2 w-48">
                        {["square", "circle", "triangle", "rectangle", "rounded", "star", "heart", "hexagon", "octagon", "diamond"].map((shape) => (
                            <DropdownMenuItem key={shape} onClick={() => handleAddShape(shape as ShapeType)} className="flex flex-col items-center justify-center h-12 gap-1 p-0">
                                <div className="w-5 h-5 bg-primary/20 rounded-md" />
                                <span className="text-[10px] capitalize">{shape}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Separator orientation="vertical" className="h-8 mx-2" />

            {/* View Section */}
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setZoomLevel(zoomLevel + 0.1)} title="Zoom In">
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="text-xs font-medium w-12 text-center">
                    {Math.round(zoomLevel * 100)}%
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setZoomLevel(Math.max(0.1, zoomLevel - 0.1))} title="Zoom Out">
                    <ZoomOut className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    variant={showGrid ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={toggleGrid}
                    title="Toggle Grid"
                >
                    <Grid className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
