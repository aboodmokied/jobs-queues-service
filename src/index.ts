import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { serverAdapter } from './dashboard/bull-board';
import { emailRoutes } from './routes/email.routes';
import { reviewRoutes } from './routes/review.routes';

const app=express();



// Middleware to capture raw body for webhook routes
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/webhook')) {
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk.toString();
    });
    req.on('end', () => {
      (req as any).rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
});




// Standard JSON body parsing for non-webhook routes
app.use(express.json());



app.use('/admin/queues', serverAdapter.getRouter());

app.use('/email',emailRoutes);
app.use('/webhook/review',reviewRoutes);

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
   console.log(`server running on port: ${PORT}`) 
})
