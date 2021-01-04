import React from 'react';
import ReactDOM from 'react-dom';
import {
  ChakraProvider, Center, Box,
} from '@chakra-ui/react';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';

const DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
const CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const AUDIENCE = process.env.REACT_APP_AUDIENCE;

const Auth = () => (
  <ChakraProvider>
    <Auth0Provider
      domain={DOMAIN}
      clientId={CLIENT_ID}
      redirectUri={window.location.origin}
      audience={AUDIENCE}
      onRedirectCallback={() => window.location.pathname}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <div className="auth">
        <Center width="100%" height="100vh">
          <Box w="100%">
            <App />
          </Box>
        </Center>
      </div>
    </Auth0Provider>
  </ChakraProvider>
);

ReactDOM.render(<Auth />, document.getElementById('root'));
