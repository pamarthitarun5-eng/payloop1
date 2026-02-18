
import React, { useState, useEffect, useMemo } from 'react';
// FIX: Import `Tier` from the central `types` file instead of `tierUtils`.
import { Customer, Settings, Transaction, Tier } from '../types';
import { getCustomerTiers, CustomerTiers } from '../utils/tierUtils';
import { TierBadge } from './CustomersSection';

interface TransactionSectionProps {
  customers: Customer[];
  onTransactionSubmit: (mobile: string, name: string, pin: string, transactionData: Omit<Transaction, 'date'>) => void;
  settings: Settings;
}

const TransactionSection: React.FC<TransactionSectionProps> = ({ customers, onTransactionSubmit, settings }) => {
    const [mobile, setMobile] = useState('');
    const [name, setName] = useState('');
    const [isNameLocked, setIsNameLocked] = useState(false);
    const [pin, setPin] = useState('');
    const [billAmount, setBillAmount] = useState('');
    const [cashGiven, setCashGiven] = useState('');
    const [pinError, setPinError] = useState('');
    
    const [showPinSection, setShowPinSection] = useState(false);
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const [tierInfo, setTierInfo] = useState<CustomerTiers | null>(null);

    const [applyBenefits, setApplyBenefits] = useState(false);
    const [pointsToRedeem, setPointsToRedeem] = useState('');

    useEffect(() => {
        if (mobile.length >= 10) {
            const existingCustomer = customers.find(c => c.mobile === mobile);
            setCurrentCustomer(existingCustomer || null);
            setShowPinSection(true);
            setShowTransactionForm(false);
            if (existingCustomer) {
                setName(existingCustomer.name);
                setIsNameLocked(true);
            } else {
                setName('');
                setIsNameLocked(false);
            }
        } else {
            setShowPinSection(false);
            setShowTransactionForm(false);
            setName('');
            setIsNameLocked(false);
            setCurrentCustomer(null);
        }
    }, [mobile, customers]);

    const handleVerifyPin = () => {
        setPinError('');
        if (currentCustomer) {
            if (currentCustomer.pin === pin) {
                setTierInfo(getCustomerTiers(currentCustomer, settings));
                setShowTransactionForm(true);
            } else {
                setPinError('Incorrect PIN code.');
            }
        } else {
            if (pin.length === 4) {
                setTierInfo(null);
                setShowTransactionForm(true);
                alert("Security PIN Set. Proceed to transaction.");
            } else {
                setPinError('PIN must be 4 digits for new users.');
            }
        }
    };

    const billSummary = useMemo(() => {
        const subtotal = parseFloat(billAmount) || 0;
        if (subtotal <= 0) return { subtotal: 0, discountAmount: 0, redeemedValue: 0, totalPayable: 0, pointsEarned: 0 };
        
        const cash = parseFloat(cashGiven) || 0;
        const redeemAmount = parseInt(pointsToRedeem) || 0;
        
        const discountPercentage = (applyBenefits && tierInfo?.effectiveTier && tierInfo.effectiveTier !== Tier.None)
            ? settings.tierDiscounts[tierInfo.effectiveTier.toLowerCase() as keyof typeof settings.tierDiscounts]
            : 0;

        const discountAmount = subtotal * (discountPercentage / 100);
        const billAfterDiscount = subtotal - discountAmount;
        
        const redeemedValue = applyBenefits 
            ? Math.min(redeemAmount * settings.pointsToRupeeConversion, billAfterDiscount)
            : 0;

        const totalPayable = billAfterDiscount - redeemedValue;
        const pointsEarned = cash > totalPayable ? Math.floor(cash - totalPayable) : 0;

        return { subtotal, discountAmount, redeemedValue, totalPayable, pointsEarned };
    }, [billAmount, cashGiven, pointsToRedeem, applyBenefits, tierInfo, settings]);
    
    const handleSubmit = () => {
        const bill = parseFloat(billAmount);
        if(!bill || bill <= 0) { alert("Please enter valid Bill Amount"); return; }
        
        const cash = parseFloat(cashGiven);
        if(!cash || cash < billSummary.totalPayable) { alert("Cash Given cannot be less than Total Payable"); return; }
        
        const redeemedPointsNum = parseInt(pointsToRedeem) || 0;
        if (applyBenefits && currentCustomer && redeemedPointsNum > currentCustomer.points) {
            alert("Cannot redeem more points than available.");
            return;
        }

        const transactionData: Omit<Transaction, 'date'> = {
            bill: billSummary.subtotal,
            points: billSummary.pointsEarned,
            discountApplied: billSummary.discountAmount,
            pointsRedeemed: applyBenefits ? redeemedPointsNum : 0,
            finalAmount: billSummary.totalPayable,
        };
        
        onTransactionSubmit(mobile, name, pin, transactionData);
        alert(`Transaction Successful! Added ${billSummary.pointsEarned} Points.`);
        resetForm();
    };

    const resetForm = () => {
        setMobile('');
        setName('');
        setPin('');
        setBillAmount('');
        setCashGiven('');
        setPinError('');
        setShowPinSection(false);
        setShowTransactionForm(false);
        setIsNameLocked(false);
        setCurrentCustomer(null);
        setTierInfo(null);
        setApplyBenefits(false);
        setPointsToRedeem('');
    };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl md:text-5xl font-serif mb-8 pb-6 border-b border-gray-200">New Entry</h1>
      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Mobile Number</label>
                    <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Search or Enter..." className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"/>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} readOnly={isNameLocked} placeholder="Customer Name" className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition disabled:text-gray-400"/>
                </div>
            </div>

            {showPinSection && !showTransactionForm && (
                <div className="my-6 border border-dashed border-gray-300 p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-800">Security PIN</label>
                        <span className="text-xs text-gray-500">{currentCustomer ? 'Existing User Verification' : 'Set New User PIN'}</span>
                    </div>
                    <div className="flex gap-4">
                        <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="w-full bg-gray-100 border border-gray-300 py-2 px-3 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition text-center tracking-[0.5em]" maxLength={4} placeholder="••••"/>
                        <button onClick={handleVerifyPin} className="bg-gray-700 text-white border border-gray-700 px-6 py-2 text-sm rounded-md hover:border-gray-800 hover:bg-gray-800 transition-colors">Verify</button>
                    </div>
                     {pinError && <p className="text-red-500 text-xs mt-2">{pinError}</p>}
                </div>
            )}
            
            {showTransactionForm && (
                <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Bill Amount (₹)</label>
                            <input type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} placeholder="e.g. 900" className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"/>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Amount Given (₹)</label>
                            <input type="number" value={cashGiven} onChange={e => setCashGiven(e.target.value)} placeholder="e.g. 1000" className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"/>
                        </div>
                    </div>

                    {tierInfo && (
                        <div className="bg-blue-50 border border-blue-200 p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-800">Effective Tier</h4>
                                    <p className="text-xs text-gray-500">
                                        Based on the higher of Spend Tier ({tierInfo.spendTier}) and active Points Tier ({tierInfo.pointsTier}).
                                    </p>
                                    {tierInfo.pointsTierDaysRemaining === 0 && (
                                        <p className="text-xs text-yellow-600 mt-1">Note: All tier discounts are disabled as the points-based tier has expired.</p>
                                    )}
                                </div>
                                <TierBadge tier={tierInfo.effectiveTier} />
                            </div>
                        </div>
                    )}
                    
                    {currentCustomer && currentCustomer.points > 0 && (
                        <div className="bg-gray-50 border border-gray-200 p-4">
                            <label htmlFor="redeem-checkbox" className="flex justify-between items-center cursor-pointer">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-800">Redeem Points & Get Tier Discount</h4>
                                    <p className="text-xs text-gray-500">Available: {currentCustomer.points.toLocaleString()} points</p>
                                </div>
                                <input id="redeem-checkbox" type="checkbox" checked={applyBenefits} onChange={e => setApplyBenefits(e.target.checked)} className="h-5 w-5 bg-gray-100 border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF]" />
                            </label>
                            {applyBenefits && (
                                <div className="mt-4">
                                     <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Points to Redeem</label>
                                     <input type="number" value={pointsToRedeem} onChange={e => setPointsToRedeem(e.target.value)} placeholder={`Max ${currentCustomer.points}`} className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition" />
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="border border-dashed border-gray-300 p-6 space-y-4 text-gray-800">
                        <h3 className="text-center font-serif text-lg text-[#1E90FF]">Bill Summary</h3>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>₹{billSummary.subtotal.toFixed(2)}</span>
                        </div>
                        {billSummary.discountAmount > 0 && (
                             <div className="flex justify-between text-sm text-green-600">
                                <span >Tier Discount</span>
                                <span>- ₹{billSummary.discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        {billSummary.redeemedValue > 0 && (
                             <div className="flex justify-between text-sm text-green-600">
                                <span>Points Redeemed</span>
                                <span>- ₹{billSummary.redeemedValue.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200 text-black">
                            <span>Total Payable</span>
                            <span>₹{billSummary.totalPayable.toFixed(2)}</span>
                        </div>
                         {billSummary.pointsEarned > 0 && (
                             <div className="text-center text-green-600 font-semibold text-sm pt-2">
                                + {billSummary.pointsEarned} Points Earned
                            </div>
                        )}
                    </div>
                    
                    <button onClick={handleSubmit} className="w-full bg-[#1E90FF] text-white py-3 rounded-md font-semibold transition-all hover:bg-[#1079e0]">Process Transaction</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TransactionSection;