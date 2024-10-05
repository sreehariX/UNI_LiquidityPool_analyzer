// apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://gateway.thegraph.com/api/db60867b9ab4845ad52a7e34ef901b8f/subgraphs/id/HUZDsRpEVP2AvzDCyzDHtdc64dyDxx8FQjzsmqSg4H3B',
  cache: new InMemoryCache(),
});

export default client;