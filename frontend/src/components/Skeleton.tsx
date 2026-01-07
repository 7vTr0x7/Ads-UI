export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${
        className ? className : "h-24 w-full"
      }`}
      aria-busy="true"
      aria-label="Loading content"
    />
  );
}
