import ProductList from "../components/ProductList";

export default function ProductListing() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductList />
    </div>
  );
}
