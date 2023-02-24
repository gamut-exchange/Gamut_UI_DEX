import { ApolloClient, InMemoryCache, HttpLink, Hawk, credentials } from '@apollo/client'

const customFetch = (uri, options) => {
  const { header } = Hawk.client.header(
    "http://65.109.205.22:8000/subgraphs/name/gamut-subgraph-kava",
    "POST",
    { credentials: credentials, ext: "some-app-data" }
  );
  options.headers.Authorization = header;
  return fetch(uri, options);
};

const link = new HttpLink({ fetch: customFetch });

export const kavaClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    typePolicies: {
      Token: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
      Pool: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
    },
  }),
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})
