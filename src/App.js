import React from "react";
import Main from "./components/Main";
import "./App.css";

import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { ApolloProvider } from "react-apollo";
const HASURA_GRAPHQL_ENGINE_HOSTNAME = process.env.REACT_APP_GRAPHQL_ENDPOINT;

const scheme = proto => {
  return window.location.protocol === "https:" ? `${proto}s` : proto;
};
export const GRAPHQL_ENDPOINT = `${scheme(
  "http"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
export const WEBSOCKET_ENDPOINT = `${scheme(
  "ws"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;

const getClient = authState => {
  const headers = { Authorization: `Bearer ${authState.token}` };
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    headers
  });
  const mkWsLink = uri => {
    const subClient = new SubscriptionClient(WEBSOCKET_ENDPOINT, {
      reconnect: true,
      connectionParams: {
        headers
      }
    });
    return new WebSocketLink(subClient);
  };

  const wsLink = mkWsLink(GRAPHQL_ENDPOINT);
  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      addTypename: false
    })
  });

  return client;
};

const App = props => {
  return (
    <ApolloProvider client={getClient(props.authState)}>
      <div width="100%" className="app">
        {" "}
        <Main {...props} />{" "}
      </div>
    </ApolloProvider>
  );
};

export default App;
