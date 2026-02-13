"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { usePresentationStore } from "@/lib/store/presentationStore";
import EditorCanvas from "@/components/EditorCanvas";
import SlidePanel from "@/components/SlidePanel";
import Toolbar from "@/components/Toolbar";
import PropertiesPanel from "@/components/PropertiesPanel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditorMenu from "@/components/EditorMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
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
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';

// Register plugins
registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

// Typy pre chart data
interface ChartDataPoint {
	label: string;
	value: number;
}

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

function EditorContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const {
		currentPresentation,
		presentations,
		loadPresentations,
		selectPresentation,
		updatePresentation,
		addElementToSlide,
	} = usePresentationStore();
	const [isLoading, setIsLoading] = useState(true);
	const [showSlidePanel, setShowSlidePanel] = useState(false);
	const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);

	// Nové stavy pre dialog na upload chartu
	const [showChartDialog, setShowChartDialog] = useState(false);
	const [chartType, setChartType] = useState<string>("bar");
	const [chartTitle, setChartTitle] = useState<string>("My Chart");
	const [chartDataInput, setChartDataInput] = useState<string>("");
	const [files, setFiles] = useState<any[]>([]);

	useEffect(() => {
		loadPresentations();
	}, [loadPresentations]);

	useEffect(() => {
		const id = searchParams.get("id");
		if (id) {
			const presentation = presentations.find((p) => p.id === id);
			if (presentation) {
				selectPresentation(id);
				setIsLoading(false);
			} else if (presentations.length > 0) {
				router.replace(`/editor?id=${presentations[0].id}`);
			} else {
				setIsLoading(false);
			}
		} else if (presentations.length > 0) {
			router.replace(`/editor?id=${presentations[0].id}`);
		} else {
			setIsLoading(false);
		}
	}, [searchParams, presentations, selectPresentation, router]);

	const handleSave = () => {
		if (currentPresentation) {
			updatePresentation(currentPresentation.id, currentPresentation);
			toast.success("Presentation saved successfully!");
		}
	};

	const handleExport = () => {
		if (currentPresentation) {
			const data = JSON.stringify(currentPresentation, null, 2);
			const blob = new Blob([data], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${currentPresentation.title}.json`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success("Presentation exported successfully!");
		}
	};

	// Funkcia pre otvorenie dialogu na upload chartu
	const handleUploadChart = () => {
		setShowChartDialog(true);
		// Reset formulara
		setChartType("bar");
		setChartTitle("My Chart");
		setChartDataInput("");
		setFiles([]);
	};

	// Funkcia pre parsovanie CSV dát
	const parseCSVData = (csvText: string): ChartData => {
		const lines = csvText.trim().split('\n');
		const headers = lines[0].split(',').map(h => h.trim());
		const datasets = [];

		// Ak máme hlavičku s "label,value" formátom
		if (headers.length === 2 && headers[0].toLowerCase() === 'label' && headers[1].toLowerCase() === 'value') {
			const labels = [];
			const data = [];

			for (let i = 1; i < lines.length; i++) {
				const [label, value] = lines[i].split(',').map(v => v.trim());
				labels.push(label);
				data.push(parseFloat(value) || 0);
			}

			datasets.push({
				label: chartTitle,
				data,
				backgroundColor: CHART_COLORS.slice(0, data.length),
				borderColor: CHART_COLORS.slice(0, data.length).map(color => color + '80'),
			});

			return {
				labels,
				datasets,
			};
		}

		// Ak máme viac dátových sád
		const labels = [];
		for (let i = 1; i < lines.length; i++) {
			const values = lines[i].split(',').map(v => v.trim());
			labels.push(values[0]);
		}

		for (let i = 1; i < headers.length; i++) {
			const data = [];
			for (let j = 1; j < lines.length; j++) {
				const values = lines[j].split(',').map(v => v.trim());
				data.push(parseFloat(values[i]) || 0);
			}

			datasets.push({
				label: headers[i],
				data,
				backgroundColor: CHART_COLORS.map(color => color + '40'),
				borderColor: CHART_COLORS[i - 1] || CHART_COLORS[0],
			});
		}

		return {
			labels,
			datasets,
		};
	};

	// Funkcia pre parsovanie JSON dát
	const parseJSONData = (jsonText: string): ChartData => {
		try {
			const data = JSON.parse(jsonText);

			// Rôzne formáty JSON dát
			if (data.labels && data.datasets) {
				// Chart.js formát
				return data;
			} else if (Array.isArray(data) && data.every(item => item.label && item.value)) {
				// Array of {label, value}
				const labels = data.map(item => item.label);
				const values = data.map(item => item.value);

				return {
					labels,
					datasets: [{
						label: chartTitle,
						data: values,
						backgroundColor: CHART_COLORS.slice(0, values.length),
						borderColor: CHART_COLORS.slice(0, values.length).map(color => color + '80'),
					}],
				};
			} else if (typeof data === 'object' && !Array.isArray(data)) {
				// Object s label/value pármi
				const labels = Object.keys(data);
				const values = Object.values(data) as number[];

				return {
					labels,
					datasets: [{
						label: chartTitle,
						data: values,
						backgroundColor: CHART_COLORS.slice(0, values.length),
						borderColor: CHART_COLORS.slice(0, values.length).map(color => color + '80'),
					}],
				};
			}

			throw new Error('Unsupported JSON format');
		} catch (error) {
			console.error('Error parsing JSON:', error);
			throw new Error('Invalid JSON format');
		}
	};

	// Funkcia pre spracovanie nahratého súboru
	const handleFileProcess = async (file: any) => {
		try {
			const text = await file.text();
			let chartData: ChartData;

			if (file.name.endsWith('.json')) {
				chartData = parseJSONData(text);
			} else if (file.name.endsWith('.csv')) {
				chartData = parseCSVData(text);
			} else {
				// Skúsime analyzovať obsah
				if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
					chartData = parseJSONData(text);
				} else {
					chartData = parseCSVData(text);
				}
			}

			// Nastavíme data do textarea
			setChartDataInput(JSON.stringify(chartData, null, 2));
			toast.success('Chart data loaded from file!');

			return true;
		} catch (error) {
			console.error('Error processing file:', error);
			toast.error('Error processing file. Please check the format.');
			return false;
		}
	};

	// Funkcia pre uloženie chartu do prezentácie
	const handleSaveChart = () => {
		try {
			if (!currentPresentation || !currentPresentation.selectedSlideId) {
				toast.error('No slide selected');
				return;
			}

			let chartData: ChartData;

			if (chartDataInput.trim()) {
				// Parse user input
				chartData = parseJSONData(chartDataInput);
			} else {
				// Vytvoríme vzorové dáta
				chartData = {
					labels: ['Q1', 'Q2', 'Q3', 'Q4'],
					datasets: [{
						label: chartTitle,
						data: [65, 59, 80, 81],
						backgroundColor: CHART_COLORS.slice(0, 4),
						borderColor: CHART_COLORS.slice(0, 4).map(color => color + '80'),
					}],
				};
			}

			// Vytvoríme chart element
			const chartElement = {
				id: `chart-${Date.now()}`,
				type: 'chart',
				x: 100,
				y: 100,
				width: 400,
				height: 300,
				content: JSON.stringify({
					type: chartType,
					data: chartData,
					options: {
						responsive: true,
						plugins: {
							legend: {
								position: 'top' as const,
							},
							title: {
								display: true,
								text: chartTitle,
							},
						},
					},
				}),
				style: {},
			};

			// Pridáme element do aktuálneho slide
			addElementToSlide(currentPresentation.selectedSlideId, chartElement);

			// Zatvoríme dialog a ukážeme toast
			setShowChartDialog(false);
			setFiles([]); // Reset files
			toast.success('Chart added to slide!');

		} catch (error) {
			console.error('Error adding chart:', error);
			toast.error('Error adding chart. Please check your data format.');
		}
	};

	// Funkcia pre zobrazenie ukážky dát podľa typu chartu
	const showSampleData = () => {
		let sampleData = '';

		switch (chartType) {
			case 'bar':
				sampleData = JSON.stringify({
					labels: ["Jan", "Feb", "Mar", "Apr"],
					datasets: [{
						label: chartTitle,
						data: [65, 59, 80, 81],
						backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
					}]
				}, null, 2);
				break;

			case 'line':
				sampleData = JSON.stringify({
					labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
					datasets: [{
						label: chartTitle,
						data: [30, 45, 25, 60],
						borderColor: "#3b82f6",
						backgroundColor: "#3b82f640"
					}]
				}, null, 2);
				break;

			case 'pie':
			case 'doughnut':
				sampleData = JSON.stringify({
					labels: ["Red", "Blue", "Yellow", "Green"],
					datasets: [{
						label: chartTitle,
						data: [300, 50, 100, 150],
						backgroundColor: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"]
					}]
				}, null, 2);
				break;

			case 'radar':
				sampleData = JSON.stringify({
					labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
					datasets: [{
						label: "Series 1",
						data: [65, 59, 90, 81, 56, 55, 40],
						backgroundColor: "#3b82f640",
						borderColor: "#3b82f6"
					}, {
						label: "Series 2",
						data: [28, 48, 40, 19, 96, 27, 100],
						backgroundColor: "#10b98140",
						borderColor: "#10b981"
					}]
				}, null, 2);
				break;
		}

		setChartDataInput(sampleData);
		toast.info('Sample data loaded for ' + chartType + ' chart');
	};

	if (isLoading || !currentPresentation) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground mb-4">Loading presentation...</p>
					<Button variant="link" asChild>
						<Link href="/">Back to dashboard</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="h-screen flex flex-col bg-background">
				{/* Header */}
				<EditorMenu
					onSave={handleSave}
					onExport={handleExport}
					onUploadChart={handleUploadChart}
				/>

				{/* Dialog pre upload chartu */}
				<Dialog open={showChartDialog} onOpenChange={setShowChartDialog}>
					<DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Add Custom Chart</DialogTitle>
							<DialogDescription>
								Upload your chart data or enter it manually. Supports JSON and CSV formats.
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="chart-type">Chart Type</Label>
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
										acceptedFileTypes={['application/json', 'text/csv', 'text/plain']}
										maxFileSize="1MB"
										labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
										labelFileProcessing='Processing'
										labelFileProcessingComplete='Upload complete'
										labelFileProcessingError='Upload error'
										labelFileProcessingAborted='Upload cancelled'
										labelTapToCancel='tap to cancel'
										labelTapToRetry='tap to retry'
										labelTapToUndo='tap to undo'
										onprocessfile={(error, file) => {
											if (!error) {
												handleFileProcess(file.file);
											}
										}}
										server={{
											process: (_fieldName, file, _metadata, load) => {
												// Simulujeme serverový upload
												setTimeout(() => {
													load(file.name);
												}, 1000);
											}
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
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={showSampleData}
											>
												Load Sample
											</Button>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => setChartDataInput('')}
											>
												Clear
											</Button>
										</div>
									</div>
									<textarea
										id="chart-data"
										className="min-h-[250px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs"
										value={chartDataInput}
										onChange={(e) => setChartDataInput(e.target.value)}
										placeholder={`Enter your chart data in JSON format...
Example:
{
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "datasets": [
    {
      "label": "Sales",
      "data": [65, 59, 80, 81],
      "backgroundColor": ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
    }
  ]
}`}
									/>
									<div className="flex items-center justify-between">
										<p className="text-xs text-muted-foreground">
											Supported formats: JSON (Chart.js format)
										</p>
										{chartDataInput.trim() && (
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => {
													try {
														const data = JSON.parse(chartDataInput);
														setChartDataInput(JSON.stringify(data, null, 2));
														toast.success('JSON formatted');
													} catch {
														toast.error('Invalid JSON format');
													}
												}}
											>
												Format JSON
											</Button>
										)}
									</div>
								</div>

								<div className="bg-muted/50 rounded-md p-4">
									<h4 className="text-sm font-medium mb-3">Quick Tips:</h4>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
										<div className="space-y-2">
											<p className="font-medium">Simple Array Format:</p>
											<pre className="bg-background p-2 rounded overflow-x-auto">
												{`[
  {"label": "Category A", "value": 30},
  {"label": "Category B", "value": 45}
]`}</pre>
										</div>
										<div className="space-y-2">
											<p className="font-medium">Multiple Datasets:</p>
											<pre className="bg-background p-2 rounded overflow-x-auto">
												{`{
  "labels": ["Jan", "Feb", "Mar"],
  "datasets": [
    {"label": "2023", "data": [65, 59, 80]},
    {"label": "2024", "data": [28, 48, 40]}
  ]
}`}</pre>
										</div>
									</div>
								</div>

								<div className="bg-primary/5 rounded-md p-4 border border-primary/20">
									<h4 className="text-sm font-medium mb-2 flex items-center gap-2">
										<span className="text-primary">✓</span>
										Chart Preview
									</h4>
									<div className="grid grid-cols-2 gap-4 text-xs">
										<div>
											<p className="text-muted-foreground mb-1">Type:</p>
											<p className="font-medium capitalize">{chartType} Chart</p>
										</div>
										<div>
											<p className="text-muted-foreground mb-1">Title:</p>
											<p className="font-medium">{chartTitle}</p>
										</div>
										<div className="col-span-2">
											<p className="text-muted-foreground mb-1">Data Points:</p>
											{chartDataInput.trim() ? (
												<p className="font-medium">
													{(() => {
														try {
															const data = JSON.parse(chartDataInput);
															if (data.labels) {
																return `${data.labels.length} labels, ${data.datasets?.length || 1} dataset(s)`;
															}
															return 'Valid JSON data';
														} catch {
															return 'Invalid JSON - check format';
														}
													})()}
												</p>
											) : (
												<p className="font-medium">No data - will use sample data</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								variant="outline"
								onClick={() => {
									setShowChartDialog(false);
									setFiles([]);
								}}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSaveChart}
								disabled={!currentPresentation?.selectedSlideId}
							>
								Add Chart to Slide
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Main Content */}
				<div className="flex-1 flex overflow-hidden relative">
					{/* Slide Panel - Desktop */}
					<div className="hidden lg:block">
						<SlidePanel />
					</div>

					{/* Slide Panel - Mobile */}
					<Sheet open={showSlidePanel} onOpenChange={setShowSlidePanel}>
						<SheetContent side="left" className="w-80 p-0">
							<SlidePanel />
						</SheetContent>
					</Sheet>

					{/* Editor Canvas */}
					<div className="flex-1 flex flex-col min-w-0">
						{/* Mobile Toolbar Toggle */}
						<div className="lg:hidden flex items-center gap-2 p-2 border-b bg-background">
							<Sheet open={showSlidePanel} onOpenChange={setShowSlidePanel}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="sm">
										<Menu className="w-4 h-4 mr-2" />
										Slides
									</Button>
								</SheetTrigger>
							</Sheet>
							<Sheet
								open={showPropertiesPanel}
								onOpenChange={setShowPropertiesPanel}
							>
								<SheetTrigger asChild>
									<Button variant="ghost" size="sm">
										<Menu className="w-4 h-4 mr-2" />
										Properties
									</Button>
								</SheetTrigger>
							</Sheet>
						</div>

						<Toolbar />
						<div className="flex-1 overflow-auto bg-muted/30 p-4 lg:p-8">
							<EditorCanvas />
						</div>
					</div>

					{/* Properties Panel - Desktop */}
					<div className="hidden lg:block">
						<PropertiesPanel />
					</div>

					{/* Properties Panel - Mobile */}
					<Sheet
						open={showPropertiesPanel}
						onOpenChange={setShowPropertiesPanel}
					>
						<SheetContent side="right" className="w-80 p-0">
							<PropertiesPanel />
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</DndProvider>
	);
}

export default function EditorPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-background">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-muted-foreground">Loading...</p>
					</div>
				</div>
			}
		>
			<EditorContent />
		</Suspense>
	);
}