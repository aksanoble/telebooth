/* eslint-disable react/no-children-prop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useContext, useEffect } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import {
  Box,
  Text,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import get from 'lodash.get';
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  fetchOnlineUsersSubscription,
  UPDATE_USER,
} from "../../globals/global.gqlqueries";

import appContext from "../../contexts/appContext";

const Users = () => {
  let { loading, data } = useSubscription(fetchOnlineUsersSubscription);
  const { appState, updateState } = useContext(appContext);

  const [
    updateUser,
    { loading: loadingUser, error: userError, data: userData },
  ] = useMutation(UPDATE_USER);

  const toggleReadStatus = (u) => {
    updateUser({
      variables: {
        id: u.user_id,
        is_unread: !u.is_unread,
      },
    });
  };

  useEffect(() => {
    if (!loadingUser && userData) {
      const userId = get(userData, 'update_user.returning[0].id');
      const isUnread = get(userData, 'udpate_user.returning[0].is_unread');

      data = data.online_users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            is_unread: isUnread,
          };
        }

        return user;
      });
    }
  }, [loadingUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="onlineUsers">
      <Stack style={{ marginTop: 4 }}>
        <div className="search-bar-container">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input type="text" placeholder="Search" />
          </InputGroup>
        </div>
        {data.online_users
          .filter((u) => !u.is_bot)
          .map((u) => {
            const selected = appState.currentChatId === u.user_id;

            return (
              <Flex
                w="100%"
                alignItems='center'
                p={4}
                mt={0}
                backgroundColor={selected ? "#5682a3" : "#ffffff"}
                onClick={() => updateState({ currentChatId: u.user_id })}
                key={u.user_id}
                _hover={{
                  background: selected ? "#5682a3" : "#f0f0f0",
                  cursor: "pointer",
                }}
              >
                <Text color={selected ? "white" : "black"} flex={1}>
                  {u.first_name || u.user_id}
                </Text>
                {u.is_unread && (
                  <Box
                    width="20px"
                    height="20px"
                    pr="12px"
                    borderRadius="20px"
                    backgroundColor="#5682a3"
                  />
                )}
                <Menu>
                  <MenuButton onClick={(e) => e.stopPropagation()}>
                    <ChevronDownIcon w={10} h={8} color={selected ? '#ffffff' : '#2d3748a3'} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReadStatus(u);
                      }}
                    >
                      {u.is_unread ? 'Mark as read' : 'Mark as unread'}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            );
          })}
      </Stack>
    </div>
  );
};

export default Users;
