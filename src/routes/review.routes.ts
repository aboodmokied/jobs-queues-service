import express,{Request, Response, Router} from 'express';
import { ReviewOptions } from '../types/review.types';
import { reviewQueue } from '../queues/review.queue';
import { verifySignature } from '../middlewares/verify-signature.middleware';

export const reviewRoutes:Router=express();
/**
 * Review Routes
 *
 * This router handles endpoints related to restaurant reviews.
 * POST / - Creates a new review and adds it to the review processing queue
 *
 * All endpoints are protected by signature verification middleware to ensure
 * requests are authentic.
 */
reviewRoutes.post('/',verifySignature,async(req:Request<{}, {}, ReviewOptions>, res: Response)=>{
    const { restaurantId, reviewText, reviewId } = req.body;
    await reviewQueue.add('review',{
        restaurantId, 
        reviewText,
        reviewId
    },{
        attempts: 3,
        backoff: {    
            type: 'exponential',  
            delay: 3000
        },
    });
    res.sendStatus(201);
});