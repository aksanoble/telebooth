import React, { useContext } from 'react';
import { ApolloProvider } from '@apollo/client';

import './App.css';

import Main from './components/Main';
import getClient from './apis/hasura';
import authContext from './contexts/authContext';

const App = () => {
  const auth = useContext(authContext);

  return (
    <ApolloProvider client={getClient(auth.authState)}>
      <div className="app">
        <Main />
      </div>
    </ApolloProvider>
  );
};

export default App;
