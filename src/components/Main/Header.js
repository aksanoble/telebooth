import React, { useContext } from 'react';
import {
  Heading, Flex, Button,
} from "@chakra-ui/react";

import authContext from "../../contexts/authContext";
import { logout } from "../../apis/firebase";

const Header = () => {
  const { setAuthState } = useContext(authContext);

  const signOut = async () => {
    try {
      setAuthState({ status: "loading" });
      await logout();
      setAuthState({ status: "out" });
    } catch (err) {
      alert("Error while logging out.");
    }
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      backgroundColor="#5682a3"
      width="100%"
      color="white"
      position="fixed"
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing="-.1rem">
          Telebooth
        </Heading>
      </Flex>
      <Flex align="rigth" mr={5}>
        <Button colorScheme="#5682a3" variant="teal" onClick={signOut}>
          Sign out
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
