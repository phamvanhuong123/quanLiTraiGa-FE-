export default function FlockTableRow({
  flock,
  onViewDetail,
  onEdit,
  onDelete,
}) {
  const id = flock._id || flock.id;

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-4">
        {flock.batchCode || flock.code || flock.name || "-"}
      </td>

      <td className="px-4 py-4">{flock.breed?.name || flock.breed || "-"}</td>

      <td className="px-4 py-4">
        {flock.importDate
          ? new Date(flock.importDate).toLocaleDateString("vi-VN")
          : "-"}
      </td>

      <td className="px-4 py-4 text-center">
        {flock.currentQuantity ?? 0} / {flock.initialQuantity ?? 0}
      </td>

      <td className="px-4 py-4 text-center">{flock.status || "Đang nuôi"}</td>

      <td className="px-4 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button onClick={() => onViewDetail(id)}>👁</button>
          <button onClick={() => onEdit(flock)}>✏️</button>
          <button onClick={() => onDelete(id)}>🗑</button>
        </div>
      </td>
    </tr>
  );
}
