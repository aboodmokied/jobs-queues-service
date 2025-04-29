import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
import { Worker } from 'bullmq';
import { RedisConnection } from '../connections/redis.connection';
import { SentimentSevice } from '../services/sentiment.service';
import { ReviewOptions } from '../types/review.types';
import { signPayload } from '../utils/signature';

// Environment variable for signing payloads
const CALLBACK_SECRET_KEY = process.env.CALLBACK_SECRET;

/**
 * Worker to process review sentiment analysis jobs
 * Analyzes the sentiment of review text and sends results to a callback URL
 */
export const reviewWorker = new Worker(
    'reviewQueue',
    async (job) => {
      // Initialize sentiment analysis service
      const sentimentService = new SentimentSevice();
      
      // Extract job data
      const { reviewText, callbackUrl, restaurantId, reviewId } = job.data as ReviewOptions;
      
      // Perform sentiment analysis on review text
      const rate = await sentimentService.analyze(reviewText);

      // Create signature for secure callback request
      const {signature, payloadStr} = signPayload({ rate, reviewId, restaurantId, reviewText }, CALLBACK_SECRET_KEY!);

      // Send analysis results to the specified callback URL with security signature
      await axios.post(callbackUrl, {
        headers: {
          'Content-Type': 'application/json',
          'x-signature': signature // Include signature for verification
        },
        data: payloadStr
      });
      console.log({rate,signature,payloadStr})
      // Return results for job completion handling
      return { rate, reviewText };
    },
    { connection: RedisConnection }
  );

  // Event handlers for job lifecycle
  reviewWorker.on('completed', job => {
    console.log(`✅ Job ${job.id} completed`);
  });

  reviewWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
  });
