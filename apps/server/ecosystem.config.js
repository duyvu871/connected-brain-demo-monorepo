module.exports = {
    apps: [
        {
            name: 'connected-brain-back-end',
            script: 'npm run start',
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
        },
        // {
        //     name: 'connected-brain-api-worker',
        //     script: './dist/worker.js',
        //     out_file: "./worker-out.log",
        //     error_file: "./worker-error.log",
        //     log_date_format: "DD-MM HH:mm:ss Z",
        //     env: {
        //         NODE_ENV: 'development',
        //         PORT: 3002
        //     },
        //     env_production: {
        //         NODE_ENV: 'production',
        //         PORT: 3002
        //     },
        // }
    ],
}