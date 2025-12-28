export default function ConfirmDeleteModal({
  open,
  title = "Xác nhận xoá",
  message = "Bạn có chắc chắn muốn xoá đàn này?",
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-[360px] p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">{title}</h2>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded border hover:bg-gray-100"
            onClick={onCancel}
          >
            Huỷ
          </button>

          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
