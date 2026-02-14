import * as XLSX from 'xlsx';
import { formatDateTime } from './formatDateTime';

export const extractExtraCharges = (invoice: any): string => {
  if (!invoice?.charges) return "";

  return invoice.charges
    .filter((charge: any) => charge.category === "Additional Services")
    .map((charge: any) => charge.description)
    .join(", ");
};

export const buildShipmentReportRows = (shipments: any[]) => {
  const rows: any[] = [];
  let serial = 1;

  shipments.forEach((shipment) => {
    const {
      tracking_no,
      user,
      created_at,
      packages = [],
      invoice,
    } = shipment;

    const customerName = user?.name || "";
    const suiteId = user?.suite_no || "";
    const requestedAt = created_at ? formatDateTime(created_at) : "";
    const carrier = "UGFLASH (air)";
    const noOfItems = packages.length;
    const extraCharges = extractExtraCharges(invoice);

    packages.forEach((pkg: any, index: number) => {
      const row: any = {};

      if (index === 0) {
        row["#"] = serial++;
        row["Tracking ID"] = tracking_no;
        row["Customer Name"] = customerName;
        row["Suite ID"] = suiteId;
        row["Requested At"] = requestedAt;
        row["Carrier"] = carrier;
        row["No of Items"] = noOfItems;
        row["Extra Charges"] = extraCharges;
      }

      row["Rack"] = pkg.rack_slot?.label || "";
      row["Package ID"] = pkg.package_id || "";

      rows.push(row);
    });
  });

  return rows;
};

export const downloadExcelReport = (data: any[]) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Shipments");

  const today = new Date().toISOString().split("T")[0];
  const fileName = `ship-requested-report-${today}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}