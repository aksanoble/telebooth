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
  MenuList,
  Box
} from "@chakra-ui/react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

const fetchOnlineUsersSubscription = gql`
  subscription {
    online_users {
      user_id
      timestamp: ts
      username
      is_bot
      is_unread
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

          console.log(data, "RESULT");
          return (
            <div>
              <Flex
                justifyContent="space-between"
                height="30px"
                bg="#2E5EAA"
                p="10px"
              >
                <Menu>
                  Telebooth ({!data.online_users ? 0 : data.online_users.length}
                  )
                  <MenuButton>
                    <IoEllipsisVerticalSharp />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={this.props.signOut}>Sign out</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <ul className="userList">
                {data.online_users
                  .filter(u => !u.is_bot)
                  .map(u => {
                    return (
                      <li
                        onClick={() => {
                          this.props.setCurrentChatId(u.user_id);
                        }}
                        key={u.user_id}
                      >
                        {u.username}
                        {u.is_unread && (
                          <Box
                            width="20px"
                            height="20px"
                            borderRadius="20px"
                            backgroundColor="tomato"
                          ></Box>
                        )}
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
