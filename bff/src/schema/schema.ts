import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
    stock: Int!
  }

  type Ad {
    id: ID!
    title: String!
    imageUrl: String!
    targetUrl: String!
  }

  type ProductListing {
    products: [Product!]!
    ads: [Ad!]!
  }

  type Query {
    productListing: ProductListing!
  }

  type Subscription {
    productPriceUpdated(productId: ID!): Product
  }
`;
