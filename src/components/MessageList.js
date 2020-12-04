import React from 'react';
import '../App.js';
import '../App.css';
import moment from 'moment';

export default class MessageList extends React.Component {
  render() {
    const { isNew } = this.props;
    return (
      <div className={isNew ? "messageWrapperNew" : "messageWrapper"}>
        {
          this.props.messages.filter(m => m.chat_id == this.props.currentChatId).map((m, i) => {
            return (
              <div key={m.id} className="message">
                <div className="messageNameTime">
                  <div className="messageName">
                    <b>{m.user.username}</b>
                  </div>
                  <div className="messsageTime">
                    <i>{moment(m.timestamp).fromNow()} </i>
                  </div>
                </div>
                <div className="messageText">
                  {m.text }
                </div>
              </div>
            );
          })
        }
        <div
          style={{ "height": 0 }}
          id="lastMessage"
        >
        </div>
      </div>
    );
  }
};
