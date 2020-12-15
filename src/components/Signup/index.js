import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Button } from '@chakra-ui/react';

import { signup } from '../../apis/firebase';

const Signup = () => {
  const signInWithGoogle = async () => {
    try {
      await signup();
    } catch (error) {
      alert('Seems like, you don\'t belong here :) please call administrator.');
    }
  };

  return (
    <Button
      onClick={signInWithGoogle}
      colorScheme="blue"
      size="md"
      leftIcon={FaGoogle}
    >
      Sign in with Google
    </Button>
  );
};

export default Signup;
