import { PubSub } from "graphql-subscriptions";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type Ad = {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
};

const pubsub = new PubSub();

// Dummy products and ads
const DUMMY_PRODUCTS: Product[] = Array.from({ length: 25 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `Product ${i + 1}`,
  description: `Description for Product ${i + 1}`,
  price: 100 + i * 5,
}));

const DUMMY_ADS: Ad[] = [
  { id: "a1", title: "Ad 1", imageUrl: "/ad1.png", targetUrl: "#" },
  { id: "a2", title: "Ad 2", imageUrl: "/ad2.png", targetUrl: "#" },
  { id: "a3", title: "Ad 3", imageUrl: "/ad3.png", targetUrl: "#" },
];

export const resolvers = {
  Query: {
    productListing: async (
      _parent: any,
      args: { page: number; pageSize: number }
    ) => {
      const { page, pageSize } = args;

      // Paginate products
      const start = (page - 1) * pageSize;
      const paginatedProducts = DUMMY_PRODUCTS.slice(start, start + pageSize);

      return {
        products: paginatedProducts,
        ads: DUMMY_ADS,
      };
    },
  },

  Subscription: {
    productPriceUpdated: {
      subscribe: (_parent: any, args: { productId: string }) => {
        return pubsub.asyncIterator(`PRODUCT_PRICE_UPDATED_${args.productId}`);
      },
    },
  },

  Product: {
    id: (parent: any) => parent.id,
  },
};

// Simulate random price updates every 30 seconds
setInterval(() => {
  const randomIndex = Math.floor(Math.random() * DUMMY_PRODUCTS.length);
  const product = DUMMY_PRODUCTS[randomIndex];

  // Update price randomly
  const newPrice = product.price + Math.floor(Math.random() * 20 - 10);
  product.price = Math.max(newPrice, 0); // Ensure price is not negative

  pubsub.publish(`PRODUCT_PRICE_UPDATED_${product.id}`, {
    productPriceUpdated: product,
  });

  console.log(`Published price update for ${product.id}: ₹${product.price}`);
}, 30000);
