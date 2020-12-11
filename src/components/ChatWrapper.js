import React from "react";
import RenderMessages from "./RenderMessages";
import Textbox from "./Textbox";
import OnlineUsers from "./OnlineUsers";
import "../App.css";

export default class RenderMessagesProxy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refetch: null
    };
  }

  // Set mutation callback. For instantly adding messages to state after mutation
  setMutationCallback = mutationCallback => {
    this.setState({
      mutationCallback
    });
  };

  render() {
    return (
      <div className="chatWrapper">
        <div className="wd25">
          <OnlineUsers
            userId={this.props.userId}
            username={this.props.username}
            setCurrentChatId={this.props.setCurrentChatId}
            signOut={this.props.signOut}
          />
        </div>
        <div className="wd75">
          <RenderMessages
            refetch={this.props.refetch}
            setRefetch={this.props.setRefetch}
            setMutationCallback={this.setMutationCallback}
            username={this.props.username}
            userId={this.props.userId}
            currentChatId={this.props.currentChatId}
          />
          <Textbox
            username={this.props.username}
            mutationCallback={this.state.mutationCallback}
            userId={this.props.userId}
            currentChatId={this.props.currentChatId}
          />
        </div>
      </div>
    );
  }
}
