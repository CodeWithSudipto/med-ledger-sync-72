import { useState, useCallback } from "react";
import { AppointmentFormData } from "@/components/forms/AppointmentForm";

export interface Appointment {
  id: number;
  patientId: string;
  patient: string;
  time: string;
  date: string;
  duration: number;
  type: string;
  status: string;
  notes: string;
  doctor: string;
  doctorSpecialty: string;
  diagnosticCenter?: string;
  consultationFee: number;
  meetingConfirmed?: boolean;
}

const initialAppointments: Appointment[] = [
  {
    id: 1,
    patientId: "1",
    patient: "Sarah Johnson",
    time: "09:00",
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    type: "Consultation",
    status: "confirmed",
    notes: "Regular checkup",
    doctor: "Dr. Smith",
    doctorSpecialty: "General Medicine",
    consultationFee: 150,
    meetingConfirmed: false
  },
  {
    id: 2,
    patientId: "2",
    patient: "Michael Chen",
    time: "10:30",
    date: new Date().toISOString().split('T')[0],
    duration: 45,
    type: "Follow-up",
    status: "pending",
    notes: "Diabetes monitoring",
    doctor: "Dr. Johnson",
    doctorSpecialty: "Cardiology",
    consultationFee: 200,
    meetingConfirmed: false
  },
  {
    id: 3,
    patientId: "3",
    patient: "Emma Williams",
    time: "14:00",
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    type: "Check-up",
    status: "confirmed",
    notes: "Annual physical",
    doctor: "Dr. Smith",
    doctorSpecialty: "General Medicine",
    consultationFee: 120,
    meetingConfirmed: true
  },
  {
    id: 4,
    patientId: "4",
    patient: "Robert Davis",
    time: "15:30",
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    type: "Consultation",
    status: "confirmed",
    notes: "Cardiac evaluation",
    doctor: "Dr. Williams",
    doctorSpecialty: "Cardiology",
    consultationFee: 300,
    meetingConfirmed: false
  },
  {
    id: 5,
    patientId: "1",
    patient: "Lisa Anderson",
    time: "16:30",
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    type: "Follow-up",
    status: "cancelled",
    notes: "Rescheduled",
    doctor: "Dr. Johnson",
    doctorSpecialty: "General Medicine",
    consultationFee: 150,
    meetingConfirmed: false
  }
];

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isLoading, setIsLoading] = useState(false);

  const addAppointment = useCallback(async (appointmentData: AppointmentFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAppointment: Appointment = {
        id: Date.now(), // Simple ID generation
        patientId: appointmentData.patientId,
        patient: appointmentData.patientName || "Unknown Patient",
        time: appointmentData.time,
        date: appointmentData.date,
        duration: appointmentData.duration,
        type: appointmentData.type,
        status: appointmentData.status,
        notes: appointmentData.notes || "",
        doctor: appointmentData.doctor,
        doctorSpecialty: appointmentData.doctorSpecialty,
        diagnosticCenter: appointmentData.diagnosticCenter,
        consultationFee: appointmentData.consultationFee,
        meetingConfirmed: false
      };
      
      setAppointments(prev => [newAppointment, ...prev]);
      return newAppointment;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAppointment = useCallback(async (id: number, appointmentData: AppointmentFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppointments(prev => prev.map(appointment => 
        appointment.id === id 
          ? { 
              ...appointment, 
              patientId: appointmentData.patientId,
              patient: appointmentData.patientName || appointment.patient,
              time: appointmentData.time,
              date: appointmentData.date,
              duration: appointmentData.duration,
              type: appointmentData.type,
              status: appointmentData.status,
              notes: appointmentData.notes || "",
              doctor: appointmentData.doctor,
              doctorSpecialty: appointmentData.doctorSpecialty,
              diagnosticCenter: appointmentData.diagnosticCenter,
              consultationFee: appointmentData.consultationFee
            }
          : appointment
      ));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAppointment = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAppointment = useCallback((id: number) => {
    return appointments.find(appointment => appointment.id === id);
  }, [appointments]);

  const getAppointmentsByDate = useCallback((date: string) => {
    return appointments.filter(appointment => appointment.date === date);
  }, [appointments]);

  const getAppointmentsByPatient = useCallback((patientId: string) => {
    return appointments.filter(appointment => appointment.patientId === patientId);
  }, [appointments]);

  const confirmMeeting = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(prev => prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, meetingConfirmed: true, status: "completed" }
          : appointment
      ));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    appointments,
    isLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment,
    getAppointmentsByDate,
    getAppointmentsByPatient,
    confirmMeeting
  };
};