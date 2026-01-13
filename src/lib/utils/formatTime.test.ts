/*! 🌼 daisyUI 5.5.14 */
import { describe, it, expect } from 'vitest';
import { formatTime } from './formatTime';

describe('formatTime', () => {
	it('should format seconds correctly', () => {
		expect(formatTime(0)).toBe('0:00');
		expect(formatTime(30)).toBe('0:30');
		expect(formatTime(90)).toBe('1:30');
		expect(formatTime(3661)).toBe('61:01');
	});

	it('should handle edge cases', () => {
		expect(formatTime(NaN)).toBe('0:00');
		expect(formatTime(Infinity)).toBe('0:00');
		expect(formatTime(-10)).toBe('0:00');
	});
});
