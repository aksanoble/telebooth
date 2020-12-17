/* eslint-disable react/no-children-prop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useContext, useEffect } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import {
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
  useToast,
} from "@chakra-ui/react";
import get from 'lodash.get';
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  fetchOnlineUsersSubscription,
  UPDATE_USER,
  MARK_READ_MESSAGE,
} from "../../globals/global.gqlqueries";

import appContext from "../../contexts/appContext";

const Users = () => {
  const usersState = useSubscription(fetchOnlineUsersSubscription);
  const { appState: { currentChatId }, messages, updateState } = useContext(appContext);
  const { loading, error } = usersState;
  let { data } = usersState;
  const toast = useToast();

  const [
    updateUser,
    { loading: loadingUser, error: userError, data: userData },
  ] = useMutation(UPDATE_USER);

  const [markReadMessages, { error: markReadError }] = useMutation(MARK_READ_MESSAGE);

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

  useEffect(() => {
    if (userError || error || markReadError) {
      toast({
        title: 'Alert',
        description: 'Something went wrong, please try again later',
        status: 'error',
        position: "bottom-left",
      });
    }
  }, [userError, error, markReadError]);

  useEffect(() => {
    if (currentChatId) {
      markReadMessages({
        variables: {
          chatId: currentChatId,
        },
      });
      updateUser({
        variables: {
          id: currentChatId,
          is_unread: false,
        },
      });
    }
  }, [data]);

  const onUserSelect = (chatId) => {
    updateState({ currentChatId: chatId });
    markReadMessages({
      variables: {
        chatId,
      },
    });
    updateUser({
      variables: {
        id: chatId,
        is_unread: false,
      },
    });
  };

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
            const selected = currentChatId === u.user_id;
            const unreadCount = messages.filter((message) => message.user.id === u.user_id && !message.read).length;

            return (
              <Flex
                w="100%"
                alignItems="center"
                p={4}
                mt={0}
                backgroundColor={selected ? "#f0f0f0" : "#ffffff"}
                onClick={() => onUserSelect(u.user_id)}
                key={u.user_id}
                _hover={{
                  background: "#f0f0f0",
                  cursor: "pointer",
                }}
              >
                <Text color="black" flex={1}>
                  {u.first_name || u.user_id}
                </Text>
                {(unreadCount || u.is_unread) && (
                  <Flex
                    width="20px"
                    height="20px"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="20px"
                    backgroundColor="#5682a3"
                  >
                    <Text textAlign="center" fontSize={12} color="white" fontWeight="bold">{unreadCount || ''}</Text>
                  </Flex>
                )}
                <Menu>
                  <MenuButton onClick={(e) => e.stopPropagation()}>
                    <ChevronDownIcon w={10} h={8} color="#2d3748a3" />
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
