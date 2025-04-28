import express,{Request, Response, Router} from 'express';
import { ReviewOptions } from '../types/review.types';
import { reviewQueue } from '../queues/review.queue';

export const reviewRoutes:Router=express();

reviewRoutes.post('/',async(req:Request<{}, {}, ReviewOptions>, res: Response)=>{
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