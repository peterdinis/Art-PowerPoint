"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Plus,
	Search,
	Filter,
	Grid3x3,
	List,
	Calendar,
	FileText,
	Trash2,
	MoreVertical,
	TrendingUp,
	Clock,
	GripVertical,
	X,
	FileUp,
} from "lucide-react";
import { usePresentationStore } from "@/store/presentationStore";
import { Slide, Presentation } from "@/types/presentation";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { importPPTX } from "@/lib/utils/pptxImport";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardSidebar from "@/components/DashboardSidebar";
import { cn } from "@/lib/utils";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
	DragOverlay,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ViewMode = "grid" | "list";
type SortOption = "recent" | "oldest" | "name" | "slides" | "custom";

// Sortable Item Component for Grid View
function SortableGridItem({
	presentation,
	handleDelete,
	formatDate,
	isOverlay = false,
}: {
	presentation: any;
	handleDelete: (id: string, title?: string) => void;
	formatDate: (date: Date) => string;
	isOverlay?: boolean;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: presentation.id,
		disabled: isOverlay,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 999 : "auto",
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={cn(
				"group hover:shadow-lg transition-shadow relative rounded-lg",
				isDragging && "ring-2 ring-primary shadow-xl",
			)}
		>
			<Link
				href={`/editor?id=${presentation.id}`}
				className="block"
				onClick={(e) => {
					if (isDragging) {
						e.preventDefault();
					}
				}}
			>
				<div className="h-40 bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center relative overflow-hidden rounded-t-lg">
					<div className="text-5xl font-bold opacity-20 text-primary">
						{presentation.slides.length}
					</div>
					<div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
						{presentation.slides.length} slide
						{presentation.slides.length !== 1 ? "s" : ""}
					</div>
				</div>
				<CardHeader className="pb-3">
					<CardTitle className="line-clamp-1 group-hover:text-primary transition-colors text-base">
						{presentation.title}
					</CardTitle>
					{presentation.description && (
						<CardDescription className="line-clamp-2 text-sm">
							{presentation.description}
						</CardDescription>
					)}
				</CardHeader>
				<CardContent className="pt-0">
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<div className="flex items-center gap-1">
							<Calendar className="w-3 h-3" />
							{formatDate(presentation.updatedAt)}
						</div>
					</div>
				</CardContent>
			</Link>
			{!isOverlay && (
				<>
					<div className="absolute top-2 left-2">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 cursor-grab active:cursor-grabbing hover:bg-primary/10 rounded-md"
							{...attributes}
							{...listeners}
						>
							<GripVertical className="w-4 h-4" />
						</Button>
					</div>
					<div className="absolute top-2 right-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 rounded-md"
								>
									<MoreVertical className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="rounded-lg">
								<DropdownMenuItem
									onClick={(e) => {
										e.preventDefault();
										handleDelete(presentation.id, presentation.title);
									}}
									className="text-destructive focus:text-destructive rounded-md"
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</>
			)}
		</Card>
	);
}

