// ================= MOCK DATABASE =================
let flocks = [
  {
    id: 1,
    name: "Gà Tết 2025",
    code: "GATET2025",
    breed: "Gà Ri",
    speciesId: "Gà Ri",
    coop: "Chuồng A1",
    importDate: "2024-10-01",
    initialQuantity: 1000,
    currentQuantity: 980,
    status: "Đang nuôi",
  },
  {
    id: 2,
    name: "Gà Tre",
    code: "GATRE2025",
    breed: "Gà tre",
    speciesId: "Gà Tre",
    coop: "Chuồng A2",
    importDate: "2024-10-01",
    initialQuantity: 1000,
    currentQuantity: 500,
    status: "Đang nuôi",
  },
];

// ================= MOCK DROPDOWN =================
const breeds = [
  { id: 1, name: "Gà Ri" },
  { id: 2, name: "Gà Tam Hoàng" },
];

const suppliers = [
  { id: 1, name: "Trại giống Minh Phú" },
  { id: 2, name: "CP Việt Nam" },
];

const coops = [
  { id: 1, name: "Chuồng A1", status: "EMPTY" },
  { id: 2, name: "Chuồng B2", status: "EMPTY" },
];

// ================= API =================
export const flockAPI = {
  // LIST
  getFlocks() {
    return Promise.resolve({ data: flocks });
  },

  // DETAIL (🔥 FIX QUAN TRỌNG)
  getFlockById(id) {
    const flock = flocks.find((f) => String(f.id) === String(id));
    return Promise.resolve({ data: flock || null });
  },

  // DROPDOWN
  getBreeds() {
    return Promise.resolve({ data: breeds });
  },

  getSuppliers() {
    return Promise.resolve({ data: suppliers });
  },

  getEmptyCoops() {
    return Promise.resolve({
      data: coops.filter((c) => c.status === "EMPTY"),
    });
  },

  // IMPORT
  importFlock(payload) {
    const newFlock = {
      id: Date.now(),
      name: payload.name,
      code: payload.name.replace(/\s+/g, "").toUpperCase(),
      breed: payload.breed,
      speciesId: payload.breed,
      coop: payload.coop,
      importDate: payload.importDate,
      initialQuantity: payload.quantity,
      currentQuantity: payload.quantity,
      status: "Đang nuôi",
    };

    flocks.unshift(newFlock);

    return Promise.resolve({ data: newFlock });
  },
  //Bán đàn
  sellFlock(payload) {
    // MOCK: cập nhật lại đàn
    const idx = flocks.findIndex(
      (f) => String(f.id) === String(payload.flockId)
    );

    if (idx !== -1) {
      flocks[idx] = {
        ...flocks[idx],
        currentQuantity: flocks[idx].currentQuantity - payload.soldQuantity,
        status: payload.closeFlock ? "Đã bán" : flocks[idx].status,
      };
    }

    return Promise.resolve({ data: payload });
  },
};
