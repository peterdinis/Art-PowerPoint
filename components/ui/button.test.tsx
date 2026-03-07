import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';
import * as React from 'react';

describe('Button', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeTruthy();
        expect(button.className).toContain('bg-primary');
    });

    it('applies variant classes correctly', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button', { name: /delete/i });
        expect(button.className).toContain('bg-destructive');
    });

    it('applies size classes correctly', () => {
        render(<Button size="lg">Large Button</Button>);
        const button = screen.getByRole('button', { name: /large button/i });
        expect(button.className).toContain('h-11');
    });

    it('forwards refs correctly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Button ref={ref}>Ref Button</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('handles onClick events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        button.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders as a different element when asChild is true', () => {
        render(<Button asChild><a href="/test">Link Button</a></Button>);
        const link = screen.getByRole('link', { name: /link button/i });
        expect(link).toBeTruthy();
        expect(link.getAttribute('href')).toBe('/test');
        expect(link.className).toContain('inline-flex'); // Should inherit button styles
    });
});
