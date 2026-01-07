import { useQuery, useSubscription } from "@apollo/client/react";
import { useState } from "react";

import { PRODUCT_LISTING } from "@/graphql/products.queries";
import { PRODUCT_UPDATED } from "@/graphql/products.subscriptions";

import AdSlot from "./AdSlot";
import Products from "./Products";
import Skeleton from "./Skeleton";

/* =======================
   Types
======================= */

interface Product {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
}

interface Ad {
  id: string;
}

interface ProductListingData {
  productListing: {
    products: Product[];
    ads: Ad[];
  };
}

interface ProductListingVars {
  page: number;
  pageSize: number;
}

interface ProductUpdatedData {
  productUpdated: {
    id: string;
    price: number;
  };
}

/* =======================
   Component
======================= */

export default function ProductList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* -----------------------
     Query: Product Listing
  ----------------------- */
  const { data, loading, error, fetchMore } = useQuery<
    ProductListingData,
    ProductListingVars
  >(PRODUCT_LISTING, {
    variables: { page, pageSize },
    notifyOnNetworkStatusChange: true,
  });

  /* -----------------------
     Subscription: Price Updates
  ----------------------- */
  useSubscription<ProductUpdatedData>(PRODUCT_UPDATED, {
    onData({ client, data }) {
      const updatedProduct = data.data?.productUpdated;
      if (!updatedProduct) return;

      client.cache.modify({
        id: client.cache.identify({
          __typename: "Product",
          id: updatedProduct.id,
        }),
        fields: {
          price() {
            return updatedProduct.price;
          },
        },
      });
    },
  });

  /* -----------------------
     Loading/Error
  ----------------------- */
  if (loading && !data) return <Skeleton className="h-96" />;
  if (error) return <div>Error loading products</div>;

  /* -----------------------
     Load More Pagination
  ----------------------- */
  const loadMore = () => {
    fetchMore({
      variables: { page: page + 1, pageSize },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          productListing: {
            products: [
              ...prev.productListing.products,
              ...fetchMoreResult.productListing.products,
            ],
            ads: fetchMoreResult.productListing.ads,
          },
        };
      },
    });
    setPage((prev) => prev + 1);
  };

  /* -----------------------
     Render
  ----------------------- */
  return (
    <div className="space-y-6">
      {/* Ads */}
      {data?.productListing.ads.length ? (
        data.productListing.ads.map((ad) => <AdSlot key={ad.id} />)
      ) : (
        <AdSlot />
      )}

      {/* Products Grid */}
      <Products data={data} />
      {/* Load More */}
      <button
        onClick={loadMore}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Load More
      </button>
    </div>
  );
}
