"use client";

import { usePresentationStore } from "@/store/presentationStore";
import {
	FileText,
	Plus,
	FileDown,
	ChevronDown,
	Archive,
	FileUp
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToPPTX } from "@/lib/utils/pptxExport";
import { toast } from "sonner";
import { ToolbarSections } from "./toolbar/ToolbarSections";
import { ToolbarDialogs } from "./toolbar/ToolbarDialogs";

export default function Toolbar() {
	const {
		currentPresentation,
		addSlide,
		updatePresentation,
		savePresentations,
		compressPresentation,
	} = usePresentationStore();

	const [activeDialog, setActiveDialog] = useState<string | null>(null);

	// Get default text color based on theme
	const getDefaultTextColor = () => {
		if (typeof window === "undefined") return "#212121";
		const isDark = document.documentElement.classList.contains("dark");
		return isDark ? "#e5e5e5" : "#212121";
	};

	if (!currentPresentation) return null;

	const handleExport = async () => {
		try {
			await exportToPPTX(currentPresentation);
			toast.success("Presentation exported successfully!");
		} catch (error) {
			console.error("Export error:", error);
			toast.error("Failed to export presentation.");
		}
	};

	return (
		<div className="flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 mr-4">
					<div className="p-1.5 bg-primary rounded-lg">
						<FileText className="w-5 h-5 text-primary-foreground" />
					</div>
					<Input
						value={currentPresentation.title}
						onChange={(e) => updatePresentation(currentPresentation.id, { title: e.target.value })}
						className="h-8 w-48 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary font-semibold"
					/>
				</div>

				<ToolbarSections
					onOpenDialog={(name) => setActiveDialog(name)}
					getDefaultTextColor={getDefaultTextColor}
				/>
			</div>

			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={addSlide} className="gap-1">
					<Plus className="h-4 w-4" />
					<span className="hidden sm:inline">Add Slide</span>
				</Button>

				<Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
					<FileDown className="h-4 w-4" />
					<span className="hidden sm:inline">Export</span>
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-9 w-9">
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={compressPresentation}>
							<Archive className="h-4 w-4 mr-2" /> Compress
						</DropdownMenuItem>
						<DropdownMenuItem onClick={savePresentations}>
							<FileUp className="h-4 w-4 mr-2" /> Save to Cloud
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<ToolbarDialogs
				activeDialog={activeDialog}
				onClose={() => setActiveDialog(null)}
			/>
		</div>
	);
}
