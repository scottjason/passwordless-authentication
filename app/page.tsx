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
    <div className='space-y-4 rounded-lg bg-gray-800 bg-opacity-50 p-12 text-center'>
      <h1 className='text-4xl font-bold text-white'>Welcome</h1>
      <p className='text-white'>
        Please enter your email to sign-in or create an account
      </p>
      <form action={formAction}>
        <p className={emailError ? 'text-red-400' : 'invisible text-red-400'}>
          {emailError}
        </p>
        <input
          type='email'
          name='email'
          placeholder='Email'
          className='w-full rounded-md px-4 py-2 text-black'
        />
        <button
          type='submit'
          className='mt-2 w-full rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600'
        >
          Enter
        </button>
      </form>
    </div>
  );
};

export default Home;
