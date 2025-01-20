"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useStore from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  User2,
  Phone,
  Mail,
  Calendar,
  FileText,
  Activity,
  Heart,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

export default function PatientDetailsPage() {
  const { id } = useParams();
  const { 
    doctorPatients, 
    fetchDoctorPatients,
    updatePatientRecord,
    addPatientNote,
    updatePatientVitals
  } = useStore();
  
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteType, setNoteType] = useState<'diagnosis' | 'treatment'>('diagnosis');
  const [noteContent, setNoteContent] = useState('');
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: ''
  });

  useEffect(() => {
    fetchDoctorPatients();
  }, [fetchDoctorPatients]);

  const patient = doctorPatients?.find(p => p._id === id);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleAddNote = async () => {
    await addPatientNote(id as string, {
      type: noteType,
      content: noteContent
    });
    setIsAddingNote(false);
    setNoteContent('');
  };

  const handleUpdateVitals = async () => {
    await updatePatientVitals(id as string, vitals);
    setVitals({ bloodPressure: '', heartRate: '', temperature: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patient Details</h1>
        <Badge variant="outline">
          Last Visit: {patient.lastVisit ? format(new Date(patient.lastVisit), 'PPP') : 'No visits yet'}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <User2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-muted-foreground">Patient ID: {patient._id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-primary" />
              <p>{patient.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-primary" />
              <p>{patient.phoneNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Vitals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vitals</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Update</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Vitals</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Blood Pressure</Label>
                    <Input
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                      placeholder="120/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heart Rate</Label>
                    <Input
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                      placeholder="72 bpm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature</Label>
                    <Input
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                      placeholder="98.6°F"
                    />
                  </div>
                  <Button onClick={handleUpdateVitals}>Save Vitals</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Blood Pressure</p>
                <p className="text-sm text-muted-foreground">
                  {patient.vitals?.bloodPressure || 'Not recorded'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Heart Rate</p>
                <p className="text-sm text-muted-foreground">
                  {patient.vitals?.heartRate || 'Not recorded'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Records */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Medical Records</CardTitle>
            <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Medical Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      variant={noteType === 'diagnosis' ? 'default' : 'outline'}
                      onClick={() => setNoteType('diagnosis')}
                    >
                      Diagnosis
                    </Button>
                    <Button
                      variant={noteType === 'treatment' ? 'default' : 'outline'}
                      onClick={() => setNoteType('treatment')}
                    >
                      Treatment
                    </Button>
                  </div>
                  <Textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder={`Enter ${noteType}...`}
                  />
                  <Button onClick={handleAddNote}>Save Note</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="diagnoses">
              <TabsList>
                <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
                <TabsTrigger value="treatments">Treatments</TabsTrigger>
              </TabsList>
              <TabsContent value="diagnoses" className="space-y-4">
                {patient.diagnoses?.map((diagnosis, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <FileText className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">{diagnosis.condition}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(diagnosis.date), 'PPP')}
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="treatments" className="space-y-4">
                {patient.treatments?.map((treatment, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Activity className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">{treatment.treatment}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(treatment.date), 'PPP')}
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 