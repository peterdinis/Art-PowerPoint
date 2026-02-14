"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ArrowLeft,
	Trash2,
	RefreshCcw,
	XCircle,
	Calendar,
	FileText,
} from "lucide-react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { usePresentationStore } from "@/lib/store/presentationStore";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TrashPage() {
	const router = useRouter();
	const {
		presentations,
		loadPresentations,
		restorePresentation,
		permanentlyDeletePresentation,
	} = usePresentationStore();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		loadPresentations();
		const timer = setTimeout(() => setIsLoading(false), 100);
		return () => clearTimeout(timer);
	}, [loadPresentations]);

	const trashedPresentations = useMemo(() => {
		return presentations.filter((p) => !!p.deletedAt);
	}, [presentations]);

	const formatDate = (date: Date) => {
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
	};

	const handleRestore = (id: string, title: string) => {
		restorePresentation(id);
		toast.success(`'${title}' was restored successfully.`);
	};

	const handlePermanentDelete = (id: string, title: string) => {
		if (
			confirm(
				`Are you sure you want to permanently delete '${title}'? This action cannot be undone.`,
			)
		) {
			permanentlyDeletePresentation(id);
			toast.info(`'${title}' was permanently deleted.`);
		}
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
									Back to Dashboard
								</Link>
							</Button>
							<div className="flex items-center gap-3 mb-2">
								<div className="p-2 bg-destructive/10 rounded-lg">
									<Trash2 className="w-8 h-8 text-destructive" />
								</div>
								<h1 className="text-3xl font-bold">Trash</h1>
							</div>
							<p className="text-muted-foreground">
								Deleted presentations are kept here. You can restore them or
								delete them permanently.
							</p>
						</div>

						{isLoading ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
								{[1, 2, 3, 4].map((i) => (
									<Card key={i} className="animate-pulse h-64 bg-accent/50" />
								))}
							</div>
						) : trashedPresentations.length === 0 ? (
							<Card className="border-dashed">
								<CardContent className="pt-6">
									<div className="text-center py-24">
										<div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
											<Trash2 className="w-10 h-10 text-muted-foreground/50" />
										</div>
										<h3 className="text-xl font-semibold mb-2">
											Trash is empty
										</h3>
										<p className="text-muted-foreground mb-8 max-w-xs mx-auto">
											No presentations in the trash. Deleted ones will appear
											here.
										</p>
										<Button asChild variant="outline">
											<Link href="/dashboard">Go back to Dashboard</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
								{trashedPresentations.map((presentation) => (
									<Card
										key={presentation.id}
										className="group overflow-hidden border-destructive/20 hover:border-destructive/40 transition-all flex flex-col"
									>
										<div className="h-40 bg-muted/30 flex items-center justify-center relative bg-gradient-to-br from-destructive/5 to-destructive/10">
											<FileText className="w-12 h-12 text-destructive/20" />
											<div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm text-[10px] uppercase font-bold text-muted-foreground rounded tracking-wider">
												Deleted {formatDate(presentation.deletedAt!)}
											</div>
										</div>
										<CardHeader className="flex-1 pb-3">
											<CardTitle className="line-clamp-1 text-base">
												{presentation.title}
											</CardTitle>
											{presentation.description && (
												<CardDescription className="line-clamp-2 text-sm">
													{presentation.description}
												</CardDescription>
											)}
										</CardHeader>
										<CardContent className="pt-0 space-y-4">
											<div className="flex flex-col gap-2">
												<Button
													variant="outline"
													size="sm"
													className="w-full justify-start gap-2 hover:bg-primary/10 border-primary/20 hover:border-primary/50 text-primary"
													onClick={() =>
														handleRestore(presentation.id, presentation.title)
													}
												>
													<RefreshCcw className="w-3.5 h-3.5" />
													Restore
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
													onClick={() =>
														handlePermanentDelete(
															presentation.id,
															presentation.title,
														)
													}
												>
													<XCircle className="w-3.5 h-3.5" />
													Delete Permanently
												</Button>
											</div>
										</CardContent>
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
