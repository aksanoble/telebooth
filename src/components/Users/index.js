/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useContext } from "react";
import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

import { logout } from "../../apis/firebase";
import authContext from "../../contexts/authContext";
import appContext from "../../contexts/appContext";

const fetchOnlineUsersSubscription = gql`
  subscription {
    online_users {
      user_id
      timestamp: ts
      username
      is_bot
    }
  }
`;

const Users = () => {
  const { loading, data, error } = useSubscription(
    fetchOnlineUsersSubscription
  );
  const { setAuthState } = useContext(authContext);
  const { updateState } = useContext(appContext);

  const signOut = async () => {
    try {
      setAuthState({ status: "loading" });
      await logout();
      setAuthState({ status: "out" });
    } catch (err) {
      alert("Error while logging out.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="onlineUsers">
      <Flex justifyContent="space-between" height="30px" bg="#2E5EAA" p="10px">
        <Menu>
          Telebooth ({!data.online_users ? 0 : data.online_users.length})
          <MenuButton>
            <IoEllipsisVerticalSharp />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={signOut}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <ul className="userList">
        {data.online_users
          .filter(u => !u.is_bot)
          .map(u => (
            <li
              onClick={() => {
                updateState({ currentChatId: u.user_id });
              }}
              key={u.user_id}
            >
              {u.username}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Users;
