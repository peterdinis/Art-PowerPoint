"use client";

import { usePresentationStore } from "@/lib/store/presentationStore";
import {
  Trash2,
  Type,
  Image as ImageIcon,
  Square,
  Layers,
  Video,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SlideElement } from "@/lib/types/presentation";
import SlideBackgroundEditor from "./SlideBackgroundEditor";
import { useTheme } from "@/components/ThemeProvider";

import { motion } from "framer-motion";

// Extended type definitions for better type safety
type AnimationType = 'none' | 'fadeIn' | 'slideIn' | 'zoomIn' | 'bounce' | 'rotate' | 'fadeOut' | 'slideOut' | 'zoomOut' | 'pulse' | 'shake';
type SlideTransitionType = 'none' | 'fade' | 'slide' | 'zoom' | 'blur' | 'cube' | 'flip';
type FontWeightType = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type FontStyleType = 'normal' | 'italic' | 'oblique';
type TextDecorationType = 'none' | 'underline' | 'line-through' | 'overline';
type TextAlignType = 'left' | 'center' | 'right' | 'justify';
type ShapeType = 'square' | 'circle' | 'triangle' | 'rectangle' | 'rounded' | 'star' | 'ellipse' | 'hexagon' | 'arrow' | 'heart';
type FontFamilyType = 'Arial' | 'Helvetica' | 'Times New Roman' | 'Courier New' | 'Verdana' | 'Georgia' | 'Palatino' | 'Garamond' | 'Roboto' | 'Open Sans' | 'Montserrat' | 'Lato';
type BorderStyleType = 'solid' | 'dashed' | 'dotted' | 'double';
type ObjectFitType = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

// Create a proper type for element styling
interface ElementStyle {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fontSize?: number;
  fontFamily?: FontFamilyType;
  fontWeight?: FontWeightType;
  fontStyle?: FontStyleType;
  textDecoration?: TextDecorationType;
  textAlign?: TextAlignType;
  opacity?: number;
  borderRadius?: number;
  borderStyle?: BorderStyleType;
  boxShadow?: string;
  lineHeight?: number;
  letterSpacing?: number;
  gradient?: string;
  objectFit?: ObjectFitType;
}

// Create a proper extended element type
interface ExtendedSlideElement extends Omit<SlideElement, 'style' | 'content'> {
  content: string;
  animation?: {
    type: AnimationType;
    duration: number;
    delay: number;
    easing?: string;
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  };
  style?: ElementStyle;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  rotation?: number;
}

