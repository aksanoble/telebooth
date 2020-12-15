import React, { useContext } from "react";
import { useSubscription } from "@apollo/client";

import MessageList from "./List";
import appContext from "../../contexts/appContext";
import { subscribeToNewMessages } from "../../globals/global.gqlqueries";
import AddNewMessage from '../AddNewMessage';

const RenderMessages = () => {
  const {
    appState: { username, currentChatId, botUserName },
  } = useContext(appContext);

  const { data } = useSubscription(subscribeToNewMessages);

  return (
    <div id="chatbox">
      <MessageList
        messages={data ? data.message : []}
        isNew={false}
        username={username}
        currentChatId={currentChatId}
        botUserName={botUserName}
      />
      <AddNewMessage currentChatId={currentChatId} />
    </div>
  );
};

export default RenderMessages;
