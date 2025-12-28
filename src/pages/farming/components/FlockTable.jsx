import FlockTableRow from "./FlockTableRow";

export default function FlockTable({ flocks, onViewDetail, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="w-1/4 px-4 py-3 text-left font-semibold">
                Mã lứa
              </th>
              <th className="w-1/5 px-4 py-3 text-left font-semibold">Giống</th>
              <th className="w-1/5 px-4 py-3 text-left font-semibold">
                Ngày nhập
              </th>
              <th className="w-1/5 px-4 py-3 text-center font-semibold">Tồn</th>
              <th className="w-1/5 px-4 py-3 text-center font-semibold">
                Trạng thái
              </th>
              <th className="w-[140px] px-4 py-3 text-center font-semibold">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            {flocks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  Chưa có dữ liệu đàn gà
                </td>
              </tr>
            ) : (
              flocks.map((flock) => (
                <FlockTableRow
                  key={flock._id || flock.id}
                  flock={flock}
                  onViewDetail={onViewDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
