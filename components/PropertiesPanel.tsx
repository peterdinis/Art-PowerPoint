'use client';

import { usePresentationStore } from '@/lib/store/presentationStore';
import { Trash2, Type, Image as ImageIcon, Square, Layers, Video, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SlideElement } from '@/lib/types/presentation';
import SlideBackgroundEditor from './SlideBackgroundEditor';

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

  if (!currentPresentation) return null;

  const currentSlide = currentPresentation.slides[currentSlideIndex];
  if (!currentSlide) return null;

  const selectedElement = currentSlide.elements.find(
    (el) => el.id === selectedElementId
  );

  const handleUpdate = (updates: Partial<SlideElement>) => {
    if (selectedElement) {
      updateElement(selectedElement.id, updates);
    }
  };

  const handleSlideBackgroundUpdate = (updates: { color?: string; image?: string; gradient?: string }) => {
    const updatedSlides = currentPresentation.slides.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, background: { ...slide.background, ...updates } }
        : slide
    );
    updatePresentation(currentPresentation.id, { slides: updatedSlides });
  };

  if (!selectedElement) {
    return (
      <div className="w-80 bg-background border-l border-border flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Vlastnosti
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Vyberte element alebo upravte pozadie slajdu
          </p>

          <div className="space-y-4">
            <SlideBackgroundEditor
              currentBackground={currentSlide.background}
              onUpdate={handleSlideBackgroundUpdate}
            />

            <Separator />

            {/* Slide Notes */}
            <div>
              <Label htmlFor="slide-notes">Poznámky k slajdu</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Poznámky sú viditeľné len v editore, nie v prezentácii
              </p>
              <textarea
                id="slide-notes"
                value={currentSlide.notes || ''}
                onChange={(e) => {
                  const updatedSlides = currentPresentation.slides.map((slide, index) =>
                    index === currentSlideIndex
                      ? { ...slide, notes: e.target.value }
                      : slide
                  );
                  updatePresentation(currentPresentation.id, { slides: updatedSlides });
                }}
                className="w-full px-3 py-2 mt-2 border border-input rounded-md text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                rows={6}
                placeholder="Pridajte poznámky k tomuto slajdu..."
              />
            </div>

            <Separator />

            {/* Slide Transition */}
            <div>
              <Label htmlFor="slide-transition">Prechod medzi slajdmi</Label>
              <select
                id="slide-transition"
                value={currentSlide.transition?.type || 'fade'}
                onChange={(e) => {
                  const updatedSlides = currentPresentation.slides.map((slide, index) =>
                    index === currentSlideIndex
                      ? { ...slide, transition: { type: e.target.value as any, duration: slide.transition?.duration || 500 } }
                      : slide
                  );
                  updatePresentation(currentPresentation.id, { slides: updatedSlides });
                }}
                className="w-full px-3 py-2 mt-2 border border-input rounded-md text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="none">Žiadny</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
                <option value="blur">Blur</option>
              </select>
              {currentSlide.transition && currentSlide.transition.type !== 'none' && (
                <div className="mt-2">
                  <Label htmlFor="transition-duration" className="text-xs">Trvanie (ms)</Label>
                  <Input
                    id="transition-duration"
                    type="number"
                    value={currentSlide.transition.duration || 500}
                    onChange={(e) => {
                      const updatedSlides = currentPresentation.slides.map((slide, index) =>
                        index === currentSlideIndex
                          ? { ...slide, transition: { ...slide.transition!, duration: Number(e.target.value) } }
                          : slide
                      );
                      updatePresentation(currentPresentation.id, { slides: updatedSlides });
                    }}
                    min="100"
                    max="2000"
                    step="100"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  const getElementIcon = () => {
    switch (selectedElement.type) {
      case 'text':
        return <Type className="w-5 h-5" />;
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'shape':
        return <Square className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-80 bg-background border-l border-border flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getElementIcon()}
            Vlastnosti
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm('Naozaj chcete vymazať tento element?')) {
                deleteElement(selectedElement.id);
                selectElement(null);
              }
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground capitalize mt-1">
          {selectedElement.type === 'shape' ? `Tvar: ${selectedElement.content || 'štvorec'}` : selectedElement.type}
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6">
        {/* Position */}
        <div>
          <Label className="mb-3">Pozícia</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <Label htmlFor="pos-x" className="text-xs text-muted-foreground">X</Label>
              <Input
                id="pos-x"
                type="number"
                value={selectedElement.position.x}
                onChange={(e) =>
                  handleUpdate({
                    position: { ...selectedElement.position, x: Number(e.target.value) },
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pos-y" className="text-xs text-muted-foreground">Y</Label>
              <Input
                id="pos-y"
                type="number"
                value={selectedElement.position.y}
                onChange={(e) =>
                  handleUpdate({
                    position: { ...selectedElement.position, y: Number(e.target.value) },
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
          <Label className="mb-3">Veľkosť</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <Label htmlFor="size-w" className="text-xs text-muted-foreground">Šírka</Label>
              <Input
                id="size-w"
                type="number"
                value={selectedElement.size.width}
                onChange={(e) =>
                  handleUpdate({
                    size: { ...selectedElement.size, width: Math.max(50, Number(e.target.value)) },
                  })
                }
                min="50"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="size-h" className="text-xs text-muted-foreground">Výška</Label>
              <Input
                id="size-h"
                type="number"
                value={selectedElement.size.height}
                onChange={(e) =>
                  handleUpdate({
                    size: { ...selectedElement.size, height: Math.max(50, Number(e.target.value)) },
                  })
                }
                min="50"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Text-specific properties */}
        {selectedElement.type === 'text' && (
          <>
            <Separator />
            <div>
              <Label htmlFor="text-content">Text</Label>
              <textarea
                id="text-content"
                value={selectedElement.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                className="w-full px-3 py-2 mt-2 border border-input rounded-md text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="font-size">Veľkosť písma</Label>
              <Input
                id="font-size"
                type="number"
                value={selectedElement.style?.fontSize || 16}
                onChange={(e) =>
                  handleUpdate({
                    style: { ...selectedElement.style, fontSize: Math.max(8, Number(e.target.value)) },
                  })
                }
                min="8"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="text-color">Farba textu</Label>
              <Input
                id="text-color"
                type="color"
                value={selectedElement.style?.color || '#000000'}
                onChange={(e) =>
                  handleUpdate({
                    style: { ...selectedElement.style, color: e.target.value },
                  })
                }
                className="w-full h-12 mt-2 cursor-pointer"
              />
            </div>

            <div>
              <Label htmlFor="font-family">Font</Label>
              <select
                id="font-family"
                value={selectedElement.style?.fontFamily || 'Arial'}
                onChange={(e) =>
                  handleUpdate({
                    style: { ...selectedElement.style, fontFamily: e.target.value },
                  })
                }
                className="w-full px-3 py-2 mt-2 border border-input rounded-md text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Palatino">Palatino</option>
                <option value="Garamond">Garamond</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-full rounded-none", selectedElement.style?.fontWeight === 'bold' && "bg-accent")}
                  onClick={() => handleUpdate({
                    style: { ...selectedElement.style, fontWeight: selectedElement.style?.fontWeight === 'bold' ? 'normal' : 'bold' }
                  })}
                  title="Tučné"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-full rounded-none border-l", selectedElement.style?.fontStyle === 'italic' && "bg-accent")}
                  onClick={() => handleUpdate({
                    style: { ...selectedElement.style, fontStyle: selectedElement.style?.fontStyle === 'italic' ? 'normal' : 'italic' }
                  })}
                  title="Kurzíva"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-full rounded-none border-l", selectedElement.style?.textDecoration === 'underline' && "bg-accent")}
                  onClick={() => handleUpdate({
                    style: { ...selectedElement.style, textDecoration: selectedElement.style?.textDecoration === 'underline' ? 'none' : 'underline' }
                  })}
                  title="Podčiarknuté"
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-full rounded-none", (!selectedElement.style?.textAlign || selectedElement.style?.textAlign === 'left') && "bg-accent")}
                  onClick={() => handleUpdate({
                    style: { ...selectedElement.style, textAlign: 'left' }
                  })}
                  title="Zarovnať vľavo"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-full rounded-none border-l", selectedElement.style?.textAlign === 'center' && "bg-accent")}
                  onClick={() => handleUpdate({
                    style: { ...selectedElement.style, textAlign: 'center' }
                  })}
                  title="Zarovnať na stred"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-full rounded-none border-l", selectedElement.style?.textAlign === 'right' && "bg-accent")}
                  onClick={() => handleUpdate({
                    style: { ...selectedElement.style, textAlign: 'right' }
                  })}
                  title="Zarovnať vpravo"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Image-specific properties */}
        {selectedElement.type === 'image' && (
          <>
            <Separator />
            <div>
              <Label htmlFor="image-url">URL obrázka</Label>
              <Input
                id="image-url"
                type="text"
                value={selectedElement.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                className="mt-2"
                placeholder="https://..."
              />
              {selectedElement.content && (
                <div className="mt-3 rounded-lg overflow-hidden border">
                  <img
                    src={selectedElement.content}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Video-specific properties */}
        {selectedElement.type === 'video' && (
          <>
            <Separator />
            <div>
              <Label htmlFor="video-url">URL videa</Label>
              <Input
                id="video-url"
                type="text"
                value={selectedElement.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                className="mt-2"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </>
        )}

        {/* Shape-specific properties */}
        {selectedElement.type === 'shape' && (
          <>
            <Separator />
            <div>
              <Label htmlFor="shape-type">Typ tvaru</Label>
              <select
                id="shape-type"
                value={selectedElement.content || 'square'}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                className="w-full px-3 py-2 mt-2 border border-input rounded-md text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="square">Štvorec</option>
                <option value="circle">Kruh</option>
                <option value="triangle">Trojuholník</option>
                <option value="rectangle">Obdĺžnik</option>
                <option value="rounded">Zaoblený obdĺžnik</option>
                <option value="star">Hviezda</option>
              </select>
            </div>
            <div>
              <Label htmlFor="shape-bg">Farba pozadia</Label>
              <Input
                id="shape-bg"
                type="color"
                value={selectedElement.style?.backgroundColor || '#3b82f6'}
                onChange={(e) =>
                  handleUpdate({
                    style: { ...selectedElement.style, backgroundColor: e.target.value },
                  })
                }
                className="w-full h-12 mt-2 cursor-pointer"
              />
            </div>

            <div>
              <Label htmlFor="shape-border-color">Farba rámečka</Label>
              <Input
                id="shape-border-color"
                type="color"
                value={selectedElement.style?.borderColor || '#000000'}
                onChange={(e) =>
                  handleUpdate({
                    style: { ...selectedElement.style, borderColor: e.target.value },
                  })
                }
                className="w-full h-12 mt-2 cursor-pointer"
              />
            </div>

            <div>
              <Label htmlFor="shape-border-width">Šírka rámečka</Label>
              <Input
                id="shape-border-width"
                type="number"
                value={selectedElement.style?.borderWidth || 0}
                onChange={(e) =>
                  handleUpdate({
                    style: { ...selectedElement.style, borderWidth: Math.max(0, Number(e.target.value)) },
                  })
                }
                min="0"
                className="mt-2"
              />
            </div>
          </>
        )}

        {/* Animation Settings - for all elements */}
        <Separator />
        <div>
          <Label className="mb-3">Animácia</Label>
          <div className="space-y-3">
            <div>
              <Label htmlFor="animation-type" className="text-xs text-muted-foreground">Typ animácie</Label>
              <select
                id="animation-type"
                value={selectedElement.animation?.type || 'none'}
                onChange={(e) =>
                  handleUpdate({
                    animation: {
                      type: e.target.value as any,
                      duration: selectedElement.animation?.duration || 500,
                      delay: selectedElement.animation?.delay || 0,
                    },
                  })
                }
                className="w-full px-3 py-2 mt-1 border border-input rounded-md text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="none">Žiadna</option>
                <option value="fadeIn">Fade In</option>
                <option value="slideIn">Slide In</option>
                <option value="zoomIn">Zoom In</option>
                <option value="bounce">Bounce</option>
                <option value="rotate">Rotate</option>
              </select>
            </div>
            {selectedElement.animation && selectedElement.animation.type !== 'none' && (
              <>
                <div>
                  <Label htmlFor="animation-duration" className="text-xs text-muted-foreground">Trvanie (ms)</Label>
                  <Input
                    id="animation-duration"
                    type="number"
                    value={selectedElement.animation.duration || 500}
                    onChange={(e) =>
                      handleUpdate({
                        animation: {
                          ...selectedElement.animation!,
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
                  <Label htmlFor="animation-delay" className="text-xs text-muted-foreground">Oneskorenie (ms)</Label>
                  <Input
                    id="animation-delay"
                    type="number"
                    value={selectedElement.animation.delay || 0}
                    onChange={(e) =>
                      handleUpdate({
                        animation: {
                          ...selectedElement.animation!,
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
              </>
            )}
          </div>
        </div>
      </CardContent>
    </div>
  );
}
