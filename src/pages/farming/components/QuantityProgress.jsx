export default function QuantityProgress({ current = 0, total = 0 }) {
  const safeCurrent = Number.isFinite(current) ? current : 0;
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0;

  const percent =
    safeTotal === 0
      ? 0
      : Math.max(0, Math.min(100, Math.round((safeCurrent / safeTotal) * 100)));

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs text-gray-700">
        {formatNumber(safeCurrent)} / {formatNumber(safeTotal)}
      </div>

      <div className="h-2 bg-gray-200 rounded mx-auto max-w-[180px] w-full">
        <div
          className="h-2 bg-green-500 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function formatNumber(n = 0) {
  return new Intl.NumberFormat("vi-VN").format(Number.isFinite(n) ? n : 0);
}
