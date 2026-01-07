import { PubSub } from "graphql-subscriptions";
import fetch from "node-fetch";

const pubsub = new PubSub();
const PRODUCTS_SERVICE_URL = "http://localhost:5001/products";
const ADS_SERVICE_URL = "http://localhost:5002/ads";

export const resolvers = {
  Query: {
    productListing: async () => {
      // Fetch products list
      const productsRes = await fetch(`${PRODUCTS_SERVICE_URL}`);
      if (!productsRes.ok) throw new Error("Failed to fetch products");
      const products = await productsRes.json();

      // Fetch ads list with partial failure handling
      let ads = [];
      try {
        const adsRes = await fetch(`${ADS_SERVICE_URL}`);
        if (!adsRes.ok) throw new Error("Ads fetch failed");
        ads = await adsRes.json();
      } catch (e) {
        console.error("Ads service failed:", e.message);
        // Partial failure: Return empty ads but still show products
      }

      return { products, ads };
    },
  },

  Subscription: {
    productPriceUpdated: {
      subscribe: (_parent: any, args: { productId: string }) => {
        // In real app, you'd filter by productId and use real pubsub backend
        return pubsub.asyncIterator(`PRODUCT_PRICE_UPDATED_${args.productId}`);
      },
    },
  },

  Product: {
    id: (parent: any) => parent._id || parent.id,
  },
};

// Simulate product price update every 30s
setInterval(async () => {
  // Random product id for demo
  const randomProductId = "someProductId";

  // Fetch product from products-service
  const res = await fetch(`${PRODUCTS_SERVICE_URL}/${randomProductId}`);
  if (!res.ok) return;
  const updatedProduct = await res.json();

  // Publish update
  pubsub.publish(`PRODUCT_PRICE_UPDATED_${randomProductId}`, {
    productPriceUpdated: updatedProduct,
  });
}, 30000);
