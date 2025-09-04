export function InvoiceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-bold">Invoice</h2>
          <p className="text-sm text-gray-500">
            UGFLASH INTERNATIONAL COURIER
          </p>
          <p className="text-sm text-gray-500">
            654, Ugflash Nagar, India 637502
          </p>
        </div>

        <div className="mb-6">
          <p className="font-medium">Customer</p>
          <p className="text-sm text-gray-700">Neurs HQ</p>
          <p className="text-sm text-gray-500">Suite No: 880-476</p>
          <p className="text-sm text-gray-500">hanqers@gmail.com</p>
        </div>

        <table className="w-full border-t border-b text-sm mb-4">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Description</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Rate</th>
              <th className="py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2">Shirt, Size XL</td>
              <td className="py-2">1</td>
              <td className="py-2">10.00</td>
              <td className="py-2">10.00</td>
            </tr>
          </tbody>
        </table>

        <div className="text-sm text-gray-700 space-y-1">
          <p>Sub Total: 10.00</p>
          <p>Commission (8%): 0.80</p>
          <p>GST (5%): 0.06</p>
          <p className="font-semibold">Total: 10.86 USD</p>
        </div>

        <div className="mt-6 border-t pt-4 text-sm text-gray-600">
          <p className="mb-1">Account Details (Click to Copy)</p>
          <p>Bank: BANK OF MALDIVES PLC</p>
          <p>Account No: 777000061523</p>
          <p>Swift Code: MALLMVMV</p>
        </div>
      </div>
    </div>
  );
}