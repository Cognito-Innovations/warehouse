import type { Metadata } from 'next';
import ProfileSidebar from '@/components/Sidebar/ProfileSidebar';
import { Box } from '@mui/material';

export const metadata: Metadata = {
  title: 'Profile - ShopMe Dashboard',
  description: 'Manage your profile settings',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <ProfileSidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}