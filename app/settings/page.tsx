"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Monitor, ArrowLeft, Globe, HardDrive, Zap, Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useSettingsStore, type Language } from "@/store/settingsStore";
import { usePresentationStore } from "@/store/presentationStore";
import { toast } from "sonner";

export default function SettingsPage() {
	const [isMounted, setIsMounted] = useState(false);
	const { theme, setTheme } = useTheme();
	const {
		language,
		performance,
		notifications,
		setLanguage,
		updatePerformance,
		updateNotifications,
		resetSettings,
	} = useSettingsStore();

	const { presentations, permanentlyDeletePresentation } = usePresentationStore();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleClearAllData = () => {
		if (
			confirm(
				"Are you sure you want to clear all data? This will delete all presentations and reset all settings. This cannot be undone.",
			)
		) {
			// Clear presentations
			presentations.forEach((p) => permanentlyDeletePresentation(p.id));
			// Reset settings
			resetSettings();
			// Clear localStorage just in case
			localStorage.clear();
			toast.success("All data has been cleared.");
			setTimeout(() => window.location.reload(), 1000);
		}
	};

	if (!isMounted) {
		return (
			<div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
				<p className="text-muted-foreground animate-pulse">Loading settings...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="flex">
				<DashboardSidebar />
				<div className="flex-1 lg:pl-64">
					<div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
						<div className="mb-6">
							<Button variant="ghost" asChild className="mb-4">
								<Link href="/dashboard">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Back
								</Link>
							</Button>
							<h1 className="text-3xl font-bold mb-2">Settings</h1>
							<p className="text-muted-foreground">
								Manage application settings and preferences
							</p>
						</div>

						<div className="space-y-6 pb-12">
							{/* Theme Settings */}
							<Card>
								<CardHeader>
									<div className="flex items-center gap-2">
										<Sun className="w-5 h-5 text-primary" />
										<CardTitle>Appearance</CardTitle>
									</div>
									<CardDescription>
										Customize the look of the application to your preference
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label>Theme</Label>
										<RadioGroup
											value={theme}
											onValueChange={(value) =>
												setTheme(value as "light" | "dark" | "system")
											}
											className="grid grid-cols-1 md:grid-cols-3 gap-4"
										>
											<Label
												htmlFor="light"
												className="flex items-center space-x-2 p-4 border rounded-xl hover:bg-accent cursor-pointer transition-all has-[:checked]:bg-primary/5 has-[:checked]:border-primary"
											>
												<RadioGroupItem value="light" id="light" className="sr-only" />
												<Sun className="w-4 h-4" />
												<span>Light Mode</span>
											</Label>
											<Label
												htmlFor="dark"
												className="flex items-center space-x-2 p-4 border rounded-xl hover:bg-accent cursor-pointer transition-all has-[:checked]:bg-primary/5 has-[:checked]:border-primary"
											>
												<RadioGroupItem value="dark" id="dark" className="sr-only" />
												<Moon className="w-4 h-4" />
												<span>Dark Mode</span>
											</Label>
											<Label
												htmlFor="system"
												className="flex items-center space-x-2 p-4 border rounded-xl hover:bg-accent cursor-pointer transition-all has-[:checked]:bg-primary/5 has-[:checked]:border-primary"
											>
												<RadioGroupItem value="system" id="system" className="sr-only" />
												<Monitor className="w-4 h-4" />
												<span>System</span>
											</Label>
										</RadioGroup>
									</div>
								</CardContent>
							</Card>

							{/* Language Settings */}
							<Card>
								<CardHeader>
									<div className="flex items-center gap-2">
										<Globe className="w-5 h-5 text-primary" />
										<CardTitle>Language</CardTitle>
									</div>
									<CardDescription>
										Select your preferred language for the interface
									</CardDescription>
								</CardHeader>
								<CardContent>
									<RadioGroup
										value={language}
										onValueChange={(val) => setLanguage(val as Language)}
										className="grid grid-cols-1 md:grid-cols-2 gap-4"
									>
										<Label
											htmlFor="en"
											className="flex items-center space-x-2 p-4 border rounded-xl hover:bg-accent cursor-pointer transition-all has-[:checked]:bg-primary/5 has-[:checked]:border-primary"
										>
											<RadioGroupItem value="en" id="en" className="sr-only" />
											<span className="text-xl">🇺🇸</span>
											<span className="font-medium">English (US)</span>
										</Label>
										<Label
											htmlFor="sk"
											className="flex items-center space-x-2 p-4 border rounded-xl hover:bg-accent cursor-pointer transition-all has-[:checked]:bg-primary/5 has-[:checked]:border-primary opacity-60"
										>
											<RadioGroupItem value="sk" id="sk" className="sr-only" disabled />
											<span className="text-xl">🇸🇰</span>
											<span className="font-medium text-muted-foreground">
												Slovenčina (Coming Soon)
											</span>
										</Label>
									</RadioGroup>
								</CardContent>
							</Card>

							{/* Performance Settings */}
							<Card>
								<CardHeader>
									<div className="flex items-center gap-2">
										<Zap className="w-5 h-5 text-primary" />
										<CardTitle>Performance</CardTitle>
									</div>
									<CardDescription>
										Optimize the application performance for your device
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between p-2">
										<div className="space-y-0.5">
											<Label className="text-base">Complex Animations</Label>
											<p className="text-sm text-muted-foreground">
												Enable advanced Framer Motion effects and transitions
											</p>
										</div>
										<Switch
											checked={performance.complexAnimations}
											onCheckedChange={(checked) =>
												updatePerformance({ complexAnimations: checked })
											}
										/>
									</div>
									<Separator />
									<div className="flex items-center justify-between p-2">
										<div className="space-y-0.5">
											<Label className="text-base">Hardware Acceleration</Label>
											<p className="text-sm text-muted-foreground">
												Use GPU for smoother rendering of slide elements
											</p>
										</div>
										<Switch
											checked={performance.hardwareAcceleration}
											onCheckedChange={(checked) =>
												updatePerformance({ hardwareAcceleration: checked })
											}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Notifications Settings */}
							<Card>
								<CardHeader>
									<div className="flex items-center gap-2">
										<Bell className="w-5 h-5 text-primary" />
										<CardTitle>Notifications</CardTitle>
									</div>
									<CardDescription>
										Control which notifications you receive
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between p-2">
										<div className="space-y-0.5">
											<Label className="text-base">Collaboration Updates</Label>
											<p className="text-sm text-muted-foreground">
												Notify when someone edits a shared presentation
											</p>
										</div>
										<Switch
											checked={notifications.collaborationUpdates}
											onCheckedChange={(checked) =>
												updateNotifications({ collaborationUpdates: checked })
											}
										/>
									</div>
									<Separator />
									<div className="flex items-center justify-between p-2">
										<div className="space-y-0.5">
											<Label className="text-base">System Announcements</Label>
											<p className="text-sm text-muted-foreground">
												Stay updated with new features and stability fixes
											</p>
										</div>
										<Switch
											checked={notifications.systemAnnouncements}
											onCheckedChange={(checked) =>
												updateNotifications({ systemAnnouncements: checked })
											}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Storage Settings */}
							<Card className="border-destructive/20 bg-destructive/5">
								<CardHeader>
									<div className="flex items-center gap-2">
										<HardDrive className="w-5 h-5 text-destructive" />
										<CardTitle>Storage & Data</CardTitle>
									</div>
									<CardDescription>
										Manage local storage and data persistence
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-xl bg-background/50">
										<div className="space-y-1">
											<p className="font-semibold text-destructive">Danger Zone</p>
											<p className="text-sm text-muted-foreground max-w-md">
												Clearing data will permanently delete all your local presentations and reset all application settings.
											</p>
										</div>
										<Button
											variant="destructive"
											size="lg"
											className="shadow-lg shadow-destructive/20"
											onClick={handleClearAllData}
										>
											Clear All Data
										</Button>
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
