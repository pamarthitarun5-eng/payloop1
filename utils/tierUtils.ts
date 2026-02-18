
import { Customer, Settings, TierDeadlines, Tier } from '../types';

const TIER_HIERARCHY: Tier[] = [Tier.Platinum, Tier.Gold, Tier.Silver, Tier.Bronze, Tier.None];

export interface CustomerTiers {
    spendTier: Tier;
    pointsTier: Tier;
    pointsTierDaysRemaining: number | null;
    effectiveTier: Tier;
}

export const getCustomerTiers = (customer: Customer, settings: Settings): CustomerTiers => {
    const { totalSpent, points, history } = customer;
    const { spendTiers, pointsTiers, tierDeadlines } = settings;

    // --- Spend Tier Calculation ---
    let spendTier = Tier.None;
    if (totalSpent >= spendTiers.platinum) spendTier = Tier.Platinum;
    else if (totalSpent >= spendTiers.gold) spendTier = Tier.Gold;
    else if (totalSpent >= spendTiers.silver) spendTier = Tier.Silver;
    else if (totalSpent >= spendTiers.bronze) spendTier = Tier.Bronze;

    // --- Points Tier Calculation (with expiry logic) ---
    let potentialPointsTier = Tier.None;
    if (points >= pointsTiers.platinum) potentialPointsTier = Tier.Platinum;
    else if (points >= pointsTiers.gold) potentialPointsTier = Tier.Gold;
    else if (points >= pointsTiers.silver) potentialPointsTier = Tier.Silver;
    else if (points >= pointsTiers.bronze) potentialPointsTier = Tier.Bronze;
    
    let activePointsTier = Tier.None;
    let pointsTierDaysRemaining: number | null = null;
    
    if (potentialPointsTier !== Tier.None && history && history.length > 0) {
        const lastTxDate = new Date(history[history.length - 1].date);
        const deadlineDays = tierDeadlines[potentialPointsTier.toLowerCase() as keyof TierDeadlines];
        
        if (!deadlineDays || deadlineDays <= 0) {
            activePointsTier = potentialPointsTier;
        } else {
            const expiryDate = new Date(lastTxDate);
            expiryDate.setDate(lastTxDate.getDate() + deadlineDays);
            const now = new Date();
            
            if (now <= expiryDate) {
                activePointsTier = potentialPointsTier;
                const diffTime = expiryDate.getTime() - now.getTime();
                pointsTierDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            } else {
                 pointsTierDaysRemaining = 0; // Explicitly set to 0 for expired
            }
        }
    }

    // --- Effective Tier Calculation ---
    let effectiveTier: Tier;

    // If the points tier has expired, no discount is available from any tier.
    if (pointsTierDaysRemaining === 0) {
        effectiveTier = Tier.None;
    } else {
        const spendTierIndex = TIER_HIERARCHY.indexOf(spendTier);
        const pointsTierIndex = TIER_HIERARCHY.indexOf(activePointsTier);
        effectiveTier = TIER_HIERARCHY[Math.min(spendTierIndex, pointsTierIndex)];
    }

    return { 
        spendTier, 
        pointsTier: activePointsTier, 
        pointsTierDaysRemaining,
        effectiveTier
    };
};
