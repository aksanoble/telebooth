import React, { useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';
import {
  Button, Flex, Box, useToast,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

const Signup = () => {
  const { loginWithRedirect, error } = useAuth0();
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Access denied!",
        description: "Unauthorized user, please call administrator.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error]);

  return (
    <Flex alignItems="center" justifyContent="center">
      <Box>
        <Button
          onClick={loginWithRedirect}
          colorScheme="blue"
          size="md"
          leftIcon={FaGoogle}
        >
          Sign in with Google
        </Button>
      </Box>
    </Flex>
  );
};

export default Signup;
