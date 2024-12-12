/**
 * External dependencies
 */
import React, { useEffect } from 'react';
/**
 * Internal dependencies
 */
import { initLogger, stopLogger } from './utils/logger';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import './styles/styles.css';

export const App = () => {
	useEffect(() => {
		// Start logging when app mounts
		initLogger({
			name: 'WP Settings App',
		});

		// Clean up logging when app unmounts
		return () => {
			stopLogger();
		};
	}, []);

	return (
		<Layout
			title={__('Modern Settings 🚀', 'wp-modern-settings-page-boilerplate')}
			tabs={[
				{ name: 'home', title: __('Home', 'wp-modern-settings-page-boilerplate') },
				{
					name: 'settings',
					title: __('Settings', 'wp-modern-settings-page-boilerplate'),
				},
				{
					name: 'help',
					title: __('Help', 'wp-modern-settings-page-boilerplate'),
				},
			]}
		>
			{({ selectedTab }) => (
				<>
					{selectedTab === 'home' && <Home />}
					{selectedTab === 'settings' && <Settings />}
				</>
			)}
		</Layout>
	);
};
