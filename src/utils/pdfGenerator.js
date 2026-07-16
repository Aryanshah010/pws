import { jsPDF } from "jspdf";

export function downloadReceipt(order) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const orderId = `PWS-${order._id.slice(-6).toUpperCase()}`;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("Pathivara Staples", 18, 22);
  pdf.setFontSize(16);
  pdf.text("Pickup Order Receipt", 18, 32);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Order ID: ${orderId}`, 18, 42);
  pdf.text(`Pickup: ${order.pickupSlot}`, 18, 49);
  pdf.text(`Payment: ${order.paymentMethod} - ${order.paymentStatus}`, 18, 56);
  let y = 70;
  pdf.setFont("helvetica", "bold");
  pdf.text("Item", 18, y);
  pdf.text("Qty", 116, y);
  pdf.text("Amount", 155, y);
  pdf.line(18, y + 3, 192, y + 3);
  pdf.setFont("helvetica", "normal");
  order.items.forEach((item) => {
    y += 10;
    const label = item.product?.name || "Product";
    pdf.text(label.slice(0, 45), 18, y);
    pdf.text(String(item.quantity), 118, y);
    pdf.text(`Rs. ${item.priceAtPurchase * item.quantity}`, 155, y);
  });
  y += 14;
  pdf.line(18, y - 5, 192, y - 5);
  pdf.setFont("helvetica", "bold");
  pdf.text("Total due", 116, y);
  pdf.text(`Rs. ${order.totalAmount}`, 155, y);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("Pathivara Wholesale Center - Pickup only", 18, 280);
  pdf.save(`${orderId}-receipt.pdf`);
}
