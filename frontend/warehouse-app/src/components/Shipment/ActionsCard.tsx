import React from 'react';

const ActionsCard: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800">Actions</h3>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mt-1">
        <p className="font-semibold text-gray-800">This item is not available</p>
        <p className="text-sm text-gray-600">Please reselect another item</p>
      </div>
    </div>
  );
};

export default ActionsCard;