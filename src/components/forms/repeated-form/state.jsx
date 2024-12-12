/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import produce from 'immer';

/**
 * Internal dependencies
 */
import { backendRequest } from '../../../utils/backendRequest';
import { addNotice } from '../../Notifications';
import { nextId } from '../../../utils/nextId';

/* global MODERN_SETTINGS */

const initialFormData = MODERN_SETTINGS.repeated_form ?? {};

export const nameChanged = createEvent();
export const resetForm = createEvent();
export const resetItem = createEvent();
export const removeItem = createEvent();
export const addItem = createEvent();
export const changeItem = createEvent();

export const $name = createStore(initialFormData.name ?? '');
export const $items = createStore(initialFormData.items ?? []);

$name.on(nameChanged, (_, value) => value).reset(resetForm);

$items
	.on(addItem, (items) => [
		...items,
		{
			id: nextId(),
		},
	])
	.on(resetItem, (state, id) =>
		produce(state, (draft) => {
			const foundItem = draft.find((item) => item.id === id);
			if (!foundItem) {
				return draft;
			}

			foundItem.title = '';
			foundItem.description = '';
			foundItem.priority = '';

			return draft;
		})
	)
	.on(changeItem, (state, [id, key, value]) =>
		produce(state, (draft) => {
			const foundItem = draft.find((item) => item.id === id);
			if (foundItem) {
				foundItem[key] = value;
			}
			return draft;
		})
	)
	.on(removeItem, (state, id) =>
		produce(state, (draft) => draft.filter((item) => item.id !== id))
	)
	.reset(resetForm);

export const saveToServer = createEffect(({ name, items }) =>
	backendRequest({
		action: 'modern-settings/repeated_form-save',
		data: { name, items },
	})
);

export const doSave = createEvent();

sample({
	clock: doSave,
	source: combine($name, $items, (name, items) => ({
		name,
		items,
	})),
	target: saveToServer,
});

sample({
	clock: saveToServer.done,
	fn: () => ({ content: __('Repeated Form Saved.', 'wp-modern-settings-page-boilerplate') }),
	target: addNotice,
});
