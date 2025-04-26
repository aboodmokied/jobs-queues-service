import dotenv from 'dotenv';
dotenv.config();
import { Worker } from 'bullmq';
import { RedisConnection } from '../connections/redis.connection';

export const reviewWorker = new Worker(
    'reviewQueue',
    async job => {
      
    },
    { connection:RedisConnection }
  );


  reviewWorker.on('completed', job => {
    console.log(`✅ Job ${job.id} completed`);
  });
  reviewWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
  });