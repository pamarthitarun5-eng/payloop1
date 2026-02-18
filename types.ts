
export interface Transaction {
  date: string;
  bill: number;
  points: number; // Points earned in this transaction
  discountApplied?: number;
  pointsRedeemed?: number;
  finalAmount: number;
}

export interface Customer {
  mobile: string;
  name: string;
  pin: string;
  points: number;
  totalSpent: number;
  history: Transaction[];
}

export interface SmsLog {
  timestamp: string;
  recipient: string;
  message: string;
}

export enum Page {
  Choice,
  Login,
  Dashboard,
  Register,
}

export enum UserType {
  Guest,
  Admin,
}

// FIX: Define and export the Tier enum to make it accessible across the application.
export enum Tier {
    Platinum = 'Platinum',
    Gold = 'Gold',
    Silver = 'Silver',
    Bronze = 'Bronze',
    None = 'None',
}

export type DashboardSection = 'overview' | 'transaction' | 'search' | 'customers' | 'analytics' | 'settings' | 'smsLogs';

export interface AdminCredentials {
  businessName: string;
  username: string;
  password: string;
}

// New settings types
export interface SpendTiers {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

export interface PointsTiers {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

export interface TierDiscounts {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

export interface TierDeadlines {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

export interface Settings {
  spendTiers: SpendTiers;
  pointsTiers: PointsTiers;
  tierDiscounts: TierDiscounts;
  tierDeadlines: TierDeadlines;
  pointsToRupeeConversion: number;
}