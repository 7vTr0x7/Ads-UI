import { PRODUCT_LISTING } from "@/graphql/products.queries";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useState } from "react";
import AdSlot from "./AdSlot";
import ProductCard from "./ProductCard";
import Skeleton from "./Skeleton";
import { UPDATE_PRODUCT_PRICE } from "@/graphql/products.mutation";

interface Product {
  imageUrl: string;
  title: string;
  price: number;
}

export default function ProductList() {
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, loading, error, fetchMore } = useQuery(PRODUCT_LISTING, {
    variables: { page, pageSize },
    notifyOnNetworkStatusChange: true,
  });

  // Subscription for product price updates - real-time updates
  useSubscription(UPDATE_PRODUCT, {
    onData({ client, data }) {
      const updatedProduct = data.data?.productUpdated;
      if (!updatedProduct) return;

      // Update Apollo cache manually for optimistic UI refresh
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

  // Mutation example with optimistic UI
  const [updatePrice] = useMutation(UPDATE_PRODUCT_PRICE);

  if (loading && !data) return <Skeleton className="h-96" />;

  if (error) return <div>Error loading products</div>;

  // Pagination load more handler
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
    setPage(page + 1);
  };

  return (
    <div className="space-y-6">
      {/* Ads at top */}
      {data.productListing.ads && data.productListing.ads.length > 0 ? (
        data.productListing.ads.map((ad: any) => <AdSlot key={ad.id} />)
      ) : (
        <AdSlot />
      )}

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.productListing.products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

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
