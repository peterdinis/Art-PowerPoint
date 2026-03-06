"use client";

import { useState } from "react";
import { usePresentationStore } from "@/store/presentationStore";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import type { SlideElement } from "@/types/presentation";

// Register plugins
registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

// Typy pre chart data
interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
    }[];
}

// Farbové palety pre charty
const CHART_COLORS = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
];

interface AdvancedChartDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AdvancedChartDialog({
    open,
    onOpenChange,
}: AdvancedChartDialogProps) {
    const { currentPresentation, addElementToSlide } = usePresentationStore();
    const [chartType, setChartType] = useState<string>("bar");
    const [chartTitle, setChartTitle] = useState<string>("My Chart");
    const [chartDataInput, setChartDataInput] = useState<string>("");
    const [files, setFiles] = useState<any[]>([]);

    // Funkcia pre parsovanie CSV dát
    const parseCSVData = (csvText: string): ChartData => {
        const lines = csvText.trim().split("\n");
        if (lines.length < 1) throw new Error("Empty CSV");

        const headers = lines[0].split(",").map((h) => h.trim());
        const datasets: any[] = [];

        // Ak máme hlavičku s "label,value" formátom
        if (
            headers.length === 2 &&
            headers[0].toLowerCase() === "label" &&
            headers[1].toLowerCase() === "value"
        ) {
            const labels = [];
            const data = [];

            for (let i = 1; i < lines.length; i++) {
                const [label, value] = lines[i].split(",").map((v) => v.trim());
                labels.push(label);
                data.push(parseFloat(value) || 0);
            }

            datasets.push({
                label: chartTitle,
                data,
                backgroundColor: CHART_COLORS.slice(0, data.length),
                borderColor: CHART_COLORS.slice(0, data.length).map(
                    (color) => color + "80",
                ),
            });

            return { labels, datasets };
        }

        // Ak máme viac dátových sád
        const labels = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim());
            labels.push(values[0]);
        }

        for (let i = 1; i < headers.length; i++) {
            const data = [];
            for (let j = 1; j < lines.length; j++) {
                const values = lines[j].split(",").map((v) => v.trim());
                data.push(parseFloat(values[i]) || 0);
            }

            datasets.push({
                label: headers[i],
                data,
                backgroundColor: CHART_COLORS.map((color) => color + "40"),
                borderColor: CHART_COLORS[i - 1] || CHART_COLORS[0],
            });
        }

        return { labels, datasets };
    };

    // Funkcia pre parsovanie JSON dát
    const parseJSONData = (jsonText: string): ChartData => {
        try {
            const data = JSON.parse(jsonText);

            if (data.labels && data.datasets) return data;

            if (Array.isArray(data) && data.every((item) => item.label && item.value)) {
                const labels = data.map((item) => item.label);
                const values = data.map((item) => item.value);

                return {
                    labels,
                    datasets: [{
                        label: chartTitle,
                        data: values,
                        backgroundColor: CHART_COLORS.slice(0, values.length),
                        borderColor: CHART_COLORS.slice(0, values.length).map(color => color + "80"),
                    }],
                };
            }

            if (typeof data === "object" && !Array.isArray(data)) {
                const labels = Object.keys(data);
                const values = Object.values(data) as number[];

                return {
                    labels,
                    datasets: [{
                        label: chartTitle,
                        data: values,
                        backgroundColor: CHART_COLORS.slice(0, values.length),
                        borderColor: CHART_COLORS.slice(0, values.length).map(color => color + "80"),
                    }],
                };
            }

            throw new Error("Unsupported JSON format");
        } catch (error) {
            console.error("Error parsing JSON:", error);
            throw new Error("Invalid JSON format");
        }
    };

    const handleFileProcess = async (file: File) => {
        try {
            const text = await file.text();
            let chartData: ChartData;

            if (file.name.endsWith(".json")) {
                chartData = parseJSONData(text);
            } else if (file.name.endsWith(".csv")) {
                chartData = parseCSVData(text);
            } else {
                if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
                    chartData = parseJSONData(text);
                } else {
                    chartData = parseCSVData(text);
                }
            }

            setChartDataInput(JSON.stringify(chartData, null, 2));
            toast.success("Chart data loaded from file!");
            return true;
        } catch (error) {
            toast.error("Error processing file. Please check the format.");
            return false;
        }
    };

    const handleSaveChart = () => {
        try {
            if (!currentPresentation) return;

            const activeSlideId = currentPresentation.selectedSlideId ||
                currentPresentation.slides[usePresentationStore.getState().currentSlideIndex]?.id;

            if (!activeSlideId) {
                toast.error("No slide selected");
                return;
            }

            let chartData: ChartData;
            if (chartDataInput.trim()) {
                chartData = parseJSONData(chartDataInput);
            } else {
                chartData = {
                    labels: ["Q1", "Q2", "Q3", "Q4"],
                    datasets: [{
                        label: chartTitle,
                        data: [65, 59, 80, 81],
                        backgroundColor: CHART_COLORS.slice(0, 4),
                        borderColor: CHART_COLORS.slice(0, 4).map(color => color + "80"),
                    }],
                };
            }

            const chartElement: SlideElement = {
                id: `chart-${Date.now()}`,
                type: "chart",
                content: JSON.stringify({
                    type: chartType,
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: "top" as const },
                            title: { display: true, text: chartTitle },
                        },
                    },
                }),
                position: { x: 100, y: 100 },
                size: { width: 500, height: 350 },
                style: {
                    chartType: chartType as any,
                    chartTitle,
                    backgroundColor: "#ffffff",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                },
            };

            addElementToSlide(activeSlideId, chartElement);
            onOpenChange(false);
            setFiles([]);
            toast.success("Chart added to slide!");
        } catch (error) {
            toast.error("Error adding chart. Please check your data format.");
        }
    };

    const showSampleData = () => {
        let sampleData = "";
        switch (chartType) {
            case "bar":
                sampleData = JSON.stringify({
                    labels: ["Jan", "Feb", "Mar", "Apr"],
                    datasets: [{ label: chartTitle, data: [65, 59, 80, 81], backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"] }]
                }, null, 2);
                break;
            case "line":
                sampleData = JSON.stringify({
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                    datasets: [{ label: chartTitle, data: [30, 45, 25, 60], borderColor: "#3b82f6", backgroundColor: "#3b82f640" }]
                }, null, 2);
                break;
            case "pie":
            case "doughnut":
                sampleData = JSON.stringify({
                    labels: ["Red", "Blue", "Yellow", "Green"],
                    datasets: [{ label: chartTitle, data: [300, 50, 100, 150], backgroundColor: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"] }]
                }, null, 2);
                break;
            case "radar":
                sampleData = JSON.stringify({
                    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
                    datasets: [
                        { label: "Series 1", data: [65, 59, 90, 81, 56, 55, 40], backgroundColor: "#3b82f640", borderColor: "#3b82f6" },
                        { label: "Series 2", data: [28, 48, 40, 19, 96, 27, 100], backgroundColor: "#10b98140", borderColor: "#10b981" }
                    ]
                }, null, 2);
                break;
        }
        setChartDataInput(sampleData);
        toast.info("Sample data loaded for " + chartType + " chart");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-175 max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Custom Chart</DialogTitle>
                    <DialogDescription>
                        Upload your chart data or enter it manually. Supports JSON and CSV formats.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Chart Type</Label>
                            <Select value={chartType} onValueChange={setChartType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select chart type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bar">Bar Chart</SelectItem>
                                    <SelectItem value="line">Line Chart</SelectItem>
                                    <SelectItem value="pie">Pie Chart</SelectItem>
                                    <SelectItem value="doughnut">Doughnut Chart</SelectItem>
                                    <SelectItem value="radar">Radar Chart</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="chart-title">Chart Title</Label>
                            <Input
                                id="chart-title"
                                value={chartTitle}
                                onChange={(e) => setChartTitle(e.target.value)}
                                placeholder="Enter chart title"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="block mb-2">Upload Data File</Label>
                            <FilePond
                                files={files}
                                onupdatefiles={setFiles}
                                allowMultiple={false}
                                maxFiles={1}
                                acceptedFileTypes={["application/json", "text/csv", "text/plain"]}
                                maxFileSize="1MB"
                                labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
                                onprocessfile={(error, file) => {
                                    if (!error) handleFileProcess(file.file as File);
                                }}
                                server={{
                                    process: (_fieldName, file, _metadata, load) => {
                                        setTimeout(() => load(file.name), 500);
                                    },
                                }}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Supports .json, .csv files up to 1MB
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="chart-data">Or Enter Data Manually (JSON)</Label>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={showSampleData}>
                                        Load Sample
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setChartDataInput("")}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                            <textarea
                                id="chart-data"
                                className="min-h-62.5 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono text-xs"
                                value={chartDataInput}
                                onChange={(e) => setChartDataInput(e.target.value)}
                                placeholder='Enter your chart data in JSON format...'
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveChart} disabled={!currentPresentation}>
                        Add Chart to Slide
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
