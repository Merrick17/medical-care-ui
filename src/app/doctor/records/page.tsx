"use client"
import { useState, useEffect } from "react";
import useStore from "@/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, FileText, User2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import MedicalRecordForm from "@/components/medical-history/medical-record-form";
import { DoctorPatient, PatientWithHistory } from "@/store/types";
import { useToast } from "@/hooks/use-toast";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const patientSelectionSchema = z.object({
  patient: z.string().min(1, "Please select a patient"),
});

export default function DoctorRecords() {
  const { 
    doctorPatients, 
    doctorPatientsHistories,
    doctorAppointments,
    fetchDoctorPatients, 
    fetchPatientsHistories,
    fetchDoctorAppointments,
    isLoading, 
    error 
  } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientWithHistory | null>(null);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [patientForNewRecord, setPatientForNewRecord] = useState<PatientWithHistory | null>(null);
  const { toast } = useToast();
  const patientSelectionForm = useForm<z.infer<typeof patientSelectionSchema>>({
    resolver: zodResolver(patientSelectionSchema),
  });

  useEffect(() => {
    fetchDoctorPatients();
    fetchPatientsHistories();
    fetchDoctorAppointments();
  }, [fetchDoctorPatients, fetchPatientsHistories, fetchDoctorAppointments]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Filter patients based on search query
  const filteredPatients = doctorPatientsHistories?.filter(patient =>
    patient.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleViewRecord = (patient: PatientWithHistory) => {
    setSelectedPatient(patient);
  };

  const handleAddRecord = (patient: PatientWithHistory) => {
    setPatientForNewRecord(patient);
    setIsAddingRecord(true);
  };

  const handleRecordSuccess = () => {
    setIsAddingRecord(false);
    setPatientForNewRecord(null);
    toast({
      title: "Success",
      description: "Medical record has been saved successfully.",
    });
    fetchDoctorPatients(); // Refresh the list
  };

  const handleRecordError = (error: Error) => {
    toast({
      title: "Error",
      description: error.message || "Failed to save medical record",
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medical Records</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setIsAddingRecord(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Medical Record
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <h3 className="font-semibold text-lg">No Records Found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery 
                    ? "No records match your search criteria." 
                    : "Get started by creating a new medical record."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsAddingRecord(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Record
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Latest Visit</TableHead>
                    <TableHead>Latest Diagnosis</TableHead>
                    <TableHead>Follow-up Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((record) => {
                    const latestHistory = record.histories[0];
                    return (
                      <TableRow key={record.patient._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User2 className="w-4 h-4" />
                            {record.patient.name}
                            <span className="text-sm text-muted-foreground">
                              ({record.patient.CIN})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {latestHistory ? format(new Date(latestHistory.createdAt), 'PPP') : 'No visits'}
                        </TableCell>
                        <TableCell>
                          {latestHistory?.diagnosis || 'No diagnosis'}
                        </TableCell>
                        <TableCell>
                          {latestHistory?.followUpDate ? 
                            format(new Date(latestHistory.followUpDate), 'PPP') : 
                            'No follow-up scheduled'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRecord(record)}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View Record</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddRecord(record)}
                            >
                              <Plus className="h-4 w-4" />
                              <span className="sr-only">Add Record</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Record Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Record</DialogTitle>
            <DialogDescription>
              View and manage patient medical information
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p>{selectedPatient.patient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p>{selectedPatient.patient.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p>{selectedPatient.patient.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">CIN</label>
                      <p>{selectedPatient.patient.CIN}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medical History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPatient.histories.map((history, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Visit Date: {format(new Date(history.createdAt), 'PPP')}</p>
                          {history.followUpDate && (
                            <p className="text-sm text-muted-foreground">
                              Follow-up: {format(new Date(history.followUpDate), 'PPP')}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Diagnosis</h4>
                          <p className="text-sm">{history.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Vital Signs</h4>
                          <div className="text-sm">
                            {Object.entries(history.vitalSigns).map(([key, value]) => (
                              <p key={key}>{key}: {value}</p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Prescriptions</h4>
                        <ul className="list-disc list-inside text-sm">
                          {history.prescription.map((med, idx) => (
                            <li key={idx}>{med}</li>
                          ))}
                        </ul>
                      </div>

                      {history.notes && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-1">Notes</h4>
                          <p className="text-sm">{history.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Latest Vital Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Blood Pressure</label>
                      <p className="mt-1">{selectedPatient.patient.vitals?.bloodPressure || 'Not recorded'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Heart Rate</label>
                      <p className="mt-1">{selectedPatient.patient.vitals?.heartRate || 'Not recorded'} bpm</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Temperature</label>
                      <p className="mt-1">{selectedPatient.patient.vitals?.temperature || 'Not recorded'} °C</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Record Dialog */}
      <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add Medical Record</DialogTitle>
            <DialogDescription>
              {patientForNewRecord 
                ? `Add a new medical record for ${patientForNewRecord.patient.name}`
                : "Create a new medical record"}
            </DialogDescription>
          </DialogHeader>
          {!patientForNewRecord ? (
            <Form {...patientSelectionForm}>
              <form className="space-y-4">
                <FormField
                  control={patientSelectionForm.control}
                  name="patient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Patient</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const patient = doctorPatients.find(p => p._id === value);
                          if (patient) {
                            setPatientForNewRecord({
                              patient: {
                                _id: patient._id,
                                name: patient.name,
                                email: patient.email,
                                phoneNumber: patient.phoneNumber,
                                CIN: patient.CIN,
                                vitals: patient.vitals
                              },
                              histories: []
                            });
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctorPatients.map((patient) => (
                            <SelectItem key={patient._id} value={patient._id}>
                              {patient.name} ({patient.CIN})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : (
            <MedicalRecordForm
              patientId={patientForNewRecord.patient._id}
              onSuccess={handleRecordSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
