"use client";

import { useState, useEffect } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Globe, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { usePresentationStore } from "@/store/presentationStore";
import type { PermissionRole } from "@/types/presentation";

interface ShareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
	const { currentPresentation, updatePresentation } = usePresentationStore();
	const [isPublic, setIsPublic] = useState(false);
	const [publicRole, setPublicRole] = useState<PermissionRole>("viewer");
	const [copied, setCopied] = useState(false);
	const [email, setEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<PermissionRole>("viewer");

	useEffect(() => {
		if (currentPresentation) {
			setIsPublic(currentPresentation.visibility === "public");
			setPublicRole(currentPresentation.publicRole || "viewer");
		}
	}, [currentPresentation]);

	const shareUrl =
		typeof window !== "undefined"
			? `${window.location.origin}/presentation/${currentPresentation?.id}`
			: "";

	const handleCopy = () => {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		toast.success("Link copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	};

	const handleVisibilityChange = (checked: boolean) => {
		setIsPublic(checked);
		if (currentPresentation) {
			updatePresentation(currentPresentation.id, {
				visibility: checked ? "public" : "private",
				publicRole: publicRole,
			});
		}
	};

	const handlePublicRoleChange = (role: PermissionRole) => {
		setPublicRole(role);
		if (currentPresentation) {
			updatePresentation(currentPresentation.id, {
				publicRole: role,
			});
		}
	};

	const handleInvite = () => {
		if (email.trim() && currentPresentation) {
			const newPermission = {
				email: email.trim(),
				role: inviteRole,
			};

			const currentPermissions = currentPresentation.permissions || [];
			updatePresentation(currentPresentation.id, {
				permissions: [...currentPermissions, newPermission],
			});

			toast.success(`Invitation sent to ${email} as ${inviteRole}`);
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
									Anyone with the link can access
								</span>
							</div>
							<Switch
								id="public-mode"
								checked={isPublic}
								onCheckedChange={handleVisibilityChange}
							/>
						</div>

						{isPublic && (
							<div className="flex items-center justify-between space-x-2 p-3 rounded-md bg-muted/50">
								<div className="flex items-center gap-2">
									<Shield className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm font-medium">Public Role</span>
								</div>
								<Select
									value={publicRole}
									onValueChange={handlePublicRoleChange}
								>
									<SelectTrigger className="w-[120px] h-8">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="viewer">Viewer</SelectItem>
										<SelectItem value="editor">Editor</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}

						<div className="flex items-center space-x-2">
							<div className="grid flex-1 gap-2">
								<Label htmlFor="link" className="sr-only">
									Link
								</Label>
								<Input id="link" value={shareUrl} readOnly className="h-9" />
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
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email address</Label>
								<div className="flex gap-2">
									<Input
										type="email"
										id="email"
										placeholder="colleague@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="flex-1"
									/>
									<Select
										value={inviteRole}
										onValueChange={(v: PermissionRole) => setInviteRole(v)}
									>
										<SelectTrigger className="w-[110px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="viewer">Viewer</SelectItem>
											<SelectItem value="editor">Editor</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<Button type="button" onClick={handleInvite} className="w-full">
								<Mail className="h-4 w-4 mr-2" />
								Send Invitation
							</Button>
						</div>

						{currentPresentation?.permissions &&
							currentPresentation.permissions.length > 0 && (
								<div className="mt-4 space-y-2">
									<Label className="text-xs uppercase text-muted-foreground font-semibold">
										Shared with
									</Label>
									<div className="space-y-2 max-h-[120px] overflow-auto pr-1">
										{currentPresentation.permissions.map((p, i) => (
											<div
												key={i}
												className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30 border"
											>
												<span className="truncate flex-1 mr-2">{p.email}</span>
												<span className="text-xs bg-secondary px-2 py-0.5 rounded capitalize">
													{p.role}
												</span>
											</div>
										))}
									</div>
								</div>
							)}
					</TabsContent>
				</Tabs>

				<DialogFooter>
					<Button
						type="button"
						variant="secondary"
						onClick={() => onOpenChange(false)}
					>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
