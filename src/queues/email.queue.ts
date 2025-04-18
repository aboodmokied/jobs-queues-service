import {Queue} from 'bullmq';
import { RedisConnection } from '../connections/redis.connection';

export const emailQueue=new Queue('email',{
    connection:RedisConnection
});