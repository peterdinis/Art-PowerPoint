import { describe, it, expect } from 'vitest';
import { rotateSize } from '@/lib/utils/imageUtils';

describe('imageUtils', () => {
    describe('rotateSize', () => {
        it('should return same size for 0 degree rotation', () => {
            const { width, height } = rotateSize(100, 50, 0);
            expect(width).toBeCloseTo(100);
            expect(height).toBeCloseTo(50);
        });

        it('should swap width and height for 90 degree rotation', () => {
            const { width, height } = rotateSize(100, 50, 90);
            expect(width).toBeCloseTo(50);
            expect(height).toBeCloseTo(100);
        });

        it('should return same size for 180 degree rotation', () => {
            const { width, height } = rotateSize(100, 50, 180);
            expect(width).toBeCloseTo(100);
            expect(height).toBeCloseTo(50);
        });

        it('should calculate correct size for 45 degree rotation', () => {
            const { width, height } = rotateSize(100, 100, 45);
            // diagonal of 100x100 is 100 * sqrt(2) ≈ 141.42
            const expected = 100 * Math.sqrt(2);
            expect(width).toBeCloseTo(expected);
            expect(height).toBeCloseTo(expected);
        });
    });
});
