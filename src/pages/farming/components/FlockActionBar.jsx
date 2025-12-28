export default function FlockActionBar({ keyword, onKeywordChange, onAdd }) {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">🔎</span>
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Tìm kiếm theo mã lứa, tên đàn, giống..."
            className="border rounded-xl pl-9 pr-3 py-2 w-[320px] focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-sm"
      >
        + Thêm đàn mới
      </button>
    </div>
  );
}
