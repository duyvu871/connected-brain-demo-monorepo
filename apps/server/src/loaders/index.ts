import {Express} from 'express';
import ExpressLoader from "@/loaders/express.loader";
import MiddlewareLoader from "@/loaders/middleware.loader";
import mongoLoader from '@/loaders/mongo.loader';
import { LoadSocket } from '@/loaders/socket.loader';
import { Server } from 'socket.io';

export default async function createLoader({expressApp, io}: {expressApp: Express, io: Server}) {
    MiddlewareLoader({app: expressApp});
    ExpressLoader({app: expressApp});
    await mongoLoader();
    LoadSocket({io});
}