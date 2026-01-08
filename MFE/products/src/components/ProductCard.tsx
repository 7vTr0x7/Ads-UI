interface Product {
  imageUrl: string;
  title: string;
  price: number;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border p-4 h-[200px] flex flex-col justify-between">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="h-24 w-full object-cover mb-2"
        loading="lazy"
      />
      <div className="font-semibold text-lg">{product.title}</div>
      <div className="text-green-700 font-bold">₹{product.price}</div>
    </div>
  );
}
