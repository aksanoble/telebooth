import { ApolloConsumer } from 'react-apollo';
import React from 'react';
import Chat from './Chat';
// import Login from './Login';
import LandingPage from './LandingPage';
import '../App.css';

export default class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      username: "aksanoble",
      currentChatId:null,
      userId: 1
    };
  }

  // set username
  setUsername = (username) => {
    this.setState({
      username
    })
  }

  setCurrentChatId = (id) => {
    this.setState({
      currentChatId: id
    })
  }
  
  // check usernme and  perform login
  login = (id) => {
    this.setState({
      isLoggedIn: true,
      userId: id
    })
  }

  render() {
    const { username, isLoggedIn, userId, currentChatId } = this.state;
    // Login if not logged in and head to chat
    return (
      <div className="app">
            <ApolloConsumer>
              {
                (client) => {
                  return (
                    <Chat
                      userId={userId}
                      username={username}
                      client={client}
                      setCurrentChatId={this.setCurrentChatId}
                      currentChatId={currentChatId}
                    />
                  );
                }
              }

            </ApolloConsumer>
      </div>
    )
  }
};
