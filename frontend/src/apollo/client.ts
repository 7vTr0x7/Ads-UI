import { HttpLink } from "@apollo/client";
import { ApolloLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  })
);

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        productListing: {
          keyArgs: false,
          merge(existing = { products: [], ads: [] }, incoming) {
            // Merge products with pagination support
            return {
              products: [...existing.products, ...incoming.products],
              ads: incoming.ads, // Ads can be replaced, no merge needed
            };
          },
        },
      },
    },
    Product: {
      keyFields: ["id"],
    },
    AdSlot: {
      keyFields: ["id"],
    },
  },
});

export const client = new ApolloClient({
  link: splitLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
