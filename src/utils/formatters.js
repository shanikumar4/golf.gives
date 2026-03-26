export const formatters = {
    date: (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—",
    currency: (n) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n ?? 0),
};