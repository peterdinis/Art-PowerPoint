"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { usePresentationStore } from "@/lib/store/presentationStore";
import EditorCanvas from "@/components/EditorCanvas";
import SlidePanel from "@/components/SlidePanel";
import Toolbar from "@/components/Toolbar";
import PropertiesPanel from "@/components/PropertiesPanel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditorMenu from "@/components/EditorMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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

	useEffect(() => {
		loadPresentations();
	}, [loadPresentations]);

	useEffect(() => {
		const id = searchParams.get("id");
		if (id) {
			const presentation = presentations.find((p) => p.id === id);
			if (presentation) {
				selectPresentation(id);
				setIsLoading(false);
			} else if (presentations.length > 0) {
				router.replace(`/editor?id=${presentations[0].id}`);
			} else {
				setIsLoading(false);
			}
		} else if (presentations.length > 0) {
			router.replace(`/editor?id=${presentations[0].id}`);
		} else {
			setIsLoading(false);
		}
	}, [searchParams, presentations, selectPresentation, router]);

	const handleSave = () => {
		if (currentPresentation) {
			updatePresentation(currentPresentation.id, currentPresentation);
			alert("Presentation saved!");
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
		}
	};

	if (isLoading || !currentPresentation) {
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

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="h-screen flex flex-col bg-background">
				{/* Header */}
				<EditorMenu onSave={handleSave} onExport={handleExport} />

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
					<div className="hidden lg:block">
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
