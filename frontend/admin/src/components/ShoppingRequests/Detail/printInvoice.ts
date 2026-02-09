import type { Invoice } from "./RequestDetailContent";

export const printInvoice = (invoice: Invoice) => {
  const printWindow = window.open("", "_blank");

  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice ${invoice.invoice_no}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .invoice-details { margin-bottom: 20px; }
          .products-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .products-table th, .products-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .products-table th { background-color: #f2f2f2; }
          .total-section { margin-top: 20px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Invoice ${invoice.invoice_no}</h1>
        </div>

        <div class="invoice-details">
          <p><strong>Amount:</strong> ${invoice.amount}</p>
          <p><strong>Total:</strong> ${invoice.total}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
        </div>

        ${invoice.products?.length > 0 ? `
          <table class="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.products.map((product) => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.quantity}</td>
                  <td>${product.unit_price}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : ""}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};