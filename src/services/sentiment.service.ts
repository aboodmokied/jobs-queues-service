import axios from 'axios';

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HF_API_TOKEN = process.env.HF_API_TOKEN;

type sentimentResponse = {
  data:[
    [{label:string,score:number},{label:string,score:number}],
  ]
}

export class SentimentSevice{
    constructor(){}
    
    async analyze(text:string) {
        try {
          // const response = await axios.post(
          //   'https://api.openai.com/v1/chat/completions',
          //   {
          //     model: 'gpt-3.5-turbo',
          //     messages: [
          //       {
          //         role: 'system',
          //         content: 'You are a sentiment analysis assistant. Respond with only one word: Positive, Negative, or Neutral.',
          //       },
          //       {
          //         role: 'user',
          //         content: `Analyze the sentiment of this text: "${text}"`,
          //       },
          //     ],
          //     temperature: 0,
          //   },
          //   {
          //     headers: {
          //       Authorization: `Bearer ${OPENAI_API_KEY}`,
          //       'Content-Type': 'application/json',
          //     },
          //   }
          // );
          const response = await axios.post(
            'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
            { inputs: text },
            {
              headers: {
                Authorization: `Bearer ${HF_API_TOKEN}`
              }
            }
          );
          const sentiment = response as sentimentResponse;
          console.log({sentiment:sentiment.data[0]});
          return this.calculateStars(sentiment);
        } catch (error:any) {
          console.error('Sentiment analysis error:', error.message);
          throw error;
        }
      };

   calculateStars(sentiment:sentimentResponse){
    const positiveRate = sentiment.data[0][0];
    let stars:number;
    if (positiveRate.label === 'POSITIVE') {
      stars = positiveRate.score * 5;
    } else {
      stars = (1 - positiveRate.score) * 5;
    }
    return stars;
  
   }   
};