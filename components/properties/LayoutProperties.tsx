"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import type { SlideElement } from "@/types/presentation";

interface LayoutPropertiesProps {
	element: SlideElement;
	onUpdate: (updates: Partial<SlideElement>) => void;
}

export function LayoutProperties({ element, onUpdate }: LayoutPropertiesProps) {
	const handleUpdate = (prop: string, value: any) => {
		if (prop === "x" || prop === "y") {
			onUpdate({
				position: { ...element.position, [prop]: value },
			});
		} else if (prop === "width" || prop === "height") {
			onUpdate({
				size: { ...element.size, [prop]: value },
			});
		} else {
			onUpdate({ [prop]: value });
		}
	};

	const handleStyleUpdate = (prop: string, value: any) => {
		onUpdate({
			style: { ...element.style, [prop]: value },
		});
	};

	return (
		<div className="space-y-6">
			<div>
				<Label className="mb-3">Position</Label>
				<div className="grid grid-cols-2 gap-3 mt-2">
					<div>
						<Label htmlFor="pos-x" className="text-xs text-muted-foreground">
							X
						</Label>
						<Input
							id="pos-x"
							type="number"
							value={element.position?.x || 0}
							onChange={(e) => handleUpdate("x", Number(e.target.value))}
							className="mt-1"
						/>
					</div>
					<div>
						<Label htmlFor="pos-y" className="text-xs text-muted-foreground">
							Y
						</Label>
						<Input
							id="pos-y"
							type="number"
							value={element.position?.y || 0}
							onChange={(e) => handleUpdate("y", Number(e.target.value))}
							className="mt-1"
						/>
					</div>
				</div>
			</div>

			<Separator />

			<div>
				<Label className="mb-3">Size</Label>
				<div className="grid grid-cols-2 gap-3 mt-2">
					<div>
						<Label htmlFor="size-w" className="text-xs text-muted-foreground">
							Width
						</Label>
						<Input
							id="size-w"
							type="number"
							value={element.size?.width || 100}
							onChange={(e) =>
								handleUpdate("width", Math.max(10, Number(e.target.value)))
							}
							min="10"
							className="mt-1"
						/>
					</div>
					<div>
						<Label htmlFor="size-h" className="text-xs text-muted-foreground">
							Height
						</Label>
						<Input
							id="size-h"
							type="number"
							value={element.size?.height || 100}
							onChange={(e) =>
								handleUpdate("height", Math.max(10, Number(e.target.value)))
							}
							min="10"
							className="mt-1"
						/>
					</div>
				</div>
			</div>

			<div>
				<Label htmlFor="rotation">Rotation</Label>
				<div className="flex items-center gap-2 mt-2">
					<Input
						id="rotation"
						type="range"
						min="0"
						max="360"
						value={element.rotation || 0}
						onChange={(e) => handleUpdate("rotation", Number(e.target.value))}
						className="flex-1"
					/>
					<span className="text-sm w-12 text-right">
						{element.rotation || 0}°
					</span>
				</div>
			</div>

			<div>
				<Label htmlFor="opacity">Opacity</Label>
				<div className="flex items-center gap-2 mt-2">
					<Input
						id="opacity"
						type="range"
						min="0"
						max="100"
						value={(element.style?.opacity || 1) * 100}
						onChange={(e) =>
							handleStyleUpdate("opacity", Number(e.target.value) / 100)
						}
						className="flex-1"
					/>
					<span className="text-sm w-12 text-right">
						{Math.round((element.style?.opacity || 1) * 100)}%
					</span>
				</div>
			</div>
		</div>
	);
}
