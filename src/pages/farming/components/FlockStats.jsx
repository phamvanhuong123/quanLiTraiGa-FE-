export default function FlockStats({ flocks }) {
  const totalInitial = flocks.reduce((s, f) => s + (f.initialQuantity || 0), 0);
  const totalCurrent = flocks.reduce((s, f) => s + (f.currentQuantity || 0), 0);

  const raisingCount = flocks.filter(
    (f) => f.status === "RAISING" || f.status === "Đang nuôi"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Tổng đàn" value={flocks.length} icon="🐔" />
      <StatCard
        title="SL ban đầu"
        value={formatNumber(totalInitial)}
        icon="📦"
      />
      <StatCard
        title="SL hiện tại"
        value={formatNumber(totalCurrent)}
        icon="✅"
      />
      <StatCard title="Đang nuôi" value={raisingCount} icon="🌱" />
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>

      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-lg">{icon}</span>
      </div>
    </div>
  );
}

function formatNumber(n) {
  return new Intl.NumberFormat("vi-VN").format(n);
}
