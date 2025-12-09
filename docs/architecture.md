# Architecture document (placeholder)

## Backend architecture
- Node + Express
- Single endpoint /api/sales that supports search, filters, sort, pagination
- In-memory dataset loader (or small DB like Mongo/Postgres)

## Frontend architecture
- React (Vite) app
- Components: SearchBar, FilterPanel, SalesTable, SortDropdown, Pagination
- Service: /src/services/api.js to call backend

## Data flow
Client -> API (query params) -> Service -> Response (page, total)

(Expand before submission)
