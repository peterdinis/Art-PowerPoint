"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { usePresentationStore } from "@/lib/store/presentationStore";
import { formatDistanceToNow } from "date-fns";

interface HistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function HistoryDialog({ open, onOpenChange }: HistoryDialogProps) {
    const { currentPresentation } = usePresentationStore();

    const handleRestore = () => {
        toast.success("Version restored successfully");
        onOpenChange(false);
    };

    if (!currentPresentation) return null;

    // Mock history data based on current presentation
    const history = [
        {
            id: "current",
            date: new Date(currentPresentation.updatedAt),
            user: "You",
            action: "Edited",
            isCurrent: true,
        },
        {
            id: "created",
            date: new Date(currentPresentation.createdAt),
            user: "You",
            action: "Created",
            isCurrent: false,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Version History</DialogTitle>
                    <DialogDescription>
                        View and restore previous versions of this presentation.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                        {history.map((version, index) => (
                            <div
                                key={version.id}
                                className="flex items-start justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {version.date.toLocaleString()}
                                            {version.isCurrent && (
                                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-0.5">
                                            {version.action} by {version.user} •{" "}
                                            {formatDistanceToNow(version.date, { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                                {!version.isCurrent && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleRestore}
                                        title="Restore this version"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        <span className="sr-only">Restore</span>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
