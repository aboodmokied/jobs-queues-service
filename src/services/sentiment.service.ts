import axios from 'axios';

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HF_API_TOKEN = process.env.HF_API_TOKEN;

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment";


interface SentimentScores {
  negative: {label:string,score:number};
  neutral: {label:string,score:number};
  positive: {label:string,score:number};
  // [key: string]: {label:string,score:number}; // Index signature for additional properties
}


export class SentimentSevice{
    constructor(){}
    
    async analyze(text:string) {
        try {
          const response = await axios.post(
            HUGGING_FACE_API_URL,
            { inputs: text },
            {
                headers: {
                    'Authorization': `Bearer ${HF_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
          // The API returns scores in this order: [negative, neutral, positive]
          const predictions = response.data[0];
          let finalPrediction;
          let scores:SentimentScores={} as SentimentScores;
          // Format the response
          const result = predictions.map((pred:{label:string,score:number}, index:number) => {
            let record;
            if(pred.label=='LABEL_0'){ // negative
              record={
                label:'NEGATIVE',
                score:pred.score
              }
              scores.negative=record;
            }else if(pred.label=='LABEL_1'){ // neutral
              record={
                label:'NEUTRAL',
                score:pred.score
              }
              scores.neutral=record;
            }else if(pred.label=='LABEL_2'){ // positive
              record={
                label:'POSITIVE',
                score:pred.score
              }
              scores.positive=record;
            }else{
              record={
                label:'UNKNOWN',
                score:pred.score
              }
            }
            if(index==0){
              finalPrediction=record;
            }
            return record;
          });
          const rating=this.sentimentToStars(scores)
          return rating;
        } catch (error:any) {
          console.error('Sentiment analysis error:', error.message);
          throw error;
        }
      };

   // Function to convert sentiment scores to star rating (0-5)
   sentimentToStars(scores:SentimentScores) {
  // scores array contains [negative, neutral, positive] probabilities
  const {negative, neutral, positive} = scores;
  
  // Calculate core components
  const sentimentBalance = positive.score - negative.score; // Range: -1 to +1
  
  // Dynamic rating calculation
  let rating: number;
  
  if (neutral.score > 0.7) {
      // Highly neutral - very constrained range
      rating = 2.5 + (sentimentBalance * 0.8);
  } else if (neutral.score > 0.4) {
      // Moderately neutral - medium range
      rating = 2.5 + (sentimentBalance * 1.5);
  } else {
      // Low neutral - full range
      rating = 2.5 + (sentimentBalance * 2.5);
  }
  
  // Apply non-linear scaling for extreme sentiments
  if (rating > 3.5) {
      rating = 3.5 + (rating - 3.5) * 1.2; // Boost positive extremes
  } else if (rating < 1.5) {
      rating = 1.5 - (1.5 - rating) * 1.2; // Boost negative extremes
  }
  
  // Clamp and format
  const finalRating = parseFloat(Math.min(5, Math.max(0, rating)).toFixed(1));
  return finalRating;
}
};