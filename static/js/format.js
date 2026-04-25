export const fmtUSD = (n) =>
  n == null || Number.isNaN(n)
    ? "—"
    : n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

export const fmtPct = (n) =>
  n == null || Number.isNaN(n) ? "—" : `${(n * 100).toFixed(2)}%`;

export const fmtAmount = (n, digits = 4) =>
  n == null || Number.isNaN(n)
    ? "—"
    : n.toLocaleString("en-US", { maximumFractionDigits: digits });

export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

export const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-US") : "—";

export function signedClass(n) {
  if (n == null || Number.isNaN(n) || n === 0) return "";
  return n > 0 ? "pos" : "neg";
}
