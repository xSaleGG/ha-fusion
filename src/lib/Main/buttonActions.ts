import type { ButtonAction } from '$lib/Types';

type ButtonActionItem = {
	tap_action?: ButtonAction;
	more_info?: boolean;
	show_info_button?: boolean;
};

export type ButtonActionArea = 'icon' | 'content';

export function resolveButtonAction(item: ButtonActionItem, area: ButtonActionArea): ButtonAction {
	if (item.tap_action) return item.tap_action;
	if (area === 'content' || item.more_info === false) return 'toggle';
	return 'more-info';
}

export function shouldShowInfoButton(item: ButtonActionItem): boolean {
	return item.show_info_button ?? item.more_info !== false;
}

export async function dispatchButtonAction(
	action: ButtonAction,
	callbacks: { toggle: () => void; moreInfo: () => void | Promise<void> }
): Promise<void> {
	if (action === 'toggle') {
		callbacks.toggle();
	} else if (action === 'more-info') {
		await callbacks.moreInfo();
	}
}
