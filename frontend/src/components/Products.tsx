import { UPDATE_PRODUCT_PRICE } from "@/graphql/products.mutation";
import { useMutation } from "@apollo/client/react";
import React from "react";
import ProductCard from "./ProductCard";

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

const Products: React.FC<{ data: ProductListingData | undefined }> = ({
  data,
}) => {
  /* -----------------------
         Mutation: Update Price
      ----------------------- */
  const [updatePrice] = useMutation<
    UpdateProductPriceData,
    UpdateProductPriceVars
  >(UPDATE_PRODUCT_PRICE);

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

  return (
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
  );
};

export default Products;
