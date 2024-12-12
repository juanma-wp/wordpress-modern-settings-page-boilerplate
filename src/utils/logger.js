/**
 * External dependencies
 */
import { attachLogger, configure } from 'effector-logger';

let loggerInstance = null;

export const initLogger = (options = {}) => {
	if (process.env.NODE_ENV === 'development') {
		loggerInstance = attachLogger({
			name: 'WP Settings',
			...options,
		});
	}
};

export const stopLogger = () => {
	if (loggerInstance) {
		loggerInstance();
		loggerInstance = null;
	}
};

export const hideFromLogger = (units) => {
	configure(units, { log: 'disabled' });
};

export const forceLog = (units) => {
	configure(units, { log: 'enabled' });
};
