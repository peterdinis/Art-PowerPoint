'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Download, Menu, Settings, ZoomIn, ZoomOut, Grid, Layers, FileText, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { usePresentationStore } from '@/lib/store/presentationStore';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface EditorMenuProps {
  onSave: () => void;
  onExport: () => void;
}

export default function EditorMenu({ onSave, onExport }: EditorMenuProps) {
  const { currentPresentation } = usePresentationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="hover:bg-accent">
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            
            <Separator orientation="vertical" className="h-6 hidden md:block" />
            
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground text-base leading-tight">
                    {currentPresentation?.title || 'Prezentácia'}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {currentPresentation?.slides.length || 0} slide
                    {currentPresentation?.slides.length !== 1 ? 'ov' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Grid className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <ZoomIn className="w-4 h-4 mr-2" />
                  Priblížiť
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ZoomOut className="w-4 h-4 mr-2" />
                  Oddialiť
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Layers className="w-4 h-4 mr-2" />
                  Zobraziť mriežku
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="icon" asChild className="hover:bg-accent">
              <Link href="/settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>

            <ThemeToggle />

            <Separator orientation="vertical" className="h-6" />

            <Button 
              onClick={() => {
                if (currentPresentation) {
                  window.open(`/presentation/${currentPresentation.id}`, '_blank');
                }
              }}
              variant="default" 
              size="sm" 
              className="gap-2"
              disabled={!currentPresentation}
            >
              <Play className="w-4 h-4" />
              <span className="hidden lg:inline">Spustiť</span>
            </Button>

            <Button onClick={onSave} variant="outline" size="sm" className="gap-2">
              <Save className="w-4 h-4" />
              <span className="hidden lg:inline">Uložiť</span>
            </Button>
            
            <Button onClick={onExport} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Exportovať</span>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="space-y-6 mt-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">
                        {currentPresentation?.title || 'Prezentácia'}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {currentPresentation?.slides.length || 0} slide
                        {currentPresentation?.slides.length !== 1 ? 'ov' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      if (currentPresentation) {
                        window.open(`/presentation/${currentPresentation.id}`, '_blank');
                        setMobileMenuOpen(false);
                      }
                    }}
                    className="w-full justify-start gap-2" 
                    variant="default"
                  >
                    <Play className="w-4 h-4" />
                    Spustiť prezentáciu
                  </Button>
                  <Button 
                    onClick={() => { onSave(); setMobileMenuOpen(false); }} 
                    className="w-full justify-start gap-2" 
                    variant="outline"
                  >
                    <Save className="w-4 h-4" />
                    Uložiť
                  </Button>
                  <Button 
                    onClick={() => { onExport(); setMobileMenuOpen(false); }} 
                    className="w-full justify-start gap-2" 
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                    Exportovať
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                      <Settings className="w-4 h-4" />
                      Nastavenia
                    </Link>
                  </Button>
                  <div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50">
                    <span className="text-sm font-medium">Téma</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
