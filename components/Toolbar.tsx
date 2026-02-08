"use client";

import { usePresentationStore } from "@/lib/store/presentationStore";
import {
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Plus,
  ChevronDown,
  Heading1,
  Heading2,
  List,
  Link2,
  Code,
  Quote,
  Table,
  LineChart,
  PieChart,
  BarChart,
  Database,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Music,
  Film,
  Mic,
  FileText,
  Download,
  Upload,
  Palette,
  Type as FontIcon,
  Sparkles,
  Star,
  Heart,
  Zap,
  Layers,
  Grid,
  Columns,
  Rows,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Table2,
} from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlideElementType } from "@/lib/types/presentation";

export default function Toolbar() {
  const {
    addElement,
    currentPresentation,
    currentSlideIndex,
    selectedElementId,
    updateElement,
  } = usePresentationStore();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [chartDialogOpen, setChartDialogOpen] = useState(false);
  const [iconDialogOpen, setIconDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [layoutDialogOpen, setLayoutDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [tableRows, setTableRows] = useState(3);
  const [tableColumns, setTableColumns] = useState(3);
  const [chartType, setChartType] = useState("bar");
  const [chartData, setChartData] = useState("Jan,Feb,Mar\n10,20,15");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#212121");
  const [layoutType, setLayoutType] = useState("two-columns");

  // Get default text color based on theme
  const getDefaultTextColor = () => {
    if (typeof window === "undefined") return "#212121";
    const isDark = document.documentElement.classList.contains("dark");
    return isDark ? "#e5e5e5" : "#212121";
  };

  if (!currentPresentation) return null;

  const currentSlide = currentPresentation.slides[currentSlideIndex];
  const selectedElement = currentSlide?.elements.find(
    (el) => el.id === selectedElementId,
  );

  const handleAddText = (
    textType: "heading1" | "heading2" | "body" | "quote" | "code" | "title" | "subtitle" = "body",
  ) => {
    const styles: Record<
      string,
      {
        fontSize: number;
        fontWeight?: string;
        fontStyle?: string;
        fontFamily?: string;
        color?: string;
      }
    > = {
      title: { fontSize: 64, fontWeight: "bold", color: "#1e40af" },
      heading1: { fontSize: 48, fontWeight: "bold" },
      heading2: { fontSize: 36, fontWeight: "bold" },
      subtitle: { fontSize: 32, fontStyle: "italic", color: "#6b7280" },
      body: { fontSize: 24, fontWeight: "normal" },
      quote: { fontSize: 28, fontStyle: "italic", color: "#6b7280" },
      code: { fontSize: 20, fontFamily: "Courier New", color: "#059669" },
    };

    const contents = {
      title: "Presentation Title",
      heading1: "Main Heading",
      heading2: "Sub Heading",
      subtitle: "Presentation Subtitle",
      body: "Add your text here...",
      quote: "The only way to do great work is to love what you do.",
      code: "console.log('Hello, World!');",
    };

    const styleConfig = styles[textType];

    addElement({
      type: "text",
      position: { x: 100, y: 100 },
      size: {
        width: textType === "title" ? 800 : textType === "subtitle" ? 600 : 400,
        height: textType === "title" ? 120 : textType === "subtitle" ? 80 : 60,
      },
      content: contents[textType],
      style: {
        fontSize: styleConfig.fontSize,
        color: styleConfig.color || getDefaultTextColor(),
        fontFamily: styleConfig.fontFamily || "Arial",
        fontWeight: styleConfig.fontWeight || "normal",
        fontStyle:
          styleConfig.fontStyle || (textType === "quote" ? "italic" : "normal"),
        textAlign: "left",
      },
    });
  };

  const handleAddImage = () => {
    if (imageUrl) {
      addElement({
        type: "image",
        position: { x: 100, y: 100 },
        size: { width: 400, height: 300 },
        content: imageUrl,
        style: {
          borderRadius: "8px",
        },
      });
      setImageUrl("");
      setImageDialogOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        addElement({
          type: "image",
          position: { x: 100, y: 100 },
          size: { width: 400, height: 300 },
          content: result,
          style: {
            borderRadius: "8px",
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVideo = () => {
    if (videoUrl) {
      addElement({
        type: "video",
        position: { x: 100, y: 100 },
        size: { width: 640, height: 360 },
        content: videoUrl,
        style: {
          borderRadius: "8px",
        },
      });
      setVideoUrl("");
      setVideoDialogOpen(false);
    }
  };

  const handleAddLink = () => {
    if (linkUrl && linkText) {
      addElement({
        type: "text",
        position: { x: 100, y: 100 },
        size: { width: 200, height: 40 },
        content: linkText,
        style: {
          fontSize: 18,
          color: "#2563eb",
          textDecoration: "underline",
        },
      });
      setLinkUrl("");
      setLinkText("");
      setLinkDialogOpen(false);
    }
  };

  const handleAddShape = (
    shapeType:
      | "square"
      | "circle"
      | "triangle"
      | "rectangle"
      | "rounded"
      | "star"
      | "heart"
      | "hexagon"
      | "octagon"
      | "diamond",
  ) => {
    const sizes = {
      square: { width: 200, height: 200 },
      circle: { width: 200, height: 200 },
      triangle: { width: 200, height: 200 },
      rectangle: { width: 300, height: 150 },
      rounded: { width: 250, height: 150 },
      star: { width: 200, height: 200 },
      heart: { width: 200, height: 180 },
      hexagon: { width: 200, height: 200 },
      octagon: { width: 200, height: 200 },
      diamond: { width: 200, height: 200 },
    };

    const colors = {
      square: "#3b82f6",
      circle: "#10b981",
      triangle: "#f59e0b",
      rectangle: "#8b5cf6",
      rounded: "#ef4444",
      star: "#fbbf24",
      heart: "#ec4899",
      hexagon: "#06b6d4",
      octagon: "#84cc16",
      diamond: "#6366f1",
    };

    addElement({
      type: "shape",
      position: { x: 100, y: 100 },
      size: sizes[shapeType],
      content: shapeType,
      style: {
        backgroundColor: colors[shapeType],
        borderWidth: 0,
        borderColor: "#000000",
        ...(shapeType === "rounded" && { borderRadius: "12px" }),
        ...(shapeType === "heart" && { color: colors[shapeType] }),
      },
    });
  };

  const handleAddList = (listType: "ordered" | "unordered" | "checklist") => {
    const items = {
      ordered: "1. First item\n2. Second item\n3. Third item",
      unordered: "• First item\n• Second item\n• Third item",
      checklist: "☐ First task\n☐ Second task\n☐ Third task",
    };

    addElement({
      type: "text",
      position: { x: 100, y: 100 },
      size: { width: 300, height: 120 },
      content: items[listType],
      style: {
        fontSize: 20,
        color: getDefaultTextColor(),
        fontFamily: "Arial",
        textAlign: "left",
      },
    });
  };

  const handleAddTable = () => {
    const tableContent = Array(tableRows)
      .fill(null)
      .map((_, rowIndex) =>
        Array(tableColumns)
          .fill(null)
          .map((_, colIndex) => `Cell ${rowIndex + 1}-${colIndex + 1}`)
          .join("\t"),
      )
      .join("\n");

    addElement({
      type: "text",
      position: { x: 100, y: 100 },
      size: { width: 400, height: 200 },
      content: tableContent,
      style: {
        fontSize: 14,
        color: getDefaultTextColor(),
        fontFamily: "Arial",
        textAlign: "left",
        backgroundColor: "#f9fafb",
      },
    });
    setTableDialogOpen(false);
  };

  const handleAddChart = () => {
    const chartContent = `Chart Type: ${chartType}\nData:\n${chartData}`;
    
    addElement({
      type: "text",
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      content: chartContent,
      style: {
        fontSize: 12,
        color: getDefaultTextColor(),
        fontFamily: "Arial",
        textAlign: "center",
        backgroundColor: "#f8fafc",
      },
    });
    setChartDialogOpen(false);
  };

  const handleAddLayout = (type: string) => {
    const layouts = {
      "two-columns": {
        content: "[Content Left]\n\n[Content Right]",
        width: 600,
        height: 400,
      },
      "three-columns": {
        content: "[Left]\n\n[Center]\n\n[Right]",
        width: 600,
        height: 400,
      },
      "header-content": {
        content: "[Header]\n\n[Main Content]\n\n[Footer]",
        width: 600,
        height: 400,
      },
      "sidebar": {
        content: "[Sidebar]\n\n[Main Content]",
        width: 600,
        height: 400,
      },
    };

    const layout = layouts[type as keyof typeof layouts] || layouts["two-columns"];

    addElement({
      type: "text",
      position: { x: 100, y: 100 },
      size: { width: layout.width, height: layout.height },
      content: layout.content,
      style: {
        fontSize: 14,
        color: "#6b7280",
        fontFamily: "Arial",
        textAlign: "center",
        backgroundColor: "#f1f5f9"
      },
    });
  };

  const handleAddIcon = (iconType: string) => {
    const icons = {
      calendar: "📅",
      clock: "⏰",
      location: "📍",
      phone: "📞",
      email: "📧",
      globe: "🌐",
      music: "🎵",
      film: "🎬",
      mic: "🎤",
      star: "⭐",
      heart: "❤️",
      sparkles: "✨",
      zap: "⚡",
    };

    const icon = icons[iconType as keyof typeof icons] || "⭐";

    addElement({
      type: "text",
      position: { x: 100, y: 100 },
      size: { width: 60, height: 60 },
      content: icon,
      style: {
        fontSize: 40,
        color: "#3b82f6",
        fontFamily: "Arial",
        textAlign: "center",
      },
    });
  };

  const handleTextStyle = (property: string, value: any) => {
    if (selectedElement && selectedElement.type === "text") {
      updateElement(selectedElement.id, {
        style: {
          ...selectedElement.style,
          [property]: value,
        },
      });
    }
  };

  const handleAddMedia = (mediaType: string) => {
    const mediaElements = {
      audio: {
        type: "text",
        content: "🎵 Audio Player\n\nClick to play audio",
        size: { width: 300, height: 100 },
        style: {
          fontSize: 16,
          color: getDefaultTextColor(),
          textAlign: "center",
          border: "2px solid #60a5fa",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#dbeafe",
        },
      },
      podcast: {
        type: "text",
        content: "🎙️ Podcast Episode\n\nEpisode Title Here",
        size: { width: 300, height: 100 },
        style: {
          fontSize: 16,
          color: getDefaultTextColor(),
          textAlign: "center",
          border: "2px solid #8b5cf6",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#f3e8ff",
        },
      },
      document: {
        type: "text",
        content: "📄 Document\n\nClick to view document",
        size: { width: 300, height: 100 },
        style: {
          fontSize: 16,
          color: getDefaultTextColor(),
          textAlign: "center",
          border: "2px solid #10b981",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#d1fae5",
        },
      },
    };

    const media = mediaElements[mediaType as keyof typeof mediaElements];
    if (media) {
      addElement({
        type: media.type as SlideElementType,
        position: { x: 100, y: 100 },
        size: media.size,
        content: media.content,
        style: media.style as any
      });
    }
  };

  return (
    <div className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          
          {/* Quick Add Buttons */}
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleAddText("title")}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Heading1 className="w-4 h-4" />
                <span className="hidden sm:inline">Title</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleAddText("body")}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Type className="w-4 h-4" />
                <span className="hidden sm:inline">Text</span>
              </Button>
            </motion.div>
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Image className="w-4 h-4" />
                    <span className="hidden sm:inline">Image</span>
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Image</DialogTitle>
                  <DialogDescription>
                    Enter image URL or use direct link
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">From URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-url-quick">Image URL</Label>
                      <Input
                        id="image-url-quick"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {imageUrl && (
                      <div className="rounded-lg overflow-hidden border">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <Button onClick={handleAddImage} disabled={!imageUrl} className="w-full">
                      Add Image
                    </Button>
                  </TabsContent>
                  <TabsContent value="upload" className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag & drop or click to upload
                      </p>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select File
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setImageDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleAddShape("star")}
                variant="outline"
                size="sm"
                className="gap-2"
                title="Add star"
              >
                <Star className="w-4 h-4" />
              </Button>
            </motion.div>
            <Dialog open={chartDialogOpen} onOpenChange={setChartDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <BarChart className="w-4 h-4" />
                    <span className="hidden sm:inline">Chart</span>
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Chart</DialogTitle>
                  <DialogDescription>
                    Configure your chart settings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
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
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chart-data">Chart Data (CSV format)</Label>
                    <textarea
                      id="chart-data"
                      value={chartData}
                      onChange={(e) => setChartData(e.target.value)}
                      className="w-full min-h-25 p-2 border rounded-md"
                      placeholder="Labels: Jan,Feb,Mar&#10;Values: 10,20,15"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setChartDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddChart}>
                    Add Chart
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Main Add Elements Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="default" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Elements
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 max-h-[80vh] overflow-y-auto">
              <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Text Elements</span>
                <FontIcon className="w-3 h-3" />
              </DropdownMenuLabel>
              <div className="grid grid-cols-2 gap-1 p-2">
                <DropdownMenuItem onClick={() => handleAddText("title")} className="flex-col gap-2 h-auto py-3">
                  <Heading1 className="w-6 h-6" />
                  <span className="text-xs">Title</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddText("heading1")} className="flex-col gap-2 h-auto py-3">
                  <Heading1 className="w-6 h-6" />
                  <span className="text-xs">Heading 1</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddText("heading2")} className="flex-col gap-2 h-auto py-3">
                  <Heading2 className="w-6 h-6" />
                  <span className="text-xs">Heading 2</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddText("body")} className="flex-col gap-2 h-auto py-3">
                  <Type className="w-6 h-6" />
                  <span className="text-xs">Body Text</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddText("quote")} className="flex-col gap-2 h-auto py-3">
                  <Quote className="w-6 h-6" />
                  <span className="text-xs">Quote</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddText("code")} className="flex-col gap-2 h-auto py-3">
                  <Code className="w-6 h-6" />
                  <span className="text-xs">Code Block</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Lists</span>
                <List className="w-3 h-3" />
              </DropdownMenuLabel>
              <div className="grid grid-cols-3 gap-1 p-2">
                <DropdownMenuItem onClick={() => handleAddList("ordered")} className="flex-col gap-2 h-auto py-3">
                  <span className="text-lg">1.</span>
                  <span className="text-xs">Numbered</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddList("unordered")} className="flex-col gap-2 h-auto py-3">
                  <span className="text-lg">•</span>
                  <span className="text-xs">Bulleted</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddList("checklist")} className="flex-col gap-2 h-auto py-3">
                  <span className="text-lg">☐</span>
                  <span className="text-xs">Checklist</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Media</span>
                <Image className="w-3 h-3" />
              </DropdownMenuLabel>
              <div className="grid grid-cols-3 gap-1 p-2">
                <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-col gap-2 h-auto py-3">
                      <Image className="w-6 h-6" />
                      <span className="text-xs">Image</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-col gap-2 h-auto py-3">
                      <Video className="w-6 h-6" />
                      <span className="text-xs">Video</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-col gap-2 h-auto py-3">
                      <Music className="w-6 h-6" />
                      <span className="text-xs">Audio</span>
                    </DropdownMenuItem>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right">
                    <DropdownMenuItem onClick={() => handleAddMedia("audio")}>
                      <Music className="w-4 h-4 mr-2" />
                      Audio Player
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddMedia("podcast")}>
                      <Mic className="w-4 h-4 mr-2" />
                      Podcast
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Shapes & Icons</span>
                <Square className="w-3 h-3" />
              </DropdownMenuLabel>
              <div className="grid grid-cols-3 gap-1 p-2">
                <DropdownMenuItem onClick={() => handleAddShape("square")} className="flex-col gap-2 h-auto py-3">
                  <Square className="w-6 h-6" />
                  <span className="text-xs">Square</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddShape("circle")} className="flex-col gap-2 h-auto py-3">
                  <Circle className="w-6 h-6" />
                  <span className="text-xs">Circle</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddShape("heart")} className="flex-col gap-2 h-auto py-3">
                  <Heart className="w-6 h-6" />
                  <span className="text-xs">Heart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddIcon("star")} className="flex-col gap-2 h-auto py-3">
                  <Star className="w-6 h-6" />
                  <span className="text-xs">Star Icon</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddIcon("sparkles")} className="flex-col gap-2 h-auto py-3">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-xs">Sparkles</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddIcon("zap")} className="flex-col gap-2 h-auto py-3">
                  <Zap className="w-6 h-6" />
                  <span className="text-xs">Zap</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Data & Tables</span>
                <Table2 className="w-3 h-3" />
              </DropdownMenuLabel>
              <div className="grid grid-cols-2 gap-1 p-2">
                <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-col gap-2 h-auto py-3">
                      <Table className="w-6 h-6" />
                      <span className="text-xs">Table</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={chartDialogOpen} onOpenChange={setChartDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-col gap-2 h-auto py-3">
                      <BarChart className="w-6 h-6" />
                      <span className="text-xs">Chart</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </Dialog>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Layouts</span>
                <Grid className="w-3 h-3" />
              </DropdownMenuLabel>
              <div className="grid grid-cols-2 gap-1 p-2">
                <DropdownMenuItem onClick={() => handleAddLayout("two-columns")} className="flex-col gap-2 h-auto py-3">
                  <Columns className="w-6 h-6" />
                  <span className="text-xs">Two Columns</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddLayout("three-columns")} className="flex-col gap-2 h-auto py-3">
                  <Layers className="w-6 h-6" />
                  <span className="text-xs">Three Columns</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddLayout("header-content")} className="flex-col gap-2 h-auto py-3 col-span-2">
                  <PanelTop className="w-6 h-6" />
                  <span className="text-xs">Header-Content-Footer</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-3">
                    <Link2 className="w-4 h-4" />
                    <span>Link</span>
                  </DropdownMenuItem>
                </DialogTrigger>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Table Dialog */}
          <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Table</DialogTitle>
                <DialogDescription>
                  Configure your table dimensions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="table-rows">Rows: {tableRows}</Label>
                    <Slider
                      id="table-rows"
                      min={1}
                      max={10}
                      step={1}
                      value={[tableRows]}
                      onValueChange={(value) => setTableRows(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="table-columns">Columns: {tableColumns}</Label>
                    <Slider
                      id="table-columns"
                      min={1}
                      max={8}
                      step={1}
                      value={[tableColumns]}
                      onValueChange={(value) => setTableColumns(value[0])}
                    />
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-2">Preview:</div>
                  <div className="inline-block border">
                    {Array(tableRows)
                      .fill(null)
                      .map((_, rowIndex) => (
                        <div key={rowIndex} className="flex">
                          {Array(tableColumns)
                            .fill(null)
                            .map((_, colIndex) => (
                              <div
                                key={colIndex}
                                className="w-16 h-8 border flex items-center justify-center text-xs"
                              >
                                {rowIndex + 1}-{colIndex + 1}
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setTableDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTable}>
                  Add Table
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Video Dialog */}
          <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Video</DialogTitle>
                <DialogDescription>
                  Enter video URL (YouTube, Vimeo, etc.)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="video-url">Video URL</Label>
                  <Input
                    id="video-url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setVideoDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddVideo} disabled={!videoUrl}>
                  Add Video
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Link Dialog */}
          <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Link</DialogTitle>
                <DialogDescription>
                  Enter link text and URL
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="link-text">Link Text</Label>
                  <Input
                    id="link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Click here"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setLinkDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddLink}
                  disabled={!linkUrl || !linkText}
                >
                  Add Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Text Formatting Tools */}
          {selectedElement && selectedElement.type === "text" && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant={
                        selectedElement.style?.fontWeight === "bold"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleTextStyle(
                          "fontWeight",
                          selectedElement.style?.fontWeight === "bold"
                            ? "normal"
                            : "bold",
                        )
                      }
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant={
                        selectedElement.style?.fontStyle === "italic"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleTextStyle(
                          "fontStyle",
                          selectedElement.style?.fontStyle === "italic"
                            ? "normal"
                            : "italic",
                        )
                      }
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant={
                        selectedElement.style?.textDecoration === "underline"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleTextStyle(
                          "textDecoration",
                          selectedElement.style?.textDecoration === "underline"
                            ? "none"
                            : "underline",
                        )
                      }
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>

                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant={
                        selectedElement.style?.textAlign === "left"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleTextStyle("textAlign", "left")}
                      title="Align left"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant={
                        selectedElement.style?.textAlign === "center"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleTextStyle("textAlign", "center")}
                      title="Align center"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant={
                        selectedElement.style?.textAlign === "right"
                          ? "default"
                          : "ghost"
                      }
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleTextStyle("textAlign", "right")}
                      title="Align right"
                    >
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>

                {/* Font Size Control */}
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Size:</span>
                  <Select
                    value={selectedElement.style?.fontSize?.toString() || "24"}
                    onValueChange={(value) => handleTextStyle("fontSize", parseInt(value))}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Family Control */}
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Font:</span>
                  <Select
                    value={selectedElement.style?.fontFamily || "Arial"}
                    onValueChange={(value) => handleTextStyle("fontFamily", value)}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Tahoma">Tahoma</SelectItem>
                      <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                      <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                      <SelectItem value="Impact">Impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}