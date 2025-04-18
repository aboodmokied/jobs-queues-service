import express from 'express';
import { emailQueue } from './queues/email.queue';

const app=express();


app.get('/',(req,res)=>{
    res.sendStatus(200);
});
app.get('/add-job',async(req,res)=>{
    const jobData={
        to:'abood',
        from:'me',
        message:'suiiiii',
        subject:'Test'
    }
    await emailQueue.add('email',jobData);
    const jobsCount=await emailQueue.count()
    console.log('new job added:',jobsCount)
    res.sendStatus(201);
});


const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
   console.log(`server running on port: ${PORT}`) 
})