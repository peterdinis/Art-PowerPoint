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
import { usePresentationStore } from "@/lib/store/presentationStore";
import { useEffect, useMemo } from "react";

export default function StatisticsPage() {
	const { presentations, loadPresentations } = usePresentationStore();

	useEffect(() => {
		loadPresentations();
	}, [loadPresentations]);

	const stats = useMemo(() => {
		const totalSlides = presentations.reduce(
			(sum, p) => sum + p.slides.length,
			0,
		);
		const totalElements = presentations.reduce(
			(sum, p) =>
				sum +
				p.slides.reduce(
					(slideSum, slide) => slideSum + slide.elements.length,
					0,
				),
			0,
		);
		const recentCount = presentations.filter((p) => {
			const daysSinceUpdate =
				(Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
			return daysSinceUpdate <= 7;
		}).length;

		const avgSlides =
			presentations.length > 0
				? Math.round(totalSlides / presentations.length)
				: 0;
		const avgElements =
			presentations.length > 0
				? Math.round(totalElements / presentations.length)
				: 0;

		const thisWeek = presentations.filter((p) => {
			const daysSinceUpdate =
				(Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
			return daysSinceUpdate <= 7;
		}).length;

		const thisMonth = presentations.filter((p) => {
			const daysSinceUpdate =
				(Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
			return daysSinceUpdate <= 30;
		}).length;

		return {
			total: presentations.length,
			totalSlides,
			totalElements,
			recent: recentCount,
			avgSlides,
			avgElements,
			thisWeek,
			thisMonth,
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
								Prehľad vašich prezentácií a aktivity
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Celkom prezentácií
									</CardTitle>
									<FileText className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.total}</div>
									<p className="text-xs text-muted-foreground mt-1">
										Všetky vaše prezentácie
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Celkom slajdov
									</CardTitle>
									<Grid3x3 className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.totalSlides}</div>
									<p className="text-xs text-muted-foreground mt-1">
										Priemer: {stats.avgSlides} na prezentáciu
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Celkom elementov
									</CardTitle>
									<BarChart3 className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats.totalElements}
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										Priemer: {stats.avgElements} na prezentáciu
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Nedávno upravené
									</CardTitle>
									<Clock className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stats.recent}</div>
									<p className="text-xs text-muted-foreground mt-1">
										Posledných 7 dní
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Calendar className="w-5 h-5" />
										Aktivita
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Tento týždeň
										</span>
										<span className="font-semibold">
											{stats.thisWeek} prezentácií
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Tento mesiac
										</span>
										<span className="font-semibold">
											{stats.thisMonth} prezentácií
										</span>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Prehľad</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Priemerný počet slajdov
										</span>
										<span className="font-semibold">{stats.avgSlides}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Priemerný počet elementov
										</span>
										<span className="font-semibold">{stats.avgElements}</span>
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
