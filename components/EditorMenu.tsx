"use client";

import { useState } from "react";
import Link from "next/link";
import {
	ArrowLeft,
	Save,
	Download,
	Menu,
	Settings,
	ZoomIn,
	ZoomOut,
	Grid,
	Layers,
	FileText,
	Play,
	BarChart3,
	Share2,
	History,
} from "lucide-react";
import ShareDialog from "@/components/ShareDialog";
import HistoryDialog from "@/components/HistoryDialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePresentationStore } from "@/store/presentationStore";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface EditorMenuProps {
	onSave: () => void;
	onExport: () => void;
	onUploadChart: () => void; // Pridaná prop pre upload chartu
}

export default function EditorMenu({
	onSave,
	onExport,
	onUploadChart,
}: EditorMenuProps) {
	const { currentPresentation } = usePresentationStore();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);
	const [historyOpen, setHistoryOpen] = useState(false);

	return (
		<>
			<header className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border sticky top-0 z-50 shadow-sm">
				<div className="px-4 py-3">
					<div className="flex items-center justify-between">
						{/* Left Side */}
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								size="icon"
								asChild
								className="hover:bg-accent"
							>
								<Link href="/">
									<ArrowLeft className="w-5 h-5" />
								</Link>
							</Button>

							<Separator
								orientation="vertical"
								className="h-6 hidden md:block"
							/>

							<div className="hidden md:flex items-center gap-3">
								<div className="flex items-center gap-2">
									<div className="p-1.5 bg-primary/10 rounded-md">
										<FileText className="w-4 h-4 text-primary" />
									</div>
									<div>
										<h1 className="font-semibold text-foreground text-base leading-tight">
											{currentPresentation?.title || "Presentation"}
										</h1>
										<p className="text-xs text-muted-foreground">
											{currentPresentation?.slides.length || 0} slide
											{currentPresentation?.slides.length !== 1 ? "s" : ""}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Right Side - Desktop */}
						<div className="hidden md:flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								className="gap-2"
								onClick={() => setShareOpen(true)}
							>
								<Share2 className="w-4 h-4" />
								<span className="hidden lg:inline">Share</span>
							</Button>

							<Button
								variant="ghost"
								size="sm"
								className="gap-2"
								onClick={() => setHistoryOpen(true)}
							>
								<History className="w-4 h-4" />
								<span className="hidden lg:inline">History</span>
							</Button>

							<Separator orientation="vertical" className="h-6" />

							{/* Pridané tlačidlo pre upload chartu */}
							<Button
								onClick={onUploadChart}
								variant="ghost"
								size="sm"
								className="gap-2"
							>
								<BarChart3 className="w-4 h-4" />
								<span className="hidden lg:inline">Upload Chart</span>
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="hover:bg-accent"
									>
										<Grid className="w-4 h-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuItem>
										<ZoomIn className="w-4 h-4 mr-2" />
										Zoom In
									</DropdownMenuItem>
									<DropdownMenuItem>
										<ZoomOut className="w-4 h-4 mr-2" />
										Zoom Out
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Layers className="w-4 h-4 mr-2" />
										Show Grid
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<Separator orientation="vertical" className="h-6" />

							<Button
								variant="ghost"
								size="icon"
								asChild
								className="hover:bg-accent"
							>
								<Link href="/settings">
									<Settings className="w-4 h-4" />
								</Link>
							</Button>

							<ThemeToggle />

							<Separator orientation="vertical" className="h-6" />

							<Button
								onClick={() => {
									if (currentPresentation) {
										window.open(
											`/presentation/${currentPresentation.id}`,
											"_blank",
										);
									}
								}}
								variant="default"
								size="sm"
								className="gap-2"
								disabled={!currentPresentation}
							>
								<Play className="w-4 h-4" />
								<span className="hidden lg:inline">Play</span>
							</Button>

							<Button
								onClick={onSave}
								variant="outline"
								size="sm"
								className="gap-2"
							>
								<Save className="w-4 h-4" />
								<span className="hidden lg:inline">Save</span>
							</Button>

							<Button
								onClick={onExport}
								variant="outline"
								size="sm"
								className="gap-2"
							>
								<Download className="w-4 h-4" />
								<span className="hidden lg:inline">Export</span>
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
													{currentPresentation?.title || "Presentation"}
												</h2>
												<p className="text-sm text-muted-foreground">
													{currentPresentation?.slides.length || 0} slide
													{currentPresentation?.slides.length !== 1 ? "s" : ""}
												</p>
											</div>
										</div>
									</div>

									<Separator />

									<Separator />

									<div className="space-y-2">
										<Button
											onClick={() => {
												setShareOpen(true);
												setMobileMenuOpen(false);
											}}
											className="w-full justify-start gap-2"
											variant="outline"
										>
											<Share2 className="w-4 h-4" />
											Share
										</Button>
										<Button
											onClick={() => {
												setHistoryOpen(true);
												setMobileMenuOpen(false);
											}}
											className="w-full justify-start gap-2"
											variant="outline"
										>
											<History className="w-4 h-4" />
											History
										</Button>

										{/* Pridaný button pre upload chartu v mobile menu */}
										<Button
											onClick={() => {
												onUploadChart();
												setMobileMenuOpen(false);
											}}
											className="w-full justify-start gap-2"
											variant="outline"
										>
											<BarChart3 className="w-4 h-4" />
											Upload Chart
										</Button>

										<Button
											onClick={() => {
												if (currentPresentation) {
													window.open(
														`/presentation/${currentPresentation.id}`,
														"_blank",
													);
													setMobileMenuOpen(false);
												}
											}}
											className="w-full justify-start gap-2"
											variant="default"
										>
											<Play className="w-4 h-4" />
											Play Presentation
										</Button>
										<Button
											onClick={() => {
												onSave();
												setMobileMenuOpen(false);
											}}
											className="w-full justify-start gap-2"
											variant="outline"
										>
											<Save className="w-4 h-4" />
											Save
										</Button>
										<Button
											onClick={() => {
												onExport();
												setMobileMenuOpen(false);
											}}
											className="w-full justify-start gap-2"
											variant="outline"
										>
											<Download className="w-4 h-4" />
											Export
										</Button>
									</div>

									<Separator />

									<div className="space-y-2">
										<Button
											variant="ghost"
											className="w-full justify-start gap-2"
											asChild
										>
											<Link
												href="/settings"
												onClick={() => setMobileMenuOpen(false)}
											>
												<Settings className="w-4 h-4" />
												Settings
											</Link>
										</Button>
										<div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50">
											<span className="text-sm font-medium">Theme</span>
											<ThemeToggle />
										</div>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>
			<ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
			<HistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} />
		</>
	);
}
