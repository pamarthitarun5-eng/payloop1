
import React, { useState, useMemo } from 'react';
import { Customer, UserType, DashboardSection, Settings, Transaction, SmsLog } from '../types';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import OverviewSection from './OverviewSection';
import TransactionSection from './TransactionSection';
import SearchSection from './SearchSection';
import CustomersSection from './CustomersSection';
import AnalyticsSection from './AnalyticsSection';
import SettingsSection from './SettingsSection';
import SmsLogsSection from './SmsLogsSection';
import { getCustomerTiers } from '../utils/tierUtils';

interface DashboardProps {
  userType: UserType;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  onLogout: () => void;
  onSignIn: () => void;
  businessName?: string;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  smsLogs: SmsLog[];
  setSmsLogs: React.Dispatch<React.SetStateAction<SmsLog[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ userType, customers, setCustomers, onLogout, onSignIn, businessName, settings, setSettings, smsLogs, setSmsLogs }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  
  const stats = useMemo(() => {
    const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
    const totalPoints = customers.reduce((acc, c) => acc + c.points, 0);
    return { totalCustomers: customers.length, totalRevenue, totalPoints };
  }, [customers]);

  const addNewTransaction = (mobile: string, name: string, pin: string, transactionData: Omit<Transaction, 'date'>) => {
      const newTransaction: Transaction = { ...transactionData, date: new Date().toISOString() };
      const existingCustomerIndex = customers.findIndex(c => c.mobile === mobile);
      
      let updatedCustomer: Customer;
      
      if (existingCustomerIndex > -1) {
          const customer = customers[existingCustomerIndex];
          updatedCustomer = {
              ...customer,
              totalSpent: customer.totalSpent + newTransaction.bill,
              points: (customer.points - (newTransaction.pointsRedeemed || 0)) + newTransaction.points,
              history: customer.history ? [...customer.history, newTransaction] : [newTransaction]
          };
      } else {
          updatedCustomer = {
              mobile,
              name: name || 'Guest',
              pin,
              points: newTransaction.points - (newTransaction.pointsRedeemed || 0),
              totalSpent: newTransaction.bill,
              history: [newTransaction]
          };
      }
  
      // Update customers state
      setCustomers(prev => {
          if (existingCustomerIndex > -1) {
              const newCustomers = [...prev];
              newCustomers[existingCustomerIndex] = updatedCustomer;
              return newCustomers;
          } else {
              return [...prev, updatedCustomer];
          }
      });
  
      // Generate SMS log using the calculated updatedCustomer
      const tiers = getCustomerTiers(updatedCustomer, settings);
      let expiryMessage = "Your tier has no expiry date.";
      if (tiers.pointsTier !== 'None' && tiers.pointsTierDaysRemaining !== null) {
          if (tiers.pointsTierDaysRemaining > 0) {
              expiryMessage = `Your ${tiers.pointsTier} tier benefits expire in ${tiers.pointsTierDaysRemaining} days of inactivity.`;
          } else {
              expiryMessage = `Your previous tier has expired due to inactivity.`;
          }
      }
      
      const sms: SmsLog = {
          timestamp: new Date().toISOString(),
          recipient: updatedCustomer.mobile,
          message: `Hi ${updatedCustomer.name}, thanks for your purchase! Your new points balance is ${updatedCustomer.points}. ${expiryMessage}`
      };
      setSmsLogs(prevLogs => [...prevLogs, sms]);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection stats={stats} />;
      case 'transaction':
        return <TransactionSection customers={customers} onTransactionSubmit={addNewTransaction} settings={settings}/>;
      case 'search':
        return <SearchSection customers={customers} settings={settings} />;
      case 'customers':
        return <CustomersSection customers={customers} settings={settings} />;
      case 'analytics':
        return <AnalyticsSection customers={customers} settings={settings} />;
       case 'smsLogs':
        return <SmsLogsSection logs={smsLogs} />;
       case 'settings':
        return <SettingsSection settings={settings} setSettings={setSettings} />;
      default:
        return <OverviewSection stats={stats} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <div className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'}`}>
        <TopBar 
          userType={userType} 
          onLogout={onLogout}
          onSignIn={onSignIn} 
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} 
          businessName={businessName}
        />
        <main className="p-4 sm:p-6 md:p-10">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;