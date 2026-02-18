
import React, { useState, useCallback } from 'react';
import { Page, UserType, Customer, AdminCredentials, Settings, SmsLog } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import ChoicePage from './components/ChoicePage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import RegisterPage from './components/RegisterPage';
import { sampleCustomers } from './sampleData';

const defaultSettings: Settings = {
  spendTiers: { bronze: 5000, silver: 10000, gold: 20000, platinum: 50000 },
  pointsTiers: { bronze: 100, silver: 250, gold: 500, platinum: 1000 },
  tierDiscounts: { bronze: 5, silver: 10, gold: 15, platinum: 20 },
  tierDeadlines: { bronze: 365, silver: 365, gold: 365, platinum: 365 },
  pointsToRupeeConversion: 1,
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Choice);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('loyaltyDB', []);
  const [adminCreds, setAdminCreds] = useLocalStorage<AdminCredentials | null>('adminCreds', null);
  const [settings, setSettings] = useLocalStorage<Settings>('loyaltySettings', defaultSettings);
  const [smsLogs, setSmsLogs] = useLocalStorage<SmsLog[]>('smsLogs', []);

  const handleGoToRegister = useCallback(() => setCurrentPage(Page.Register), []);
  const handleGoToLogin = useCallback(() => setCurrentPage(Page.Login), []);

  const handleRegister = useCallback((creds: AdminCredentials) => {
    setAdminCreds(creds);
    setCustomers([]); // Ensure a fresh start by clearing any existing customers
    setSettings(defaultSettings); // Reset settings to default for the new admin
    setSmsLogs([]); // Clear SMS logs for new admin
    setUserType(UserType.Admin);
    setCurrentPage(Page.Dashboard);
  }, [setAdminCreds, setCustomers, setSettings, setSmsLogs]);

  const handleLoginAttempt = useCallback((username: string, password: string): boolean => {
    if (adminCreds && adminCreds.username === username && adminCreds.password === password) {
      setUserType(UserType.Admin);
      setCurrentPage(Page.Dashboard);
      return true;
    }
    return false;
  }, [adminCreds]);
  
  const handleDevLogin = useCallback(() => {
    setCustomers(sampleCustomers);
    setUserType(UserType.Admin);
    setCurrentPage(Page.Dashboard);
  }, [setCustomers]);

  const handleBackToChoice = useCallback(() => {
    setCurrentPage(Page.Choice);
  }, []);

  const handleLogout = useCallback(() => {
    setUserType(null);
    setCurrentPage(Page.Choice);
    // Optional: Clear customers on logout if it's not guest mode
    // setCustomers([]); 
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Choice:
        return <ChoicePage onGoToRegister={handleGoToRegister} onGoToLogin={handleGoToLogin} />;
      case Page.Register:
        return <RegisterPage onRegister={handleRegister} onBack={handleBackToChoice} />;
      case Page.Login:
        return <LoginPage onLoginAttempt={handleLoginAttempt} onBack={handleBackToChoice} onDevLogin={handleDevLogin} />;
      case Page.Dashboard:
        return <Dashboard 
                  userType={userType ?? UserType.Guest} 
                  customers={customers} 
                  setCustomers={setCustomers} 
                  onLogout={handleLogout} 
                  onSignIn={handleGoToLogin}
                  businessName={adminCreds?.businessName}
                  settings={settings}
                  setSettings={setSettings}
                  smsLogs={smsLogs}
                  setSmsLogs={setSmsLogs}
                />;
      default:
        return <ChoicePage onGoToRegister={handleGoToRegister} onGoToLogin={handleGoToLogin} />;
    }
  };

  return <div className="min-h-screen bg-white">{renderPage()}</div>;
};

export default App;