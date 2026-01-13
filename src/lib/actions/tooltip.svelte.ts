import type { Action } from 'svelte/action';
import tippy, { type Instance, type Props } from 'tippy.js';

export type TooltipParams = {
	content: string;
	placement?: Props['placement'];
};

export const tooltip: Action<HTMLHtmlElement, TooltipParams> = (node, params) => {
	let instance: Instance | null = null;

	function setup(p: TooltipParams) {
		instance?.destroy();

		instance = tippy(node, {
			content: p.content,
			placement: p.placement ?? 'top'
		});
	}

  setup(params);

  return {
    update(next) {
      setup(next);
    },
    destory() {
      instance?.destroy();
    }
  }
};
