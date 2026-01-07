import { gql } from "@apollo/client";

export const UPDATE_PRODUCT = gql`
  mutation UpdateProductPrice($productId: ID!, $newPrice: Int!) {
    updateProductPrice(productId: $productId, newPrice: $newPrice) {
      id
      price
    }
  }
`;