export default function PropertiesPanel() {
  const {
    currentPresentation,
    currentSlideIndex,
    selectedElementId,
    updateElement,
    deleteElement,
    selectElement,
    updatePresentation,
  } = usePresentationStore();
  const { theme } = useTheme();

  // Get default text color based on theme
  const getDefaultTextColor = () => {
    if (typeof window === "undefined") return "#212121";
    const isDark = document.documentElement.classList.contains("dark");
    return isDark ? "#e5e5e5" : "#212121";
  };

  if (!currentPresentation) return null;

  const currentSlide = currentPresentation.slides[currentSlideIndex];
  if (!currentSlide) return null;

  // Safe type casting with proper checks
  const selectedElement = selectedElementId 
    ? currentSlide.elements.find((el) => el.id === selectedElementId)
    : undefined;

  // Helper function to cast element to extended type
  const getExtendedElement = (): ExtendedSlideElement | undefined => {
    if (!selectedElement) return undefined;
    
    // Type guard to ensure we have a proper element
    const baseElement = selectedElement as any;
    
    return {
      ...baseElement,
      content: baseElement.content || '',
      style: baseElement.style || {},
      animation: baseElement.animation || undefined,
      autoplay: baseElement.autoplay || false,
      controls: baseElement.controls ?? true, // Default to true for videos
      loop: baseElement.loop || false,
      rotation: baseElement.rotation || 0,
    };
  };

  const extendedElement = getExtendedElement();

  const handleUpdate = (updates: Partial<ExtendedSlideElement>) => {
    if (selectedElement && extendedElement) {
      // Merge updates properly
      const mergedUpdates = {
        ...updates,
        style: { ...extendedElement.style, ...updates.style },
        animation: updates.animation ? { 
          ...extendedElement.animation, 
          ...updates.animation 
        } : extendedElement.animation,
      };
      
      updateElement(selectedElement.id, mergedUpdates);
    }
  };

  const handleSlideBackgroundUpdate = (updates: {
    color?: string;
    image?: string;
    gradient?: string;
  }) => {
    const updatedSlides = currentPresentation.slides.map((slide, index) =>
      index === currentSlideIndex
        ? { 
            ...slide, 
            background: { 
              ...(slide.background || { type: 'color', color: '#ffffff' }), 
              ...updates 
            } 
          }
        : slide,
    );
    updatePresentation(currentPresentation.id, { slides: updatedSlides });
  };

  if (!extendedElement) {
    return (
      <motion.div
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-80 bg-background border-l border-border flex flex-col"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Select an element or edit slide background
          </p>

          <div className="space-y-4">
            <SlideBackgroundEditor
              currentBackground={currentSlide.background || { type: 'color', color: '#ffffff' }}
              onUpdate={handleSlideBackgroundUpdate}
            />

            <Separator />

            {/* Slide Notes */}
            <div>
              <Label htmlFor="slide-notes">Slide Notes</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Notes are only visible in the editor, not in the presentation
              </p>
              <Textarea
                id="slide-notes"
                value={currentSlide.notes || ""}
                onChange={(e) => {
                  const updatedSlides = currentPresentation.slides.map(
                    (slide, index) =>
                      index === currentSlideIndex
                        ? { ...slide, notes: e.target.value }
                        : slide,
                  );
                  updatePresentation(currentPresentation.id, {
                    slides: updatedSlides,
                  });
                }}
                className="mt-2 resize-none"
                rows={6}
                placeholder="Add notes for this slide..."
              />
            </div>

            <Separator />

            {/* Slide Transition */}
            <div>
              <Label htmlFor="slide-transition">Slide Transition</Label>
              <Select
                value={currentSlide.transition?.type || "fade"}
                onValueChange={(value: SlideTransitionType) => {
                  const updatedSlides = currentPresentation.slides.map(
                    (slide, index) =>
                      index === currentSlideIndex
                        ? {
                            ...slide,
                            transition: {
                              type: value,
                              duration: slide.transition?.duration || 500,
                              direction: slide.transition?.direction || 'right',
                            },
                          }
                        : slide,
                  );
                  updatePresentation(currentPresentation.id, {
                    slides: updatedSlides,
                  });
                }}
              >
                <SelectTrigger id="slide-transition" className="mt-2">
                  <SelectValue placeholder="Select transition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="blur">Blur</SelectItem>
                  <SelectItem value="cube">Cube</SelectItem>
                  <SelectItem value="flip">Flip</SelectItem>
                </SelectContent>
              </Select>
              {currentSlide.transition &&
                currentSlide.transition.type !== "none" && (
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label htmlFor="transition-duration" className="text-xs">
                        Duration (ms)
                      </Label>
                      <Input
                        id="transition-duration"
                        type="number"
                        value={currentSlide.transition.duration || 500}
                        onChange={(e) => {
                          const updatedSlides = currentPresentation.slides.map(
                            (slide, index) =>
                              index === currentSlideIndex
                                ? {
                                    ...slide,
                                    transition: {
                                      ...slide.transition!,
                                      duration: Number(e.target.value),
                                    },
                                  }
                                : slide,
                          );
                          updatePresentation(currentPresentation.id, {
                            slides: updatedSlides,
                          });
                        }}
                        min="100"
                        max="2000"
                        step="100"
                        className="mt-1"
                      />
                    </div>
                    {(currentSlide.transition.type === 'slide' || currentSlide.transition.type === 'cube') && (
                      <div>
                        <Label htmlFor="transition-direction" className="text-xs">
                          Direction
                        </Label>
                        <Select
                          value={currentSlide.transition.direction || 'right'}
                          onValueChange={(value: 'left' | 'right' | 'up' | 'down') => {
                            const updatedSlides = currentPresentation.slides.map(
                              (slide, index) =>
                                index === currentSlideIndex
                                  ? {
                                      ...slide,
                                      transition: {
                                        ...slide.transition!,
                                        direction: value,
                                      },
                                    }
                                  : slide,
                            );
                            updatePresentation(currentPresentation.id, {
                              slides: updatedSlides,
                            });
                          }}
                        >
                          <SelectTrigger id="transition-direction" className="mt-1">
                            <SelectValue placeholder="Select direction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="up">Up</SelectItem>
                            <SelectItem value="down">Down</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </motion.div>
    );
  }

  const getElementIcon = () => {
    switch (extendedElement.type) {
      case "text":
        return <Type className="w-5 h-5" />;
      case "image":
        return <ImageIcon className="w-5 h-5" />;
      case "shape":
        return <Square className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      key={extendedElement.id}
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-80 bg-background border-l border-border flex flex-col"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getElementIcon()}
            Properties
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Are you sure you want to delete this element?")) {
                deleteElement(extendedElement.id);
                selectElement(null);
              }
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground capitalize mt-1">
          {extendedElement.type === "shape"
            ? `Shape: ${extendedElement.content || "square"}`
            : extendedElement.type}
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6">
        {/* Position */}
        <div>
          <Label className="mb-3">Position</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <Label htmlFor="pos-x" className="text-xs text-muted-foreground">
                X
              </Label>
              <Input
                id="pos-x"
                type="number"
                value={extendedElement.position.x}
                onChange={(e) =>
                  handleUpdate({
                    position: {
                      ...extendedElement.position,
                      x: Number(e.target.value),
                    },
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pos-y" className="text-xs text-muted-foreground">
                Y
              </Label>
              <Input
                id="pos-y"
                type="number"
                value={extendedElement.position.y}
                onChange={(e) =>
                  handleUpdate({
                    position: {
                      ...extendedElement.position,
                      y: Number(e.target.value),
                    },
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Size */}
        <div>
          <Label className="mb-3">Size</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <Label htmlFor="size-w" className="text-xs text-muted-foreground">
                Width
              </Label>
              <Input
                id="size-w"
                type="number"
                value={extendedElement.size.width}
                onChange={(e) =>
                  handleUpdate({
                    size: {
                      ...extendedElement.size,
                      width: Math.max(50, Number(e.target.value)),
                    },
                  })
                }
                min="50"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="size-h" className="text-xs text-muted-foreground">
                Height
              </Label>
              <Input
                id="size-h"
                type="number"
                value={extendedElement.size.height}
                onChange={(e) =>
                  handleUpdate({
                    size: {
                      ...extendedElement.size,
                      height: Math.max(50, Number(e.target.value)),
                    },
                  })
                }
                min="50"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <Label htmlFor="rotation">Rotation</Label>
          <div className="flex items-center gap-2 mt-2">
            <Input
              id="rotation"
              type="range"
              min="0"
              max="360"
              value={extendedElement.rotation || 0}
              onChange={(e) =>
                handleUpdate({
                  rotation: Number(e.target.value),
                })
              }
              className="flex-1"
            />
            <span className="text-sm w-12 text-right">
              {extendedElement.rotation || 0}°
            </span>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <Label htmlFor="opacity">Opacity</Label>
          <div className="flex items-center gap-2 mt-2">
            <Input
              id="opacity"
              type="range"
              min="0"
              max="100"
              value={((extendedElement.style?.opacity || 1) * 100)}
              onChange={(e) =>
                handleUpdate({
                  style: {
                    ...extendedElement.style,
                    opacity: Number(e.target.value) / 100,
                  },
                })
              }
              className="flex-1"
            />
            <span className="text-sm w-12 text-right">
              {Math.round((extendedElement.style?.opacity || 1) * 100)}%
            </span>
          </div>
        </div>

        {/* Text-specific properties */}
        {extendedElement.type === "text" && (
          <>
            <Separator />
            <div>
              <Label htmlFor="text-content">Text</Label>
              <Textarea
                id="text-content"
                value={extendedElement.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                className="mt-2 resize-none"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  id="font-size"
                  type="number"
                  value={extendedElement.style?.fontSize || 16}
                  onChange={(e) =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        fontSize: Math.max(8, Number(e.target.value)),
                      },
                    })
                  }
                  min="8"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">px</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="text-color">Text Color</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={extendedElement.style?.color || getDefaultTextColor()}
                  onChange={(e) =>
                    handleUpdate({
                      style: { ...extendedElement.style, color: e.target.value },
                    })
                  }
                  className="w-full h-10 mt-2 cursor-pointer"
                />
              </div>

              <div>
                <Label htmlFor="background-color">Background Color</Label>
                <Input
                  id="background-color"
                  type="color"
                  value={extendedElement.style?.backgroundColor || "transparent"}
                  onChange={(e) =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        backgroundColor: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 mt-2 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="font-family">Font Family</Label>
              <Select
                value={extendedElement.style?.fontFamily || "Arial"}
                onValueChange={(value: FontFamilyType) =>
                  handleUpdate({
                    style: { ...extendedElement.style, fontFamily: value },
                  })
                }
              >
                <SelectTrigger id="font-family" className="mt-2">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Palatino">Palatino</SelectItem>
                  <SelectItem value="Garamond">Garamond</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-full rounded-none",
                    extendedElement.style?.fontWeight === "bold" && "bg-accent",
                  )}
                  onClick={() =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        fontWeight:
                          extendedElement.style?.fontWeight === "bold"
                            ? "normal"
                            : "bold",
                      },
                    })
                  }
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-full rounded-none border-l",
                    extendedElement.style?.fontStyle === "italic" && "bg-accent",
                  )}
                  onClick={() =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        fontStyle:
                          extendedElement.style?.fontStyle === "italic"
                            ? "normal"
                            : "italic",
                      },
                    })
                  }
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-full rounded-none border-l",
                    extendedElement.style?.textDecoration === "underline" &&
                      "bg-accent",
                  )}
                  onClick={() =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        textDecoration:
                          extendedElement.style?.textDecoration === "underline"
                            ? "none"
                            : "underline",
                      },
                    })
                  }
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-full rounded-none",
                    (!extendedElement.style?.textAlign ||
                      extendedElement.style?.textAlign === "left") &&
                      "bg-accent",
                  )}
                  onClick={() =>
                    handleUpdate({
                      style: { ...extendedElement.style, textAlign: "left" },
                    })
                  }
                  title="Align left"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-full rounded-none border-l",
                    extendedElement.style?.textAlign === "center" && "bg-accent",
                  )}
                  onClick={() =>
                    handleUpdate({
                      style: { ...extendedElement.style, textAlign: "center" },
                    })
                  }
                  title="Align center"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-full rounded-none border-l",
                    extendedElement.style?.textAlign === "right" && "bg-accent",
                  )}
                  onClick={() =>
                    handleUpdate({
                      style: { ...extendedElement.style, textAlign: "right" },
                    })
                  }
                  title="Align right"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Advanced text styling */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="line-height">Line Height</Label>
                <Input
                  id="line-height"
                  type="number"
                  step="0.1"
                  value={extendedElement.style?.lineHeight || 1.5}
                  onChange={(e) =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        lineHeight: Number(e.target.value),
                      },
                    })
                  }
                  min="0.5"
                  max="3"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="letter-spacing">Letter Spacing (px)</Label>
                <Input
                  id="letter-spacing"
                  type="number"
                  value={extendedElement.style?.letterSpacing || 0}
                  onChange={(e) =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        letterSpacing: Number(e.target.value),
                      },
                    })
                  }
                  min="-5"
                  max="20"
                  className="mt-2"
                />
              </div>
            </div>
          </>
        )}

        {/* Image-specific properties */}
        {extendedElement.type === "image" && (
          <>
            <Separator />
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="text"
                value={extendedElement.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                className="mt-2"
                placeholder="https://..."
              />
              {extendedElement.content && (
                <div className="mt-3 rounded-lg overflow-hidden border">
                  <img
                    src={extendedElement.content}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="image-fit">Image Fit</Label>
              <Select
                value={extendedElement.style?.objectFit || "cover"}
                onValueChange={(value: ObjectFitType) =>
                  handleUpdate({
                    style: { ...extendedElement.style, objectFit: value },
                  })
                }
              >
                <SelectTrigger id="image-fit" className="mt-2">
                  <SelectValue placeholder="Select fit mode" />
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
          </>
        )}

        {/* Video-specific properties */}
        {extendedElement.type === "video" && (
          <>
            <Separator />
            <div>
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                type="text"
                value={extendedElement.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                className="mt-2"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="video-autoplay">Autoplay</Label>
                <Select
                  value={extendedElement.autoplay ? "true" : "false"}
                  onValueChange={(value) =>
                    handleUpdate({ autoplay: value === "true" })
                  }
                >
                  <SelectTrigger id="video-autoplay" className="mt-2">
                    <SelectValue placeholder="Autoplay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="video-controls">Show Controls</Label>
                <Select
                  value={extendedElement.controls ? "true" : "false"}
                  onValueChange={(value) =>
                    handleUpdate({ controls: value === "true" })
                  }
                >
                  <SelectTrigger id="video-controls" className="mt-2">
                    <SelectValue placeholder="Controls" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="video-loop">Loop</Label>
              <Select
                value={extendedElement.loop ? "true" : "false"}
                onValueChange={(value) =>
                  handleUpdate({ loop: value === "true" })
                }
              >
                <SelectTrigger id="video-loop" className="mt-2">
                  <SelectValue placeholder="Loop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Shape-specific properties */}
        {extendedElement.type === "shape" && (
          <>
            <Separator />
            <div>
              <Label htmlFor="shape-type">Shape Type</Label>
              <Select
                value={(extendedElement.content as ShapeType) || "square"}
                onValueChange={(value: ShapeType) => handleUpdate({ content: value })}
              >
                <SelectTrigger id="shape-type" className="mt-2">
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="circle">Circle</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                  <SelectItem value="rectangle">Rectangle</SelectItem>
                  <SelectItem value="rounded">Rounded Rectangle</SelectItem>
                  <SelectItem value="star">Star</SelectItem>
                  <SelectItem value="ellipse">Ellipse</SelectItem>
                  <SelectItem value="hexagon">Hexagon</SelectItem>
                  <SelectItem value="arrow">Arrow</SelectItem>
                  <SelectItem value="heart">Heart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shape-bg">Background Color</Label>
                <Input
                  id="shape-bg"
                  type="color"
                  value={extendedElement.style?.backgroundColor || "#3b82f6"}
                  onChange={(e) =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        backgroundColor: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 mt-2 cursor-pointer"
                />
              </div>

              <div>
                <Label htmlFor="shape-border-color">Border Color</Label>
                <Input
                  id="shape-border-color"
                  type="color"
                  value={extendedElement.style?.borderColor || "#000000"}
                  onChange={(e) =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        borderColor: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 mt-2 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shape-border-width">Border Width</Label>
                <Input
                  id="shape-border-width"
                  type="number"
                  value={extendedElement.style?.borderWidth || 0}
                  onChange={(e) =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        borderWidth: Math.max(0, Number(e.target.value)),
                      },
                    })
                  }
                  min="0"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="shape-border-radius">Border Radius</Label>
                <Input
                  id="shape-border-radius"
                  type="number"
                  value={extendedElement.style?.borderRadius || 0}
                  onChange={(e) =>
                    handleUpdate({
                      style: {
                        ...extendedElement.style,
                        borderRadius: Math.max(0, Number(e.target.value)),
                      },
                    })
                  }
                  min="0"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="shape-border-style">Border Style</Label>
              <Select
                value={extendedElement.style?.borderStyle || "solid"}
                onValueChange={(value: BorderStyleType) =>
                  handleUpdate({
                    style: {
                      ...extendedElement.style,
                      borderStyle: value,
                    },
                  })
                }
              >
                <SelectTrigger id="shape-border-style" className="mt-2">
                  <SelectValue placeholder="Select border style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="shape-shadow">Box Shadow</Label>
              <Input
                id="shape-shadow"
                type="text"
                value={extendedElement.style?.boxShadow || ""}
                onChange={(e) =>
                  handleUpdate({
                    style: {
                      ...extendedElement.style,
                      boxShadow: e.target.value,
                    },
                  })
                }
                className="mt-2"
                placeholder="0 2px 4px rgba(0,0,0,0.1)"
              />
            </div>
          </>
        )}

        {/* Animation Settings - for all elements */}
        <Separator />
        <div>
          <Label className="mb-3">Animation</Label>
          <div className="space-y-3">
            <div>
              <Label
                htmlFor="animation-type"
                className="text-xs text-muted-foreground"
              >
                Animation Type
              </Label>
              <Select
                value={extendedElement.animation?.type || "none"}
                onValueChange={(value: AnimationType) =>
                  handleUpdate({
                    animation: {
                      type: value,
                      duration: extendedElement.animation?.duration || 500,
                      delay: extendedElement.animation?.delay || 0,
                      easing: extendedElement.animation?.easing || "ease-in-out",
                      direction: extendedElement.animation?.direction || "normal",
                    },
                  })
                }
              >
                <SelectTrigger id="animation-type" className="mt-1">
                  <SelectValue placeholder="Select animation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fadeIn">Fade In</SelectItem>
                  <SelectItem value="fadeOut">Fade Out</SelectItem>
                  <SelectItem value="slideIn">Slide In</SelectItem>
                  <SelectItem value="slideOut">Slide Out</SelectItem>
                  <SelectItem value="zoomIn">Zoom In</SelectItem>
                  <SelectItem value="zoomOut">Zoom Out</SelectItem>
                  <SelectItem value="bounce">Bounce</SelectItem>
                  <SelectItem value="rotate">Rotate</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="shake">Shake</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {extendedElement.animation &&
              extendedElement.animation.type !== "none" && (
                <>
                  <div>
                    <Label
                      htmlFor="animation-duration"
                      className="text-xs text-muted-foreground"
                    >
                      Duration (ms)
                    </Label>
                    <Input
                      id="animation-duration"
                      type="number"
                      value={extendedElement.animation.duration || 500}
                      onChange={(e) =>
                        handleUpdate({
                          animation: {
                            ...extendedElement.animation!,
                            duration: Number(e.target.value),
                          },
                        })
                      }
                      min="100"
                      max="2000"
                      step="100"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="animation-delay"
                      className="text-xs text-muted-foreground"
                    >
                      Delay (ms)
                    </Label>
                    <Input
                      id="animation-delay"
                      type="number"
                      value={extendedElement.animation.delay || 0}
                      onChange={(e) =>
                        handleUpdate({
                          animation: {
                            ...extendedElement.animation!,
                            delay: Number(e.target.value),
                          },
                        })
                      }
                      min="0"
                      max="5000"
                      step="100"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="animation-easing"
                      className="text-xs text-muted-foreground"
                    >
                      Easing
                    </Label>
                    <Select
                      value={extendedElement.animation?.easing || "ease-in-out"}
                      onValueChange={(value: string) =>
                        handleUpdate({
                          animation: {
                            ...extendedElement.animation!,
                            easing: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger id="animation-easing" className="mt-1">
                        <SelectValue placeholder="Select easing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="ease">Ease</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                        <SelectItem value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">Bounce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {extendedElement.animation.type.includes('slide') && (
                    <div>
                      <Label
                        htmlFor="animation-direction"
                        className="text-xs text-muted-foreground"
                      >
                        Direction
                      </Label>
                      <Select
                        value={extendedElement.animation.direction || "normal"}
                        onValueChange={(value: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse') =>
                          handleUpdate({
                            animation: {
                              ...extendedElement.animation!,
                              direction: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger id="animation-direction" className="mt-1">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="reverse">Reverse</SelectItem>
                          <SelectItem value="alternate">Alternate</SelectItem>
                          <SelectItem value="alternate-reverse">Alternate Reverse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      </CardContent>
    </motion.div>
  );
}