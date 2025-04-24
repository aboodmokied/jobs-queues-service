import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { EmailOptions } from './types/email-options.types';
import { MailerService } from './services/mailer.service';
dotenv.config();

import { serverAdapter } from './dashboard/bull-board';
import { emailRoutes } from './routes/email.routes';

const app=express();

app.use(express.json());

app.post('/',async(req:Request<{}, {}, EmailOptions>, res: Response)=>{
    const mailerService=new MailerService();
    const result=await mailerService.sendEmail(req.body);
    res.send(result);
});



app.use('/admin/queues', serverAdapter.getRouter());

app.use('/email',emailRoutes);

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
   console.log(`server running on port: ${PORT}`) 
})