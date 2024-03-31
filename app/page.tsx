'use client';
import React, { useState } from 'react';

const EMAIL_REGEX: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Home = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [emailValidationErr, setEmailValidationErr] = useState<boolean>(false);

  const sendEmail = async (): Promise<void> => {
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toEmail: email }),
      });
    } catch (error) {}
  };

  const onEnterEmail = (): Promise<void> | void => {
    const isValidEmail = EMAIL_REGEX.test(email);
    return isValidEmail ? sendEmail() : setEmailValidationErr(true);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-t from-[#00212a] to-[#000125]'>
      <div className='p-12 space-y-4 rounded-lg text-center bg-gray-800 bg-opacity-50'>
        <h1 className='text-4xl font-bold text-white'>Welcome</h1>
        <p className='text-white'>Please enter your email to sign-in or create an account</p>
        <p className={emailValidationErr ? 'text-red-400' : 'text-red-400 invisible'}>
          Please enter a valid email
        </p>
        <input
          type='email'
          placeholder='Email'
          className='w-full px-4 py-2 rounded-md text-black'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className='w-full px-4 py-2 mt-2 rounded-md text-white bg-teal-500 hover:bg-teal-600'
          onClick={onEnterEmail}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default Home;
