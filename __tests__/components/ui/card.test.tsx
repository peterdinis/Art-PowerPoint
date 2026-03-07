import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import React from 'react';

afterEach(() => {
    cleanup();
});

describe('Card Component Stack', () => {
    it('renders the complete card structure correctly', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <button>Footer Button</button>
                </CardFooter>
            </Card>
        );

        expect(screen.getByText('Card Title')).toBeTruthy();
        expect(screen.getByText('Card Description')).toBeTruthy();
        expect(screen.getByText('Card Content')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Footer Button' })).toBeTruthy();
    });

    it('applies custom classNames correctly', () => {
        const { container } = render(<Card className="custom-card" />);
        expect((container.firstChild as HTMLElement).classList.contains('custom-card')).toBe(true);
    });

    it('renders CardHeader with correct styles', () => {
        render(<CardHeader>Header</CardHeader>);
        const header = screen.getByText('Header');
        expect(header.className).toContain('p-6');
    });

    it('renders CardTitle as an h3 by default', () => {
        render(<CardTitle>Title</CardTitle>);
        const title = screen.getByText('Title');
        expect(title.tagName).toBe('H3');
    });
});
