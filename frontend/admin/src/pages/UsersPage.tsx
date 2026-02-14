import React from "react";
import { Box } from "@mui/material";

import TopNavbar from "../components/Layout/TopNavbar";
import UserCreateForm from "../components/Users/UserCreateForm";

const UsersPage: React.FC = () => {
  return (
    <Box>
      <TopNavbar pageSubtitle="Create Users" />
      <UserCreateForm />
    </Box>
  );
};

export default UsersPage;