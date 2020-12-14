import React from 'react';
import moment from 'moment';

const MessageList = (props) => {
  const { isNew, messages, currentChatId } = props;

  return (
    <div className={isNew ? 'messageWrapperNew' : 'messageWrapper'}>
      {
        messages.filter((m) => m.chat_id === currentChatId).map((m, i) => (
          <div key={m.id} className="message">
            <div className="messageNameTime">
              <div className="messageName">
                <b>{m.user.username}</b>
              </div>
              <div className="messsageTime">
                <i>
                  {moment(m.timestamp).fromNow()}
                  {' '}
                </i>
              </div>
            </div>
            <div className="messageText">
              {m.text }
            </div>
          </div>
        ))
      }
      <div
        style={{ height: 0 }}
        id="lastMessage"
      />
    </div>
  );
};

export default MessageList;
