'use client';

import { usePresentationStore } from '@/lib/store/presentationStore';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function SlidePanel() {
  const {
    currentPresentation,
    currentSlideIndex,
    selectSlide,
    addSlide,
    deleteSlide,
    duplicateSlide,
    reorderSlides,
  } = usePresentationStore();

  if (!currentPresentation) return null;

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderSlides(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < currentPresentation.slides.length - 1) {
      reorderSlides(index, index + 1);
    }
  };

  return (
    <div className="w-72 bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground text-lg">Slajdy</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={addSlide}
            title="Pridať slajd"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {currentPresentation.slides.length} slajd{currentPresentation.slides.length !== 1 ? 'ov' : ''}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {currentPresentation.slides.map((slide, index) => (
          <Card
            key={slide.id}
            className={cn(
              "relative group cursor-pointer overflow-hidden transition-all",
              index === currentSlideIndex
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => selectSlide(index)}
          >
            {/* Slide Thumbnail */}
            <div
              className="aspect-video bg-background relative"
              style={{
                backgroundColor: slide.background?.gradient 
                  ? undefined 
                  : (slide.background?.color || '#ffffff'),
                background: slide.background?.gradient 
                  ? slide.background.gradient 
                  : undefined,
                backgroundImage: slide.background?.image
                  ? `url(${slide.background.image})`
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Preview of elements */}
              <div className="absolute inset-0 p-2">
                {slide.elements.slice(0, 3).map((el, elIndex) => (
                  <div
                    key={el.id}
                    className="absolute bg-primary/20 border border-primary/40 rounded"
                    style={{
                      left: `${(el.position.x / 960) * 100}%`,
                      top: `${(el.position.y / 540) * 100}%`,
                      width: `${(el.size.width / 960) * 100}%`,
                      height: `${(el.size.height / 540) * 100}%`,
                      fontSize: '8px',
                    }}
                  />
                ))}
              </div>

              {/* Slide Number Badge */}
              <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2.5 py-1 rounded-md">
                {index + 1}
              </div>

              {/* Element Count */}
              {slide.elements.length > 0 && (
                <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-md">
                  {slide.elements.length} element{slide.elements.length !== 1 ? 'ov' : ''}
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 bg-background/95 hover:bg-background"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSlide(slide.id);
                  }}
                  title="Duplikovať"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                {currentPresentation.slides.length > 1 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-background/95 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Naozaj chcete vymazať tento slajd?')) {
                        deleteSlide(slide.id);
                      }
                    }}
                    title="Vymazať"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>

              {/* Move buttons */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-background/95 hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveUp(index);
                    }}
                    title="Presunúť hore"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </Button>
                )}
                {index < currentPresentation.slides.length - 1 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-background/95 hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveDown(index);
                    }}
                    title="Presunúť dole"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
