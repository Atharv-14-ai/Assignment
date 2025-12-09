export default function SortDropdown({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ marginBottom: 12 }}>
      <option value="date_desc">Date (Newest)</option>
      <option value="quantity_desc">Quantity (High → Low)</option>
      <option value="customer_asc">Customer Name (A → Z)</option>
    </select>
  );
}
