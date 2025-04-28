import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { serverAdapter } from './dashboard/bull-board';
import { emailRoutes } from './routes/email.routes';
import { reviewRoutes } from './routes/review.routes';

const app=express();

app.use(express.json());



app.use('/admin/queues', serverAdapter.getRouter());

app.use('/email',emailRoutes);
app.use('/review',reviewRoutes);

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
   console.log(`server running on port: ${PORT}`) 
})