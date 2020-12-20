import React, { useState } from 'react';
import { useSubscription } from '@apollo/client';
import get from 'lodash.get';

import AppContext from '../../contexts/appContext';
import Users from '../Users';
import RenderMessages from '../Messages';
import Header from './Header';
import { subscribeToNewMessages } from "../../globals/global.gqlqueries";

const botUserName = process.env.REACT_APP_BOT_USERNAME;

const INITIAL_STATE = {
  isLoggedIn: false,
  currentChatId: null,
  userId: 1,
  username: null,
  botUserName,
};

const Main = () => {
  const [appState, setAppState] = useState(INITIAL_STATE);
  const { data, error } = useSubscription(subscribeToNewMessages);

  const updateState = (toUpdateState) => {
    setAppState({
      ...appState,
      ...toUpdateState,
    });
  };

  return (
    <AppContext.Provider value={{ appState, updateState, messages: get(data, 'message', []) }}>
      <Header />
      <div className="chatWrapper">
        <div className="wd25">
          <Users />
        </div>
        <div className="wd75">
          <RenderMessages />
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default Main;
