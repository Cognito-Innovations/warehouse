import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import { getPickupRequests } from '../services/api.services';
import TopNavbar from '../components/Layout/TopNavbar';
import StatusChip from '../components/common/StatusChip';
import CommonTable from '../components/common/CommonTable';
import { formatDateTime } from '../utils/formatDateTime';
import type { ColumnDefinition } from '../types/table';
import { pickupSummaryConfig } from '../utils/summaryConfig';
import RequestSummary from '../components/common/RequestSummary';

const statusOptions = [
  { value: 'requested', label: 'Requested' },
  { value: 'quoted', label: 'Quotation Confirmed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'picked', label: 'Picked' },
  { value: 'cancelled', label: 'Cancelled' },
];

//TODO: Code is very hard to read, please remove columns ->  header,  cell, width, its not the right approach.
//TODO: Refer old git project for reference.
const PickupRequests: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState<string | string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const requests = await getPickupRequests();
      setRequests(requests)
    } catch (error) {
      console.error("Failed to fetch pickup requests:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests()
  }, []);

  const mappedRows = useMemo(() => {
    const filteredRequests = selectedStatus
      ? requests.filter(req => {
          const statusesToFilter = Array.isArray(selectedStatus) ? selectedStatus : [selectedStatus];
          return statusesToFilter.includes(req.status);
        })
      : requests;

    return filteredRequests.map((req: any) => ({
      id: req.id!,
      date: formatDateTime(req.created_at),
      user: req.user.name,
      pickupLocation: req.pickup_address,
      supplier: req.supplier_name,
      status: req.status,
    }));
  }, [requests, selectedStatus]);

  const columns: ColumnDefinition<typeof mappedRows[0]>[] = [
    {
      header: 'Request No.',
      cell: (row) => <Typography variant="body2" fontWeight={500}>{row.id}</Typography>,
      width: '25%',
    },
    {
      header: 'Date',
      cell: (row) => <Typography variant="body2">{(row.date)}</Typography>,
      width: '20%',
    },
    {
      header: 'Customer',
      cell: (row) => <Typography variant="body2">{row.user}</Typography>,
      width: '25%',
    },
    {
      header: 'Pickup Location',
      cell: (row) => <Typography variant="body2">{row.pickupLocation}</Typography>,
      width: '30%',
    },
    {
      header: 'Supplier',
      cell: (row) => <Typography variant="body2">{row.supplier}</Typography>,
      width: '20%',
    },
    {
      header: 'Status',
      cell: (row) => <StatusChip status={row.status} />,
      width: '20%',
    },
  ];
  
  const handleViewDetails = (id: string | number) => {
    navigate(`/pickups/${encodeURIComponent(id as string)}`);
  };

  return (
    <Box>
      <TopNavbar pageTitle="Pickup Request" pageSubtitle="All" />

      <RequestSummary
        requests={requests}
        loading={loading}
        summaryConfig={pickupSummaryConfig}
        onCardClick={setSelectedStatus}
        selectedStatus={selectedStatus}
      />

      <CommonTable
        rows={mappedRows}
        columns={columns}
        loading={loading}
        statusOptions={statusOptions}
        noDataMessage="No pickup requests available"
        onViewDetails={handleViewDetails}
        getIdentifier={(row) => row.id!}
        getRowStatus={(row) => row.status || 'REQUESTED'}
      />
    </Box>
  );
};

export default PickupRequests;