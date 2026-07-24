import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadReceipt(order) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const orderId = `PWS-${order._id.slice(-6).toUpperCase()}`;

  // Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("Pathivara Staples", 14, 22);

  pdf.setFontSize(16);
  pdf.text("Pickup Order Receipt", 14, 32);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString();
  pdf.text(`Date: ${dateStr}`, 14, 42);
  pdf.text(`Order ID: ${orderId}`, 14, 48);
  pdf.text(`Pickup: ${order.pickupSlot}`, 14, 54);
  pdf.text(`Payment: ${order.paymentMethod} - ${order.paymentStatus}`, 14, 60);

  // Table Data
  const tableData = order.items.map((item) => {
    const name = item.product?.name || "Product";
    const qty = item.quantity;
    const price = item.priceAtPurchase;
    const amount = qty * price;
    return [name, String(qty), `Rs. ${price}`, `Rs. ${amount}`];
  });

  // Add Total Row
  tableData.push([
    { content: "Total due", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } },
    { content: `Rs. ${order.totalAmount}`, styles: { fontStyle: "bold" } },
  ]);

  // Generate Table
  autoTable(pdf, {
    startY: 68,
    head: [["Item Name", "Quantity", "Unit Price", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageHeight = pdf.internal.pageSize.height;
  pdf.setFontSize(9);
  pdf.text("Pathivara Wholesale Center - Pickup only", pdf.internal.pageSize.width / 2, pageHeight - 10, { align: "center" });

  // Save
  pdf.save(`${orderId}-receipt.pdf`);
}
