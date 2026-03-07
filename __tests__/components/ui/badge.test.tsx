import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { Badge } from '@/components/ui/badge';
import React from 'react';

afterEach(() => {
    cleanup();
});

describe('Badge', () => {
    it('renders correctly with default props', () => {
        render(<Badge>Default Badge</Badge>);
        const badge = screen.getByText('Default Badge');
        expect(badge).toBeTruthy();
        expect(badge.className).toContain('bg-primary');
    });

    it('applies secondary variant classes correctly', () => {
        render(<Badge variant="secondary">Secondary Badge</Badge>);
        const badge = screen.getByText('Secondary Badge');
        expect(badge.className).toContain('bg-secondary');
    });

    it('applies destructive variant classes correctly', () => {
        render(<Badge variant="destructive">Destructive Badge</Badge>);
        const badge = screen.getByText('Destructive Badge');
        expect(badge.className).toContain('bg-destructive');
    });

    it('applies outline variant classes correctly', () => {
        render(<Badge variant="outline">Outline Badge</Badge>);
        const badge = screen.getByText('Outline Badge');
        expect(badge.className).toContain('text-foreground');
    });

    it('applies custom className correctly', () => {
        render(<Badge className="custom-class">Custom Badge</Badge>);
        const badge = screen.getByText('Custom Badge');
        expect(badge.className).toContain('custom-class');
    });
});
