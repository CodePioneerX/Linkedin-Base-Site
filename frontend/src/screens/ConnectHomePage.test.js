import { render, screen, fireEvent } from '@testing-library/react';
import ConnectHomePage from './ConnectHomePage';
import  {Provider} from 'react-redux';
import store from '../store';
import OfficeWorker from '../images/OfficeWorker.png';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
  }));


test('Home page should have the correct headings and text', () => {
    const { getByText } = render(<Provider store={store}> <ConnectHomePage /> </Provider>);

    const mainHeading = getByText(/Unlock Your Professional Potential/i);
    const heading = screen.queryByText('Log in to your account');
    const subheading = screen.queryByText('New to CONNECT?');
    const forgotPasswordText = getByText(/Forgot password?/i);
  
    expect(mainHeading).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(subheading).toBeInTheDocument();
    expect(forgotPasswordText).toBeInTheDocument();
});

test('Home page should have the correct placeholders', () => {
    render(<Provider store={store}> <ConnectHomePage /> </Provider>);

    const emailBox = screen.queryByPlaceholderText('Enter your email...');
    const passwordBox = screen.queryByPlaceholderText('Enter your password...');
  
    expect(emailBox).toBeInTheDocument();
    expect(passwordBox).toBeInTheDocument();
});


test('renders "Log in" button', () => {
    render(<Provider store={store}> <ConnectHomePage /> </Provider>);
    const button = screen.getByRole('button', { name: /Log in/i });
    expect(button).toBeInTheDocument();
});

test('renders "Register Now" button', () => {
    render(<Provider store={store}> <ConnectHomePage /> </Provider>);
    const button = screen.getByRole('link', { name: /Click here/i });
    expect(button).toBeInTheDocument();
});

test('Home page should have the correct image', () => {
    const { getByRole } = render(<Provider store={store}> <ConnectHomePage /> </Provider>);

    const officeWorkerImage = getByRole('img');

    expect(officeWorkerImage).toBeInTheDocument();
    expect(officeWorkerImage).toHaveAttribute('src', OfficeWorker);
});