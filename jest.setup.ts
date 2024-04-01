import '@testing-library/jest-dom';

jest.mock('./lib/db', () => ({
  dbConnect: jest.fn(),
}));
