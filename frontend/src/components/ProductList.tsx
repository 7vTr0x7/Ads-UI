import { useState } from "react";
import { useQuery, useSubscription, useMutation } from "@apollo/client/react";

import { PRODUCT_LISTING } from "@/graphql/products.queries";
import { UPDATE_PRODUCT_PRICE } from "@/graphql/products.mutation";
import { PRODUCT_UPDATED } from "@/graphql/products.subscriptions";

import AdSlot from "./AdSlot";
import ProductCard from "./ProductCard";
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

interface UpdateProductPriceData {
  updateProductPrice: {
    id: string;
    price: number;
    __typename: "Product";
  };
}

interface UpdateProductPriceVars {
  id: string;
  price: number;
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
     Mutation: Update Price
  ----------------------- */
  const [updatePrice] = useMutation<
    UpdateProductPriceData,
    UpdateProductPriceVars
  >(UPDATE_PRODUCT_PRICE);

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
     Handler: Increase Price by 10
  ----------------------- */
  const handleIncreasePrice = (product: Product) => {
    updatePrice({
      variables: {
        id: product.id,
        price: product.price + 10,
      },
      optimisticResponse: {
        updateProductPrice: {
          __typename: "Product",
          id: product.id,
          price: product.price + 10,
        },
      },
      update: (cache, { data }) => {
        if (!data?.updateProductPrice) return;

        cache.modify({
          id: cache.identify({ __typename: "Product", id: product.id }),
          fields: {
            price() {
              return data.updateProductPrice.price;
            },
          },
        });
      },
    });
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.productListing.products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} />
            {/* Button to increase price */}
            <button
              className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 text-xs rounded"
              onClick={() => handleIncreasePrice(product)}
            >
              +₹10
            </button>
          </div>
        ))}
      </div>

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
