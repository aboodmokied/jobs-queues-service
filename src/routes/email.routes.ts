import express,{Request, Response, Router} from 'express';
import { EmailOptions, ReminderEmailOptions } from '../types/email-options.types';
import { emailQueue } from '../queues/email.queue';

export const emailRoutes:Router=express();

emailRoutes.post('/send-email',async(req:Request<{}, {}, EmailOptions>, res: Response)=>{
    await emailQueue.add('sendEmail',req.body,{
        attempts: 5,
        backoff: {
            type: 'exponential', 
            delay: 3000
        },
    });
    res.sendStatus(201);
});


emailRoutes.post('/reminder-email',async(req:Request<{}, {}, ReminderEmailOptions>, res: Response)=>{
    const {minutes,...jobData}=req.body;
    await emailQueue.add('sendEmail',jobData,{
        delay: 1000 * 60 * minutes,
        attempts: 3,
        backoff: {
            type: 'exponential', 
            delay: 3000
        },
    });
    res.sendStatus(201);
});


