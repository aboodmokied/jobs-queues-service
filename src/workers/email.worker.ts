import dotenv from 'dotenv';
dotenv.config();
import { Worker } from 'bullmq';
import { RedisConnection } from '../connections/redis.connection';
import { MailerService } from '../services/mailer.service';

export const emailWorker = new Worker(
    'emailQueue',
    async job => {
      // const { to, subject, html, text } = job.data as EmailOptions;
      const mailerService=new MailerService();
      await mailerService.sendEmail(job.data)
    },
    { connection:RedisConnection }
  );


  emailWorker.on('completed', job => {
    console.log(`✅ Job ${job.id} completed`);
  });
  emailWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
  });