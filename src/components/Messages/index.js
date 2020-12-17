import React, { useContext } from "react";

import MessageList from "./List";
import appContext from "../../contexts/appContext";
import AddNewMessage from '../AddNewMessage';

const RenderMessages = () => {
  const {
    appState: { username, currentChatId, botUserName }, messages,
  } = useContext(appContext);

  return (
    <div id="chatbox">
      <MessageList
        messages={messages}
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
