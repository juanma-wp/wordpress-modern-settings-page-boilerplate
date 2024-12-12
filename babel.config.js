module.exports = {
	plugins: [
		[
			'effector/babel-plugin',
			{
				addLoc: process.env.NODE_ENV === 'development',
			},
		],
	],
};
