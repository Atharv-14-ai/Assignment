export default function PaginationControls({ page, totalPages, onChange }) {
  const makeRange = (from, to) => {
    const arr = [];
    for (let i = from; i <= to; i++) arr.push(i);
    return arr;
  };

  if (totalPages <= 1) return null;

  const pages = (() => {
    if (totalPages <= 7) return makeRange(1, totalPages);
    // compact view: show first, last, surrounding current
    const arr = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) arr.push("...");
    for (let i = start; i <= end; i++) arr.push(i);
    if (end < totalPages - 1) arr.push("...");
    arr.push(totalPages);
    return arr;
  })();

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={idx} style={{ width: 24, textAlign: "center" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              minWidth: 36,
              background: p === page ? "#1e40af" : undefined,
              color: p === page ? "#fff" : undefined,
            }}
          >
            {p}
          </button>
        )
      )}

      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}
