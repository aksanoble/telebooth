import React from "react";
import { Subscription } from "react-apollo";
import moment from "moment";
import gql from "graphql-tag";
import {
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuItem,
  MenuList
} from "@chakra-ui/react";
// import { ChevronDownIcon } from "@chakra-ui/react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

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
              <Flex
                justifyContent="space-between"
                height="30px"
                bg="#2E5EAA"
                p="10px"
              >
                <Menu>
                  MountBlue ({!data.user ? 0 : data.user.length})
                  <MenuButton>
                    <IoEllipsisVerticalSharp />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={this.props.signOut}>Sign out</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <ul className="userList">
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
            </div>
          );
        }}
      </Subscription>
    );

    return (
      <div>
        <div className="onlineUsers">{subscriptionData(false)}</div>
      </div>
    );
  }
}

export default OnlineUsers;
