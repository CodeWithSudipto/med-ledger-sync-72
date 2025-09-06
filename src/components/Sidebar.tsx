import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  TestTube,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
    },
    {
      name: "Appointments",
      href: "/appointments", 
      icon: Calendar,
    },
    {
      name: "Diagnostics",
      href: "/diagnostics", 
      icon: TestTube,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Activity className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold text-foreground">MediCare Pro</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">DS</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-foreground">Dr. Smith</p>
            <p className="text-xs text-muted-foreground">Cardiologist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;