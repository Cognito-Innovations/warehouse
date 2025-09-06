import { Box } from '@mui/material';
import MySuiteHeader from '../components/mySuite/MySuiteHeader';
import MySuiteContent from '../components/mySuite/MySuiteContent';
import TopNavbar from '../components/Layout/TopNavbar';

const MySuite = () => (
  <Box sx={{ position: 'relative', zIndex: 1 }}>
    <TopNavbar pageTitle="My Suite" pageSubtitle="All" />
    <MySuiteHeader />
    <MySuiteContent />
  </Box>
);

export default MySuite;