import React from "react";

interface Tab {
  label: string;
  count: number;
  icon: React.ReactNode;
}

interface TabNavigationProps {
  tabs: Tab[];
  value: number;
  onChange: (newValue: number) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, value, onChange }) => {
  return (
    <div className="bg-purple-700 rounded-lg p-1 mb-3">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button 
            key={tab.label} 
            className={`flex items-center justify-center gap-2 py-1 text-sm leading-5 font-medium text-purple-700 rounded-lg transition-all duration-300 rounded-md flex-1 
              ${value === index ? "bg-white text-purple-700 shadow-sm" : "bg-transparent text-white hover:bg-purple-600"}`} 
            onClick={() => onChange(index)}
          >
            <span className={`text-lg ${value === index ? "text-purple-700" : "text-white"}`}>
              {tab.icon}
            </span>
            <span>
              {tab.label} ({tab.count})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
