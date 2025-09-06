import { useState } from "react";
import { Search, Plus, Edit, Eye, FileText, Phone, Mail, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePatients } from "@/hooks/usePatients";
import { useAppointments } from "@/hooks/useAppointments";
import PatientForm, { PatientFormData } from "@/components/forms/PatientForm";
import AppointmentForm, { AppointmentFormData } from "@/components/forms/AppointmentForm";
import PatientDetailsModal from "@/components/modals/PatientDetailsModal";
import { toast } from "@/components/ui/use-toast";

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const { patients, isLoading, addPatient, updatePatient } = usePatients();
  const { addAppointment, isLoading: appointmentLoading } = useAppointments();

  const handleAddPatient = async (data: PatientFormData) => {
    await addPatient(data);
    setShowAddForm(false);
  };

  const handleEditPatient = async (data: PatientFormData) => {
    if (selectedPatient) {
      await updatePatient(selectedPatient.id, data);
      setShowEditForm(false);
      setSelectedPatient(null);
    }
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const handleEditClick = (patient: any) => {
    setSelectedPatient(patient);
    setShowEditForm(true);
  };

  const handleScheduleAppointment = (patient: any) => {
    setSelectedPatient(patient);
    setShowAppointmentForm(true);
    setShowDetailsModal(false);
  };

  const handleScheduleAppointmentSubmit = async (data: AppointmentFormData) => {
    await addAppointment(data);
    setShowAppointmentForm(false);
    setSelectedPatient(null);
    toast({
      title: "Success",
      description: "Appointment scheduled successfully!",
    });
  };

  const closeAllModals = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDetailsModal(false);
    setShowAppointmentForm(false);
    setSelectedPatient(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success text-success-foreground';
      case 'follow-up': return 'bg-warning text-warning-foreground';
      case 'healthy': return 'bg-accent text-accent-foreground';
      case 'monitoring': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
          <p className="text-muted-foreground">Manage patient records and information</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Cards */}
      <div className="grid gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{patient.name}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{patient.age} years • {patient.gender}</span>
                      <span>Blood: {patient.bloodGroup}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {patient.phone}
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {patient.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Last Visit: {patient.lastVisit}
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {patient.condition}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(patient)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditClick(patient)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleScheduleAppointment(patient)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Patient Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <PatientForm
            onSubmit={handleAddPatient}
            onCancel={() => setShowAddForm(false)}
            isSubmitting={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Patient Modal */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          <PatientForm
            initialData={selectedPatient}
            onSubmit={handleEditPatient}
            onCancel={() => setShowEditForm(false)}
            isSubmitting={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatient}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onEdit={() => {
          setShowDetailsModal(false);
          setShowEditForm(true);
        }}
        onScheduleAppointment={() => handleScheduleAppointment(selectedPatient)}
      />

      {/* Schedule Appointment Modal */}
      <Dialog open={showAppointmentForm} onOpenChange={setShowAppointmentForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Appointment for {selectedPatient?.name}</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            selectedPatientId={selectedPatient?.id?.toString()}
            patients={patients.map(p => ({ id: p.id.toString(), name: p.name }))}
            onSubmit={handleScheduleAppointmentSubmit}
            onCancel={() => setShowAppointmentForm(false)}
            isSubmitting={appointmentLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientManagement;