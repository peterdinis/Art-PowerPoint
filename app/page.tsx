'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Grid3x3, List, Calendar, FileText, Trash2, MoreVertical, TrendingUp, Clock, Star } from 'lucide-react';
import { usePresentationStore } from '@/lib/store/presentationStore';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DashboardSidebar from '@/components/DashboardSidebar';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'oldest' | 'name' | 'slides';

export default function Home() {
  const router = useRouter();
  const { presentations, loadPresentations, createPresentation, deletePresentation } = usePresentationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadPresentations();
  }, [loadPresentations]);

  const filteredAndSorted = useMemo(() => {
    let filtered = presentations.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'slides':
          return b.slides.length - a.slides.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [presentations, searchQuery, sortBy]);

  const stats = useMemo(() => {
    const totalSlides = presentations.reduce((sum, p) => sum + p.slides.length, 0);
    const recentCount = presentations.filter(p => {
      const daysSinceUpdate = (Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate <= 7;
    }).length;
    return {
      total: presentations.length,
      totalSlides,
      recent: recentCount,
      avgSlides: presentations.length > 0 ? Math.round(totalSlides / presentations.length) : 0,
    };
  }, [presentations]);

  const handleCreateNew = () => {
    const title = prompt('Zadajte názov prezentácie:');
    if (title) {
      const description = prompt('Zadajte popis (voliteľné):') || undefined;
      const newId = createPresentation(title, description);
      router.push(`/editor?id=${newId}`);
    }
  };

  const handleDelete = (id: string) => {
    if (showDeleteConfirm === id) {
      deletePresentation(id);
      setShowDeleteConfirm(null);
    } else {
      setShowDeleteConfirm(id);
      setTimeout(() => setShowDeleteConfirm(null), 3000);
    }
  };

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
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">Prezentácie</h1>
                  <p className="text-muted-foreground">
                    Vytvárajte a spravujte svoje profesionálne prezentácie
                  </p>
                </div>
                <Button onClick={handleCreateNew} size="lg" className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Nová prezentácia
                </Button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Celkom prezentácií</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Celkom slajdov</CardTitle>
                    <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSlides}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nedávno upravené</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.recent}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Priemer slajdov</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.avgSlides}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Hľadať prezentácie..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            {sortBy === 'recent' && 'Najnovšie'}
                            {sortBy === 'oldest' && 'Najstaršie'}
                            {sortBy === 'name' && 'Podľa názvu'}
                            {sortBy === 'slides' && 'Podľa slajdov'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setSortBy('recent')}>Najnovšie</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy('oldest')}>Najstaršie</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy('name')}>Podľa názvu</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy('slides')}>Podľa počtu slajdov</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Presentations */}
            {filteredAndSorted.length === 0 && presentations.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">
                      Žiadne prezentácie sa nenašli
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Skúste zmeniť vyhľadávací dotaz
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : filteredAndSorted.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">
                      Zatiaľ nemáte žiadne prezentácie
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Začnite vytváraním svojej prvej prezentácie. Je to jednoduché a rýchle!
                    </p>
                    <Button onClick={handleCreateNew} size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Vytvoriť prvú prezentáciu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {/* Create New Card */}
                <Card 
                  className="cursor-pointer hover:border-primary transition-colors border-dashed"
                  onClick={handleCreateNew}
                >
                  <CardContent className="flex flex-col items-center justify-center h-64 p-6">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-center">Vytvoriť novú prezentáciu</p>
                  </CardContent>
                </Card>

                {/* Presentation Cards */}
                {filteredAndSorted.map((presentation) => (
                  <Card key={presentation.id} className="group hover:shadow-lg transition-shadow">
                    <Link href={`/editor?id=${presentation.id}`} className="block">
                      <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative overflow-hidden">
                        <div className="text-5xl font-bold opacity-20 text-primary">
                          {presentation.slides.length}
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
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(presentation.updatedAt)}
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleDelete(presentation.id); }}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Vymazať
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSorted.map((presentation) => (
                  <Card key={presentation.id} className="group hover:shadow-md transition-shadow">
                    <Link href={`/editor?id=${presentation.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-10 h-10 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors mb-1">
                              {presentation.title}
                            </CardTitle>
                            {presentation.description && (
                              <CardDescription className="line-clamp-1 mb-2">
                                {presentation.description}
                              </CardDescription>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Grid3x3 className="w-3 h-3" />
                                {presentation.slides.length} slajd{presentation.slides.length !== 1 ? 'ov' : ''}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(presentation.updatedAt)}
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleDelete(presentation.id); }}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Vymazať
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
