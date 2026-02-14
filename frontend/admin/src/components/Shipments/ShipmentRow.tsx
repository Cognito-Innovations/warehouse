import { useState } from 'react';

import ShipmentSummaryRow from './ShipmentSummaryRow';
import ShipmentPackageRow from './ShipmentPackageRow';

const ShipmentRow = ({ row }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ShipmentSummaryRow
        row={row}
        open={open}
        onToggle={() => setOpen(prev => !prev)}
      />

      <ShipmentPackageRow
        open={open}
        packages={row.packages}
      />
    </>
  );
};

export default ShipmentRow;