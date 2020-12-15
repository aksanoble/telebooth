import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  ChakraProvider, Center, Box,
} from '@chakra-ui/react';

import App from './App';
import Signup from './components/Signup';
import {
  authenticate,
  initializeFirebase,
} from './apis/firebase';
import AuthContext from './contexts/authContext';

// Initialization Firebase
initializeFirebase();

const Auth = () => {
  const [authState, setAuthState] = useState({ status: 'loading' });

  useEffect(() => {
    authenticate(setAuthState);
  }, []);

  if (authState.status === 'loading') {
    return <div><p>Loading...</p></div>;
  }

  return (
    <ChakraProvider>
      <div className="auth">
        <Center width="100%" height="100vh">
          {authState.status === 'in' ? (
            <AuthContext.Provider value={{ authState, setAuthState }}>
              <Box w="100%">
                <App />
              </Box>
            </AuthContext.Provider>
          ) : (
            <Signup />
          )}
        </Center>
      </div>
    </ChakraProvider>
  );
};

ReactDOM.render(<Auth />, document.getElementById('root'));
