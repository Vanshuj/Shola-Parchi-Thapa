export default function MarigoldGarland() {
  const flowers = Array.from({ length: 12 });
  return (
    <div className="flex justify-center gap-1 py-2" aria-hidden="true">
      {flowers.map((_, i) => (
        <span
          key={i}
          className="text-xl"
          style={{ transform: `translateY(${Math.sin(i) * 4}px)` }}
        >
          🌼
        </span>
      ))}
    </div>
  );
}
