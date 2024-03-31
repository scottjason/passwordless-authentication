'use client';
import { useFormState } from 'react-dom';
import { sendEmail } from './actions/sendEmail';

const initialState = {
  email: '',
  errors: {
    email: '',
  },
};

const Home = (): JSX.Element => {
  const [state, formAction] = useFormState(sendEmail, initialState);
  const emailError = 'errors' in state && state.errors.email;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-t from-[#00212a] to-[#000125]'>
      <div className='p-12 space-y-4 rounded-lg text-center bg-gray-800 bg-opacity-50'>
        <h1 className='text-4xl font-bold text-white'>Welcome</h1>
        <p className='text-white'>Please enter your email to sign-in or create an account</p>
        <form action={formAction}>
          <p className={emailError ? 'text-red-400' : 'text-red-400 invisible'}>{emailError}</p>
          <input
            type='email'
            name='email'
            placeholder='Email'
            className='w-full px-4 py-2 rounded-md text-black'
          />
          <button
            type='submit'
            className='w-full px-4 py-2 mt-2 rounded-md text-white bg-teal-500 hover:bg-teal-600'
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
