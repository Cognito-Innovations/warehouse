import React from "react";
import { TableBody, TableRow, TableCell, Typography } from "@mui/material";
import type { ItemDetail } from "../../types";

interface ItemTableBodyProps {
  items: ItemDetail[];
}

const ItemTableBody: React.FC<ItemTableBodyProps> = ({ items }) => {
  return (
    <TableBody>
      {items.map((detail, index) => (
        <TableRow
          key={detail.name}
          sx={{
            "& > *": {
              border: "none",
              borderBottom: index === items.length - 1 ? "none" : "1px solid #f1f5f9",
            },
            "&:hover": {
              bgcolor: "#f8fafc",
            },
          }}
        >
          <TableCell sx={{ py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
              {detail.name}
            </Typography>
          </TableCell>

          <TableCell align="center" sx={{ py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
              {detail.quantity}
            </Typography>
          </TableCell>

          <TableCell align="right" sx={{ py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
              {detail.unit_price}
            </Typography>
          </TableCell>

          <TableCell align="right" sx={{ py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
              {detail.total_price}
            </Typography>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ItemTableBody;