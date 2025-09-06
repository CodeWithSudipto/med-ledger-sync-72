import { useState, useCallback } from "react";

export interface EarningRecord {
  id: number;
  appointmentId: number;
  patientId: string;
  patientName: string;
  amount: number;
  type: 'consultation' | 'diagnostic' | 'procedure';
  date: string;
  description: string;
}

const initialEarnings: EarningRecord[] = [
  {
    id: 1,
    appointmentId: 1,
    patientId: "1",
    patientName: "Sarah Johnson",
    amount: 150,
    type: "consultation",
    date: new Date().toISOString().split('T')[0],
    description: "Regular consultation"
  },
  {
    id: 2,
    appointmentId: 2,
    patientId: "2", 
    patientName: "Michael Chen",
    amount: 200,
    type: "consultation",
    date: new Date().toISOString().split('T')[0],
    description: "Diabetes follow-up"
  }
];

export const useEarnings = () => {
  const [earnings, setEarnings] = useState<EarningRecord[]>(initialEarnings);
  const [isLoading, setIsLoading] = useState(false);

  const addEarning = useCallback(async (earningData: Omit<EarningRecord, 'id'>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEarning: EarningRecord = {
        id: Date.now(),
        ...earningData,
      };
      
      setEarnings(prev => [newEarning, ...prev]);
      return newEarning;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTotalEarnings = useCallback(() => {
    return earnings.reduce((total, earning) => total + earning.amount, 0);
  }, [earnings]);

  const getTodayEarnings = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return earnings
      .filter(earning => earning.date === today)
      .reduce((total, earning) => total + earning.amount, 0);
  }, [earnings]);

  const getMonthlyEarnings = useCallback(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return earnings
      .filter(earning => {
        const earningDate = new Date(earning.date);
        return earningDate.getMonth() === currentMonth && earningDate.getFullYear() === currentYear;
      })
      .reduce((total, earning) => total + earning.amount, 0);
  }, [earnings]);

  return {
    earnings,
    isLoading,
    addEarning,
    getTotalEarnings,
    getTodayEarnings,
    getMonthlyEarnings
  };
};