module.exports = {
	apps: [
		{
			name: 'connected-brain-front-end',
			script: 'npm run start',  // Assuming corrected package.json script
			cwd: '/home/brainx/local/src/connected-brain-monorepo/apps/web', // Change to your web app directory
			watch: [
				'src',  // Example, adjust as needed
				'public',
			],
			out_file: "./front-end-out.log",
			error_file: "./front-end-error.log",
			log_date_format: "DD-MM HH:mm:ss Z",
			env: {
				NODE_ENV: 'development',
				PORT: 3000
			},
			env_production: {
				NODE_ENV: 'production',
				PORT: 3000
			},
		},
		{
			name: 'connected-brain-back-end',
			script: 'npm run start',  // Use the package.json start script
			watch: [
				'src', // Watch your source code for changes
			],
			cwd: '/home/brainx/local/src/connected-brain-monorepo/apps/server', // Change to your server app directory
			out_file: "./back-end-out.log",
			error_file: "./back-end-error.log",
			log_date_format: "DD-MM HH:mm:ss Z",
			env: {
				NODE_ENV: 'development',
				PORT: 3001
			},
			env_production: {
				NODE_ENV: 'production',
				PORT: 3001
			},
		}
	],
};