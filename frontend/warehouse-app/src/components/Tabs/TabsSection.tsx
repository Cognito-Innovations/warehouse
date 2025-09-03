'use client';

import React, { useState } from 'react';
import { Inventory as PackageIcon, LocalShipping as ShipmentIcon, History as HistoryIcon, Search as SearchIcon } from '@mui/icons-material';
import PrePackageArrivalOTPModal from '../Modals/PrePackageArrivalOTPModal/PrePackageArrivalOTPModal';

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

const TabsSection = () => {
  const [value, setValue] = useState(0);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (newValue: number) => {
    setValue(newValue);
    setSearchTerm('');
  };

  const handleShareOTPClick = () => {
    setIsOTPModalOpen(true);
  };

  const handleOTPModalClose = () => {
    setIsOTPModalOpen(false);
  };

  const handleOTPSubmit = (data: any) => {
    console.log('OTP Form submitted:', data);
  };

  const tabs = [
    { label: 'Packages', count: 0, icon: <PackageIcon /> },
    { label: 'Shipments', count: 0, icon: <ShipmentIcon /> },
    { label: 'History', count: 0, icon: <HistoryIcon /> },
  ];

  const renderEmptyState = (icon: React.ReactNode, message: string) => (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
      <div className="text-6xl text-gray-300 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-600">{message}</h3>
    </div>
  );

  const renderSearchBar = () => (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={`Search ${tabs[value].label.toLowerCase()}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <div className="bg-purple-700 rounded-lg p-1 mb-3">
        <div className="flex">
          {tabs.map((tab, index) => (
            <button key={tab.label}
              className={`flex items-center justify-center gap-2 py-1 text-sm leading-5 font-medium text-purple-700 rounded-lgtransition-all duration-300 rounded-md flex-1 ${
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
          {renderEmptyState(<PackageIcon />, 'No Packages Available')}
        </TabPanel>

        <TabPanel value={value} index={1}>
          {renderSearchBar()}
          {renderEmptyState(<ShipmentIcon />, 'No Shipments Available')}
        </TabPanel>

        <TabPanel value={value} index={2}>
          {renderSearchBar()}
          {renderEmptyState(<HistoryIcon />, 'No History Available')}
        </TabPanel>
      </div>

      {/* Share OTP Button - Only show on Packages tab */}
      {value === 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleShareOTPClick}
            className="bg-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors duration-200"
          >
            Share OTP
          </button>
        </div>
      )}
      {/* OTP Modal */}
      <PrePackageArrivalOTPModal
        isOpen={isOTPModalOpen}
        onClose={handleOTPModalClose}
        onSubmit={handleOTPSubmit}
      />
    </div>
  );
};

export default TabsSection;
