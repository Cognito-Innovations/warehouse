import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import { getAllShoppingRequests } from '../services/api.services';
import TopNavbar from '../components/Layout/TopNavbar';
import RequestSummary from '../components/common/RequestSummary';
import StatusChip from '../components/common/StatusChip';
import CommonTable from '../components/common/CommonTable';
import ShoppingRequestFilters from '../components/ShoppingRequests/ShoppingRequestFilters';
import { shoppingSummaryConfig } from '../utils/summaryConfig';
import { SHOPPING_REQUEST_STATUS_OPTIONS } from '../utils/constants';
import type { ColumnDefinition, TablePaginationConfig } from '../types/table';

const ShoppingRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]); //TODO P0: Resolve these typescript errors
  const [selectedStatus, setSelectedStatus] = useState<string | string[] | null>(null);
  const [originCountry, setOriginCountry] = useState<string | null>(null);
  const [targetCountry, setTargetCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllShoppingRequests({
        page: page + 1,
        limit: rowsPerPage,
        origin: originCountry ?? undefined,
        target: targetCountry ?? undefined,
        status: selectedStatus ?? undefined,
      });

      setRequests(response.data);
      setTotal(response.total);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, originCountry, targetCountry, selectedStatus]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);
  
  useEffect(() => {
    setPage(0);
  }, [originCountry, targetCountry, selectedStatus]);

  const mappedRows = useMemo(() => {
    return requests.map((req: any) => {
      const createdAt = new Date(Number(req.created_at) * 1000);

      return {
        orderNo: req.request_code,
        requestedAt: {
          date: createdAt.toLocaleDateString('en-GB'),
          time: createdAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        user: {
          name: req.user?.name || 'Unknown',
          suite_no: req.user?.suite_no || '',
          originCountry: req.user?.address?.country_code,
        },
        targetCountry: req.courier?.country?.code,
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
          <Typography variant="body2" fontWeight={500}>{row.user.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.user.suite_no}</Typography>
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

  const pagination: TablePaginationConfig = {
    mode: 'server',
    page,
    rowsPerPage,
    totalCount: total,
    onPageChange: setPage,
    onRowsPerPageChange: setRowsPerPage,
  }

  const filters = {
    statusOptions: SHOPPING_REQUEST_STATUS_OPTIONS,
    onStatusChange: setSelectedStatus,
    filtersComponent:(
      <ShoppingRequestFilters
        originCountry={originCountry}
        targetCountry={targetCountry}
        onOriginChange={setOriginCountry}
        onTargetChange={setTargetCountry}
      />
    )
  }

  const actions = {
    onViewDetails: handleViewDetails,
  }

  return (
    <Box>
      <TopNavbar pageTitle="Shopping Request" pageSubtitle="All" />

      <RequestSummary
        requests={requests}
        loading={loading}
        summaryConfig={shoppingSummaryConfig}
        onCardClick={setSelectedStatus}
        selectedStatus={selectedStatus}
      />

      <CommonTable
        rows={mappedRows}
        columns={columns}
        loading={loading}
        noDataMessage="No shopping requests available"
        getIdentifier={(row) => row.orderNo}
        getRowStatus={(row) => row.status}
        pagination={pagination}
        filters={filters}
        actions={actions}
      />
    </Box>
  );
};

export default ShoppingRequests;