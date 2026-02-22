"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	Strikethrough,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Link as LinkIcon,
	Unlink,
	Highlighter,
	Palette,
	Type,
	Heading1,
	Heading2,
	Heading3,
	Quote,
	Code,
	Minus,
	Undo,
	Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SlideNotesEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export function SlideNotesEditor({
	content,
	onChange,
	placeholder = "Add notes for this slide...",
}: SlideNotesEditorProps) {
	const [linkUrl, setLinkUrl] = useState("");
	const [linkOpen, setLinkOpen] = useState(false);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Underline,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Color,
			Highlight.configure({
				multicolor: true,
			}),
			Typography,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-primary underline underline-offset-2",
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content: content || "",
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) {
		return null;
	}

	const addLink = () => {
		if (linkUrl) {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: linkUrl })
				.run();
			setLinkOpen(false);
			setLinkUrl("");
		}
	};

	const removeLink = () => {
		editor.chain().focus().unsetLink().run();
		setLinkOpen(false);
	};

	const setColor = (color: string) => {
		editor.chain().focus().setColor(color).run();
	};

	const setHighlight = (color: string) => {
		editor.chain().focus().setHighlight({ color }).run();
	};

	const colors = [
		"#000000",
		"#ff0000",
		"#00ff00",
		"#0000ff",
		"#ffff00",
		"#ff00ff",
		"#00ffff",
		"#808080",
		"#800000",
		"#808000",
		"#008000",
		"#800080",
		"#008080",
		"#000080",
	];

	return (
		<div className="border rounded-md overflow-hidden">
			<div className="bg-muted/30 p-1 flex flex-wrap items-center gap-0.5 border-b">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
					title="Undo"
				>
					<Undo className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
					title="Redo"
				>
					<Redo className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" className="h-6 mx-1" />

				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 w-8", editor.isActive("bold") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleBold().run()}
					title="Bold"
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 w-8", editor.isActive("italic") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					title="Italic"
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 w-8", editor.isActive("underline") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					title="Underline"
				>
					<UnderlineIcon className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8",
						editor.isActive("strike") && "bg-accent",
					)}
					onClick={() => editor.chain().focus().toggleStrike().run()}
					title="Strikethrough"
				>
					<Strikethrough className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" className="h-6 mx-1" />

				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8",
						editor.isActive("heading", { level: 1 }) && "bg-accent",
					)}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					title="Heading 1"
				>
					<Heading1 className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8",
						editor.isActive("heading", { level: 2 }) && "bg-accent",
					)}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					title="Heading 2"
				>
					<Heading2 className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8",
						editor.isActive("heading", { level: 3 }) && "bg-accent",
					)}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					title="Heading 3"
				>
					<Heading3 className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" className="h-6 mx-1" />

				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 w-8", editor.isActive("bulletList") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					title="Bullet list"
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 w-8", editor.isActive("orderedList") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					title="Numbered list"
				>
					<ListOrdered className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" className="h-6 mx-1" />

				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8",
						editor.isActive({ textAlign: "left" }) && "bg-accent",
					)}
					onClick={() => editor.chain().focus().setTextAlign("left").run()}
					title="Align left"
				>
					<AlignLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8",
						editor.isActive({ textAlign: "center" }) && "bg-accent",
					)}
					onClick={() => editor.chain().focus().setTextAlign("center").run()}
					title="Align center"
				>
					<AlignCenter className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8",
						editor.isActive({ textAlign: "right" }) && "bg-accent",
					)}
					onClick={() => editor.chain().focus().setTextAlign("right").run()}
					title="Align right"
				>
					<AlignRight className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" className="h-6 mx-1" />

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<Palette className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-64">
						<div className="space-y-3">
							<div>
								<Label className="text-xs">Text Color</Label>
								<div className="grid grid-cols-7 gap-1 mt-1">
									{colors.map((color) => (
										<button
											key={color}
											className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform"
											style={{ backgroundColor: color }}
											onClick={() => setColor(color)}
											title={color}
										/>
									))}
								</div>
							</div>
							<div>
								<Label className="text-xs">Highlight</Label>
								<div className="grid grid-cols-7 gap-1 mt-1">
									{colors.map((color) => (
										<button
											key={color}
											className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform"
											style={{ backgroundColor: color }}
											onClick={() => setHighlight(color)}
											title={color}
										/>
									))}
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 w-8", editor.isActive("highlight") && "bg-accent")}
					onClick={() => editor.chain().focus().unsetHighlight().run()}
					title="Remove highlight"
				>
					<Highlighter className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" className="h-6 mx-1" />

				<Popover open={linkOpen} onOpenChange={setLinkOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className={cn("h-8 w-8", editor.isActive("link") && "bg-accent")}
							title="Add link"
						>
							<LinkIcon className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80">
						<div className="space-y-3">
							<div className="space-y-1">
								<Label htmlFor="link-url">URL</Label>
								<Input
									id="link-url"
									value={linkUrl}
									onChange={(e) => setLinkUrl(e.target.value)}
									placeholder="https://example.com"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											addLink();
										}
									}}
								/>
							</div>
							<div className="flex justify-between">
								<Button size="sm" onClick={addLink}>
									Add Link
								</Button>
								{editor.isActive("link") && (
									<Button size="sm" variant="outline" onClick={removeLink}>
										<Unlink className="h-4 w-4 mr-2" />
										Remove
									</Button>
								)}
							</div>
						</div>
					</PopoverContent>
				</Popover>

				<Separator orientation="vertical" className="h-6 mx-1" />

				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 w-8", editor.isActive("blockquote") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					title="Quote"
				>
					<Quote className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 w-8", editor.isActive("codeBlock") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					title="Code block"
				>
					<Code className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
					title="Horizontal rule"
				>
					<Minus className="h-4 w-4" />
				</Button>
			</div>

			<EditorContent
				editor={editor}
				className="prose prose-sm max-w-none p-3 min-h-50 focus:outline-none [&_.tiptap]:outline-none"
			/>

			<div className="bg-muted/30 px-3 py-1 text-xs text-muted-foreground border-t flex justify-between items-center">
				<span>Rich text editor</span>
				<span className="font-mono">
					{editor.storage.characterCount?.words() || 0} words
				</span>
			</div>
		</div>
	);
}