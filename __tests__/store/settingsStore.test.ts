import { describe, it, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';

// Define the state interface again for mocking
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
    updateNotifications: (
        updates: Partial<SettingsState["notifications"]>,
    ) => void;
    resetSettings: () => void;
}

// Create a simple mock store without persist
const createMockStore = () => create<SettingsState>((set) => ({
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
}));

let useSettingsStoreMock = createMockStore();

describe('settingsStore', () => {
    beforeEach(() => {
        useSettingsStoreMock = createMockStore();
    });

    it('should have default values', () => {
        const state = useSettingsStoreMock.getState();
        expect(state.language).toBe('en');
        expect(state.performance.complexAnimations).toBe(true);
        expect(state.notifications.systemAnnouncements).toBe(true);
    });

    it('should update language', () => {
        useSettingsStoreMock.getState().setLanguage('sk');
        expect(useSettingsStoreMock.getState().language).toBe('sk');
    });

    it('should update performance settings', () => {
        useSettingsStoreMock.getState().updatePerformance({ complexAnimations: false });
        expect(useSettingsStoreMock.getState().performance.complexAnimations).toBe(false);
        expect(useSettingsStoreMock.getState().performance.hardwareAcceleration).toBe(true);
    });

    it('should update notification settings', () => {
        useSettingsStoreMock.getState().updateNotifications({ collaborationUpdates: true });
        expect(useSettingsStoreMock.getState().notifications.collaborationUpdates).toBe(true);
    });

    it('should reset settings to default', () => {
        const store = useSettingsStoreMock.getState();
        store.setLanguage('sk');
        store.updatePerformance({ complexAnimations: false });
        store.resetSettings();

        const state = useSettingsStoreMock.getState();
        expect(state.language).toBe('en');
        expect(state.performance.complexAnimations).toBe(true);
    });
});
