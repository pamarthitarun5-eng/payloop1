
import React from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
    <div className="bg-white border border-gray-200 p-6 transition-colors hover:border-gray-300">
        <span className="block text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</span>
        <div className="text-4xl lg:text-5xl font-serif text-black">{value}</div>
    </div>
);


interface OverviewSectionProps {
  stats: {
    totalCustomers: number;
    totalRevenue: number;
    totalPoints: number;
  };
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ stats }) => {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl md:text-5xl font-serif mb-8 pb-6 border-b border-gray-200">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={stats.totalCustomers.toLocaleString()} />
        <StatCard label="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} />
        <StatCard label="Active Points" value={stats.totalPoints.toLocaleString()} />
      </div>
    </div>
  );
};

export default OverviewSection;