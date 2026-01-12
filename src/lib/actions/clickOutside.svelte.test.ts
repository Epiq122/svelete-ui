// @vitest-environment jsdom

import { clickOutside } from './clickOutside.svelte';
import { describe, it, expect, vi } from 'vitest';

describe('clickOutside action', () => {
	it('should call handler when clicking outside element', () => {
		const element = document.createElement('div');
		document.body.appendChild(element);

		const handler = vi.fn();
		element.addEventListener('clickoutside', handler);

		const action = clickOutside(element);

		const outsideClick = new PointerEvent('pointerdown', {
			bubbles: true,
			composed: true
		});
		document.body.dispatchEvent(outsideClick);

		expect(handler).toHaveBeenCalled();

		action?.destroy?.();
		element.remove();
	});

	it('should NOT call handler when clicking inside element', () => {
		const element = document.createElement('div');
		document.body.appendChild(element);

		const handler = vi.fn();
		element.addEventListener('clickoutside', handler);

		const action = clickOutside(element);

		const insideClick = new PointerEvent('pointerdown', {
			bubbles: true,
			composed: true
		});
		element.dispatchEvent(insideClick);

		expect(handler).not.toHaveBeenCalled();
		action?.destroy?.();
		element.remove();
	});

	it('should cleanup event listener on destory', () => {
		const element = document.createElement('div');
		document.body.appendChild(element);

		const action = clickOutside(element);
		const spy = vi.spyOn(document, 'removeEventListener');

		action?.destroy?.();

		expect(spy).toHaveBeenCalledWith('pointerdown', expect.any(Function), true);

		element.remove();
		spy.mockRestore();
	});
});