// Sortable Item Component for List View
function SortableListItem({
	presentation,
	handleDelete,
	formatDate,
	isOverlay = false,
}: {
	presentation: any;
	handleDelete: (id: string, title?: string) => void;
	formatDate: (date: Date) => string;
	isOverlay?: boolean;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: presentation.id,
		disabled: isOverlay,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 999 : "auto",
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={cn(
				"group hover:shadow-md transition-shadow rounded-lg",
				isDragging && "ring-2 ring-primary shadow-xl",
			)}
		>
			<Link
				href={`/editor?id=${presentation.id}`}
				onClick={(e) => {
					if (isDragging) {
						e.preventDefault();
					}
				}}
			>
				<CardContent className="p-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-3">
							{!isOverlay && (
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 cursor-grab active:cursor-grabbing hover:bg-primary/10 rounded-md"
									{...attributes}
									{...listeners}
								>
									<GripVertical className="w-4 h-4" />
								</Button>
							)}
							<div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
								<FileText className="w-10 h-10 text-primary" />
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<CardTitle className="line-clamp-1 group-hover:text-primary transition-colors mb-1 text-base">
								{presentation.title}
							</CardTitle>
							{presentation.description && (
								<CardDescription className="line-clamp-1 mb-2 text-sm">
									{presentation.description}
								</CardDescription>
							)}
							<div className="flex items-center gap-4 text-xs text-muted-foreground">
								<span className="flex items-center gap-1">
									<Grid3x3 className="w-3 h-3" />
									{presentation.slides.length} slide
									{presentation.slides.length !== 1 ? "s" : ""}
								</span>
								<span className="flex items-center gap-1">
									<Calendar className="w-3 h-3" />
									{formatDate(presentation.updatedAt)}
								</span>
							</div>
						</div>
						{!isOverlay && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="rounded-md">
										<MoreVertical className="w-4 h-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="rounded-lg">
									<DropdownMenuItem
										onClick={(e) => {
											e.preventDefault();
											handleDelete(presentation.id, presentation.title);
										}}
										className="text-destructive focus:text-destructive rounded-md"
									>
										<Trash2 className="w-4 h-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}

export default function Home() {
	const router = useRouter();
	const {
		presentations,
		loadPresentations,
		createPresentation,
		deletePresentation,
		restorePresentation,
		permanentlyDeletePresentation,
		reorderPresentationsByIds,
		presentationOrder,
	} = usePresentationStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [sortBy, setSortBy] = useState<SortOption>("recent");

	const [activeId, setActiveId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [localOrder, setLocalOrder] = useState<string[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Dialog state
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newDescription, setNewDescription] = useState("");

	const handleImportPPTX = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			toast.loading("Importing PowerPoint...", { id: "import-pptx" });
			const importedData = await importPPTX(file);

			const newPresentationId = createPresentation(
				importedData.title || "Imported Presentation",
				"Imported from PowerPoint",
			);

			// We need to update the newly created presentation with the imported slides
			const store = usePresentationStore.getState();
			store.updatePresentation(newPresentationId, {
				slides: (importedData.slides || []).map((slide: Slide) => ({
					...slide,
					id: uuidv4(),
				})),
			});

			toast.success("Presentation imported successfully!", {
				id: "import-pptx",
			});
			router.push(`/editor?id=${newPresentationId}`);
		} catch (error) {
			console.error("Failed to import PPTX:", error);
			toast.error("Failed to import PowerPoint file.", { id: "import-pptx" });
		}
	};

	// Load presentations
	useEffect(() => {
		setIsLoading(true);
		loadPresentations();
		const timer = setTimeout(() => setIsLoading(false), 100);
		return () => clearTimeout(timer);
	}, [loadPresentations]);

	// Sync local order with store
	useEffect(() => {
		if (presentationOrder.length > 0) {
			setLocalOrder(presentationOrder);
		} else if (presentations.length > 0) {
			setLocalOrder(presentations.map((p) => p.id));
		}
	}, [presentationOrder, presentations]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Presentations sorted by local order
	const orderedPresentations = useMemo(() => {
		if (localOrder.length === 0 || presentations.length === 0) {
			return presentations;
		}

		const presentationMap = new Map(presentations.map((p) => [p.id, p]));

		return localOrder
			.map((id) => presentationMap.get(id))
			.filter(Boolean) as typeof presentations;
	}, [presentations, localOrder]);

	const filteredAndSorted = useMemo(() => {
		let filtered = orderedPresentations.filter(
			(p) =>
				!p.deletedAt &&
				(p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					p.description?.toLowerCase().includes(searchQuery.toLowerCase())),
		);

		if (sortBy === "custom") {
			return filtered;
		}

		filtered.sort((a, b) => {
			switch (sortBy) {
				case "recent":
					return (
						new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					);
				case "oldest":
					return (
						new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
					);
				case "name":
					return a.title.localeCompare(b.title);
				case "slides":
					return b.slides.length - a.slides.length;
				default:
					return 0;
			}
		});

		return filtered;
	}, [orderedPresentations, searchQuery, sortBy]);

	const handleDragStart = useCallback((event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	}, []);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;

			if (over && active.id !== over.id) {
				const activeIndex = filteredAndSorted.findIndex(
					(item) => item.id === active.id,
				);
				const overIndex = filteredAndSorted.findIndex(
					(item) => item.id === over.id,
				);

				if (activeIndex !== -1 && overIndex !== -1) {
					const newLocalOrder = [...localOrder];

					const oldGlobalIndex = newLocalOrder.indexOf(active.id as string);
					const newGlobalIndex = newLocalOrder.indexOf(over.id as string);

					if (oldGlobalIndex !== -1 && newGlobalIndex !== -1) {
						const [movedItem] = newLocalOrder.splice(oldGlobalIndex, 1);
						newLocalOrder.splice(newGlobalIndex, 0, movedItem);

						setLocalOrder(newLocalOrder);
						reorderPresentationsByIds(newLocalOrder);
						setSortBy("custom");
					}
				}
			}

			setActiveId(null);
		},
		[filteredAndSorted, localOrder, reorderPresentationsByIds],
	);

	const stats = useMemo(() => {
		const totalSlides = presentations.reduce(
			(sum, p) => sum + p.slides.length,
			0,
		);
		const recentCount = presentations.filter((p) => {
			const daysSinceUpdate =
				(Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
			return daysSinceUpdate <= 7;
		}).length;
		return {
			total: presentations.length,
			totalSlides,
			recent: recentCount,
			avgSlides:
				presentations.length > 0
					? Math.round(totalSlides / presentations.length)
					: 0,
		};
	}, [presentations]);

	const handleCreateNew = useCallback(() => {
		setNewTitle("");
		setNewDescription("");
		setIsDialogOpen(true);
	}, []);

	const handleCreateSubmit = useCallback(() => {
		if (!newTitle.trim()) {
			toast.error("Please enter a title");
			return;
		}

		const newId = createPresentation(
			newTitle.trim(),
			newDescription.trim() || undefined,
		);
		setIsDialogOpen(false);
		router.push(`/editor?id=${newId}`);
	}, [newTitle, newDescription, createPresentation, router]);

	const handleDelete = useCallback(
		(id: string, title?: string) => {
			deletePresentation(id);
			setLocalOrder((prev) => prev.filter((itemId) => itemId !== id));

			toast.success("Presentation moved to trash", {
				description: title ? `"${title}" has been moved to trash` : undefined,
				action: {
					label: "Undo",
					onClick: () => {
						restorePresentation(id);
						toast.success("Presentation restored");
					},
				},
			});
		},
		[deletePresentation, restorePresentation],
	);

	const formatDate = useCallback((date: Date) => {
		const d = new Date(date);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - d.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		return d.toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	}, []);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(e.target.value);
			if (e.target.value.trim() !== "") {
				setIsSearching(true);
			} else {
				setIsSearching(false);
			}
		},
		[],
	);

	const handleClearSearch = useCallback(() => {
		setSearchQuery("");
		setIsSearching(false);
	}, []);

	const activePresentation = activeId
		? presentations.find((p) => p.id === activeId)
		: null;

	const sortableItems = useMemo(
		() => filteredAndSorted.map((p) => p.id),
		[filteredAndSorted],
	);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="flex">
					<DashboardSidebar />
					<div className="flex-1 lg:pl-64">
						<div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
							<div className="flex items-center justify-center h-64">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="flex">
				<DashboardSidebar />

				<div className="flex-1 lg:pl-64">
					<div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
						{/* Header */}
						<div className="mb-6 lg:mb-8">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
								<div>
									<h1 className="text-3xl lg:text-4xl font-bold mb-2">
										Presentations
									</h1>
									<p className="text-muted-foreground">
										Create and manage professional presentations
									</p>
								</div>
								<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
									<input
										type="file"
										accept=".pptx"
										className="hidden"
										ref={fileInputRef}
										onChange={handleImportPPTX}
									/>
									<Button
										onClick={() => fileInputRef.current?.click()}
										variant="outline"
										size="lg"
										className="rounded-lg shadow-sm hover:shadow-md transition-all border-primary/20 hover:border-primary/50 text-primary"
									>
										<FileUp className="w-4 h-4 mr-2" />
										Import PowerPoint
									</Button>
									<Button
										onClick={handleCreateNew}
										size="lg"
										className="rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-linear-to-r from-primary to-primary/90"
									>
										<Plus className="w-4 h-4 mr-2" />
										New Presentation
									</Button>
								</div>
							</div>

							{/* Statistics */}
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
								<Card className="rounded-lg">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Total Presentations
										</CardTitle>
										<FileText className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{stats.total}</div>
									</CardContent>
								</Card>
								<Card className="rounded-lg">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Total Slides
										</CardTitle>
										<Grid3x3 className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{stats.totalSlides}
										</div>
									</CardContent>
								</Card>
								<Card className="rounded-lg">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Recently Updated
										</CardTitle>
										<Clock className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{stats.recent}</div>
									</CardContent>
								</Card>
								<Card className="rounded-lg">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Average Slides
										</CardTitle>
										<TrendingUp className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{stats.avgSlides}</div>
									</CardContent>
								</Card>
							</div>

							{/* Search and Filters */}
							<Card className="rounded-lg">
								<CardContent className="pt-6">
									<div className="flex flex-col sm:flex-row gap-4">
										<div className="flex-1 relative">
											<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
											<Input
												type="text"
												placeholder="Search presentations..."
												value={searchQuery}
												onChange={handleSearchChange}
												className="pl-10 pr-10 rounded-lg transition-all duration-300"
											/>
											{searchQuery && (
												<Button
													variant="ghost"
													size="icon"
													onClick={handleClearSearch}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0 hover:bg-transparent"
												>
													<X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
												</Button>
											)}
										</div>
										<div className="flex items-center gap-2">
											<Filter className="w-4 h-4 text-muted-foreground" />
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="outline" className="rounded-lg">
														{sortBy === "recent" && "Most Recent"}
														{sortBy === "oldest" && "Oldest"}
														{sortBy === "name" && "By Name"}
														{sortBy === "slides" && "By Slides"}
														{sortBy === "custom" && "Custom Order"}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="rounded-lg">
													<DropdownMenuItem
														onClick={() => setSortBy("recent")}
														className="rounded-md"
													>
														Most Recent
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => setSortBy("oldest")}
														className="rounded-md"
													>
														Oldest
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => setSortBy("name")}
														className="rounded-md"
													>
														By Name
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => setSortBy("slides")}
														className="rounded-md"
													>
														By Slide Count
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => setSortBy("custom")}
														className="rounded-md"
													>
														Custom Order (drag & drop)
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
										<div className="flex items-center gap-2 bg-muted rounded-lg p-1">
											<Button
												variant={viewMode === "grid" ? "default" : "ghost"}
												size="icon"
												onClick={() => setViewMode("grid")}
												className="rounded-md"
											>
												<Grid3x3 className="w-4 h-4" />
											</Button>
											<Button
												variant={viewMode === "list" ? "default" : "ghost"}
												size="icon"
												onClick={() => setViewMode("list")}
												className="rounded-md"
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
							<Card className="rounded-lg">
								<CardContent className="pt-6">
									<div className="text-center py-12">
										<Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
										<p className="text-muted-foreground text-lg mb-2">
											No presentations found
										</p>
										<p className="text-sm text-muted-foreground">
											Try changing your search query
										</p>
									</div>
								</CardContent>
							</Card>
						) : filteredAndSorted.length === 0 ? (
							<Card className="rounded-lg">
								<CardContent className="pt-6">
									<div className="text-center py-16">
										<div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
											<FileText className="w-12 h-12 text-muted-foreground" />
										</div>
										<h3 className="text-2xl font-semibold mb-2">
											You don't have any presentations yet
										</h3>
										<p className="text-muted-foreground mb-6 max-w-md mx-auto">
											Start by creating your first presentation. It's simple and
											fast!
										</p>
										<Button
											onClick={handleCreateNew}
											size="lg"
											className="rounded-lg"
										>
											<Plus className="w-4 h-4 mr-2" />
											Create First Presentation
										</Button>
									</div>
								</CardContent>
							</Card>
						) : (
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={sortableItems}
									strategy={
										viewMode === "grid"
											? rectSortingStrategy
											: verticalListSortingStrategy
									}
								>
									{viewMode === "grid" ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
											{/* Create New Card */}
											<Card
												className="cursor-pointer hover:border-primary transition-colors border-dashed rounded-lg"
												onClick={handleCreateNew}
											>
												<CardContent className="flex flex-col items-center justify-center h-64 p-6">
													<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
														<Plus className="w-8 h-8 text-muted-foreground" />
													</div>
													<p className="font-semibold text-center">
														Create New Presentation
													</p>
												</CardContent>
											</Card>

											{/* Presentation Cards */}
											{filteredAndSorted.map((presentation) => (
												<SortableGridItem
													key={presentation.id}
													presentation={presentation}
													handleDelete={handleDelete}
													formatDate={formatDate}
												/>
											))}
										</div>
									) : (
										<div className="space-y-3">
											{filteredAndSorted.map((presentation) => (
												<SortableListItem
													key={presentation.id}
													presentation={presentation}
													handleDelete={handleDelete}
													formatDate={formatDate}
												/>
											))}
										</div>
									)}

									{/* Drag Overlay */}
									<DragOverlay>
										{activeId && activePresentation ? (
											viewMode === "grid" ? (
												<SortableGridItem
													presentation={activePresentation}
													handleDelete={handleDelete}
													formatDate={formatDate}
													isOverlay={true}
												/>
											) : (
												<SortableListItem
													presentation={activePresentation}
													handleDelete={handleDelete}
													formatDate={formatDate}
													isOverlay={true}
												/>
											)
										) : null}
									</DragOverlay>
								</SortableContext>
							</DndContext>
						)}
					</div>
				</div>
			</div>

			{/* Create Presentation Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md rounded-lg">
					<DialogHeader>
						<DialogTitle className="text-xl">
							Create New Presentation
						</DialogTitle>
						<DialogDescription>
							Enter the details for your new presentation. You can always change
							them later.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="title" className="text-sm font-medium">
								Title <span className="text-destructive">*</span>
							</Label>
							<Input
								id="title"
								placeholder="Enter presentation title"
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								autoFocus
								className="rounded-lg"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description" className="text-sm font-medium">
								Description (optional)
							</Label>
							<Textarea
								id="description"
								placeholder="Enter a brief description"
								value={newDescription}
								onChange={(e) => setNewDescription(e.target.value)}
								className="min-h-25 rounded-lg"
							/>
						</div>
					</div>
					<DialogFooter className="sm:justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
							className="rounded-lg"
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreateSubmit}
							disabled={!newTitle.trim()}
							className="rounded-lg"
						>
							Create Presentation
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
