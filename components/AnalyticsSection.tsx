
import React, { useMemo } from 'react';
import { Customer, Settings, Tier } from '../types';
import { DownloadIcon } from './Icons';
import { getCustomerTiers } from '../utils/tierUtils';

interface AnalyticsCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ label, value, icon }) => (
    <div className="bg-white border border-gray-200 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1E90FF] text-xl flex-shrink-0">
            {icon}
        </div>
        <div>
            <span className="block text-xs text-gray-500 uppercase tracking-widest">{label}</span>
            <div className="text-2xl font-semibold text-black">{value}</div>
        </div>
    </div>
);


interface AnalyticsSectionProps {
    customers: Customer[];
    settings: Settings;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ customers, settings }) => {
    const Recharts = (window as any).Recharts;

    const analyticsData = useMemo(() => {
        let totalRevenue = 0;
        let totalPoints = 0;
        let totalTxns = 0;
        let newCustomersLast30Days = 0;

        const monthlyDataMap = new Map<string, { revenue: number; points: number }>();
        const tierDistribution = { [Tier.Platinum]: 0, [Tier.Gold]: 0, [Tier.Silver]: 0, [Tier.Bronze]: 0, [Tier.None]: 0 };
        const activityByDay = Array(7).fill(0).map(() => ({ transactions: 0 }));

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        customers.forEach(customer => {
            totalRevenue += customer.totalSpent;
            totalPoints += customer.points;
            totalTxns += customer.history?.length || 0;
            
            const tiers = getCustomerTiers(customer, settings);
            tierDistribution[tiers.effectiveTier]++;

            if (customer.history && customer.history.length > 0) {
                const firstTxDate = new Date(customer.history[0].date);
                if (firstTxDate >= thirtyDaysAgo) {
                    newCustomersLast30Days++;
                }

                customer.history.forEach(tx => {
                    const txDate = new Date(tx.date);
                    const monthKey = txDate.toLocaleString('default', { month: 'short', year: '2-digit' });

                    const currentMonthData = monthlyDataMap.get(monthKey) || { revenue: 0, points: 0 };
                    currentMonthData.revenue += tx.bill;
                    currentMonthData.points += tx.points;
                    monthlyDataMap.set(monthKey, currentMonthData);

                    const dayIndex = txDate.getDay();
                    activityByDay[dayIndex].transactions++;
                });
            }
        });

        const aov = totalTxns > 0 ? Math.round(totalRevenue / totalTxns) : 0;
        const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

        const sortedMonths = Array.from(monthlyDataMap.keys()).sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            const dateA = new Date(`${monthA} 1, 20${yearA}`);
            const dateB = new Date(`${monthB} 1, 20${yearB}`);
            return dateA.getTime() - dateB.getTime();
        });
        
        const monthlyChartData = sortedMonths.map(month => ({
            name: month,
            Revenue: monthlyDataMap.get(month)!.revenue,
            Points: monthlyDataMap.get(month)!.points,
        }));
        
        const tierSegmentData = Object.entries(tierDistribution)
            .map(([name, value]) => ({ name, value }))
            .filter(item => item.value > 0);

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activityByDayChartData = activityByDay.map((data, index) => ({
            name: dayNames[index],
            Transactions: data.transactions,
        }));
        
        return { totalTxns, aov, totalPoints, newCustomersLast30Days, topCustomers, monthlyChartData, tierSegmentData, activityByDayChartData };
    }, [customers, settings]);

    const TIER_COLORS = {
        [Tier.Platinum]: '#a855f7', // purple-500
        [Tier.Gold]: '#facc15', // yellow-400
        [Tier.Silver]: '#9ca3af', // gray-400
        [Tier.Bronze]: '#fb923c', // orange-400
        [Tier.None]: '#6b7280' // gray-500
    };

    const exportData = () => {
        let csv = "Name,Mobile,TotalSpent,Points\n";
        customers.forEach(c => {
            csv += `${c.name},${c.mobile},${c.totalSpent},${c.points}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'loyalty_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (!Recharts) {
        return (
            <div className="animate-fadeIn">
                <div className="flex flex-wrap justify-between items-end mb-8 pb-6 border-b border-gray-200 gap-4">
                    <h1 className="text-4xl md:text-5xl font-serif m-0 p-0 border-none">Intelligence Hub</h1>
                </div>
                <div className="flex items-center justify-center h-96 bg-white border border-gray-200">
                    <p className="text-gray-500">Loading chart components...</p>
                </div>
            </div>
        );
    }

    const { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } = Recharts;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-300 p-3 text-sm rounded-md shadow-lg">
                    <p className="label font-semibold mb-1 text-gray-700">{`${label}`}</p>
                    {payload.map((pld: any) => (
                         <p key={pld.dataKey} style={{ color: pld.color || pld.fill }}>{`${pld.name} : ${pld.value.toLocaleString()}`}</p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-wrap justify-between items-end mb-8 pb-6 border-b border-gray-200 gap-4">
                <h1 className="text-4xl md:text-5xl font-serif m-0 p-0 border-none">Intelligence Hub</h1>
                <button onClick={exportData} className="flex items-center gap-2 bg-gray-100 text-gray-700 border border-gray-300 text-xs px-4 py-2 rounded-md hover:border-gray-400 hover:bg-gray-200 transition-colors">
                    <DownloadIcon className="h-4 w-4" /> Export CSV
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <AnalyticsCard label="Avg. Order Value" value={`₹${analyticsData.aov}`} icon={"💳"} />
                <AnalyticsCard label="Points Liability" value={analyticsData.totalPoints.toLocaleString()} icon={"💰"} />
                <AnalyticsCard label="Total Transactions" value={analyticsData.totalTxns} icon={"🛒"} />
                <AnalyticsCard label="New Users (30d)" value={analyticsData.newCustomersLast30Days} icon={"📈"} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 p-6 h-96">
                        <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4">Revenue & Points Velocity</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={analyticsData.monthlyChartData} >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" stroke="#d1d5db" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: "12px"}} />
                                <Line yAxisId="left" type="monotone" dataKey="Revenue" stroke="#1E90FF" strokeWidth={2} dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="Points" stroke="#a0aec0" strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                     <div className="bg-white border border-gray-200 p-6 h-96">
                        <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4">Transaction Hotspots (By Day)</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={analyticsData.activityByDayChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#1E90FF10'}} />
                                <Bar dataKey="Transactions" fill="#1E90FF" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Column */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 p-6 h-96">
                        <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4">Customer Tier Distribution</h3>
                         <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie data={analyticsData.tierSegmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={5}>
                                    {analyticsData.tierSegmentData.map((entry) => <Cell key={entry.name} fill={TIER_COLORS[entry.name as Tier]} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white border border-gray-200 p-6">
                        <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4">Top 5 "Whale" Customers</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left text-gray-500 font-normal text-xs p-2">Rank</th>
                                        <th className="text-left text-gray-500 font-normal text-xs p-2">Name</th>
                                        <th className="text-left text-gray-500 font-normal text-xs p-2">Spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.topCustomers.map((c, index) => {
                                        const rankColors = ['bg-yellow-400 text-black', 'bg-gray-400 text-black', 'bg-yellow-700 text-white'];
                                        const rankClass = index < 3 ? rankColors[index] : 'bg-gray-200 text-gray-700';
                                        return (
                                        <tr key={c.mobile}>
                                            <td className="p-2">
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rankClass}`}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td className="p-2 text-sm text-gray-800">{c.name}</td>
                                            <td className="p-2 text-sm font-bold text-black">₹{c.totalSpent.toLocaleString()}</td>
                                        </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;