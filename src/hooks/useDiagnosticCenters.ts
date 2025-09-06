import { useState, useCallback } from "react";

export interface DiagnosticCenter {
  id: number;
  name: string;
  location: string;
  phone: string;
  services: string[];
  availability: string;
  rating: number;
}

export interface DiagnosticTest {
  id: number;
  patientId: string;
  patientName: string;
  centerId: number;
  centerName: string;
  testType: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  results?: string;
  cost: number;
}

const initialCenters: DiagnosticCenter[] = [
  {
    id: 1,
    name: "Advanced Medical Diagnostics",
    location: "123 Healthcare Blvd, Medical District",
    phone: "+1 (555) 100-2000",
    services: ["X-Ray", "MRI", "CT Scan", "Blood Tests", "ECG"],
    availability: "24/7",
    rating: 4.8
  },
  {
    id: 2,
    name: "City Diagnostic Center",
    location: "456 Medical Ave, Downtown",
    phone: "+1 (555) 200-3000",
    services: ["Ultrasound", "Blood Tests", "Urine Tests", "ECG", "EEG"],
    availability: "6 AM - 10 PM",
    rating: 4.5
  },
  {
    id: 3,
    name: "Heart & Imaging Center",
    location: "789 Cardiac St, Health Plaza",
    phone: "+1 (555) 300-4000",
    services: ["Echocardiogram", "Stress Test", "Heart CT", "Angiogram"],
    availability: "8 AM - 6 PM",
    rating: 4.9
  }
];

const initialTests: DiagnosticTest[] = [
  {
    id: 1,
    patientId: "1",
    patientName: "Sarah Johnson",
    centerId: 1,
    centerName: "Advanced Medical Diagnostics",
    testType: "Blood Tests",
    date: new Date().toISOString().split('T')[0],
    status: "pending",
    cost: 150
  },
  {
    id: 2,
    patientId: "2",
    patientName: "Michael Chen",
    centerId: 2,
    centerName: "City Diagnostic Center",
    testType: "ECG",
    date: new Date().toISOString().split('T')[0],
    status: "completed",
    results: "Normal sinus rhythm",
    cost: 75
  }
];

export const useDiagnosticCenters = () => {
  const [centers, setCenters] = useState<DiagnosticCenter[]>(initialCenters);
  const [tests, setTests] = useState<DiagnosticTest[]>(initialTests);
  const [isLoading, setIsLoading] = useState(false);

  const addDiagnosticTest = useCallback(async (testData: Omit<DiagnosticTest, 'id'>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTest: DiagnosticTest = {
        id: Date.now(),
        ...testData,
      };
      
      setTests(prev => [newTest, ...prev]);
      return newTest;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTestStatus = useCallback(async (id: number, status: DiagnosticTest['status'], results?: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTests(prev => prev.map(test => 
        test.id === id 
          ? { ...test, status, results }
          : test
      ));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    centers,
    tests,
    isLoading,
    addDiagnosticTest,
    updateTestStatus
  };
};