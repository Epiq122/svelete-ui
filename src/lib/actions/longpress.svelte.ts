import type { Action } from 'svelte/action';

export type LongpressParams = {
	ms?: number;
};

export type LongpressEvents = {
	onlongpress: (e: CustomEvent<{ pointerType: string }>) => void;
};

export const longpress: Action<HTMLElement, LongpressParams, LongpressEvents> = (node, params) => {
	let timer: number | null = null;
	let ms = params?.ms ?? 600;

	function clear() {
		if (timer !== null) clearTimeout(timer);
		timer = null;
	}

	function start(e: PointerEvent) {
		clear();

		node.style.userSelect = 'none';

		timer = window.setTimeout(() => {
			node.dispatchEvent(
				new CustomEvent('longpress', {
					detail: {
						pointerType: e.pointerType
					}
				})
			);
			clear();
		}, ms);
	}
	function stop() {
		node.style.userSelect = '';
		clear();
	}

	node.addEventListener('pointerdown', start);
	node.addEventListener('pointerup', stop);
	node.addEventListener('pointercancel', stop);
	node.addEventListener('pointerleave', stop);

	return {
		update(next) {
			ms = next?.ms ?? 600;
		},
		destroy() {
			//  clean up all the listeners
			node.addEventListener('pointerdown', start);
			node.addEventListener('pointerup', stop);
			node.addEventListener('pointercancel', stop);
			node.addEventListener('pointerleave', stop);
		}
	};
};
