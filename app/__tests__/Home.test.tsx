import { render, screen } from '@testing-library/react';
import Home from '../page';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn().mockReturnValue([{ email: '', errors: { email: '' } }, () => {}]),
}));

describe('Home Component', () => {
  it('renders the welcome message', () => {
    render(<Home />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
