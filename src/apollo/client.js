import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const link = new HttpLink({ uri:"https://subgraph.gamut.exchange/subgraphs/name/gamut-subgraph-kava" });

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
