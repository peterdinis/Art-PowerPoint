import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "sk";

interface SettingsState {
    language: Language;
    performance: {
        complexAnimations: boolean;
        hardwareAcceleration: boolean;
    };
    notifications: {
        collaborationUpdates: boolean;
        systemAnnouncements: boolean;
    };

    // Actions
    setLanguage: (lang: Language) => void;
    updatePerformance: (updates: Partial<SettingsState["performance"]>) => void;
    updateNotifications: (updates: Partial<SettingsState["notifications"]>) => void;
    resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            language: "en",
            performance: {
                complexAnimations: true,
                hardwareAcceleration: true,
            },
            notifications: {
                collaborationUpdates: false,
                systemAnnouncements: true,
            },

            setLanguage: (language) => set({ language }),

            updatePerformance: (updates) =>
                set((state) => ({
                    performance: { ...state.performance, ...updates },
                })),

            updateNotifications: (updates) =>
                set((state) => ({
                    notifications: { ...state.notifications, ...updates },
                })),

            resetSettings: () =>
                set({
                    language: "en",
                    performance: {
                        complexAnimations: true,
                        hardwareAcceleration: true,
                    },
                    notifications: {
                        collaborationUpdates: false,
                        systemAnnouncements: true,
                    },
                }),
        }),
        {
            name: "presentation-builder-settings",
        },
    ),
);
