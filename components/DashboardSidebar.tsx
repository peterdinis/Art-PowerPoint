"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
	FileText,
	Plus,
	Settings,
	LayoutDashboard,
	Menu,
	TrendingUp,
	Clock,
	Star,
} from "lucide-react";
import { usePresentationStore } from "@/lib/store/presentationStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import TemplateSelector from "@/components/TemplateSelector";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardSidebar() {
	const router = useRouter();
	const pathname = usePathname();
	const { createPresentation } = usePresentationStore();
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [showTemplateSelector, setShowTemplateSelector] = useState(false);
	const [showNameDialog, setShowNameDialog] = useState(false);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
		null,
	);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const handleCreateNew = () => {
		setShowTemplateSelector(true);
		setTitle("");
		setDescription("");
		setSelectedTemplateId(null);
	};

	const handleTemplateSelected = (templateId: string | null) => {
		setSelectedTemplateId(templateId);
		setShowTemplateSelector(false);
		setShowNameDialog(true);
	};

	const handleCreateFromTemplate = () => {
		if (title.trim()) {
			const newId = createPresentation(
				title.trim(),
				description.trim() || undefined,
				selectedTemplateId || undefined,
			);
			router.push(`/editor?id=${newId}`);
			setIsMobileOpen(false);
			setShowNameDialog(false);
			setTitle("");
			setDescription("");
			setSelectedTemplateId(null);
		}
	};

	const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => {
		const isActive = (path: string) => pathname === path;

		return (
			<div className="flex flex-col h-full">
				<div className="p-6 border-b">
					<div className="flex items-center gap-2 mb-6">
						<div className="p-2 bg-primary rounded-lg">
							<FileText className="w-5 h-5 text-primary-foreground" />
						</div>
						<h2 className="text-xl dark:text-white font-bold">Slide Master</h2>
					</div>
					<Button
						onClick={() => {
							handleCreateNew();
							onItemClick?.();
						}}
						className="w-full"
						size="lg"
					>
						<Plus className="w-4 h-4 mr-2" />
						Nová prezentácia
					</Button>
				</div>

				<nav className="flex-1 p-4 space-y-1">
					<Link
						href="/dashboard"
						onClick={onItemClick}
						className={cn(
							"flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
							"hover:bg-accent hover:text-accent-foreground",
							isActive("/dashboard")
								? "bg-accent text-accent-foreground"
								: "text-foreground",
						)}
					>
						<LayoutDashboard className="w-5 h-5" />
						<span>Dashboard</span>
					</Link>
					<Button
						variant="ghost"
						onClick={() => {
							handleCreateNew();
							onItemClick?.();
						}}
						className="w-full justify-start gap-3 px-4 py-6 text-foreground hover:text-accent-foreground"
					>
						<Plus className="w-5 h-5" />
						<span className="text-base font-normal">Create New</span>
					</Button>
					<Link
						href="/favorites"
						onClick={onItemClick}
						className={cn(
							"flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
							"hover:bg-accent hover:text-accent-foreground",
							isActive("/favorites")
								? "bg-accent text-accent-foreground"
								: "text-foreground",
						)}
					>
						<Star className="w-5 h-5" />
						<span>Favorites</span>
					</Link>
					<Link
						href="/recent"
						onClick={onItemClick}
						className={cn(
							"flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
							"hover:bg-accent hover:text-accent-foreground",
							isActive("/recent")
								? "bg-accent text-accent-foreground"
								: "text-foreground",
						)}
					>
						<Clock className="w-5 h-5" />
						<span>Recent</span>
					</Link>
					<Link
						href="/statistics"
						onClick={onItemClick}
						className={cn(
							"flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
							"hover:bg-accent hover:text-accent-foreground",
							isActive("/statistics")
								? "bg-accent text-accent-foreground"
								: "text-foreground",
						)}
					>
						<TrendingUp className="w-5 h-5" />
						<span>Statistics</span>
					</Link>
				</nav>

				<div className="p-4 border-t space-y-2">
					<Link
						href="/settings"
						onClick={onItemClick}
						className={cn(
							"flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
							"hover:bg-accent hover:text-accent-foreground",
							isActive("/settings")
								? "bg-accent text-accent-foreground"
								: "text-foreground",
						)}
					>
						<Settings className="w-5 h-5" />
						<span>Settings</span>
					</Link>
					<div className="flex items-center justify-center px-4">
						<ThemeToggle />
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<TemplateSelector
				open={showTemplateSelector}
				onOpenChange={setShowTemplateSelector}
				onSelectTemplate={handleTemplateSelected}
			/>

			<Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create new presentation</DialogTitle>
						<DialogDescription>
							Enter the name and description for your presentation
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="title">Presentation name *</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="My presentation"
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter" && title.trim()) {
										handleCreateFromTemplate();
									}
								}}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description (optional)</Label>
							<Input
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Short presentation description"
							/>
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setShowNameDialog(false)}>
							Cancel
						</Button>
						<Button onClick={handleCreateFromTemplate} disabled={!title.trim()}>
							Create
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Mobile Sidebar */}
			<Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="lg:hidden">
						<Menu className="w-5 h-5" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-80 p-0">
					<SidebarContent onItemClick={() => setIsMobileOpen(false)} />
				</SheetContent>
			</Sheet>

			{/* Desktop Sidebar */}
			<aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r bg-background z-40">
				<SidebarContent />
			</aside>
		</>
	);
}
