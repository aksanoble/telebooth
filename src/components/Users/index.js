/* eslint-disable react/no-children-prop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useContext } from "react";
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
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Button,
  useToast
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  fetchOnlineUsersSubscription,
  UPDATE_USER
} from "../../globals/global.gqlqueries";

import appContext from "../../contexts/appContext";

const Users = () => {
  const { loading, data } = useSubscription(fetchOnlineUsersSubscription);
  const { appState, updateState } = useContext(appContext);

  console.log(appState, "Appstate");
  const [
    updateUser,
    { data: userData, loading: loadingUser, error: userError }
  ] = useMutation(UPDATE_USER);
  const toast = useToast();

  if (loadingUser) {
    toast({
      title: "Account created.",
      description: "We've created your account for you.",
      status: "success",
      duration: 2000,
      position: "bottom-left",
      isClosable: true
    });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const toggleReadStatus = u => {
    updateUser({
      variables: {
        id: u.user_id,
        is_unread: !u.is_unread
      }
    });
  };

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
          .filter(u => !u.is_bot)
          .map(u => {
            const selected = appState.currentChatId === u.user_id;

            return (
              <Box
                w="100%"
                p={4}
                mt={0}
                color="white"
                backgroundColor={selected ? "#5682a3" : "#ffffff"}
                onClick={() => updateState({ currentChatId: u.user_id })}
                key={u.user_id}
                _hover={{
                  background: selected ? "#5682a3" : "#f0f0f0",
                  cursor: "pointer"
                }}
              >
                <Text color={selected ? "white" : "black"}>
                  {u.first_name || u.user_id}
                </Text>
                {u.is_unread && (
                  <Box
                    width="20px"
                    height="20px"
                    borderRadius="20px"
                    backgroundColor="tomato"
                  ></Box>
                )}
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  ></MenuButton>
                  <MenuList>
                    {u.is_unread ? (
                      <MenuItem
                        onClick={() => {
                          toggleReadStatus(u);
                        }}
                      >
                        Mark as read
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          toggleReadStatus(u);
                        }}
                      >
                        Mark as unread
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </Box>
            );
          })}
      </Stack>
    </div>
  );
};

export default Users;
