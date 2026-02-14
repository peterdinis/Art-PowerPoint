"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Globe, Mail } from "lucide-react";
import { toast } from "sonner";
import { usePresentationStore } from "@/lib/store/presentationStore";

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
    const { currentPresentation } = usePresentationStore();
    const [isPublic, setIsPublic] = useState(false);
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState("");

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/presentation/${currentPresentation?.id}`
        : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInvite = () => {
        if (email.trim()) {
            toast.success(`Invitation sent to ${email}`);
            setEmail("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Presentation</DialogTitle>
                    <DialogDescription>
                        Share your presentation with others or publish it to the web.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="link" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="link">Public Link</TabsTrigger>
                        <TabsTrigger value="invite">Invite</TabsTrigger>
                    </TabsList>

                    <TabsContent value="link" className="space-y-4 py-4">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="public-mode" className="font-medium">
                                    Public Access
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    Anyone with the link can view
                                </span>
                            </div>
                            <Switch
                                id="public-mode"
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">
                                    Link
                                </Label>
                                <Input
                                    id="link"
                                    defaultValue={shareUrl}
                                    readOnly
                                    className="h-9"
                                />
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                className="px-3"
                                onClick={handleCopy}
                                disabled={!isPublic}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                                <span className="sr-only">Copy</span>
                            </Button>
                        </div>

                        {!isPublic && (
                            <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                                <Globe className="mr-1 inline h-3 w-3" />
                                Enable public access to share this link.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="invite" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="colleague@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button type="button" onClick={handleInvite}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Invite
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
