/* eslint-disable react/no-children-prop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useContext } from "react";
import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import {
  Box, Text, Stack, InputGroup, InputLeftElement, Input,
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';

import appContext from "../../contexts/appContext";

const fetchOnlineUsersSubscription = gql`
  subscription {
    online_users {
      user_id
      timestamp: ts
      username
      first_name
      is_bot
    }
  }
`;

const Users = () => {
  const { loading, data } = useSubscription(
    fetchOnlineUsersSubscription,
  );
  const { appState, updateState } = useContext(appContext);

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
              children={
                <SearchIcon color="gray.300" />
              }
            />
            <Input type="text" placeholder="Search" />
          </InputGroup>
        </div>
        {data.online_users
          .filter((u) => !u.is_bot)
          .map((u) => {
            const selected = appState.currentChatId === u.user_id;

            return (
              <Box
                w="100%"
                p={4}
                mt={0}
                color="white"
                backgroundColor={selected ? '#5682a3' : '#ffffff'}
                onClick={() => updateState({ currentChatId: u.user_id })}
                key={u.user_id}
                _hover={{
                  background: selected ? '#5682a3' : "#f0f0f0",
                  cursor: "pointer",
                }}
              >
                <Text color={selected ? 'white' : 'black'}>{u.first_name || u.user_id}</Text>
              </Box>
            );
          })}
      </Stack>
    </div>
  );
};

export default Users;
