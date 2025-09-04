'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag as ShoppingBagIcon, History as HistoryIcon, Search as SearchIcon, Add as AddIcon, Delete as DeleteIcon, HourglassEmpty as HourglassIcon } from '@mui/icons-material';
import HowItWorksModal from '../../components/Modals/HowItWorksModal/HowItWorksModal';
import { getShoppingRequestsByUser } from '@/lib/api.service';
import { useSession } from 'next-auth/react';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div className="p-6">{children}</div>}
    </div>
  );
}

export default function AssistedShopping() {
  const { data: session, status } = useSession();
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);
  const [shoppingRequests, setShoppingRequests] = useState<any[]>([]);

  const user_id = (session?.user as any)?.user_id;

  const fetchRequests = async () => {
    try {
      const data = await getShoppingRequestsByUser(user_id);
      setShoppingRequests(data);
    } catch (error) {
      console.error("Error fetching shopping requests:", error);
    }
  };

  useEffect(() => {
    if (!user_id || status === "loading") return; 
    fetchRequests();
  }, []);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    setSearchTerm('');
  };

  const handleNewShoppingRequest = () => {
    setIsHowItWorksModalOpen(true);
  };

  const handleDeleteRequest = (requestId: string) => {
    console.log('Delete request:', requestId);
    // Handle delete request logic here
  };

  const tabs = [
    { label: 'Shopping Requests', count: 1, icon: <ShoppingBagIcon /> },
    { label: 'History', count: 0, icon: <HistoryIcon /> },
  ];

  const renderSearchBar = () => (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search by item name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
      />
    </div>
  );

  const renderShoppingRequests = () => (
    <div className="space-y-4">
      {shoppingRequests.map((request) => (
        <Link 
          href={`/assisted-shopping/${encodeURIComponent(request.request_code)}`} 
          key={request.request_code}
          className="block transition-all duration-200 hover:shadow-md hover:border-purple-200 rounded-lg"
        >
          <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                {/* <p className="font-semibold text-gray-900">{request.id}</p> */}
                <p className="text-sm text-gray-600">{formatDateTime(request.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{request.items} Items</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <HourglassIcon className={`w-5 h-5 ${request.statusColor}`} />
                <span className={`text-sm font-medium ${request.statusColor}`}>{request.status}</span>
              </div>
              <button
                onClick={() => handleDeleteRequest(request.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <DeleteIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderEmptyState = (icon: React.ReactNode, message: string) => (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
      <div className="text-6xl text-gray-300 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-600">{message}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-purple-700 rounded-lg p-1 mb-3">
          <div className="flex">
            {tabs.map((tab, index) => (
              <button key={tab.label}
                className={`flex items-center justify-center gap-2 py-1 text-sm font-bold transition-all duration-300 rounded-md flex-1 ${
                  value === index
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'bg-transparent text-white hover:bg-purple-600'
                }`}
                onClick={() => handleChange(index)}
              >
                <span className={`text-lg ${value === index ? 'text-purple-700' : 'text-white'}`}>
                  {tab.icon}
                </span>
                <span>{tab.label} ({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-gray-200 rounded-lg min-h-[400px]">
          <TabPanel value={value} index={0}>
            <div className="p-6">
              {/* Search and Add Button Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  {renderSearchBar()}
                </div>
                <button
                  onClick={handleNewShoppingRequest}
                  className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <AddIcon className="w-4 h-4" />
                  Shopping Request
                </button>
              </div>

              {/* Shopping Requests List */}
              {shoppingRequests.length > 0 ? (
                <>
                  {renderShoppingRequests()}
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Showing 1 to {shoppingRequests.length} of {shoppingRequests.length} Requests
                    </p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded disabled:opacity-50" disabled>
                        Previous
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded disabled:opacity-50" disabled>
                        Next
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                renderEmptyState(<ShoppingBagIcon />, 'No Shopping Requests Available')
              )}
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            {renderSearchBar()}
            {renderEmptyState(<HistoryIcon />, 'No History Available')}
          </TabPanel>
        </div>

        {/* How It Works Modal */}
        <HowItWorksModal
          isOpen={isHowItWorksModalOpen}
          onClose={() => setIsHowItWorksModalOpen(false)}
        />
      </div>
    </div>
  );
}
