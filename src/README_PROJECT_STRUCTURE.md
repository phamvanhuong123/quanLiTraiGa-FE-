Feature-based project structure for Chicken Management System

src/
  api/             # axiosClient.js (Config), authApi.js, inventoryApi.js
  assets/          # Images, Icons
  components/      # Shared UI (Loading, PageHeader, CustomButton...)
  features/        # Complex business logic (separated from pages)
    auth/
    inventory/
    farming/
    dashboard/
  layouts/         # MainLayout.jsx (Sidebar + Header), AuthLayout.jsx
  pages/           # Route pages (use features inside)
    auth/
    dashboard/
    inventory/
    farming/
    finance/
    master-data/
  redux/
    slices/
  routes/          # AppRouter.jsx
  utils/           # constants.js, formatters.js
