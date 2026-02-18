
import React, { useState, useEffect } from 'react';
import { Settings, SpendTiers, PointsTiers, TierDiscounts, TierDeadlines } from '../types';

interface SettingsSectionProps {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ settings, setSettings }) => {
    const [localSettings, setLocalSettings] = useState<Settings>(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSpendChange = (tier: keyof SpendTiers, value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            spendTiers: { ...prev.spendTiers, [tier]: Number(value) || 0 }
        }));
    };

    const handlePointsChange = (tier: keyof PointsTiers, value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            pointsTiers: { ...prev.pointsTiers, [tier]: Number(value) || 0 }
        }));
    };
    
    const handleDiscountChange = (tier: keyof TierDiscounts, value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            tierDiscounts: { ...prev.tierDiscounts, [tier]: Number(value) || 0 }
        }));
    };
    
    const handleDeadlineChange = (tier: keyof TierDeadlines, value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            tierDeadlines: { ...prev.tierDeadlines, [tier]: Number(value) || 0 }
        }));
    };

    const handleConversionChange = (value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            pointsToRupeeConversion: parseFloat(value) || 0
        }));
    };

    const handleSaveChanges = () => {
        setSettings(localSettings);
        alert('Settings saved successfully!');
    };
    
    return (
        <div className="animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-serif mb-8 pb-6 border-b border-gray-200">Settings</h1>
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Spend Tiers */}
                <div className="bg-white border border-gray-200 p-8">
                    <h2 className="text-2xl font-serif mb-2">Spend Tiers</h2>
                    <p className="text-gray-500 text-sm mb-6">Set the minimum total spend (₹) required for each customer tier.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {(Object.keys(localSettings.spendTiers) as Array<keyof SpendTiers>).map(tier => (
                            <div key={tier}>
                                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider capitalize">{tier} Tier</label>
                                <input
                                    type="number"
                                    value={localSettings.spendTiers[tier]}
                                    onChange={(e) => handleSpendChange(tier, e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"
                                    placeholder="e.g., 5000"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Points Tiers */}
                <div className="bg-white border border-gray-200 p-8">
                     <h2 className="text-2xl font-serif mb-2">Points Tiers</h2>
                    <p className="text-gray-500 text-sm mb-6">Set the minimum points balance required for each customer tier.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                         {(Object.keys(localSettings.pointsTiers) as Array<keyof PointsTiers>).map(tier => (
                            <div key={tier}>
                                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider capitalize">{tier} Tier</label>
                                <input
                                    type="number"
                                    value={localSettings.pointsTiers[tier]}
                                    onChange={(e) => handlePointsChange(tier, e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"
                                    placeholder="e.g., 100"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Tier Discounts */}
                <div className="bg-white border border-gray-200 p-8">
                     <h2 className="text-2xl font-serif mb-2">Tier Discounts</h2>
                    <p className="text-gray-500 text-sm mb-6">Set the discount percentage (%) offered to each customer tier.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                         {(Object.keys(localSettings.tierDiscounts) as Array<keyof TierDiscounts>).map(tier => (
                            <div key={tier}>
                                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider capitalize">{tier} Discount</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={localSettings.tierDiscounts[tier]}
                                        onChange={(e) => handleDiscountChange(tier, e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition pr-6"
                                        placeholder="e.g., 5"
                                    />
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Tier Deadlines */}
                <div className="bg-white border border-gray-200 p-8">
                     <h2 className="text-2xl font-serif mb-2">Tier Expiry Deadlines</h2>
                    <p className="text-gray-500 text-sm mb-6">Set the number of days a points-based tier is valid after the customer's last transaction.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                         {(Object.keys(localSettings.tierDeadlines) as Array<keyof TierDeadlines>).map(tier => (
                            <div key={tier}>
                                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider capitalize">{tier} Deadline</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={localSettings.tierDeadlines[tier]}
                                        onChange={(e) => handleDeadlineChange(tier, e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition pr-12"
                                        placeholder="e.g., 365"
                                    />
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500">days</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Points Value */}
                <div className="bg-white border border-gray-200 p-8">
                    <h2 className="text-2xl font-serif mb-2">Points Value Configuration</h2>
                    <p className="text-gray-500 text-sm mb-6">Define how many rupees one loyalty point is worth when redeemed.</p>
                    <div className="max-w-xs">
                        <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Value of 1 Point (in ₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={localSettings.pointsToRupeeConversion}
                            onChange={(e) => handleConversionChange(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"
                            placeholder="e.g., 1 or 0.5"
                        />
                    </div>
                </div>


                <div className="flex justify-end">
                    <button onClick={handleSaveChanges} className="bg-[#1E90FF] text-white py-3 px-8 rounded-md font-semibold transition-all hover:bg-[#1079e0]">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsSection;