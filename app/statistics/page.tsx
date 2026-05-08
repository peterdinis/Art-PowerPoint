"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ArrowLeft,
	TrendingUp,
	FileText,
	Grid3x3,
	Clock,
	BarChart3,
	Calendar,
} from "lucide-react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { usePresentationStore } from "@/store/presentationStore";
import { useEffect, useMemo } from "react";

export default function StatisticsPage() {
	const { presentations, loadPresentations } = usePresentationStore();

	useEffect(() => {
		loadPresentations();
	}, [loadPresentations]);

	const stats = useMemo(() => {
		const DAY_MS = 24 * 60 * 60 * 1000;
		const now = Date.now();
		const activePresentations = presentations.filter((p) => !p.deletedAt);

		const inLastNDays = (updatedAt: Date, days: number) =>
			now - new Date(updatedAt).getTime() <= days * DAY_MS;

		const inRangeDaysAgo = (updatedAt: Date, fromDays: number, toDays: number) => {
			const diffDays = (now - new Date(updatedAt).getTime()) / DAY_MS;
			return diffDays > fromDays && diffDays <= toDays;
		};

		const totalSlides = activePresentations.reduce(
			(sum, p) => sum + Math.max(0, p.slidesCount || 0),
			0,
		);
		const totalElements = activePresentations.reduce(
			(sum, p) => sum + Math.max(0, p.elementsCount || 0),
			0,
		);
		const recentCount = activePresentations.filter((p) =>
			inLastNDays(p.updatedAt, 7),
		).length;

		const avgSlides =
			activePresentations.length > 0
				? Math.round(totalSlides / activePresentations.length)
				: 0;
		const avgElements =
			activePresentations.length > 0
				? Math.round(totalElements / activePresentations.length)
				: 0;
		const avgElementsPerSlide =
			totalSlides > 0 ? Number((totalElements / totalSlides).toFixed(1)) : 0;

		const thisWeek = activePresentations.filter((p) =>
			inLastNDays(p.updatedAt, 7),
		).length;
		const previousWeek = activePresentations.filter((p) =>
			inRangeDaysAgo(p.updatedAt, 7, 14),
		).length;
		const weeklyTrend =
			previousWeek === 0
				? thisWeek > 0
					? 100
					: 0
				: Math.round(((thisWeek - previousWeek) / previousWeek) * 100);

		const thisMonth = activePresentations.filter((p) =>
			inLastNDays(p.updatedAt, 30),
		).length;
		const staleCount = activePresentations.filter(
			(p) => !inLastNDays(p.updatedAt, 30),
		).length;

		return {
			total: activePresentations.length,
			archived: presentations.length - activePresentations.length,
			totalSlides,
			totalElements,
			recent: recentCount,
			avgSlides,
			avgElements,
			avgElementsPerSlide,
			thisWeek,
			weeklyTrend,
			thisMonth,
			staleCount,
		};
	}, [presentations]);

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
								<TrendingUp className="w-8 h-8 text-primary" />
								<h1 className="text-3xl font-bold">Statistics</h1>
							</div>
							<p className="text-muted-foreground">
								Overview of your presentations and activity
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Presentations
									</CardTitle>
									<FileText className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.total}</div>
									<p className="text-xs text-muted-foreground mt-1">
										{stats.archived > 0
											? `${stats.archived} archived`
											: "All active presentations"}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Slides
									</CardTitle>
									<Grid3x3 className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.totalSlides}</div>
									<p className="text-xs text-muted-foreground mt-1">
										Average: {stats.avgSlides} per presentation
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Elements
									</CardTitle>
									<BarChart3 className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats.totalElements}
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										Average: {stats.avgElements} per presentation
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Recently Modified
									</CardTitle>
									<Clock className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.recent}</div>
									<p className="text-xs text-muted-foreground mt-1">
										{stats.weeklyTrend >= 0 ? "+" : ""}
										{stats.weeklyTrend}% vs previous week
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Calendar className="w-5 h-5" />
										Activity
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											This Week
										</span>
										<span className="font-semibold">
											{stats.thisWeek} presentations
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											This Month
										</span>
										<span className="font-semibold">
											{stats.thisMonth} presentations
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Inactive 30+ days
										</span>
										<span className="font-semibold">
											{stats.staleCount} presentations
										</span>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Overview</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Average Slides
										</span>
										<span className="font-semibold">{stats.avgSlides}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Average Elements
										</span>
										<span className="font-semibold">{stats.avgElements}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Elements per Slide
										</span>
										<span className="font-semibold">
											{stats.avgElementsPerSlide}
										</span>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
