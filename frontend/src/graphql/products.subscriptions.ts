import { gql } from "@apollo/client";

export const PRODUCT_UPDATED = gql`
  subscription ProductUpdated {
    productUpdated {
      id
      price
    }
  }
`;
