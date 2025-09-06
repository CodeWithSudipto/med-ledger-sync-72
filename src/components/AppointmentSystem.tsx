import { useState } from "react";
import { Calendar, Clock, Users, Plus, Filter, Search, Edit, Trash2, CheckCircle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAppointments } from "@/hooks/useAppointments";
import { usePatients } from "@/hooks/usePatients";
import { useEarnings } from "@/hooks/useEarnings";
import AppointmentForm, { AppointmentFormData } from "@/components/forms/AppointmentForm";
import { toast } from "@/components/ui/use-toast";

const AppointmentSystem = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  const { appointments, isLoading, addAppointment, updateAppointment, deleteAppointment, getAppointmentsByDate, confirmMeeting } = useAppointments();
  const { patients } = usePatients();
  const { addEarning } = useEarnings();

  const handleAddAppointment = async (data: AppointmentFormData) => {
    await addAppointment(data);
    setShowAddForm(false);
    toast({
      title: "Success",
      description: "Appointment added successfully!",
    });
  };

  const handleEditAppointment = async (data: AppointmentFormData) => {
    if (selectedAppointment) {
      await updateAppointment(selectedAppointment.id, data);
      setShowEditForm(false);
      setSelectedAppointment(null);
      toast({
        title: "Success", 
        description: "Appointment updated successfully!",
      });
    }
  };

  const handleEditClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowEditForm(true);
  };

  const handleDeleteClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDeleteAlert(true);  
  };

  const handleDeleteConfirm = async () => {
    if (selectedAppointment) {
      await deleteAppointment(selectedAppointment.id);
      setShowDeleteAlert(false);
      setSelectedAppointment(null);
      toast({
        title: "Success",
        description: "Appointment deleted successfully!",
      });
    }
  };

  const handleConfirmMeeting = async (appointment: any) => {
    await confirmMeeting(appointment.id);
    
    // Add earning record
    await addEarning({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patient,
      amount: appointment.consultationFee,
      type: 'consultation',
      date: new Date().toISOString().split('T')[0],
      description: `${appointment.type} with ${appointment.doctor}`
    });

    toast({
      title: "Meeting Confirmed!",
      description: `Earned +$${appointment.consultationFee} from ${appointment.patient}`,
    });
  };

  const closeAllModals = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDeleteAlert(false);
    setSelectedAppointment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'consultation': return 'bg-primary text-primary-foreground';
      case 'follow-up': return 'bg-accent text-accent-foreground';
      case 'check-up': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredAppointments = getAppointmentsByDate(selectedDate).filter(appointment =>
    appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointment Management</h1>
          <p className="text-muted-foreground">Schedule and manage patient appointments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Calendar and Controls */}
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Date Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Actions</p>
              <div className="space-y-1">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Today's Schedule
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  This Week
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Upcoming
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Appointments for {new Date(selectedDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{appointment.time}</div>
                        <div className="text-xs text-muted-foreground">{appointment.duration}min</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.doctor} - {appointment.doctorSpecialty}
                        </p>
                        {appointment.diagnosticCenter && (
                          <p className="text-xs text-muted-foreground">
                            Diagnostic: {appointment.diagnosticCenter}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">${appointment.consultationFee}</p>
                        {appointment.meetingConfirmed && (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirmed
                          </Badge>
                        )}
                      </div>
                      <Badge className={getTypeColor(appointment.type)}>
                        {appointment.type}
                      </Badge>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {!appointment.meetingConfirmed && appointment.status === 'confirmed' && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-success hover:bg-success/90"
                          onClick={() => handleConfirmMeeting(appointment)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm Meeting
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(appointment)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteClick(appointment)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            patients={patients.map(p => ({ id: p.id.toString(), name: p.name }))}
            onSubmit={handleAddAppointment}
            onCancel={() => setShowAddForm(false)}
            isSubmitting={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Modal */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            initialData={{
              patientId: selectedAppointment?.patientId,
              patientName: selectedAppointment?.patient,
              date: selectedAppointment?.date,
              time: selectedAppointment?.time,
              duration: selectedAppointment?.duration,
              type: selectedAppointment?.type as any,
              doctor: selectedAppointment?.doctor,
              doctorSpecialty: selectedAppointment?.doctorSpecialty,
              diagnosticCenter: selectedAppointment?.diagnosticCenter,
              notes: selectedAppointment?.notes,
              status: selectedAppointment?.status as any,
              consultationFee: selectedAppointment?.consultationFee,
            }}
            patients={patients.map(p => ({ id: p.id.toString(), name: p.name }))}
            onSubmit={handleEditAppointment}
            onCancel={() => setShowEditForm(false)}
            isSubmitting={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment with {selectedAppointment?.patient}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentSystem;