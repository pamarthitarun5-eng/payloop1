
import { Customer } from './types';

// Helper to create recent dates for active tiers
const recentDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const sampleCustomers: Customer[] = [
  {
    mobile: '9876543210',
    name: 'Aarav Sharma',
    pin: '9876',
    points: 125,
    totalSpent: 8500,
    history: [
      { date: '2023-10-15T10:00:00Z', bill: 2500, points: 50, finalAmount: 2500 },
      { date: '2023-11-02T14:30:00Z', bill: 3000, points: 25, finalAmount: 3000 },
      { date: '2023-11-20T19:45:00Z', bill: 3000, points: 50, finalAmount: 3000 },
    ],
  },
  {
    mobile: '9123456789',
    name: 'Priya Patel',
    pin: '9123',
    points: 340,
    totalSpent: 15200,
    history: [
      { date: '2023-09-05T12:10:00Z', bill: 7000, points: 150, finalAmount: 7000 },
      { date: '2023-10-25T18:00:00Z', bill: 4200, points: 90, finalAmount: 4200 },
      { date: '2023-11-18T11:05:00Z', bill: 4000, points: 100, finalAmount: 4000 },
    ],
  },
  {
    mobile: '8887776665',
    name: 'Rohan Mehta',
    pin: '8887',
    points: 50,
    totalSpent: 1800,
    history: [
        { date: '2023-11-21T20:00:00Z', bill: 1800, points: 50, finalAmount: 1800 },
    ],
  },
  {
    mobile: '7001002003',
    name: 'Sneha Verma',
    pin: '7001',
    points: 85,
    totalSpent: 4500,
    history: [
        { date: '2023-10-10T13:00:00Z', bill: 2000, points: 40, finalAmount: 2000 },
        { date: '2023-11-12T15:20:00Z', bill: 2500, points: 45, finalAmount: 2500 },
    ],
  },
  {
    mobile: '9990001112',
    name: 'Vikram Singh',
    pin: '9990',
    points: 210,
    totalSpent: 11000,
    history: [
        { date: '2023-08-20T09:30:00Z', bill: 5000, points: 100, finalAmount: 5000 },
        { date: '2023-10-28T16:00:00Z', bill: 6000, points: 110, finalAmount: 6000 },
    ],
  },
  // --- NEW CUSTOMERS ---
  {
    mobile: '8123456789',
    name: 'Anika Reddy',
    pin: '8123',
    points: 650,
    totalSpent: 22000,
    history: [
      { date: '2024-04-10T11:00:00Z', bill: 10000, points: 300, finalAmount: 10000 },
      { date: recentDate(15), bill: 12000, points: 350, finalAmount: 12000 }, // Active Gold Tier
    ],
  },
  {
    mobile: '7890123456',
    name: 'Kabir Khan',
    pin: '7890',
    points: 1500,
    totalSpent: 55000,
    history: [
      { date: '2024-01-05T18:20:00Z', bill: 25000, points: 700, finalAmount: 25000 },
      { date: recentDate(25), bill: 30000, points: 800, finalAmount: 30000 }, // Active Platinum Tier
    ],
  },
  {
    mobile: '8880001111',
    name: 'Ishaan Joshi',
    pin: '8880',
    points: 110,
    totalSpent: 5100,
    history: [
      { date: recentDate(5), bill: 5100, points: 110, finalAmount: 5100 }, // Active Bronze Tier
    ],
  },
  {
    mobile: '9008007001',
    name: 'Meera Iyer',
    pin: '9008',
    points: 400,
    totalSpent: 18000,
    history: [
      { date: '2022-12-01T14:00:00Z', bill: 8000, points: 200, finalAmount: 8000 },
      { date: '2023-01-15T16:30:00Z', bill: 10000, points: 200, finalAmount: 10000 }, // Expired Gold Tier
    ],
  },
  {
    mobile: '9555666777',
    name: 'Zara Ali',
    pin: '9555',
    points: 30,
    totalSpent: 2500,
    history: [
      { date: recentDate(90), bill: 1500, points: 20, finalAmount: 1500 },
      { date: recentDate(40), bill: 1000, points: 10, finalAmount: 1000 }, // No Tier
    ],
  },
  {
    mobile: '7111222333',
    name: 'Arjun Nair',
    pin: '7111',
    points: 300,
    totalSpent: 9000,
    history: [
      { date: '2024-03-01T12:00:00Z', bill: 7000, points: 150, finalAmount: 7000 },
      { date: recentDate(60), bill: 4000, points: 200, finalAmount: 3000, discountApplied: 200, pointsRedeemed: 200 }, // Active Silver Tier
    ],
  },
];
