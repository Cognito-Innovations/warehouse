import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COMMISSION_RATE = 0.08;

// Helper function to extract currency symbol and amount
const parseCurrency = (currencyString: string, defaultCurrency: string = '₹') => {
  if (!currencyString) return { symbol: defaultCurrency, amount: '0' };
  
  // Handle different currency formats
  // Format 1: "176.54 ₹" or "882.70 ₹"
  // Format 2: "₹176.54" or "$176.54"
  // Format 3: "176.54" (just number)
  
  const trimmed = currencyString.trim();
  
  // Check if currency symbol is at the end (Format 1)
  const endSymbolMatch = trimmed.match(/^([\d,]+\.?\d*)\s*([₹$€£¥])$/);
  if (endSymbolMatch) {
    return { symbol: endSymbolMatch[2], amount: endSymbolMatch[1] };
  }
  
  // Check if currency symbol is at the beginning (Format 2)
  const startSymbolMatch = trimmed.match(/^([₹$€£¥])([\d,]+\.?\d*)$/);
  if (startSymbolMatch) {
    return { symbol: startSymbolMatch[1], amount: startSymbolMatch[2] };
  }
  
  // Check if it's just a number (Format 3)
  const numberMatch = trimmed.match(/^[\d,]+\.?\d*$/);
  if (numberMatch) {
    return { symbol: defaultCurrency, amount: numberMatch[0] };
  }
  
  // Fallback: try to extract any currency symbol and number
  const symbolMatch = trimmed.match(/[₹$€£¥]/);
  const symbol = symbolMatch ? symbolMatch[0] : defaultCurrency;
  
  const amountMatch = trimmed.match(/[\d,]+\.?\d*/);
  const amount = amountMatch ? amountMatch[0] : '0';
  
  return { symbol, amount };
};

export const generateInvoicePDF = (request: any) => {
  const doc = new jsPDF();
  
  // Set primary color (vibrant blue theme)
  const primaryColor = [124, 58, 237]; // rgb(124, 58, 237)
  const textColor = [33, 33, 33]; // #212121
  const secondaryColor = [96, 125, 139]; // #607D8B

  // Get currency from request.currency or default to ₹
  const defaultCurrency = request.currency || '₹';

  // Header Section
  // doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("", 'bold');
  doc.text("Palakart International Courier", 14, 15);
  
  doc.setFontSize(10);
  doc.setFont("", 'normal');
  doc.text("654, Palakart Nagar, India 637502", 14, 22);
  
  doc.setFontSize(12);
  doc.setFont("", 'bold');
  doc.text(`Invoice No: ${request.invoice?.invoice_no || "-"}`, 150, 15);
  
  // Status with colored background
  const status = request.invoice?.status || "-";
  const statusColor = status === 'PAID' ? [76, 175, 80] : [244, 67, 54]; // Green or Red
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.rect(150, 20, 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(status, 155, 25);

  // Reset text color
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  // Customer Details Section
  doc.setFontSize(12);
  doc.setFont("", 'bold');
  doc.text("Customer Details:", 14, 45);
  
  doc.setFontSize(10);
  doc.setFont("", 'normal');
  doc.text(request.user?.name || "Unknown", 14, 52);
  doc.text(`Suite No: ${request.user?.suite_no || "-"}`, 14, 58);
  doc.text(request.user?.email || "-", 14, 64);

  // Prepare table data with proper currency formatting
  const tableData = request.invoice?.products?.map((item: any) => {
    const unitPriceInfo = parseCurrency(item.unit_price, defaultCurrency);
    const unitPrice = parseFloat(unitPriceInfo.amount.replace(/,/g, '')) || 0; // Remove commas and handle NaN
    const total = (item.quantity || 0) * unitPrice;
    
    // Capitalize item name
    const capitalizedName = item.name
      ?.toLowerCase()
      ?.split(' ')
      ?.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(' ') || 'Unknown Item';
    
    return [
      capitalizedName,
      (item.quantity || 0).toString(),
      `${unitPrice.toFixed(2)}`,
      `${total.toFixed(2)}`,
    ];
  }) || [];

  // Use the default currency for consistent display
  const currencySymbol = defaultCurrency;

  // Table styling
  autoTable(doc, {
    startY: 75,
    head: [["Description", "Qty", "Rate", "Amount"]],
    body: tableData,
    headStyles: {
      fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      textColor: [textColor[0], textColor[1], textColor[2]],
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    columnStyles: {
      0: { cellWidth: 80 }, // Description
      1: { cellWidth: 20, halign: 'center' }, // Qty
      2: { cellWidth: 30, halign: 'right' }, // Rate
      3: { cellWidth: 30, halign: 'right' }, // Amount
    },
    margin: { left: 14, right: 14 },
  });

  let finalY = (doc as any).lastAutoTable.finalY;
  
  // Amount and Total Section
  doc.setFontSize(11);
  doc.setFont("", 'bold');
  
  // Parse amounts with currency
  const subTotal = request.invoice?.products?.reduce((sum: number, item: any) => {
    const unitPriceInfo = parseCurrency(item.unit_price, defaultCurrency);
    const unitPrice = parseFloat(unitPriceInfo.amount.replace(/,/g, '')) || 0;
    return sum + (item.quantity || 0) * unitPrice;
  }, 0) || 0;

  const commission = subTotal * COMMISSION_RATE;
  const total = subTotal + commission;
  
  // Position variables for the summary section on the right
  const pageWidth = doc.internal.pageSize.getWidth();
  const rightMargin = 14;
  const summaryLabelX = pageWidth - rightMargin - 50;
  const summaryValueX = pageWidth - rightMargin;

  // Draw SubTotal
  doc.setFontSize(10);
  doc.setFont("", 'normal');
  doc.text("SubTotal:", summaryLabelX, finalY + 10);
  doc.text(subTotal.toFixed(2), summaryValueX, finalY + 10, { align: "right" });

  // Draw Commission
  doc.text("Commission (8%):", summaryLabelX, finalY + 17);
  doc.text(commission.toFixed(2), summaryValueX, finalY + 17, { align: "right" });

  // Draw Separator Line
  doc.setLineWidth(0.2);
  doc.line(summaryLabelX, finalY + 21, summaryValueX, finalY + 21);

  // Draw Total
  doc.setFontSize(11);
  doc.setFont("", 'bold');
  doc.text("Total:", summaryLabelX, finalY + 26);
  doc.text(total.toFixed(2), summaryValueX, finalY + 26, { align: "right" });

  // Update finalY to position the footer correctly
  finalY += 40;

  // Account Details Section
  doc.setFontSize(11);
  doc.setFont("", 'bold');

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("Thank you for your business!", 14, finalY + 55);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, finalY + 60);

  window.open(doc.output("bloburl"), "_blank");
};
