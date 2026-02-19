import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthContainer = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <>
      {isSignUp ? (
        <SignUp onToggle={toggleForm} />
      ) : (
        <SignIn onToggle={toggleForm} />
      )}
    </>
  );
};

export default AuthContainer;