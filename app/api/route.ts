import nodemailer from 'nodemailer';
import Bottleneck from 'bottleneck';
import { randomInt } from 'crypto';
import { type NextRequest, NextResponse } from 'next/server';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_MAIL } = process.env;

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
      <h3>Hello,</h3>
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

export async function POST(request: NextRequest) {
  const { toEmail } = await request.json();
  const mailOptions = {
    from: FROM_MAIL,
    to: toEmail,
    subject: 'Your One-Time Secure Access Code ',
    html: generateEmailContent(),
  };
  await limiter.schedule(
    () =>
      new Promise(() => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return NextResponse.json({ error }, { status: 403 });
          } else {
            return NextResponse.json({ info }, { status: 200 });
          }
        });
      })
  );
}
