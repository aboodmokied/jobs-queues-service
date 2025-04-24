import nodemailer,{Transporter} from 'nodemailer';
import { EmailOptions } from '../types/email-options.types';

export class MailerService{
    private transporter: Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          },
          host:'smtp.gmail.com',
          port:587,
          secure:false
        });
      }

    async sendEmail({ to, subject, text, html }:EmailOptions){
        const emailOptions={
            from:process.env.GMAIL_USER,
            to,
            subject,
            text,
            html
        }
        try {
            const info = await this.transporter.sendMail(emailOptions);
            return { success: true, info };
          } catch (error) {
            console.error('Error sending email:', error);
            throw error;
          }
    }  
};