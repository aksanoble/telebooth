import React, { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Flex, Box } from '@chakra-ui/react';

import './App.css';

import Main from './components/Main';
import Signup from './components/Signup';
import getClient from './apis/hasura';

const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const {
    isLoading, getAccessTokenSilently, isAuthenticated,
  } = useAuth0();

  useEffect(() => {
    (async () => {
      if (!isLoading) {
        getAccessTokenSilently({
          audience: 'http://localhost:3000/',
        }).then((token) => {
          setAuthToken(token);
        });
      }
    })();
  }, [isLoading, isAuthenticated]);

  if (!isAuthenticated && !isLoading) {
    return <Signup />;
  }

  if (isLoading || !authToken) {
    return (
      <Flex alignItems="center" justifyContent="center">
        <Box>
          <p>Loading...</p>
        </Box>
      </Flex>
    );
  }

  return (
    <ApolloProvider client={getClient({ token: authToken })}>
      <div className="app">
        <Main />
      </div>
    </ApolloProvider>
  );
};

export default App;
