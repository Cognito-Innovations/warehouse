import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import { getAllShoppingRequests } from '../services/api.services';
import TopNavbar from '../components/Layout/TopNavbar';
import RequestSummary from '../components/ShoppingRequests/RequestSummary';
import StatusChip from '../components/common/StatusChip';
import CommonTable from '../components/common/CommonTable';
import type { ColumnDefinition } from '../types/table';

const ShoppingRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requests = await getAllShoppingRequests();
      setRequests(requests);
    } catch (error) {
      console.error("Error fetching shopping requests:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  const statusOptions = [
    { value: 'REQUESTED', label: 'Requested' },
    { value: 'PAID', label: 'Paid' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'ORDER PLACED', label: 'Order Placed' },
  ];

  const mappedRows = useMemo(() => {
    return requests.map((req: any) => {
      const createdAt = new Date(Number(req.created_at) * 1000);
      return {
        orderNo: req.request_code,
        requestedAt: {
          date: createdAt.toLocaleDateString('en-GB'),
          time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        customer: {
          name: req.user?.name || 'Unknown',
          suite_no: req.user?.suite_no || '',
        },
        status: req.status,
        noOfItems: req.items_count,
      };
    });
  }, [requests]);

   const columns: ColumnDefinition<typeof mappedRows[0]>[] = [
    {
      header: 'Order No.',
      cell: (row) => <Typography variant="body2" fontWeight={500}>{row.orderNo}</Typography>,
      width: '20%',
    },
    {
      header: 'Requested At',
      cell: (row) => (
        <>
          <Typography variant="body2">{row.requestedAt.date}</Typography>
          <Typography variant="caption" color="text.secondary">{row.requestedAt.time}</Typography>
        </>
      ),
      width: '20%',
    },
    {
      header: 'Customer',
      cell: (row) => (
        <>
          <Typography variant="body2" fontWeight={500}>{row.customer.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.customer.suite_no}</Typography>
        </>
      ),
      width: '20%',
    },
    {
      header: 'Status',
      cell: (row) => <StatusChip status={row.status} />,
      width: '20%'
    },
    {
      header: 'No. of Items',
      cell: (row) => <Typography variant="body2">{row.noOfItems}</Typography>,
      width: '10%',
    },
  ];

  const handleViewDetails = (orderNo: string | number) => {
    navigate(`/requests/${encodeURIComponent(orderNo as string)}`);
  };

  return (
    <Box>
      <TopNavbar pageTitle="Shopping Request" pageSubtitle="All" />
      <RequestSummary requests={requests} loading={loading} />
      <CommonTable
        rows={mappedRows}
        columns={columns}
        loading={loading}
        statusOptions={statusOptions}
        noDataMessage="No shopping requests available"
        onViewDetails={handleViewDetails}
        getIdentifier={(row) => row.orderNo}
        getRowStatus={(row) => row.status}
      />
    </Box>
  );
};

export default ShoppingRequests;