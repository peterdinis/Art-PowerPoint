import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';
import React from 'react';

// Mock the useTheme hook or the ThemeProvider state
// Since ThemeToggle uses useTheme from ThemeProvider, let's mock the Provider or the hook.
// Actually, it's easier to mock the hook.

vi.mock('@/components/ThemeProvider', async () => {
    const actual = await vi.importActual('@/components/ThemeProvider');
    return {
        ...actual,
        useTheme: () => ({
            theme: 'light',
            setTheme: vi.fn(),
        }),
    };
});

// Since DropdownMenu uses Radix UI which might need some portal/container mocking in jsdom,
// let's see if it works directly with RTL.

describe('ThemeToggle', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the toggle button', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeTruthy();
    });

    // Note: Testing Radix Dropdown internal menu items often requires more setup 
    // because they render in portals. For now, we verify the trigger button.
    // If we want to test clicking items, we might need to mock PointerEvent or similar.
});
