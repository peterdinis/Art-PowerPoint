```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSettingsStore } from '@/store/settingsStore';

// Mock localStorage for Zustand's persist middleware
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        key: (index: number) => Object.keys(store)[index] || null,
        length: 0,
    };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('settingsStore', () => {
    beforeEach(() => {
        useSettingsStore.getState().resetSettings();
    });

    it('should have default values', () => {
        const state = useSettingsStore.getState();
        expect(state.language).toBe('en');
        expect(state.performance.complexAnimations).toBe(true);
        expect(state.notifications.systemAnnouncements).toBe(true);
    });

    it('should update language', () => {
        useSettingsStore.getState().setLanguage('sk');
        expect(useSettingsStore.getState().language).toBe('sk');
    });

    it('should update performance settings', () => {
        useSettingsStore.getState().updatePerformance({ complexAnimations: false });
        expect(useSettingsStore.getState().performance.complexAnimations).toBe(false);
        expect(useSettingsStore.getState().performance.hardwareAcceleration).toBe(true);
    });

    it('should update notification settings', () => {
        useSettingsStore.getState().updateNotifications({ collaborationUpdates: true });
        expect(useSettingsStore.getState().notifications.collaborationUpdates).toBe(true);
    });

    it('should reset settings to default', () => {
        const store = useSettingsStore.getState();
        store.setLanguage('sk');
        store.updatePerformance({ complexAnimations: false });
        store.resetSettings();

        const state = useSettingsStore.getState();
        expect(state.language).toBe('en');
        expect(state.performance.complexAnimations).toBe(true);
    });
});
