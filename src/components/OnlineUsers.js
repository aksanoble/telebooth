import React from "react";
import { Subscription } from "react-apollo";
import moment from "moment";
import gql from "graphql-tag";

const fetchOnlineUsersSubscription = gql`
  subscription {
    user(order_by: { username: asc }) {
      id
      username
      is_bot
    }
  }
`;

class OnlineUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment()
        .subtract(10, "seconds")
        .format(),
      refetch: null,
      showMobileView: false
    };
  }

  toggleMobileView = () => {
    this.setState({
      showMobileView: !this.state.showMobileView
    });
  };

  render() {
    const subscriptionData = isMobileView => (
      <Subscription subscription={fetchOnlineUsersSubscription}>
        {({ data, error, loading }) => {
          if (loading) {
            return null;
          }
          if (error) {
            console.log(error, "Error");
            return "Error loading online users";
          }
          return (
            <div>
              <p
                className={
                  isMobileView ? "mobileuserListHeading" : "userListHeading"
                }
                onClick={this.toggleMobileView}
              >
                Contacts ({!data.user ? 0 : data.user.length}){" "}
                {isMobileView && <i className="fa fa-angle-up"></i>}
              </p>
              {((isMobileView && this.state.showMobileView) ||
                !isMobileView) && (
                <ul className={isMobileView ? "mobileUserList" : "userList"}>
                  {data.user
                    .filter(u => !u.is_bot)
                    .map(u => {
                      return (
                        <li
                          onClick={() => {
                            this.props.setCurrentChatId(u.id);
                          }}
                          key={u.id}
                        >
                          {u.username}
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          );
        }}
      </Subscription>
    );

    return (
      <div>
        <div className="onlineUsers hidden-xs">{subscriptionData(false)}</div>
        <div className="mobileonlineUsers visible-xs">
          {subscriptionData(true)}
        </div>
      </div>
    );
  }
}

export default OnlineUsers;
