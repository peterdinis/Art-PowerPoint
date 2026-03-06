"use client";

import { useState, useRef } from "react";
import { usePresentationStore } from "@/store/presentationStore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePond, registerPlugin } from "react-filepond";
import type { FilePondFile } from "filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {
    createImageElement,
    createVideoElement,
    createTableElement,
    createChartElement,
    createTextElement,
    createIconElement,
    createCodeElement
} from "@/lib/utils/elementFactory";
import {
    Search,
    Type,
    Image as ImageIcon,
    Video as VideoIcon,
    Table2,
    PieChart,
    Shapes,
    Link as LinkIcon,
    Smile
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AdvancedChartDialog from "@/components/editor/AdvancedChartDialog";

interface ToolbarDialogsProps {
    activeDialog: string | null;
    onClose: () => void;
}

export function ToolbarDialogs({ activeDialog, onClose }: ToolbarDialogsProps) {
    const { addElement } = usePresentationStore();
    const [keepOpen, setKeepOpen] = useState(false);

    // Image Dialog State
    const [imageUrl, setImageUrl] = useState("");

    // Video Dialog State
    const [videoUrl, setVideoUrl] = useState("");

    // Table Dialog State
    const [tableRows, setTableRows] = useState(3);
    const [tableColumns, setTableColumns] = useState(3);

    // Code Dialog State
    const [codeLanguage, setCodeLanguage] = useState("javascript");
    const [codeContent, setCodeContent] = useState("// Write your code here...");

    const maybeClose = () => {
        if (!keepOpen) onClose();
    };

    const handleAddImage = (url?: string) => {
        const finalUrl = url || imageUrl;
        if (finalUrl) {
            addElement(createImageElement(finalUrl));
            setImageUrl("");
            maybeClose();
        }
    };

    const handleImageUploadComplete = (file: FilePondFile) => {
        if (file && file.getFileEncodeDataURL) {
            const base64 = file.getFileEncodeDataURL();
            if (base64) {
                handleAddImage(base64);
            }
        }
    };

    const handleAddVideo = () => {
        if (videoUrl) {
            addElement(createVideoElement(videoUrl));
            setVideoUrl("");
            maybeClose();
        }
    };

    const handleAddTable = () => {
        addElement(createTableElement(tableRows, tableColumns));
        maybeClose();
    };

    const handleAddCode = () => {
        addElement(createCodeElement(codeLanguage, { content: codeContent } as any));
        maybeClose();
    };

    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");
    const [iconSearch, setIconSearch] = useState("");

    const handleAddLink = () => {
        if (linkUrl && linkText) {
            addElement({
                ...createTextElement("subtitle"), // Use a subtitle base
                content: linkText,
                style: {
                    fontSize: 18,
                    color: "#2563eb",
                    textDecoration: "underline",
                }
            });
            setLinkUrl("");
            setLinkText("");
            maybeClose();
        }
    };

    const handleAddIcon = (iconName: string) => {
        addElement(createIconElement(iconName));
        maybeClose();
    };

    const KeepOpenToggle = () => (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Label htmlFor="keep-open" className="text-xs text-muted-foreground cursor-pointer">
                Keep dialog open after adding
            </Label>
            <Switch
                id="keep-open"
                checked={keepOpen}
                onCheckedChange={setKeepOpen}
            />
        </div>
    );

    return (
        <>
            {/* ... previous dialogs ... */}

            {/* Link Dialog */}
            <Dialog open={activeDialog === "link"} onOpenChange={(open) => !open && onClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Link</DialogTitle>
                        <DialogDescription>Create a hyperlinked text element</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="linkText">Display Text</Label>
                            <Input
                                id="linkText"
                                placeholder="Click here"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkUrl">URL</Label>
                            <Input
                                id="linkUrl"
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAddLink} className="w-full">
                            Add Link
                        </Button>
                        <KeepOpenToggle />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Icon Dialog */}
            <Dialog open={activeDialog === "icon"} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add Icon</DialogTitle>
                        <DialogDescription>Search and select an icon</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search icons..."
                                className="pl-9"
                                value={iconSearch}
                                onChange={(e) => setIconSearch(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-6 gap-4 max-h-[300px] overflow-y-auto p-2">
                            {/* Example icons, in real app we'd map over lucide icons */}
                            {["Star", "Heart", "Clock", "Bell", "Settings", "User", "Home", "Search", "Mail", "Phone", "Camera", "Music"].map((iconName) => (
                                <Button
                                    key={iconName}
                                    variant="outline"
                                    className="h-16 flex flex-col items-center justify-center gap-1"
                                    onClick={() => handleAddIcon(iconName)}
                                >
                                    <div className="w-6 h-6 bg-muted-foreground/20 rounded-md" />
                                    <span className="text-[10px]">{iconName}</span>
                                </Button>
                            ))}
                        </div>
                        <KeepOpenToggle />
                    </div>
                </DialogContent>
            </Dialog>
            {/* Image Dialog */}
            <Dialog open={activeDialog === "image"} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add Image</DialogTitle>
                        <DialogDescription>Upload an image or paste a URL</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="upload">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload">Upload</TabsTrigger>
                            <TabsTrigger value="url">URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="py-4">
                            <FilePond
                                onprocessfile={(_, file) => handleImageUploadComplete(file)}
                                allowMultiple={false}
                                name="files"
                                labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                                acceptedFileTypes={["image/*"]}
                            />
                        </TabsContent>
                        <TabsContent value="url" className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </div>
                            <Button onClick={() => handleAddImage()} className="w-full">
                                Add Image
                            </Button>
                        </TabsContent>
                    </Tabs>
                    <KeepOpenToggle />
                </DialogContent>
            </Dialog>

            {/* Video Dialog */}
            <Dialog open={activeDialog === "video"} onOpenChange={(open) => !open && onClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Video</DialogTitle>
                        <DialogDescription>Enter video URL (YouTube, Vimeo, etc.)</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="videoUrl">Video URL</Label>
                            <Input
                                id="videoUrl"
                                placeholder="https://youtube.com/..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAddVideo} className="w-full">
                            Add Video
                        </Button>
                        <KeepOpenToggle />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Table Dialog */}
            <Dialog open={activeDialog === "table"} onOpenChange={(open) => !open && onClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Table</DialogTitle>
                        <DialogDescription>Specify number of rows and columns</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rows">Rows</Label>
                            <Input
                                id="rows"
                                type="number"
                                value={tableRows}
                                onChange={(e) => setTableRows(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cols">Columns</Label>
                            <Input
                                id="cols"
                                type="number"
                                value={tableColumns}
                                onChange={(e) => setTableColumns(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <Button onClick={handleAddTable} className="w-full">
                        Add Table
                    </Button>
                    <KeepOpenToggle />
                </DialogContent>
            </Dialog>

            {/* Chart Dialog */}
            <AdvancedChartDialog
                open={activeDialog === "chart"}
                onOpenChange={(open) => !open && onClose()}
            />

            {/* Code Dialog */}
            <Dialog open={activeDialog === "code"} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add Code Block</DialogTitle>
                        <DialogDescription>Insert a syntax-highlighted code block</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="javascript">JavaScript</SelectItem>
                                    <SelectItem value="typescript">TypeScript</SelectItem>
                                    <SelectItem value="tsx">TSX</SelectItem>
                                    <SelectItem value="html">HTML</SelectItem>
                                    <SelectItem value="css">CSS</SelectItem>
                                    <SelectItem value="python">Python</SelectItem>
                                    <SelectItem value="rust">Rust</SelectItem>
                                    <SelectItem value="go">Go</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="codeContent">Code</Label>
                            <textarea
                                id="codeContent"
                                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={codeContent}
                                onChange={(e) => setCodeContent(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAddCode} className="w-full">
                            Add Code Block
                        </Button>
                        <KeepOpenToggle />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
