"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import type { SlideElement } from "@/types/presentation";

interface TablePropertiesProps {
    element: SlideElement;
    onUpdate: (updates: Partial<SlideElement>) => void;
}

export function TableProperties({ element, onUpdate }: TablePropertiesProps) {
    const style = element.style || {};

    const handleStyleUpdate = (prop: string, value: any) => {
        onUpdate({
            style: { ...style, [prop]: value }
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="table-rows">Rows</Label>
                    <Input
                        id="table-rows"
                        type="number"
                        min="1"
                        max="20"
                        value={style.rows || 1}
                        onChange={(e) => handleStyleUpdate("rows", Number(e.target.value))}
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="table-cols">Columns</Label>
                    <Input
                        id="table-cols"
                        type="number"
                        min="1"
                        max="10"
                        value={style.cols || 1}
                        onChange={(e) => handleStyleUpdate("cols", Number(e.target.value))}
                        className="mt-2"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="header-row">Header Row</Label>
                <Switch
                    id="header-row"
                    checked={!!style.headerRow}
                    onCheckedChange={(val) => handleStyleUpdate("headerRow", val)}
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="stripe-rows">Stripe Rows</Label>
                <Switch
                    id="stripe-rows"
                    checked={!!style.stripeRows}
                    onCheckedChange={(val) => handleStyleUpdate("stripeRows", val)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="table-bg">Background</Label>
                    <Input
                        id="table-bg"
                        type="color"
                        value={style.backgroundColor || "#ffffff"}
                        onChange={(e) => handleStyleUpdate("backgroundColor", e.target.value)}
                        className="w-full h-10 mt-2 cursor-pointer p-1"
                    />
                </div>
                <div>
                    <Label htmlFor="table-border">Border Color</Label>
                    <Input
                        id="table-border"
                        type="color"
                        value={style.borderColor || "#e5e7eb"}
                        onChange={(e) => handleStyleUpdate("borderColor", e.target.value)}
                        className="w-full h-10 mt-2 cursor-pointer p-1"
                    />
                </div>
            </div>
        </div>
    );
}
