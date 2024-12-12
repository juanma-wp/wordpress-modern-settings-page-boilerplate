<?php

namespace ModernSettingsPageBoilerplate;

define( 'NONCE_ACTION', 'wp-modern-settings-page-boilerplate' );

add_filter( 'modern_settings_variables', __NAMESPACE__ . '\\add_variable_to_frontend' );

/**
 * Adds the nonce to the frontend JavaScript variables.
 * 
 * This function hooks into the 'modern_settings_variables' filter and adds
 * a nonce value that will be used for AJAX requests. The nonce helps secure
 * AJAX calls by verifying the request came from an authorized source.
 *
 * @param array $variables The existing variables array to filter
 * @return array The variables array with nonce added
 */

function add_variable_to_frontend( $variables ) {
	$variables['nonce'] = wp_create_nonce( NONCE_ACTION );

	return $variables;
}
/**
 * Registers an AJAX method with WordPress.
 *
 * @param string   $action The AJAX action name to register.
 * @param callable $method The callback function to execute when the AJAX action is called.
 *
 * The callback function will:
 * - Verify the nonce for security
 * - Execute the provided method
 * - Return success response with result data
 * - Return error response if an exception occurs
 */

function register_ajax_method( $action, $method ) {
	add_action(
		'wp_ajax_' . $action,
		function() use ( $method ) {
			if ( ! isset( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_key( $_REQUEST['_wpnonce'] ), NONCE_ACTION ) ) {
				die( esc_html__( 'Security check', 'wp-modern-settings-page-boilerplate' ) );
			}

			try {
				$result = call_user_func_array( $method, [] );
				wp_send_json_success( $result );
			} catch ( \Exception $e ) {
				wp_send_json_error(
					[
						'error' => $e->getMessage(),
					]
				);
			}
		}
	);
}
