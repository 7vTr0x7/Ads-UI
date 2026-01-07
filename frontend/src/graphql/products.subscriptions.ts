import { gql } from "@apollo/client";

export const PRODUCT_UPDATED = gql`
  subscription ProductPriceUpdated($productId: String!) {
    productPriceUpdated(productId: $productId) {
      id
      price
    }
  }
`;
