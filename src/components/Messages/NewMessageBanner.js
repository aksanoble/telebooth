/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */

import React from 'react';

const NewMessageBanner = (props) => {
  const { numOfNewMessages } = props;

  if (!numOfNewMessages) {
    return null;
  }

  return (
    <div
      className="banner"
      onClick={props.scrollToNewMessage}
      role="button"
    >
      {`You have ${numOfNewMessages} new message(s)`}
    </div>
  );
};

export default NewMessageBanner;
