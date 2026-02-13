"use client";

import { useState } from "react";
import { Image, Palette, Sparkles, Upload, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { GradientStop } from "@/lib/types/presentation";

interface SlideBackgroundEditorProps {
	currentBackground?: {
		type?: "color" | "image" | "gradient";
		color?: string;
		image?: string;
		gradient?: string;
		gradientStops?: GradientStop[];
		gradientAngle?: number;
		gradientType?: "linear" | "radial";
	};
	onUpdate: (updates: {
		type?: "color" | "image" | "gradient";
		color?: string;
		image?: string;
		gradient?: string;
		gradientStops?: GradientStop[];
		gradientAngle?: number;
		gradientType?: "linear" | "radial";
	}) => void;
}

const PRESET_GRADIENTS = [
	{ name: "Blue", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
	{
		name: "Orange",
		value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
	},
	{
		name: "Green",
		value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
	},
	{
		name: "Purple",
		value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
	},
	{ name: "Warm", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
	{
		name: "Cool",
		value: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
	},
	{ name: "Sun", value: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
	{ name: "Ocean", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
];

const PRESET_COLORS = [
	"#ffffff",
	"#000000",
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#ec4899",
	"#06b6d4",
	"#84cc16",
	"#f97316",
	"#6366f1",
];

export default function SlideBackgroundEditor({
	currentBackground,
	onUpdate,
}: SlideBackgroundEditorProps) {
	const [imageUrl, setImageUrl] = useState(currentBackground?.image || "");
	const [color, setColor] = useState(currentBackground?.color || "#ffffff");
	const [selectedGradient, setSelectedGradient] = useState(
		currentBackground?.gradient || "",
	);

	const handleColorChange = (newColor: string) => {
		setColor(newColor);
		onUpdate({
			type: "color",
			color: newColor,
			image: undefined,
			gradient: undefined,
		});
	};

	const handleImageChange = (url: string) => {
		setImageUrl(url);
		onUpdate({
			type: "image",
			image: url || undefined,
			color: undefined,
			gradient: undefined,
		});
	};

	const handleGradientChange = (gradient: string) => {
		setSelectedGradient(gradient);
		onUpdate({
			type: "gradient",
			gradient,
			color: undefined,
			image: undefined,
		});
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result as string;
				handleImageChange(base64String);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="space-y-4">
			<Tabs defaultValue="color" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="color" className="gap-2">
						<Palette className="w-4 h-4" />
						Color
					</TabsTrigger>
					<TabsTrigger value="gradient" className="gap-2">
						<Sparkles className="w-4 h-4" />
						Gradient
					</TabsTrigger>
					<TabsTrigger value="image" className="gap-2">
						<Image className="w-4 h-4" />
						Image
					</TabsTrigger>
				</TabsList>

				<TabsContent value="color" className="space-y-4 mt-4">
					<div>
						<Label>Custom Color</Label>
						<div className="flex items-center gap-2 mt-2">
							<Input
								type="color"
								value={color}
								onChange={(e) => handleColorChange(e.target.value)}
								className="w-20 h-12 cursor-pointer"
							/>
							<Input
								type="text"
								value={color}
								onChange={(e) => handleColorChange(e.target.value)}
								className="flex-1"
								placeholder="#ffffff"
							/>
						</div>
					</div>

					<div>
						<Label className="mb-2 block">Preset Colors</Label>
						<div className="grid grid-cols-6 gap-2">
							{PRESET_COLORS.map((presetColor) => (
								<Button
									key={presetColor}
									onClick={() => handleColorChange(presetColor)}
									variant="outline"
									className={cn(
										"w-full h-10 p-0 rounded-md border-2 transition-all hover:scale-110",
										color === presetColor
											? "border-primary ring-2 ring-primary/20"
											: "border-border",
									)}
									style={{ backgroundColor: presetColor }}
									title={presetColor}
								/>
							))}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="gradient" className="space-y-4 mt-4">
					<div>
						<Label className="mb-2 block">Preset Gradients</Label>
						<div className="grid grid-cols-2 gap-2">
							{PRESET_GRADIENTS.map((gradient) => (
								<Button
									key={gradient.name}
									onClick={() => handleGradientChange(gradient.value)}
									variant="outline"
									className={cn(
										"w-full h-16 p-0 rounded-md border-2 transition-all hover:scale-105 relative overflow-hidden block",
										selectedGradient === gradient.value
											? "border-primary ring-2 ring-primary/20"
											: "border-border",
									)}
									style={{ backgroundImage: gradient.value }}
								>
									<span className="absolute bottom-1 left-2 text-xs font-medium text-white drop-shadow">
										{gradient.name}
									</span>
								</Button>
							))}
						</div>
					</div>

					<Separator className="my-4" />

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label className="flex items-center gap-2 font-medium">
								<Sparkles className="w-4 h-4" /> Advanced Gradient
							</Label>
						</div>

						<div className="space-y-4 pt-2">
							<div>
								<Label className="text-xs">Type</Label>
								<Select
									value={currentBackground?.gradientType || "linear"}
									onValueChange={(value: "linear" | "radial") =>
										onUpdate({
											...currentBackground,
											type: "gradient",
											gradientType: value,
										})
									}
								>
									<SelectTrigger className="mt-1 h-8">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="linear">Linear</SelectItem>
										<SelectItem value="radial">Radial</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{currentBackground?.gradientType !== "radial" && (
								<div>
									<div className="flex justify-between mb-1">
										<Label className="text-xs">Angle</Label>
										<span className="text-[10px] text-muted-foreground">
											{currentBackground?.gradientAngle || 135}°
										</span>
									</div>
									<Input
										type="range"
										min="0"
										max="360"
										value={currentBackground?.gradientAngle || 135}
										onChange={(e) =>
											onUpdate({
												...currentBackground,
												type: "gradient",
												gradientAngle: Number(e.target.value),
											})
										}
										className="h-4 mt-1"
									/>
								</div>
							)}

							<div className="space-y-2">
								<Label className="text-xs flex items-center justify-between">
									Stops
									<Button
										variant="ghost"
										size="sm"
										className="h-6 w-6 p-0"
										onClick={() => {
											const stops = [
												...(currentBackground?.gradientStops || [
													{ color: "#667eea", offset: 0 },
													{ color: "#764ba2", offset: 100 },
												]),
											];
											stops.push({ color: "#ffffff", offset: 100 });
											onUpdate({
												...currentBackground,
												type: "gradient",
												gradientStops: stops,
											});
										}}
									>
										<Plus className="w-3 h-3" />
									</Button>
								</Label>
								<div className="space-y-2">
									{(
										currentBackground?.gradientStops || [
											{ color: "#667eea", offset: 0 },
											{ color: "#764ba2", offset: 100 },
										]
									).map((stop, idx) => (
										<div key={idx} className="flex items-center gap-2">
											<Input
												type="color"
												value={stop.color}
												onChange={(e) => {
													const stops = [
														...(currentBackground?.gradientStops || [
															{ color: "#667eea", offset: 0 },
															{ color: "#764ba2", offset: 100 },
														]),
													];
													stops[idx] = { ...stops[idx], color: e.target.value };
													onUpdate({
														...currentBackground,
														type: "gradient",
														gradientStops: stops,
													});
												}}
												className="w-8 h-8 p-0 border-none bg-transparent"
											/>
											<Input
												type="number"
												min="0"
												max="100"
												value={stop.offset}
												onChange={(e) => {
													const stops = [
														...(currentBackground?.gradientStops || [
															{ color: "#667eea", offset: 0 },
															{ color: "#764ba2", offset: 100 },
														]),
													];
													stops[idx] = {
														...stops[idx],
														offset: Number(e.target.value),
													};
													onUpdate({
														...currentBackground,
														type: "gradient",
														gradientStops: stops,
													});
												}}
												className="h-8 flex-1"
											/>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0"
												onClick={() => {
													const currentStops =
														currentBackground?.gradientStops || [
															{ color: "#667eea", offset: 0 },
															{ color: "#764ba2", offset: 100 },
														];
													if (currentStops.length > 2) {
														const stops = currentStops.filter(
															(_, i) => i !== idx,
														);
														onUpdate({
															...currentBackground,
															type: "gradient",
															gradientStops: stops,
														});
													}
												}}
												disabled={
													(currentBackground?.gradientStops?.length || 2) <= 2
												}
											>
												<Minus className="w-3 h-3" />
											</Button>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="pt-4">
						<Label>Gradient Preview (CSS)</Label>
						<Input
							type="text"
							value={selectedGradient}
							onChange={(e) => handleGradientChange(e.target.value)}
							className="mt-2 text-xs"
							placeholder="linear-gradient(...)"
						/>
					</div>
				</TabsContent>

				<TabsContent value="image" className="space-y-4 mt-4">
					<div>
						<Label>Upload Image</Label>
						<div className="mt-2">
							<Input
								type="file"
								accept="image/*"
								onChange={handleFileUpload}
								className="cursor-pointer"
							/>
						</div>
					</div>

					<div>
						<Label>Image URL</Label>
						<div className="flex gap-2 mt-2">
							<Input
								type="text"
								value={imageUrl}
								onChange={(e) => handleImageChange(e.target.value)}
								placeholder="https://example.com/image.jpg"
								className="flex-1"
							/>
							{imageUrl && (
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleImageChange("")}
								>
									<X className="w-4 h-4" />
								</Button>
							)}
						</div>
					</div>

					{imageUrl && (
						<Card>
							<CardContent className="p-0">
								<div className="relative w-full h-32 rounded-lg overflow-hidden">
									<img
										src={imageUrl}
										alt="Preview"
										className="w-full h-full object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = "none";
										}}
									/>
								</div>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
