import { expect, test, describe } from 'vitest';
import { cn } from '$lib/utils';

describe('cn', () => {
	test('should merge class names correctly', () => {
		expect(cn('foo', 'bar')).toBe('foo bar');
	});

	test('should handle conditional classes', () => {
		expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
	});

	test('should merge tailwind classes', () => {
		expect(cn('p-4 bg-red-500', 'p-8')).toBe('bg-red-500 p-8');
	});

	test('should handle null and undefined', () => {
		expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
	});

	test('should handle empty strings', () => {
		expect(cn('', 'foo', '')).toBe('foo');
	});
});
