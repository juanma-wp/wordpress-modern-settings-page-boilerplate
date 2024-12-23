/**
 * WordPress dependencies
 */
import { SnackbarList } from '@wordpress/components';

/**
 * External dependencies
 */
import { createEvent, createStore } from 'effector';
import { useStore } from 'effector-react';
import { createPortal } from 'react-dom';

/**
 * Internal dependencies
 */
import { nextId } from '../utils/nextId';

export const $notifications = createStore([]);

export const addNotice = createEvent();
export const removeNotice = createEvent();

$notifications.on(addNotice, (notifications, notification) => [
	...notifications,
	{
		id: nextId(),
		...notification,
	},
]);
$notifications.on(removeNotice, (notifications, id) =>
	notifications.filter((notification) => notification.id !== id)
);

export const Notifications = () => {
	return createPortal(<NotificationsBody />, document.body);
};

export const NotificationsBody = () => {
	const notifications = useStore($notifications);

	return <SnackbarList notices={notifications} onRemove={removeNotice} />;
};
