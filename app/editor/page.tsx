"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { usePresentationStore } from "@/store/presentationStore";
import EditorCanvas from "@/components/EditorCanvas";
import SlidePanel from "@/components/SlidePanel";
import Toolbar from "@/components/Toolbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditorMenu from "@/components/EditorMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { toast } from "sonner";
import PropertiesPanel from "@/components/PropertiesPanel";
import AdvancedChartDialog from "@/components/editor/AdvancedChartDialog";

function EditorContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const {
		currentPresentation,
		presentations,
		loadPresentations,
		selectPresentation,
		updatePresentation,
	} = usePresentationStore();
	const [isLoading, setIsLoading] = useState(true);
	const [showSlidePanel, setShowSlidePanel] = useState(false);
	const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
	const [showChartDialog, setShowChartDialog] = useState(false);
	const hasSelected = useRef(false);

	useEffect(() => {
		loadPresentations();
	}, [loadPresentations]);

	useEffect(() => {
		if (presentations.length === 0 && !isLoading) {
			return;
		}

		// Initial load: don't redirect until we have presentations
		if (presentations.length === 0) return;

		const id = searchParams.get("id");
		if (id) {
			const presentation = presentations.find((p) => p.id === id);
			if (presentation) {
				if (!hasSelected.current) {
					selectPresentation(id);
					hasSelected.current = true;
				}
				setIsLoading(false);
			} else {
				// ID not found, redirect to first
				router.replace(`/editor?id=${presentations[0].id}`);
			}
		} else {
			// No ID in URL, redirect to first
			router.replace(`/editor?id=${presentations[0].id}`);
		}
	}, [searchParams, presentations, selectPresentation, router, isLoading]);

	const handleSave = () => {
		if (currentPresentation) {
			updatePresentation(currentPresentation.id, currentPresentation);
			toast.success("Presentation saved successfully!");
		}
	};

	const handleExport = () => {
		if (currentPresentation) {
			const data = JSON.stringify(currentPresentation, null, 2);
			const blob = new Blob([data], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${currentPresentation.title}.json`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success("Presentation exported successfully!");
		}
	};

	const handleUploadChart = () => {
		setShowChartDialog(true);
	};

	if (isLoading || (!currentPresentation && presentations.length > 0)) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground mb-4">Loading presentation...</p>
					<Button variant="link" asChild>
						<Link href="/">Back to dashboard</Link>
					</Button>
				</div>
			</div>
		);
	}

	if (!currentPresentation && !isLoading && presentations.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<p className="text-muted-foreground mb-4">No presentations found. Please create one from the dashboard.</p>
					<Button asChild>
						<Link href="/">Go to Dashboard</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<DndProvider backend={HTML5Backend} context={window}>
			<div className="h-screen flex flex-col bg-background">
				{/* Header */}
				<EditorMenu
					onSave={handleSave}
					onExport={handleExport}
					onUploadChart={handleUploadChart}
				/>

				{/* Dialog pre upload chartu */}
				<AdvancedChartDialog
					open={showChartDialog}
					onOpenChange={setShowChartDialog}
				/>

				{/* Main Content */}
				<div className="flex-1 flex overflow-hidden relative">
					{/* Slide Panel - Desktop */}
					<div className="hidden lg:block">
						<SlidePanel />
					</div>

					{/* Slide Panel - Mobile */}
					<Sheet open={showSlidePanel} onOpenChange={setShowSlidePanel}>
						<SheetContent side="left" className="w-80 p-0">
							<SlidePanel />
						</SheetContent>
					</Sheet>

					{/* Editor Canvas */}
					<div className="flex-1 flex flex-col min-w-0">
						{/* Mobile Toolbar Toggle */}
						<div className="lg:hidden flex items-center gap-2 p-2 border-b bg-background">
							<Sheet open={showSlidePanel} onOpenChange={setShowSlidePanel}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="sm">
										<Menu className="w-4 h-4 mr-2" />
										Slides
									</Button>
								</SheetTrigger>
							</Sheet>
							<Sheet
								open={showPropertiesPanel}
								onOpenChange={setShowPropertiesPanel}
							>
								<SheetTrigger asChild>
									<Button variant="ghost" size="sm">
										<Menu className="w-4 h-4 mr-2" />
										Properties
									</Button>
								</SheetTrigger>
							</Sheet>
						</div>

						<Toolbar />
						<div className="flex-1 overflow-auto bg-muted/30 p-4 lg:p-8">
							<EditorCanvas />
						</div>
					</div>

					{/* Properties Panel - Desktop */}
					<div className="hidden lg:flex lg:flex-col lg:h-full lg:min-h-0 lg:shrink-0">
						<PropertiesPanel />
					</div>

					{/* Properties Panel - Mobile */}
					<Sheet
						open={showPropertiesPanel}
						onOpenChange={setShowPropertiesPanel}
					>
						<SheetContent side="right" className="w-80 p-0">
							<PropertiesPanel />
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</DndProvider>
	);
}

export default function EditorPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-background">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-muted-foreground">Loading...</p>
					</div>
				</div>
			}
		>
			<EditorContent />
		</Suspense>
	);
}
