"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Activity } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function MedicalHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Medical History</h1>

      <Tabs defaultValue="visits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="tests">Lab Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="visits" className="space-y-4">
          {[
            {
              date: 'February 28, 2024',
              doctor: 'Dr. Sarah Smith',
              type: 'Regular Checkup',
              notes: 'Patient reported mild chest pain. BP: 120/80, Heart rate: Normal',
              followUp: 'Scheduled for March 15',
            },
            {
              date: 'January 15, 2024',
              doctor: 'Dr. John Doe',
              type: 'Emergency Visit',
              notes: 'Severe allergic reaction to peanuts. Administered epinephrine.',
              followUp: 'Allergy specialist referral',
            },
          ].map((visit, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{visit.date}</span>
                  </div>
                  <Badge>{visit.type}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{visit.doctor}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{visit.notes}</p>
                  <p className="text-sm">Follow-up: {visit.followUp}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="diagnoses" className="space-y-4">
          {[
            {
              date: 'February 28, 2024',
              condition: 'Hypertension',
              doctor: 'Dr. Sarah Smith',
              status: 'Ongoing',
              notes: 'Prescribed medication and lifestyle changes',
            },
            {
              date: 'January 15, 2024',
              condition: 'Peanut Allergy',
              doctor: 'Dr. John Doe',
              status: 'Chronic',
              notes: 'Severe allergic reaction, carry epinephrine',
            },
          ].map((diagnosis, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{diagnosis.condition}</h3>
                  <Badge variant="secondary">{diagnosis.status}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <p>Diagnosed: {diagnosis.date}</p>
                  <p>By: {diagnosis.doctor}</p>
                  <p className="text-muted-foreground">{diagnosis.notes}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          {/* Similar structure for medications history */}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {/* Similar structure for lab tests history */}
        </TabsContent>
      </Tabs>
    </div>
  );
} 