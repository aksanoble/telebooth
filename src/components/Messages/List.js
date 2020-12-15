import React, { useEffect, useState } from "react";
import moment from "moment";
import { useFocusEffect } from "@chakra-ui/hooks";

const MessageList = props => {
  const [bottom, setBottom] = useState(false);
  const scrollToBottom = () => {
    document
      .getElementById("lastMessage")
      .scrollIntoView({ behavior: "instant" });
  };

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
  const { isNew, messages, currentChatId } = props;

  useEffect(() => {
    console.log("Scroll to bottom called!");
    window.addEventListener("scroll", handleScroll);
    scrollToBottom();
  });
  return (
    <div className={isNew ? "messageWrapperNew" : "messageWrapper"}>
      {messages
        .filter(m => m.chat_id === currentChatId)
        .map((m, i) => (
          <div key={m.id} className="message">
            <div className="messageNameTime">
              <div className="messageName">
                <b>{m.user.username}</b>
              </div>
              <div className="messsageTime">
                <i>{moment(m.timestamp).fromNow()} </i>
              </div>
            </div>
            <div className="messageText">{m.text}</div>
          </div>
        ))}
      <div style={{ height: 0 }} id="lastMessage" />
    </div>
  );
};

export default MessageList;
