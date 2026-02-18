
import React, { useState } from 'react';
import { Customer, Settings } from '../types';
import { getCustomerTiers, CustomerTiers } from '../utils/tierUtils';
import { TierBadge } from './CustomersSection';

interface SearchSectionProps {
    customers: Customer[];
    settings: Settings;
}

interface FoundCustomerState {
    customer: Customer;
    tiers: CustomerTiers;
}

const SearchSection: React.FC<SearchSectionProps> = ({ customers, settings }) => {
    const [searchMobile, setSearchMobile] = useState('');
    const [foundInfo, setFoundInfo] = useState<FoundCustomerState | null | undefined>(undefined);

    const handleSearch = () => {
        const customer = customers.find(c => c.mobile === searchMobile);
        if (customer) {
            const tiers = getCustomerTiers(customer, settings);
            setFoundInfo({ customer, tiers });
        } else {
            setFoundInfo(null);
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-serif mb-8 pb-6 border-b border-gray-200">Database Search</h1>
            <div className="max-w-xl mx-auto">
                <div className="bg-white border border-gray-200 p-8">
                    <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Find Customer</label>
                    <div className="flex gap-4">
                        <input
                            type="tel"
                            value={searchMobile}
                            onChange={(e) => setSearchMobile(e.target.value)}
                            placeholder="Enter Mobile Number..."
                            className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"
                        />
                        <button onClick={handleSearch} className="bg-gray-700 text-white border border-gray-700 px-6 py-2 text-sm rounded-md hover:border-gray-800 hover:bg-gray-800 transition-colors">Search</button>
                    </div>

                    <div className="mt-6 min-h-[120px]">
                        {foundInfo === undefined && <p className="text-gray-500 text-sm">Enter a mobile number to search.</p>}
                        {foundInfo === null && <p className="text-red-500 text-sm">User not found in database.</p>}
                        {foundInfo && (
                            <div className="bg-gray-50 border border-gray-200 p-6 animate-fadeIn space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-serif text-black">{foundInfo.customer.name}</h3>
                                    <TierBadge tier={foundInfo.tiers.effectiveTier} />
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 border-t border-gray-200">
                                    <p className="text-gray-500">Points:</p>
                                    <p className="text-black font-semibold text-right">{foundInfo.customer.points.toLocaleString()}</p>
                                    
                                    <p className="text-gray-500">Total Spent:</p>
                                    <p className="text-black font-semibold text-right">₹{foundInfo.customer.totalSpent.toLocaleString()}</p>
                                    
                                    <p className="text-gray-500">Tier Expiry:</p>
                                    <p className="text-black font-semibold text-right">
                                        {foundInfo.tiers.pointsTierDaysRemaining === null && 'No Expiry'}
                                        {foundInfo.tiers.pointsTierDaysRemaining === 0 && <span className="text-red-500">Expired</span>}
                                        {foundInfo.tiers.pointsTierDaysRemaining && foundInfo.tiers.pointsTierDaysRemaining > 0 && `${foundInfo.tiers.pointsTierDaysRemaining} days left`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchSection;