/**
 * External dependencies
 */
import $ from 'jquery';
import { createEffect, sample } from 'effector';

/**
 * Internal dependencies
 */
import { addNotice } from '../components/Notifications';

/* global ajaxurl, MODERN_SETTINGS */
/* @see https://developer.wordpress.org/reference/functions/wp_ajax/ */

export const backendRequest = createEffect(async ({ action, data }) => {
	try {
		const response = await $.ajax({
			url: ajaxurl,
			type: 'POST',
			data: {
				action,
				...data,
				_wpnonce: MODERN_SETTINGS.nonce,
			},
		});

		if (!response.success) {
			throw new Error(response.data?.error ?? response.data ?? 'Error');
		}

		return response.data;
	} catch (error) {
		throw new Error(error.message);
	}
});

sample({
	clock: backendRequest.failData,
	fn: (error) => ({
		status: 'error',
		content: error?.message ?? error ?? 'Error',
	}),
	target: addNotice,
});
