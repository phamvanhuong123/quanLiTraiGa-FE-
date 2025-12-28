import dayjs from "dayjs";

export const mockInventory = [
  {
    id: 1,
    batchCode: "MAT-001",
    material: { id: 1, name: "Cám gà con" },
    supplier: { id: 1, name: "Cám Bình Định" },
    quantityImported: 1000,
    quantityRemaining: 600,
    pricePerUnit: 12000,
    importDate: dayjs().subtract(7, "day"),
    expiryDate: dayjs().add(5, "day"), // sắp hết hạn
  },
  {
    id: 2,
    batchCode: "MAT-002",
    material: { id: 2, name: "Cám gà thịt" },
    supplier: { id: 1, name: "Cám Bình Định" },
    quantityImported: 1500,
    quantityRemaining: 1500,
    pricePerUnit: 11000,
    importDate: dayjs().subtract(15, "day"),
    expiryDate: dayjs().add(60, "day"),
  },
];
