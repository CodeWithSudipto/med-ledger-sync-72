import { useState, useCallback } from "react";
import { PatientFormData } from "@/components/forms/PatientForm";

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  lastVisit: string;
  condition: string;
  status: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
}

const initialPatients: Patient[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 34,
    gender: "Female",
    bloodGroup: "A+",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@email.com",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
    status: "Active",
    address: "123 Main St, New York, NY 10001",
    emergencyContact: "John Johnson - +1 (555) 123-4568",
    medicalHistory: "Family history of hypertension, previous surgery in 2020",
    allergies: "Penicillin, Shellfish",
    currentMedications: "Lisinopril 10mg daily, Aspirin 81mg daily"
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 28,
    gender: "Male",
    bloodGroup: "O-",
    phone: "+1 (555) 987-6543",
    email: "m.chen@email.com",
    lastVisit: "2024-01-12",
    condition: "Diabetes Type 2",
    status: "Follow-up",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    emergencyContact: "Lisa Chen - +1 (555) 987-6544",
    medicalHistory: "Recently diagnosed diabetes, no previous surgeries",
    allergies: "None known",
    currentMedications: "Metformin 500mg twice daily"
  },
  {
    id: 3,
    name: "Emma Williams",
    age: 45,
    gender: "Female",
    bloodGroup: "B+",
    phone: "+1 (555) 456-7890",
    email: "emma.w@email.com",
    lastVisit: "2024-01-10",
    condition: "Regular Check-up",
    status: "Healthy",
    address: "789 Pine St, Chicago, IL 60601",
    emergencyContact: "David Williams - +1 (555) 456-7891",
    medicalHistory: "Regular checkups, no significant medical history",
    allergies: "Latex",
    currentMedications: "Multivitamin daily"
  },
  {
    id: 4,
    name: "Robert Davis",
    age: 52,
    gender: "Male",
    bloodGroup: "AB+",
    phone: "+1 (555) 321-0987",
    email: "r.davis@email.com",
    lastVisit: "2024-01-08",
    condition: "Cardiac Monitoring",
    status: "Monitoring",
    address: "321 Elm St, Houston, TX 77001",
    emergencyContact: "Mary Davis - +1 (555) 321-0988",
    medicalHistory: "Heart condition, previous cardiac event in 2019",
    allergies: "Iodine",
    currentMedications: "Carvedilol 25mg twice daily, Atorvastatin 20mg daily"
  }
];

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [isLoading, setIsLoading] = useState(false);

  const addPatient = useCallback(async (patientData: PatientFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPatient: Patient = {
        id: Date.now(), // Simple ID generation
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        bloodGroup: patientData.bloodGroup,
        phone: patientData.phone,
        email: patientData.email,
        lastVisit: new Date().toISOString().split('T')[0],
        condition: "New Patient",
        status: "Active",
        address: patientData.address,
        emergencyContact: patientData.emergencyContact,
        medicalHistory: patientData.medicalHistory,
        allergies: patientData.allergies,
        currentMedications: patientData.currentMedications,
      };
      
      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePatient = useCallback(async (id: number, patientData: PatientFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPatients(prev => prev.map(patient => 
        patient.id === id 
          ? { 
              ...patient,
              name: patientData.name,
              age: patientData.age,
              gender: patientData.gender,
              bloodGroup: patientData.bloodGroup,
              phone: patientData.phone,
              email: patientData.email,
              address: patientData.address,
              emergencyContact: patientData.emergencyContact,
              medicalHistory: patientData.medicalHistory,
              allergies: patientData.allergies,
              currentMedications: patientData.currentMedications,
            }
          : patient
      ));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePatient = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPatients(prev => prev.filter(patient => patient.id !== id));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPatient = useCallback((id: number) => {
    return patients.find(patient => patient.id === id);
  }, [patients]);

  return {
    patients,
    isLoading,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient
  };
};