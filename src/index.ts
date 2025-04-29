import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { serverAdapter } from './dashboard/bull-board';
import { emailRoutes } from './routes/email.routes';
import { reviewRoutes } from './routes/review.routes';
import { signPayload } from './utils/signature';

const app=express();


// Standard JSON body parsing for non-webhook routes
app.use(express.json({
   verify: (req:Request, res, buf) => {
     req.rawBody = buf.toString(); // Save raw payload before parsing
   }
 }));



app.use('/admin/queues', serverAdapter.getRouter());

app.use('/email',emailRoutes);
app.use('/webhook/review',reviewRoutes);

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
   console.log(`server running on port: ${PORT}`) 
})
