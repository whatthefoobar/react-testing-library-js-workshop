import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// test('desc', () => {});

test('input should be initially empty', () => {
  render(<App />);
  //getByRole best for user interaction and screen readers
  // const emailInputElement = screen.getByRole('textbox'); // google the role of each html elem
  // expect(emailInputElement.value).toBe('');
  expect(screen.getByRole('textbox').value).toBe('');
  // password doesn't have implicit role can't use getByRole
  // Password in side the label tags
  expect(screen.getByLabelText('Password').value).toBe(''); // can be /password/i but then the because of the line below it will find multiple elem and throw and error so the suite fails
  expect(screen.getByLabelText(/confirm password/i).value).toBe(''); // can be "password"
});

// test user eevnts
test('should be able to type an email', () => {
  render(<App />);
  const emailInputElement = screen.getByRole('textbox', { name: /email/i });
  userEvent.type(emailInputElement, 'selena@gmail.com');
  // const { emailInputElement } = typeIntoForm({ email: 'selena@gmail.com' });
  expect(emailInputElement.value).toBe('selena@gmail.com');
});
test('should be able to type an password', () => {
  render(<App />);
  const passwordInputElement = screen.getByLabelText('Password');
  userEvent.type(passwordInputElement, '123');
  expect(passwordInputElement.value).toBe('123');
});

test('should be able to type a confirm password', () => {
  render(<App />);
  const confirmPasswordInputElement = screen.getByLabelText('Confirm Password');
  userEvent.type(confirmPasswordInputElement, '12345');
  expect(confirmPasswordInputElement.value).toBe('12345');
});

test('should show email error message on invalid email', () => {
  render(<App />);
  //first check error is not present // queryByTest instead of getByTest because we don't have the element
  const emailErrorElement = screen.queryByText(
    /the email you input is invalid./i
  );
  const emailInputElement = screen.getByRole('textbox', { name: /email/i });
  const submitBtnElement = screen.getByRole('button', { name: /submit/i });

  expect(emailErrorElement).not.toBeInTheDocument();
  // now input wrong email click and error msg should be there
  userEvent.type(emailInputElement, 'selenagmail.com');
  userEvent.click(submitBtnElement);

  const emailErrorElementAgain = screen.queryByText(
    /the email you input is invalid./i
  );
  expect(emailErrorElementAgain).toBeInTheDocument(); // check Dom based matchers for all methods
});

test('should show password error if password is less than 5 characters', () => {
  render(<App />);
  const emailErrorElementInitial = screen.queryByText(
    /the password you entered should contain 5 or more characters/i
  );
  expect(emailErrorElementInitial).not.toBeInTheDocument();

  const emailInputElement = screen.getByRole('textbox', { name: /email/i });
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement = screen.getByLabelText('Confirm Password');

  userEvent.type(emailInputElement, 'selena@gmail.com');
  userEvent.type(passwordInputElement, '123');
  userEvent.type(confirmPasswordInputElement, '123');

  const submitBtnElement = screen.getByRole('button', { name: /submit/i });
  userEvent.click(submitBtnElement);
  const emailErrorElement = screen.queryByText(
    /the password you entered should contain 5 or more characters./i
  );

  expect(emailErrorElement).toBeInTheDocument();
});

test("should show confirm password error if passwords don't match", () => {
  render(<App />);
  const emailErrorElementInitial = screen.queryByText(
    /the passwords don't match. try again/i
  );
  expect(emailErrorElementInitial).not.toBeInTheDocument();

  const emailInputElement = screen.getByRole('textbox', { name: /email/i });
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement = screen.getByLabelText('Confirm Password');
  const submitBtnElement = screen.getByRole('button', { name: /submit/i });
  const passwordErrorElementInitial = screen.queryByText(
    /the passwords don't match. try again/i
  );

  userEvent.type(emailInputElement, 'selena@gmail.com');
  userEvent.type(passwordInputElement, '12345');
  expect(passwordErrorElementInitial).not.toBeInTheDocument();
  userEvent.type(confirmPasswordInputElement, '123456');

  userEvent.click(submitBtnElement);
  const passwordErrorElement = screen.queryByText(
    /the passwords don't match. try again/i
  );

  expect(passwordErrorElement).toBeInTheDocument();
});

test('should show no error message if every input is valid', () => {
  const emailInputElement = screen.getByRole('textbox', { name: /email/i });
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement = screen.getByLabelText('Confirm Password');

  userEvent.type(emailInputElement, 'selena@gmail.com');
  userEvent.type(passwordInputElement, '12345');
  userEvent.type(confirmPasswordInputElement, '123456');

  const submitBtnElement = screen.getByRole('button', { name: /submit/i });
  userEvent.click(submitBtnElement);

  expect(
    screen.queryByText(/the email you input is invalid/i)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(
      /the password you entered should contain 5 or more characters/i
    )
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(/the passwords don't match. try again/i)
  ).not.toBeInTheDocument();
});
