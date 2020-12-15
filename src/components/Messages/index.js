import React, { useContext } from "react";
import { useSubscription } from "@apollo/client";

import MessageList from "./List";
import appContext from "../../contexts/appContext";
import { subscribeToNewMessages } from "../../globals/global.gqlqueries";

const RenderMessages = () => {
  const {
    appState: { username, currentChatId }
  } = useContext(appContext);

  const { data, loading } = useSubscription(subscribeToNewMessages);

  return (
    <div id="chatbox">
      <MessageList
        messages={data ? data.message : []}
        isNew={false}
        username={username}
        currentChatId={currentChatId}
      />
    </div>
  );
};

export default RenderMessages;
