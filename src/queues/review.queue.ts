import {Queue} from 'bullmq';
import { RedisConnection } from '../connections/redis.connection';

export const reviewQueue=new Queue('reviewQueue',{
    connection:RedisConnection
});
