import dotenv from 'dotenv';
dotenv.config();
import { Worker } from 'bullmq';
import { RedisConnection } from '../connections/redis.connection';
import { SentimentSevice } from '../services/sentiment.service';
import { ReviewOptions } from '../types/review.types';

export const reviewWorker = new Worker(
    'reviewQueue',
    async (job) => {
      const sentementService=new SentimentSevice();
      const {reviewText}=job.data as ReviewOptions
      const rate=await sentementService.analyze(reviewText);
      console.log(rate);
    },
    { connection:RedisConnection }
  );


  reviewWorker.on('completed', job => {
    console.log(`✅ Job ${job.id} completed`);
  });
  reviewWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
  });