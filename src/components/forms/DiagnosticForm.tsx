import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DiagnosticCenter } from "@/hooks/useDiagnosticCenters";

const diagnosticSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  patientName: z.string().optional(),
  centerId: z.number().min(1, "Please select a diagnostic center"),
  centerName: z.string().min(1, "Center name is required"),
  testType: z.string().min(1, "Test type is required"),
  date: z.string().min(1, "Date is required"),
  cost: z.number().min(0, "Cost must be positive"),
  status: z.enum(["pending", "completed", "cancelled"]),
});

export type DiagnosticFormData = z.infer<typeof diagnosticSchema>;

interface DiagnosticFormProps {
  onSubmit: (data: DiagnosticFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  patients?: Array<{ id: string; name: string }>;
  centers: DiagnosticCenter[];
}

const DiagnosticForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  patients = [],
  centers = []
}: DiagnosticFormProps) => {
  const form = useForm<DiagnosticFormData>({
    resolver: zodResolver(diagnosticSchema),
    defaultValues: {
      patientId: "",
      patientName: "",
      centerId: 0,
      centerName: "",
      testType: "",
      date: new Date().toISOString().split('T')[0],
      cost: 100,
      status: "pending",
    },
  });

  const handleSubmit = (data: DiagnosticFormData) => {
    // Find patient name if patientId is provided
    if (data.patientId && patients.length > 0) {
      const patient = patients.find(p => p.id === data.patientId);
      if (patient) {
        data.patientName = patient.name;
      }
    }

    // Find center name if centerId is provided
    if (data.centerId && centers.length > 0) {
      const center = centers.find(c => c.id === data.centerId);
      if (center) {
        data.centerName = center.name;
      }
    }
    
    onSubmit(data);
  };

  const selectedCenter = centers.find(c => c.id === form.watch("centerId"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="centerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagnostic Center</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select center" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {centers.map((center) => (
                      <SelectItem key={center.id} value={center.id.toString()}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="testType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedCenter?.services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    )) || (
                      <>
                        <SelectItem value="Blood Tests">Blood Tests</SelectItem>
                        <SelectItem value="X-Ray">X-Ray</SelectItem>
                        <SelectItem value="MRI">MRI</SelectItem>
                        <SelectItem value="CT Scan">CT Scan</SelectItem>
                        <SelectItem value="ECG">ECG</SelectItem>
                        <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="100" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule Test"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DiagnosticForm;