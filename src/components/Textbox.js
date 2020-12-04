import React from "react";
import "../App.css";

export default class Textbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  handleTyping(text) {
    this.setState({
      text
    });
  }

  sendMessage = e => {
    e.preventDefault();
    fetch(process.env.REACT_APP_SERVER_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        chatId: this.props.currentChatId,
        text: this.state.text
      })
    })
      .then(res => {
        if (res.status !== 200) {
          alert("There was an error while saving your message");
        } else {
          this.setState({ text: "" });
        }
      })
      .catch(e => {
        alert(
          "There was a problem with the network. Please check your connection and try again."
        );
      });
  };

  render() {
    return (
      <form onSubmit={this.sendMessage}>
        <div className="textboxWrapper">
          <input
            id="textbox"
            className="textbox typoTextbox"
            value={this.state.text}
            autoFocus={true}
            onChange={e => {
              this.handleTyping(e.target.value);
            }}
            autoComplete="off"
          />
          <button className="sendButton typoButton" onClick={this.sendMessage}>
            {" "}
            Send{" "}
          </button>
        </div>
      </form>
    );
  }
}
