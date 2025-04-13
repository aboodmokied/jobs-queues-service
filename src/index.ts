import express from 'express';

const app=express();


app.get('/',(req,res)=>{
    res.sendStatus(200);
});


const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
   console.log(`server running on port: ${PORT}`) 
})