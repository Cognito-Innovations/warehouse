import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (request: any) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("UGFLASH INTERNATIONAL COURIER", 14, 20);
  doc.setFontSize(11);
  doc.text("654, Ugflash Nagar, India 637502", 14, 28);

  doc.setFontSize(12);
  doc.text(`Invoice No: ${request.invoice?.invoice_no || "-"}`, 150, 20);
  doc.text(`Status: ${request.invoice?.status || "-"}`, 150, 28);

  doc.setFontSize(12);
  doc.text("Customer Details:", 14, 40);
  doc.setFontSize(11);
  doc.text(request.user?.name || "Unknown", 14, 48);
  doc.text(`Suite No: ${request.user?.suite_no || "-"}`, 14, 54);
  doc.text(request.user?.email || "-", 14, 60);

  const tableData =
    request.invoice.products?.map((item: any) => [
      item.name,
      item.quantity,
      `$${item.unit_price}`,
      `$${(item.quantity * parseFloat(item.unit_price)).toFixed(2)}`,
    ]) || [];

  autoTable(doc, {
    startY: 70,
    head: [["Description", "Qty", "Rate", "Amount"]],
    body: tableData,
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Amount: $${request.invoice?.amount}`, 14, finalY);
  doc.text(`Total: $${request.invoice?.total} USD`, 14, finalY + 12);

  doc.setFontSize(11);
  doc.text("Account Details:", 14, finalY + 28);
  doc.text("Bank: BANK OF MALDIVES PLC", 14, finalY + 34);
  doc.text("Account No: 777000061523", 14, finalY + 40);
  doc.text("Swift Code: MALLMVMV", 14, finalY + 46);

  window.open(doc.output("bloburl"), "_blank");
};
