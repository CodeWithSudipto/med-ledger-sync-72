import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, Calendar, FileText, Heart, AlertTriangle, Pill, Contact } from "lucide-react";

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

interface PatientDetailsModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onScheduleAppointment: () => void;
}

const PatientDetailsModal = ({ 
  patient, 
  isOpen, 
  onClose, 
  onEdit, 
  onScheduleAppointment 
}: PatientDetailsModalProps) => {
  if (!patient) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success text-success-foreground';
      case 'follow-up': return 'bg-warning text-warning-foreground';
      case 'healthy': return 'bg-accent text-accent-foreground';
      case 'monitoring': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-muted-foreground">Patient ID: #{patient.id}</p>
              </div>
            </div>
            <Badge className={getStatusColor(patient.status)}>
              {patient.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{patient.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{patient.bloodGroup}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Last Visit</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Condition</p>
                  <p className="font-medium">{patient.condition}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Contact className="h-5 w-5 mr-2 text-primary" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{patient.email}</span>
              </div>
              {patient.address && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">{patient.address}</p>
                </div>
              )}
              {patient.emergencyContact && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Emergency Contact</p>
                  <p className="font-medium">{patient.emergencyContact}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-primary" />
              Medical Information
            </h3>
            <div className="space-y-4">
              {patient.medicalHistory && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Medical History</p>
                  <p className="font-medium">{patient.medicalHistory}</p>
                </div>
              )}
              {patient.allergies && (
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <p className="text-sm text-destructive font-medium mb-1 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Allergies
                  </p>
                  <p>{patient.allergies}</p>
                </div>
              )}
              {patient.currentMedications && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Pill className="h-4 w-4 mr-2" />
                    Current Medications
                  </p>
                  <p className="font-medium">{patient.currentMedications}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={onEdit}>
            Edit Patient
          </Button>
          <Button onClick={onScheduleAppointment}>
            Schedule Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailsModal;