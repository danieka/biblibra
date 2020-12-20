import { ApolloClient, HttpLink, split } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";

import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

let newURI;
if (window.location.protocol === "https:") {
  newURI = "wss:";
} else {
  newURI = "ws:";
}

const wsLink = new WebSocketLink({
  // subscriptions-transport-ws package needs to be installed also
  uri: `${newURI}//${window.location.hostname}:8080/v1/graphql`,
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: `${window.location.protocol}//${window.location.hostname}:8080/v1/graphql`,
});

console.error(
  `${window.location.protocol}//${window.location.hostname}:8080/v1/graphql`,
  httpLink
);

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

// REMOVE authLink FOR HTTPONLY_TOKEN
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  let token = "";
  const item = localStorage.getItem("session"); // survive a refresh
  if (item) {
    const user = JSON.parse(item);
    token = user.token;
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // TBD - take into account refresh token and revocation
    },
  };
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: authLink.concat(link), // REMOVE authLink FOR HTTPONLY_TOKEN
  cache,
  connectToDevTools: true,
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) console.log("networkError", networkError);
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.name === "AuthenticationError") {
        }
        console.dir("graphQLErrors", err);
      }
    }
  },
});
