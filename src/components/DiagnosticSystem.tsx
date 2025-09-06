import { useState } from "react";
import { Search, Plus, Building, TestTube, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDiagnosticCenters } from "@/hooks/useDiagnosticCenters";
import { usePatients } from "@/hooks/usePatients";
import DiagnosticForm from "@/components/forms/DiagnosticForm";
import { toast } from "@/components/ui/use-toast";

const DiagnosticSystem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { centers, tests, isLoading, addDiagnosticTest } = useDiagnosticCenters();
  const { patients } = usePatients();

  const handleAddTest = async (testData: any) => {
    await addDiagnosticTest(testData);
    setShowAddForm(false);
    toast({
      title: "Success",
      description: "Diagnostic test scheduled successfully!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredTests = tests.filter(test =>
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.centerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diagnostic Management</h1>
          <p className="text-muted-foreground">Manage diagnostic tests and centers</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Test
        </Button>
      </div>

      {/* Diagnostic Centers */}
      <div className="grid md:grid-cols-3 gap-6">
        {centers.map((center) => (
          <Card key={center.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Building className="h-5 w-5 mr-2 text-primary" />
                {center.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{center.location}</p>
                <p className="text-sm text-muted-foreground">{center.phone}</p>
                <p className="text-sm">
                  <span className="font-medium">Rating:</span> ⭐ {center.rating}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Hours:</span> {center.availability}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {center.services.slice(0, 3).map((service) => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {center.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{center.services.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Tests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <TestTube className="h-5 w-5 mr-2 text-primary" />
              Diagnostic Tests
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TestTube className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{test.patientName}</p>
                    <p className="text-sm text-muted-foreground">{test.testType}</p>
                    <p className="text-xs text-muted-foreground">{test.centerName}</p>
                    {test.results && (
                      <p className="text-xs text-success">Results: {test.results}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(test.date).toLocaleDateString()}
                    </div>
                    <p className="text-sm font-medium text-primary">${test.cost}</p>
                  </div>
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Test Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Diagnostic Test</DialogTitle>
          </DialogHeader>
          <DiagnosticForm
            patients={patients.map(p => ({ id: p.id.toString(), name: p.name }))}
            centers={centers}
            onSubmit={handleAddTest}
            onCancel={() => setShowAddForm(false)}
            isSubmitting={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiagnosticSystem;