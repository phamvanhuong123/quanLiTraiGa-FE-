export default function StatusBadge({ status }) {
  const isRaising =
    status === "RAISING" || status === "Đang nuôi" || status === "Raising";

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        isRaising ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
      }`}
    >
      {isRaising ? "Đang nuôi" : status || "-"}
    </span>
  );
}
