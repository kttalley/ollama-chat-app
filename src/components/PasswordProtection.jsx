import '@momentum-design/fonts/dist/css/fonts.css';
import '@momentum-design/tokens/dist/css/typography/complete.css';
import '@momentum-design/tokens/dist/css/theme/webex/light-stable.css';
import React, { useState } from 'react';
import { ThemeProvider, IconProvider, Button, Input, Password } from '@momentum-design/components/react';

const PasswordProtection = ({ onPasswordCorrect }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const CORRECT_PASSWORD = 'hwc123';
  const isPasswordCorrect = password === CORRECT_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Add a small delay to show loading state
    setTimeout(() => {
      if (isPasswordCorrect) {
        onPasswordCorrect();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setError(''); // Clear error when typing
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isPasswordCorrect) {
      handleSubmit(e);
    }
  };

  return (
    <ThemeProvider themeclass="mds-theme-stable-lightWebex">
      <IconProvider iconSet="custom-icons" url="svg" className="mds-typography">
        <div className="fixed inset-[0px]  bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#fff] max-w-[500px] rounded-[24px] shadow-[0_35px_35px_rgba(0,0,0,0.25)] px-[4rem] pt-[2rem] pb-[3rem] w-full max-w-md mx-[16px]">
            <div className="text-center mb-[2rem]">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Password Required
              </h2>
              <p className="text-sm text-gray-600 gap-[1.5rem]">
                Please enter the password to view this demo. Reach out to krtalley for access.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-[1rem]">
              <div>
                <Password
                  leadingIcon={isPasswordCorrect ? 'unsecure-unlocked-bold' : 'secure-lock-bold'}
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={handleInputChange}
                  onInput={handleInputChange} // Add onInput for immediate updates
                  onKeyDown={handleKeyDown}
                  className="w-full"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                variant='primary'
                type="submit"
                prefixIcon={isPasswordCorrect ? 'unsecure-unlocked-filled' : 'secure-lock-filled'}
                disabled={!isPasswordCorrect || isLoading}
                className="w-full"
                onClick={handleSubmit}
              >
                {isLoading ? 'Verifying...' : isPasswordCorrect ? 'Access demo' : 'Password is case sensitive'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                HWC team
              </p>
            </div>
          </div>
        </div>
      </IconProvider>
    </ThemeProvider>
  );
};

export default PasswordProtection;