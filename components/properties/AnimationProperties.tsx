"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { SlideElement, AnimationType } from "@/types/presentation";

interface AnimationPropertiesProps {
	element: SlideElement;
	onUpdate: (updates: Partial<SlideElement>) => void;
}

export function AnimationProperties({
	element,
	onUpdate,
}: AnimationPropertiesProps) {
	const animation = element.animation || {
		type: "none",
		duration: 500,
		delay: 0,
	};

	const handleAnimUpdate = (prop: string, value: any) => {
		onUpdate({
			animation: { ...animation, [prop]: value },
		});
	};

	return (
		<div className="space-y-6">
			<div>
				<Label htmlFor="anim-type">Entry Animation</Label>
				<Select
					value={animation.type || "none"}
					onValueChange={(value: AnimationType) =>
						handleAnimUpdate("type", value)
					}
				>
					<SelectTrigger className="mt-2">
						<SelectValue placeholder="Select animation" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">None</SelectItem>
						<SelectItem value="fade">Fade In</SelectItem>
						<SelectItem value="slide-up">Slide Up</SelectItem>
						<SelectItem value="slide-down">Slide Down</SelectItem>
						<SelectItem value="slide-left">Slide Left</SelectItem>
						<SelectItem value="slide-right">Slide Right</SelectItem>
						<SelectItem value="zoom">Zoom</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="anim-duration">Duration (ms)</Label>
					<Input
						id="anim-duration"
						type="number"
						value={animation.duration || 500}
						onChange={(e) =>
							handleAnimUpdate("duration", Number(e.target.value))
						}
						step="100"
						min="0"
						className="mt-2"
					/>
				</div>
				<div>
					<Label htmlFor="anim-delay">Delay (ms)</Label>
					<Input
						id="anim-delay"
						type="number"
						value={animation.delay || 0}
						onChange={(e) => handleAnimUpdate("delay", Number(e.target.value))}
						step="100"
						min="0"
						className="mt-2"
					/>
				</div>
			</div>
		</div>
	);
}
