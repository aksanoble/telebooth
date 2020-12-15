import React, { useEffect, useState } from "react";
import moment from "moment";
import { useFocusEffect } from "@chakra-ui/hooks";

const MessageList = (props) => {
  const [bottom, setBottom] = useState(false);
  const scrollToBottom = () => {
    document
      .getElementById("lastMessage")
      .scrollIntoView({ behavior: "instant" });
  };

  const handleScroll = () => {
    const windowHeight = "innerHeight" in window
      ? window.innerHeight
      : document.documentElement.offsetHeight;
    const body = document.getElementById("chatbox");
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      setBottom(true);
    } else if (bottom) {
      setBottom(false);
    }
  };
  const {
    isNew, messages, currentChatId, botUserName,
  } = props;

  const filteredMessages = messages.filter((m) => m.chat_id === currentChatId);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  return (
    <div className={isNew ? "messageWrapperNew" : "messageWrapper"}>
      {
        filteredMessages.map((m, i) => {
          const isBot = botUserName === m.user.username;
          const pointerClassNames = !isBot ? 'chat-pointer chat-pointer-left' : 'chat-pointer';

          return (
            <div key={m.id} className="message-container" style={{ justifyContent: isBot ? 'flex-end' : 'flex-start' }}>
              <span className={pointerClassNames} />
              <div className="message" style={{ backgroundColor: isBot ? '#CAD8E3' : 'white' }}>
                <div className="messageText">{m.text}</div>
                <div className="messsageTime">
                  <i>
                    {moment(m.timestamp).format('lll')}
                    {' '}
                  </i>
                </div>
              </div>
            </div>
          );
        })
}
      <div style={{ height: 0 }} id="lastMessage" />
    </div>
  );
};

export default MessageList;
