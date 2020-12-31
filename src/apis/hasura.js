import { ApolloClient } from '@apollo/client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const HASURA_GRAPHQL_ENGINE_HOSTNAME = process.env.REACT_APP_GRAPHQL_ENDPOINT;

const scheme = (proto) => (window.location.protocol === 'https:' ? `${proto}s` : proto);

const GRAPHQL_ENDPOINT = `${scheme('http')}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
const WEBSOCKET_ENDPOINT = `${scheme('ws')}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;

const mkWsLink = (headers) => {
  const subClient = new SubscriptionClient(WEBSOCKET_ENDPOINT, {
    reconnect: true,
    connectionParams: {
      headers,
    },
  });
  return new WebSocketLink(subClient);
};

const getClient = (authState) => {
  const headers = {
    Authorization: `Bearer ${authState.token}`,
  };

  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    headers,
  });
  const wsLink = mkWsLink(headers);
  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });

  return client;
};

export default getClient;
