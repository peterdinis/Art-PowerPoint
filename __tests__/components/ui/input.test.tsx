import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Input } from '@/components/ui/input';
import React from 'react';

afterEach(() => {
    cleanup();
});

describe('Input', () => {
    it('renders correctly', () => {
        render(<Input placeholder="Enter text" />);
        const input = screen.getByPlaceholderText('Enter text');
        expect(input).toBeTruthy();
        expect(input.tagName).toBe('INPUT');
    });

    it('handles onChange events', () => {
        const handleChange = vi.fn();
        render(<Input onChange={handleChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect((input as HTMLInputElement).value).toBe('new value');
    });

    it('is disabled when the disabled prop is passed', () => {
        render(<Input disabled />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    it('applies custom className correctly', () => {
        render(<Input className="custom-input" />);
        const input = screen.getByRole('textbox');
        expect(input.className).toContain('custom-input');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Input ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
});
