export default function Pagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        className="px-3 py-1 rounded border text-sm disabled:opacity-40"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`px-3 py-1 rounded text-sm border ${
            p === currentPage
              ? "bg-green-600 text-white border-green-600"
              : "hover:bg-gray-100"
          }`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="px-3 py-1 rounded border text-sm disabled:opacity-40"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ▶
      </button>
    </div>
  );
}
