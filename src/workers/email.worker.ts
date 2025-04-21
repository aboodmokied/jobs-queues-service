import { Worker } from 'bullmq';
import { RedisConnection } from '../connections/redis.connection';

export const emailWorker = new Worker(
    'emailQueue',
    async job => {
      const { to, subject, message } = job.data;
      console.log(`Sending email to ${to}: ${subject}`);
      await new Promise(res => setTimeout(res, 1000));
      console.log(`Email sent to ${to}`);
    },
    { connection:RedisConnection }
  );


  emailWorker.on('completed', job => {
    console.log(`✅ Job ${job.id} completed`);
  });
  emailWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
  });