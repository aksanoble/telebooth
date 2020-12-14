export const fetchMessages = gql`
  query($last_received_id: Int, $last_received_ts: timestamptz) {
    message(
      order_by: { timestamp: asc }
      where: {
        _and: {
          id: { _neq: $last_received_id }
          timestamp: { _gte: $last_received_ts }
        }
      }
    ) {
      id
      text
      user {
        username
      }
      timestamp
      chat_id
    }
  }
`;

export const fetchOnlineUsersSubscription = gql`
  subscription {
    online_users {
      user_id
      timestamp: ts
      username
      is_bot
    }
  }
`;

const addUser = gql`
  mutation ($username: String!) {
    insert_user (
      objects: [{
        username: $username
      }]
    ) {
      returning {
        id
        username
      }
    }
  }
`;

const subscribeToNewMessages = gql`
  subscription {
    message(order_by: { id: desc }, limit: 1) {
      id
      user {
        username
      }
      text
      timestamp
    }
  }
`;
