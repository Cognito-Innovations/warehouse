import { createContext, useContext } from 'react';

// Context for managing active tab state and sidebar expansion
interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPageSidebarExpanded: boolean;
  togglePageSidebar: () => void;
}

const TabContext = createContext<TabContextType>({
  activeTab: 'packages',
  setActiveTab: () => {},
  isPageSidebarExpanded: true,
  togglePageSidebar: () => {}
});

export const useTabContext = () => useContext(TabContext);
export { TabContext };
export type { TabContextType };
