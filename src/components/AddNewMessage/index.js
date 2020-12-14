import React, { useState } from 'react';

const Textbox = (props) => {
  const { currentChatId } = props;
  const [value, setValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(process.env.REACT_APP_SERVER_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          chatId: currentChatId,
          text: value,
        }),
      });

      if (response.status === 200) {
        setValue('');
      } else {
        alert('There was an error while saving your message');
      }
    } catch (err) {
      alert('There was an error while saving your message.');
    }
  };

  return (
    <form onSubmit={sendMessage}>
      <div className="textboxWrapper">
        <input
          id="textbox"
          className="textbox typoTextbox"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          autoComplete="off"
        />
        <button type="submit" className="sendButton typoButton" onClick={sendMessage}>
          Send
        </button>
      </div>
    </form>
  );
};

export default Textbox;
