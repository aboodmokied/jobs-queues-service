export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  };
  
export interface ReminderEmailOptions extends EmailOptions {
    minutes:number
  };


