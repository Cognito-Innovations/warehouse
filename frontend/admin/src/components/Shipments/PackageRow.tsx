import React, { useState } from 'react';
import { TableCell, TableRow, Collapse } from '@mui/material';

import ItemTable from './ItemTable';
import PackageMainRow from './PackageMainRow';

interface PackageRowProps {
  item: any;
  index: number;
  showCancel?: boolean;
  shipmentId?: string;
  onPackageRemoved?: () => void;
  isDiscarded?: boolean;
}

const PackageRow: React.FC<PackageRowProps> = ({
  item,
  index,
  showCancel = false,
  shipmentId,
  onPackageRemoved,
  isDiscarded,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PackageMainRow
        item={item}
        index={index}
        open={open}
        onToggleOpen={() => setOpen(!open)}
        shipmentId={shipmentId}
        onPackageRemoved={onPackageRemoved}
        showCancel={showCancel}
        isDiscarded={isDiscarded}
      />

      <TableRow>
        <TableCell colSpan={9} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ItemTable items={item.items ?? []} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default PackageRow;