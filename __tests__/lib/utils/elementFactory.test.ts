import { describe, it, expect } from 'vitest';
import {
    createTextElement,
    createShapeElement,
    createTableElement,
} from '@/lib/utils/elementFactory';

describe('elementFactory', () => {
    describe('createTextElement', () => {
        it('should create a default text element', () => {
            const element = createTextElement();
            expect(element.type).toBe('text');
            expect(typeof element.id).toBe('string');
            expect(element.content).toBe('Add your text here...');
            expect(element.position).toEqual({ x: 100, y: 100 });
        });

        it('should create a title text element', () => {
            const element = createTextElement('title');
            expect(element.content).toBe('Presentation Title');
            expect(element.size).toEqual({ width: 800, height: 120 });
            expect(element.style?.fontSize).toBe(64);
            expect(element.style?.fontWeight).toBe('bold');
        });

        it('should apply custom options', () => {
            const element = createTextElement('body', {
                position: { x: 50, y: 50 },
                textColor: '#ff0000'
            });
            expect(element.position).toEqual({ x: 50, y: 50 });
            expect(element.style?.color).toBe('#ff0000');
        });
    });

    describe('createShapeElement', () => {
        it('should create a square shape element', () => {
            const element = createShapeElement('square');
            expect(element.type).toBe('shape');
            expect(element.content).toBe('square');
            expect(element.size).toEqual({ width: 200, height: 200 });
            expect(element.style?.backgroundColor).toBe('#3b82f6');
        });

        it('should create a circle shape element', () => {
            const element = createShapeElement('circle');
            expect(element.type).toBe('shape');
            expect(element.content).toBe('circle');
            expect(element.size).toEqual({ width: 200, height: 200 });
            expect(element.style?.backgroundColor).toBe('#10b981');
        });
    });

    describe('createTableElement', () => {
        it('should create a table element with default rows and cols', () => {
            const element = createTableElement();
            expect(element.type).toBe('table');
            expect(element.style?.rows).toBe(3);
            expect(element.style?.cols).toBe(3);
            expect(element.style?.tableData).toHaveLength(3);
            expect(element.style?.tableData?.[0]).toHaveLength(3);
        });

        it('should create a table element with specific rows and cols', () => {
            const element = createTableElement(4, 5);
            expect(element.style?.rows).toBe(4);
            expect(element.style?.cols).toBe(5);
            expect(element.style?.tableData).toHaveLength(4);
            expect(element.style?.tableData?.[0]).toHaveLength(5);
        });
    });
});
