import type { Action } from 'svelte/action';

export type ClickOutsideEvents = {
	onclickoutside: (e: CustomEvent<{ originalEvent: PointerEvent }>) => void;
};

export const clickOutside: Action<HTMLElement, undefined, ClickOutsideEvents> = (node) => {
	function onPointerDown(e: PointerEvent) {
		if (!e.composedPath().includes(node)) {
			node.dispatchEvent(
				new CustomEvent('clickoutside', {
					detail: { originalEvent: e }
				})
			);
		}
	}
	document.addEventListener('pointerdown', onPointerDown, true);

	return {
		destroy() {
			document.removeEventListener('pointerdown', onPointerDown, true);
		}
	};
};
