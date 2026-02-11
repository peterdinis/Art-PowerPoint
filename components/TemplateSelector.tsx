"use client";

import { useState } from "react";
import {
	X,
	Sparkles,
	Briefcase,
	GraduationCap,
	Palette,
	Minus,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	templates,
	type PresentationTemplate,
} from "@/lib/templates/presentationTemplates";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

interface TemplateSelectorProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelectTemplate: (templateId: string | null) => void;
}

const categoryIcons = {
	business: Briefcase,
	education: GraduationCap,
	creative: Palette,
	minimal: Minus,
};

const categoryLabels = {
	business: "Business",
	education: "Vzdelávanie",
	creative: "Kreatívne",
	minimal: "Minimálne",
};

export default function TemplateSelector({
	open,
	onOpenChange,
	onSelectTemplate,
}: TemplateSelectorProps) {
	const { theme } = useTheme();
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	// Get default text color based on theme
	const getDefaultTextColor = () => {
		if (typeof window === "undefined") return "#212121";
		const isDark = document.documentElement.classList.contains("dark");
		return isDark ? "#e5e5e5" : "#212121";
	};

	const filteredTemplates =
		selectedCategory === "all"
			? templates
			: templates.filter((t) => t.category === selectedCategory);

	const handleSelect = (template: PresentationTemplate) => {
		onSelectTemplate(template.id);
		onOpenChange(false);
	};

	const handleBlank = () => {
		onSelectTemplate(null);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Vyberte šablónu</DialogTitle>
					<DialogDescription>
						Vyberte šablónu pre vašu novú prezentáciu alebo začnite s prázdnou
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto">
					<Tabs
						defaultValue="all"
						className="w-full"
						onValueChange={setSelectedCategory}
					>
						<TabsList className="grid w-full grid-cols-5 mb-6">
							<TabsTrigger value="all">Všetky</TabsTrigger>
							<TabsTrigger value="business">
								<Briefcase className="w-4 h-4 mr-2" />
								Business
							</TabsTrigger>
							<TabsTrigger value="education">
								<GraduationCap className="w-4 h-4 mr-2" />
								Vzdelávanie
							</TabsTrigger>
							<TabsTrigger value="creative">
								<Palette className="w-4 h-4 mr-2" />
								Kreatívne
							</TabsTrigger>
							<TabsTrigger value="minimal">
								<Minus className="w-4 h-4 mr-2" />
								Minimálne
							</TabsTrigger>
						</TabsList>

						<TabsContent value={selectedCategory} className="mt-0">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{/* Blank template */}
								<Card
									className="cursor-pointer hover:shadow-lg transition-all group"
									onClick={handleBlank}
								>
									<div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
										<div className="absolute inset-0 flex items-center justify-center">
											<Sparkles className="w-16 h-16 text-muted-foreground/50" />
										</div>
										<div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
											Prázdna
										</div>
									</div>
									<CardHeader>
										<CardTitle className="group-hover:text-primary transition-colors">
											Prázdna prezentácia
										</CardTitle>
										<CardDescription>
											Začnite s prázdnou prezentáciou
										</CardDescription>
									</CardHeader>
								</Card>

								{/* Template cards */}
								{filteredTemplates.map((template) => {
									const Icon = categoryIcons[template.category];
									return (
										<Card
											key={template.id}
											className="cursor-pointer hover:shadow-lg transition-all group"
											onClick={() => handleSelect(template)}
										>
											<div
												className="aspect-video relative overflow-hidden"
												style={{
													backgroundColor: template.slides[0]?.background
														?.gradient
														? undefined
														: template.slides[0]?.background?.color ||
															"#ffffff",
													background:
														template.slides[0]?.background?.gradient ||
														undefined,
													backgroundImage: template.slides[0]?.background?.image
														? `url(${template.slides[0].background.image})`
														: undefined,
													backgroundSize: "cover",
													backgroundPosition: "center",
												}}
											>
												{/* Render first slide elements as preview */}
												<div className="absolute inset-0 p-4">
													{template.slides[0]?.elements
														.slice(0, 3)
														.map((el) => {
															if (el.type === "text") {
																return (
																	<div
																		key={el.id}
																		className="absolute"
																		style={{
																			left: `${(el.position.x / 960) * 100}%`,
																			top: `${(el.position.y / 540) * 100}%`,
																			width: `${(el.size.width / 960) * 100}%`,
																			height: `${(el.size.height / 540) * 100}%`,
																			fontSize: `${(el.style?.fontSize || 16) * 0.3}px`,
																			color:
																				el.style?.color ||
																				getDefaultTextColor(),
																			textAlign: el.style?.textAlign || "left",
																			overflow: "hidden",
																			textOverflow: "ellipsis",
																			whiteSpace: "nowrap",
																		}}
																	>
																		{el.content.substring(0, 20)}
																	</div>
																);
															}
															if (el.type === "shape") {
																return (
																	<div
																		key={el.id}
																		className="absolute"
																		style={{
																			left: `${(el.position.x / 960) * 100}%`,
																			top: `${(el.position.y / 540) * 100}%`,
																			width: `${(el.size.width / 960) * 100}%`,
																			height: `${(el.size.height / 540) * 100}%`,
																			backgroundColor:
																				el.style?.backgroundColor || "#3b82f6",
																			borderRadius:
																				el.content === "circle"
																					? "50%"
																					: el.content === "rounded"
																						? "8px"
																						: "0",
																			clipPath:
																				el.content === "triangle"
																					? "polygon(50% 0%, 0% 100%, 100% 100%)"
																					: undefined,
																		}}
																	/>
																);
															}
															return null;
														})}
												</div>
												<div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded flex items-center gap-1">
													<Icon className="w-3 h-3" />
													{categoryLabels[template.category]}
												</div>
												<div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
													{template.slides.length} slajd
													{template.slides.length !== 1 ? "ov" : ""}
												</div>
											</div>
											<CardHeader>
												<CardTitle className="group-hover:text-primary transition-colors">
													{template.name}
												</CardTitle>
												<CardDescription>
													{template.description}
												</CardDescription>
											</CardHeader>
										</Card>
									);
								})}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	);
}
