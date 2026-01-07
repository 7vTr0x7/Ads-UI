import { gql } from "@apollo/client";

export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCard on Product {
    id
    title
    price
    imageUrl
  }
`;
