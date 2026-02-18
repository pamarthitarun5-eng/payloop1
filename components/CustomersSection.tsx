
import React from 'react';
// FIX: Import `Tier` from the central `types` file instead of `tierUtils`.
import { Customer, Settings, Tier } from '../types';
import { getCustomerTiers } from '../utils/tierUtils';

interface CustomersSectionProps {
    customers: Customer[];
    settings: Settings;
}

const tierColorMap: { [key in Tier]: string } = {
    [Tier.Platinum]: 'bg-purple-100 text-purple-700 border-purple-300',
    [Tier.Gold]: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    [Tier.Silver]: 'bg-gray-100 text-gray-700 border-gray-300',
    [Tier.Bronze]: 'bg-orange-100 text-orange-700 border-orange-300',
    [Tier.None]: 'bg-gray-100 text-gray-500 border-gray-200',
};

export const TierBadge: React.FC<{ tier: Tier }> = ({ tier }) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${tierColorMap[tier]}`}>
        {tier}
    </span>
);

const PointsTierStatus: React.FC<{ tierInfo: ReturnType<typeof getCustomerTiers> }> = ({ tierInfo }) => {
    const { pointsTier, pointsTierDaysRemaining } = tierInfo;

    if (pointsTier === Tier.None) {
        // Differentiate between never having a tier and an expired tier
        if (pointsTierDaysRemaining === 0) {
            return <span className="text-xs text-red-500">Expired</span>;
        }
        return <TierBadge tier={Tier.None} />;
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <TierBadge tier={pointsTier} />
            {pointsTierDaysRemaining !== null && (
                <span className="text-xs text-gray-500">({pointsTierDaysRemaining} days left)</span>
            )}
        </div>
    );
};


const CustomersSection: React.FC<CustomersSectionProps> = ({ customers, settings }) => {
    return (
        <div className="animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-serif mb-8 pb-6 border-b border-gray-200">Registered Users</h1>
            <div className="bg-white border border-gray-200 p-4 sm:p-8">
                {customers.length === 0 ? (
                    <p className="text-gray-500">No records found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left text-gray-500 text-xs uppercase tracking-wider p-4 border-b border-gray-200">Name</th>
                                    <th className="text-left text-gray-500 text-xs uppercase tracking-wider p-4 border-b border-gray-200">Mobile</th>
                                    <th className="text-left text-gray-500 text-xs uppercase tracking-wider p-4 border-b border-gray-200">Points</th>
                                    <th className="text-left text-gray-500 text-xs uppercase tracking-wider p-4 border-b border-gray-200">Total Spend</th>
                                    <th className="text-center text-gray-500 text-xs uppercase tracking-wider p-4 border-b border-gray-200">Spend Tier</th>
                                    <th className="text-center text-gray-500 text-xs uppercase tracking-wider p-4 border-b border-gray-200">Points Tier Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => {
                                    const tierInfo = getCustomerTiers(customer, settings);
                                    return (
                                        <tr key={customer.mobile} className="hover:bg-gray-50">
                                            <td className="p-4 border-b border-gray-100 text-sm text-gray-800">{customer.name}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm text-gray-600 font-mono">{customer.mobile}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm text-gray-800">{customer.points.toLocaleString()}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm text-gray-800">₹{customer.totalSpent.toLocaleString()}</td>
                                            <td className="p-4 border-b border-gray-100 text-center"><TierBadge tier={tierInfo.spendTier} /></td>
                                            <td className="p-4 border-b border-gray-100 text-center"><PointsTierStatus tierInfo={tierInfo} /></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomersSection;