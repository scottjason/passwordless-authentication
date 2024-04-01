'use server';
import nodemailer from 'nodemailer';
import Bottleneck from 'bottleneck';
import { randomInt } from 'crypto';
import { dbConnect } from '../../lib/db';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_MAIL } = process.env;
const VALID_EMAIL_REGEX: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const generateOTP = () => {
  let otp = '';
  const length = 6;
  for (let i = 0; i < length; i++) {
    otp += randomInt(0, 10).toString();
  }
  return otp;
};

const generateEmailContent = () => {
  return `
    <div style="font-family: sans-serif; color: #333;">
      <p>Your one-time passcode is: <strong>${generateOTP()}</strong></p>
      <p>This passcode will expire in five minutes. Please do not share this code or forward this email.</p>
      <p>If you did not request this code, please ignore this email.</p>
    </div>
  `;
};

const limiter = new Bottleneck({
  maxConcurrent: 1, // Ensures that only 1 email is sent at a time.
  reservoir: 250, // Total requests allowed per day.
  reservoirRefreshAmount: 250,
  reservoirRefreshInterval: 24 * 60 * 60 * 1000, // Refreshes daily to replenish 250 requests.
  minTime: 6000, // Allows for 10 requests per minute (6000 milliseconds between each request).
});

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendEmail = async (
  state: { errors: { email: string } } | Response,
  form?: FormData
): Promise<{ errors: { email: string } } | Response> => {
  if (!form) {
    return { ...state };
  }
  console.log('sendEmail');

  const email = form.get('email') as string;
  if (!VALID_EMAIL_REGEX.test(email)) {
    return {
      errors: {
        email: 'Please enter a valid email',
      },
    };
  }

  await dbConnect();

  try {
    transporter.verify(async (error) => {
      if (error) {
        return { errors: { email: 'Failed to connect to SMTP server' } };
      }
      await limiter.schedule(() => {
        return new Promise((resolve, reject) => {
          transporter.sendMail(
            {
              from: FROM_MAIL,
              to: email,
              subject: 'Your One-Time Secure Access Code',
              html: generateEmailContent(),
            },
            (error, info) => {
              if (error) {
                reject({ errors: { email: 'Failed to send email' } });
              } else {
                resolve(info);
              }
            }
          );
        });
      });
    });
  } catch (_) {
    return { errors: { email: 'Failed to send email due to an error' } };
  }
  return { ...state };
};
