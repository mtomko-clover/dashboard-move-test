import ApolloClient from "apollo-boost";

// const { REACT_APP_GRAPHQL_SERVER } = process.env;
const  REACT_APP_GRAPHQL_SERVER  = "http://localhost:4000";

const client = new ApolloClient({
  uri: REACT_APP_GRAPHQL_SERVER
});

export default client;
