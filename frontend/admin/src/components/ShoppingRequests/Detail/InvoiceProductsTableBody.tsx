import {
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import type { Invoice } from "./RequestDetailContent";

interface InvoiceProductsTableBodyProps {
  products: Invoice["products"];
}

const InvoiceProductsTableBody: React.FC<InvoiceProductsTableBodyProps> = ({ products }) => {
  return (
    <TableBody>
      {products.map((product, index) => (
        <TableRow
          key={product.id || index}
          sx={{
            "&:hover": { bgcolor: "action.hover" },
            "&:last-child": { borderBottom: 0 },
          }}
        >
          <TableCell>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {product.name}
              </Typography>

              {product.description && (
                <Typography variant="caption" color="text.secondary">
                  {product.description}
                </Typography>
              )}
            </Box>
          </TableCell>

          <TableCell align="center">
            <Chip
              label={product.quantity}
              size="small"
              variant="outlined"
              color="primary"
            />
          </TableCell>

          <TableCell align="right">
            {product.unit_price && product.currency && (
              <Typography variant="body2">
                {product.unit_price}
              </Typography>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default InvoiceProductsTableBody;