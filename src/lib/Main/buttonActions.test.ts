import { describe, expect, it, vi } from 'vitest';
import { dispatchButtonAction, resolveButtonAction, shouldShowInfoButton } from './buttonActions';

describe('button actions', () => {
	it('preserves the legacy icon and content actions', () => {
		expect(resolveButtonAction({}, 'icon')).toBe('more-info');
		expect(resolveButtonAction({}, 'content')).toBe('toggle');
		expect(resolveButtonAction({ more_info: false }, 'icon')).toBe('toggle');
	});

	it('uses an explicitly configured primary action in either area', () => {
		for (const action of ['toggle', 'more-info', 'none'] as const) {
			expect(resolveButtonAction({ tap_action: action }, 'icon')).toBe(action);
			expect(resolveButtonAction({ tap_action: action }, 'content')).toBe(action);
		}
	});

	it('shows the info button by default unless legacy more-info was disabled', () => {
		expect(shouldShowInfoButton({})).toBe(true);
		expect(shouldShowInfoButton({ more_info: false })).toBe(false);
		expect(shouldShowInfoButton({ more_info: false, show_info_button: true })).toBe(true);
		expect(shouldShowInfoButton({ show_info_button: false })).toBe(false);
	});

	it('dispatches exactly one configured action', async () => {
		const toggle = vi.fn();
		const moreInfo = vi.fn();

		await dispatchButtonAction('toggle', { toggle, moreInfo });
		expect(toggle).toHaveBeenCalledTimes(1);
		expect(moreInfo).not.toHaveBeenCalled();

		await dispatchButtonAction('more-info', { toggle, moreInfo });
		expect(toggle).toHaveBeenCalledTimes(1);
		expect(moreInfo).toHaveBeenCalledTimes(1);

		await dispatchButtonAction('none', { toggle, moreInfo });
		expect(toggle).toHaveBeenCalledTimes(1);
		expect(moreInfo).toHaveBeenCalledTimes(1);
	});
});
