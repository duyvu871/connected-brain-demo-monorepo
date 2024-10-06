import {initRedis, getRedis} from "@/configs/database/redis"

initRedis();
const redis = getRedis();

const publisher = async (channel: string, data:string, callback: (err?: any, result?: number) => void) => {
	return redis.instanceRedis && await redis.instanceRedis.publish(channel, data, callback);
}

export default publisher;