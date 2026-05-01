"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "sonner";
import { Sparkles, Bell } from "lucide-react";

export default function NotificationManager() {
    const { notifications } = useSettingsStore();
    const [hasShownWelcome, setHasShownWelcome] = useState(false);

    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return;

        // Show welcome notification if system announcements are enabled
        if (notifications.systemAnnouncements && !hasShownWelcome) {
            const timer = setTimeout(() => {
                toast("Welcome to Art Powerpoint!", {
                    description: "You have system announcements enabled. We'll keep you posted on new features!",
                    icon: <Sparkles className="w-4 h-4 text-primary" />,
                    duration: 5000,
                });
                setHasShownWelcome(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notifications.systemAnnouncements, hasShownWelcome]);

    useEffect(() => {
        // Simulate collaboration updates if enabled
        if (notifications.collaborationUpdates) {
            const interval = setInterval(() => {
                // Only show 10% of the time to avoid being annoying
                if (Math.random() > 0.9) {
                    toast("Collaboration Update", {
                        description: "A shared presentation was recently updated.",
                        icon: <Bell className="w-4 h-4 text-primary" />,
                        duration: 3000,
                    });
                }
            }, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, [notifications.collaborationUpdates]);

    return null; // This component doesn't render anything visible
}
