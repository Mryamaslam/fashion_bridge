import Papa from "papaparse";

function downloadBlob(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[]
) {
  if (!rows.length) return;
  const csv = Papa.unparse(rows);
  downloadBlob(csv, filename, "text/csv;charset=utf-8;");
}

export async function exportOrdersPDF(
  orders: Array<{
    order_number: string;
    buyer_name: string;
    buyer_company: string | null;
    buyer_email: string;
    buyer_country: string;
    status: string;
    total_amount: number;
    currency: string;
    created_at: string;
  }>
) {
  const { jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Fashion Bridge International — Invoices", 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  const tableData = orders.map((o) => [
    o.order_number,
    o.buyer_name,
    o.buyer_company || "—",
    o.buyer_country,
    `${o.currency} ${o.total_amount.toFixed(2)}`,
    o.status,
    new Date(o.created_at).toLocaleDateString(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc as any).autoTable({
    startY: 35,
    head: [["Order #", "Buyer", "Company", "Country", "Amount", "Status", "Date"]],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [201, 162, 39] },
  });

  doc.save(`fbi-invoices-${Date.now()}.pdf`);
}
