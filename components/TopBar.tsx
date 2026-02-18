
import React from 'react';
import { UserType } from '../types';
import { MenuIcon, PowerIcon } from './Icons';

interface TopBarProps {
  userType: UserType;
  onLogout: () => void;
  onSignIn: () => void;
  toggleSidebar: () => void;
  businessName?: string;
}

const TopBar: React.FC<TopBarProps> = ({ userType, onLogout, onSignIn, toggleSidebar, businessName }) => {
  return (
    <header className="sticky top-0 z-50 h-[60px] bg-[rgba(255,255,255,0.8)] backdrop-blur-lg border-b border-gray-200 flex justify-between items-center px-5">
      <div className="flex items-center gap-5">
        <button onClick={toggleSidebar} className="text-gray-700 p-1">
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="font-serif text-lg tracking-wider">
          Pay<span className="italic">Loop</span>
          {businessName && <span className="text-sm text-gray-500"> | {businessName}</span>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block border border-gray-200 px-4 py-1.5 rounded-full text-xs tracking-widest text-gray-600">
          {userType === UserType.Admin ? 'Administrator' : 'Guest Mode'}
        </div>
        {userType === UserType.Guest && (
           <button onClick={onSignIn} className="bg-gray-100 text-gray-700 border border-gray-300 text-xs px-4 py-2 rounded-md hover:border-gray-400 hover:bg-gray-200 transition-colors">
             Sign In
           </button>
        )}
        <button onClick={onLogout} className="flex items-center gap-2 bg-gray-100 text-gray-700 border border-gray-300 text-xs px-4 py-2 rounded-md hover:border-gray-400 hover:bg-gray-200 transition-colors">
          <PowerIcon className="h-4 w-4" />
          <span className="hidden md:inline">Exit</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;