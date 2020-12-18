import { ApolloClient, HttpLink, split } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:8080/v1/graphql",
});

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
  link: authLink.concat(httpLink), // REMOVE authLink FOR HTTPONLY_TOKEN
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
