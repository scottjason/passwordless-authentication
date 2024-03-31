'use server';
import nodemailer from 'nodemailer';
import Bottleneck from 'bottleneck';
import { randomInt } from 'crypto';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_MAIL } = process.env;
const EMAIL_REGEX: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const generateOTP = () => {
  let otp = '';
  const length = 6 as const;
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
  reservoir: 500,
  reservoirRefreshAmount: 500,
  reservoirRefreshInterval: 24 * 60 * 60 * 1000,
});

const transporter = nodemailer.createTransport({
  // @ts-ignore
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendEmail = async (
  state: Response | { errors: { email: string } },
  form: FormData
): Promise<{ errors: { email: string } } | Response> => {
  const email = form.get('email') as string;
  const isValidEmail = EMAIL_REGEX.test(email);
  if (!isValidEmail) {
    return {
      errors: {
        email: 'Please enter a valid email',
      },
    };
  } else {
    const mailOptions = {
      from: FROM_MAIL,
      to: email,
      subject: 'Your One-Time Secure Access Code ',
      html: generateEmailContent(),
    };
    await limiter.schedule(
      () =>
        new Promise(() => {
          transporter.sendMail(mailOptions, (error: unknown) => {
            if (error) {
              return { ...state, errors: { email: 'Failed to send email' } };
            } else {
              return { ...state };
            }
          });
        })
    );
  }
  return { ...state };
};
