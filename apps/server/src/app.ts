"use strict";
import express from 'express'
import Loaders from '@/loaders';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import * as console from "node:console";
import { loadEnv } from '@/configs/env';
import * as process from 'node:process';
import * as http from 'node:http';
import * as io from 'socket.io';

global.__basedir = __dirname;
global.__rootdir = path.resolve(__dirname, '../');

async function startServer() {
    const isProduction = process.env.NODE_ENV === 'production';
    const DOTENV = dotenv.config({
        path: path.resolve(__dirname, isProduction ? '../.env' : '../.env')
    }); // Load environment variables from .env file
    loadEnv(DOTENV.parsed);
    const listenPort = process.env.PORT;
    console.log(`listenPort: ${listenPort}`);
    console.log(`environment: ${process.env.NODE_ENV}`);

    const app = express();
    const httpServer = http.createServer(app);
    global.__io = new io.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        path: '/socket'
    });

    app.use(helmet({
        crossOriginResourcePolicy: false,
    })); // Secure your app by setting various HTTP headers

    await Loaders({ expressApp: app, io: global.__io, httpServer });

    // listen to port
    httpServer.listen(listenPort).on("listening", () => {
        console.log(`Server is running on http://localhost:${listenPort}`);
    });
}

startServer().then(() => console.log('server started')).catch((err) => console.error(err));