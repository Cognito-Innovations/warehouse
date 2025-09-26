import React from "react";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { green, grey } from "@mui/material/colors";

interface PasswordStrengthProps {
  password_str: string;
}

const validationCriteria = [
  { id: "length", text: "Minimum 6 characters in length" },
  { id: "uppercase", text: "At least one upper case letter (A-Z)" },
  { id: "lowercase", text: "At least two lower case letters (a-z)" },
  { id: "number", text: "At least one number (0-9)" },
  { id: "special", text: "At least one special symbol (!@#$%^&*)" },
];

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password_str }) => {

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: (password.match(/[a-z]/g) || []).length >= 2,
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };
  };

  const validationResults = validatePassword(password_str);
  
  return (
    <Box sx={{
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      zIndex: 10,
      width: "100%",
      backgroundColor: "background.paper",
      boxShadow: 3,
      borderRadius: 2,
      p: 2,
      mt: 1,
      "::before": {
        content: "\"\"",
        position: "absolute",
        top: -10,
        left: "calc(50% - 10px)",
        width: 0,
        height: 0,
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderBottom: "10px solid white",
      }
    }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold" }}>
        Password requirements:
      </Typography>
      <List dense>
        {validationCriteria.map((criterion) => {
          const isValid = validationResults[criterion.id as keyof typeof validationResults];
          return (
            <ListItem key={criterion.id} sx={{ p: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleIcon sx={{ color: isValid ? green[500] : grey[400] }} />
              </ListItemIcon>
              <ListItemText 
                primary={criterion.text} 
                primaryTypographyProps={{ 
                  variant: "body2", 
                  color: isValid ? "text.primary" : "text.secondary"
                }} 
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default PasswordStrength;