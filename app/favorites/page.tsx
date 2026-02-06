'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import DashboardSidebar from '@/components/DashboardSidebar';
import { usePresentationStore } from '@/lib/store/presentationStore';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();
  const { presentations, loadPresentations } = usePresentationStore();

  useEffect(() => {
    loadPresentations();
  }, [loadPresentations]);

  // For now, show all presentations (can be extended with favorites feature)
  const favoritePresentations = useMemo(() => {
    return presentations.filter(p => {
      // Show recently updated presentations as "favorites" for now
      const daysSinceUpdate = (Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate <= 3;
    });
  }, [presentations]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Dnes';
    if (diffDays === 1) return 'Včera';
    if (diffDays < 7) return `Pred ${diffDays} dňami`;
    return d.toLocaleDateString('sk-SK', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 lg:pl-64">
          <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
            <div className="mb-6">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Favorites</h1>
              </div>
              <p className="text-muted-foreground">
                Vaše obľúbené a nedávno upravené prezentácie
              </p>
            </div>

            {favoritePresentations.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-16">
                    <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No favorite presentations</h3>
                    <p className="text-muted-foreground mb-6">
                      Zatiaľ nemáte žiadne obľúbené prezentácie
                    </p>
                    <Button asChild>
                      <Link href="/dashboard">
                        Prejsť na dashboard
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {favoritePresentations.map((presentation) => (
                  <Card key={presentation.id} className="group hover:shadow-lg transition-shadow">
                    <Link href={`/editor?id=${presentation.id}`} className="block">
                      <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative overflow-hidden">
                        <div className="text-5xl font-bold opacity-20 text-primary">
                          {presentation.slides.length}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Star className="w-5 h-5 text-primary fill-primary" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
                          {presentation.slides.length} slajd{presentation.slides.length !== 1 ? 'ov' : ''}
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                          {presentation.title}
                        </CardTitle>
                        {presentation.description && (
                          <CardDescription className="line-clamp-2">
                            {presentation.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(presentation.updatedAt)}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
