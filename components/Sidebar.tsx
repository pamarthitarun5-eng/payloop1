
import React from 'react';
import { DashboardSection } from '../types';
import { ChartLineIcon, PlusIcon, SearchIcon, UsersIcon, ChartPieIcon, SettingsIcon, MessageSquareIcon } from './Icons';

interface SidebarProps {
  isCollapsed: boolean;
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

const navItems = [
  { id: 'overview', text: 'Overview', icon: <ChartLineIcon className="h-5 w-5"/> },
  { id: 'transaction', text: 'Transaction', icon: <PlusIcon className="h-5 w-5"/> },
  { id: 'search', text: 'Search', icon: <SearchIcon className="h-5 w-5"/> },
  { id: 'customers', text: 'Customers', icon: <UsersIcon className="h-5 w-5"/> },
  { id: 'analytics', text: 'Analytics', icon: <ChartPieIcon className="h-5 w-5"/> },
  { id: 'smsLogs', text: 'SMS Logs', icon: <MessageSquareIcon className="h-5 w-5" /> },
  { id: 'settings', text: 'Settings', icon: <SettingsIcon className="h-5 w-5"/> },
] as const;


const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, activeSection, setActiveSection }) => {
  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-50 border-r border-gray-200 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 pt-[60px] ${isCollapsed ? 'w-[60px]' : 'w-[240px]'}`}>
      <nav className="flex flex-col">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center h-[60px] px-5 text-gray-600 whitespace-nowrap overflow-hidden border-l-2 transition-all duration-200
              ${activeSection === item.id ? 'border-[#1E90FF] text-[#1E90FF] bg-blue-50' : 'border-transparent hover:bg-gray-200 hover:text-[#1E90FF]'}`}
          >
            <div className={`flex-shrink-0 ${isCollapsed ? 'mr-0' : 'mr-5'}`}>{item.icon}</div>
            <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>{item.text}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;