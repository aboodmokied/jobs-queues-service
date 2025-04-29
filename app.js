const express=require('express');
const bodyParser=require('body-parser');
const app=express();


// app.use(bodyParser.json({
//     verify: (req, res, buf) => {
//       req.rawBody = buf.toString('utf8');
//       console.log({raw:req.rawBody})
//     }
//   }))


app.post('/',bodyParser.raw({ type: 'application/json' }),(req,res)=>{
    const rawBody=req.body.toString('utf8');
    console.log({rawBody});
    const payload = JSON.parse(rawBody);
    console.log({payload});
    const compactBody = JSON.stringify(payload); // No whitespace
    console.log({compactBody});
    return res.sendStatus(200)
})
app.listen(3000,()=>{
    console.log('server is running on port 3000')
});