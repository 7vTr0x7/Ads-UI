import DataLoader from "dataloader";
import fetch from "node-fetch";

const PRODUCTS_SERVICE_URL = "http://localhost:5001/products";

export const productLoader = new DataLoader(async (ids: readonly string[]) => {
  // Batch load products by ids
  const results = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`${PRODUCTS_SERVICE_URL}/${id}`);
      if (!res.ok) return null;
      return res.json();
    })
  );
  return results;
});
