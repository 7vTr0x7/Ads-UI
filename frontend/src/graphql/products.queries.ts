import { gql } from "@apollo/client";
import { PRODUCT_CARD_FRAGMENT } from "./products.fragments";

export const PRODUCT_LISTING = gql`
  query ProductListing($page: Int!, $pageSize: Int!) {
    productListing(page: $page, pageSize: $pageSize) {
      products {
        ...ProductCard
      }
      ads {
        id
        position
        creativeUrl
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
