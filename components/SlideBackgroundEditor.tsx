"use client";

import { useState } from "react";
import { Image, Palette, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SlideBackgroundEditorProps {
	currentBackground?: {
		color?: string;
		image?: string;
		gradient?: string;
	};
	onUpdate: (updates: {
		color?: string;
		image?: string;
		gradient?: string;
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
		onUpdate({ color: newColor, image: undefined, gradient: undefined });
	};

	const handleImageChange = (url: string) => {
		setImageUrl(url);
		onUpdate({
			image: url || undefined,
			color: undefined,
			gradient: undefined,
		});
	};

	const handleGradientChange = (gradient: string) => {
		setSelectedGradient(gradient);
		onUpdate({ gradient, color: undefined, image: undefined });
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
									style={{ background: gradient.value }}
								>
									<span className="absolute bottom-1 left-2 text-xs font-medium text-white drop-shadow">
										{gradient.name}
									</span>
								</Button>
							))}
						</div>
					</div>

					<div>
						<Label>Custom Gradient</Label>
						<Input
							type="text"
							value={selectedGradient}
							onChange={(e) => handleGradientChange(e.target.value)}
							className="mt-2"
							placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
						/>
						{selectedGradient && (
							<div
								className="w-full h-16 rounded-md border border-border mt-2"
								style={{ background: selectedGradient }}
							/>
						)}
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
