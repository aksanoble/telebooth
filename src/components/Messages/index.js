import React, { useEffect, useState, useContext } from "react";
import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";

import Banner from "./NewMessageBanner";
import MessageList from "./List";
import appContext from "../../contexts/appContext";

const subscribeToNewMessages = gql`
  subscription {
    message(order_by: { id: desc }, limit: 1) {
      id
      user {
        username
      }
      text
      timestamp
    }
  }
`;

const fetchMessages = gql`
  query($last_received_id: Int, $last_received_ts: timestamptz) {
    message(
      order_by: { timestamp: asc }
      where: {
        _and: {
          id: { _neq: $last_received_id }
          timestamp: { _gte: $last_received_ts }
        }
      }
    ) {
      id
      text
      user {
        username
      }
      timestamp
      chat_id
    }
  }
`;

const RenderMessages = () => {
  const {
    appState: { username, currentChatId }
  } = useContext(appContext);
  const [bottom, setBottom] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);

  const getLastReceivedVars = () => {
    if (newMessages.length === 0) {
      if (messages.length !== 0) {
        return {
          last_received_id: messages[messages.length - 1].id,
          last_received_ts: messages[messages.length - 1].timestamp
        };
      }
      return {
        last_received_id: -1,
        last_received_ts: "2018-08-21T19:58:46.987552+00:00"
      };
    }
    return {
      last_received_id: newMessages[newMessages.length - 1].id,
      last_received_ts: newMessages[newMessages.length - 1].timestamp
    };
  };

  const { data, loading } = useSubscription(fetchMessages, {
    variables: getLastReceivedVars()
  });

  const { data: newMessage } = useSubscription(subscribeToNewMessages);

  // const data = {message: []};
  // const loading = false;

  const handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.getElementById("chatbox");
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      setBottom(true);
    } else if (bottom) {
      setBottom(false);
    }
  };

  const scrollToBottom = () => {
    document
      .getElementById("lastMessage")
      .scrollIntoView({ behavior: "instant" });
  };

  // scroll to the new message
  const scrollToNewMessage = () => {
    document
      .getElementById("newMessage")
      .scrollIntoView({ behavior: "instant" });
  };

  // add new (unread) messages to state
  const addNewMessages = msgs => {
    // const messagesWithOutSelf = msgs.filter(m => m.username !== username);

    setNewMessages([...newMessages, ...msgs]);
  };

  // add old (read) messages to state
  const addOldMessages = oldMsgs => {
    const oldMessages = [...messages, ...oldMsgs];

    setMessages(oldMessages);
    setNewMessages([]);
  };

  // check if the view is scrollable
  const isViewScrollable = () => {
    const isInViewport = elem => {
      const bounding = elem.getBoundingClientRect();
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    if (document.getElementById("lastMessage")) {
      return !isInViewport(document.getElementById("lastMessage"));
    }

    return false;
  };

  // const refetch = async () => {
  //   if (!this.state.loading) {
  //     const resp = await this.state.refetch(this.getLastReceivedVars());
  //     if (resp.data) {
  //       if (!this.isViewScrollable()) {
  //         this.addOldMessages(resp.data.message);
  //       } else {
  //         if (this.state.bottom) {
  //           this.addOldMessages(resp.data.message);
  //         } else {
  //           this.addNewMessages(resp.data.message);
  //         }
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    scrollToBottom();
  }, []);

  useEffect(() => {
    const message = newMessage ? newMessage.message : [];

    if (message.length) {
      addNewMessages(message);
      scrollToBottom();
    }
  }, [newMessage]);

  useEffect(() => {
    const receivedMessages = data ? data.message : [];

    if (receivedMessages.length) {
      addOldMessages(receivedMessages);
    }
  }, [loading]);

  // if (loading) {
  //   return <div>loading...</div>;
  // }

  return (
    <div id="chatbox">
      {/* <Query query={fetchMessages} variables={this.getLastReceivedVars()}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return null;
          }

          if (error) {
            return "Error: " + error;
          }
          // set refetch in local state to make a custom refetch
          if (!this.state.refetch) {
            this.setState({
              refetch
            });
          }
          const receivedMessages = data.message;

          // load all messages to state in the beginning
          if (receivedMessages.length !== 0) {
            if (messages.length === 0) {
              this.addOldMessages(receivedMessages);
            }
          }

          // return null; real rendering happens below
          return null;
        }}
      </Query> */}
      {/* show "unread messages" banner if not at bottom */}
      {!bottom && newMessages.length > 0 && isViewScrollable() ? (
        <Banner
          scrollToNewMessage={scrollToNewMessage}
          numOfNewMessages={newMessages.length}
        />
      ) : null}

      {/* Render old messages */}
      <MessageList
        messages={messages}
        isNew={false}
        username={username}
        currentChatId={currentChatId}
      />
      {/* Show old/new message separation */}
      <div id="newMessage" className="oldNewSeparator">
        {newMessages.length !== 0 ? "New messages" : null}
      </div>

      {/* render new messages */}
      <MessageList messages={newMessages} isNew username={username} />
    </div>
  );
};

export default RenderMessages;
