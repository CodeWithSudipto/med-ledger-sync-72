import { Users, Calendar, FileText, TrendingUp, Clock, DollarSign, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatients } from "@/hooks/usePatients";
import { useAppointments } from "@/hooks/useAppointments";
import { useEarnings } from "@/hooks/useEarnings";

const HealthcareDashboard = () => {
  const { patients } = usePatients();
  const { appointments, getAppointmentsByDate } = useAppointments();
  const { getTodayEarnings, getMonthlyEarnings } = useEarnings();

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = getAppointmentsByDate(today);
  const confirmedMeetings = appointments.filter(apt => apt.meetingConfirmed).length;

  const stats = [
    {
      title: "Total Patients",
      value: patients.length.toString(),
      change: "+12%",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length.toString(),
      change: "+3",
      icon: Calendar,
      color: "text-accent"
    },
    {
      title: "Confirmed Meetings",
      value: confirmedMeetings.toString(),
      change: "+5",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      title: "Monthly Revenue",
      value: `$${getMonthlyEarnings().toLocaleString()}`,
      change: "+18%",
      icon: DollarSign,
      color: "text-success"
    }
  ];

  const recentAppointments = todayAppointments.slice(0, 4);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Healthcare Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Smith</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Today's Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">{appointment.time}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthcareDashboard;