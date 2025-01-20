"use client"
import { useEffect } from 'react';
import useStore from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Clock, FileText, Activity, 
  Heart, Pill, ArrowUpRight, ArrowDownRight,
  Stethoscope, Building
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import Link from 'next/link';

const appointmentData = [
  { month: 'Jan', visits: 2 },
  { month: 'Feb', visits: 1 },
  { month: 'Mar', visits: 3 },
  { month: 'Apr', visits: 2 },
  { month: 'May', visits: 4 },
  { month: 'Jun', visits: 2 },
];

const vitalData = [
  { date: '1', systolic: 120, diastolic: 80 },
  { date: '2', systolic: 122, diastolic: 82 },
  { date: '3', systolic: 125, diastolic: 85 },
  { date: '4', systolic: 118, diastolic: 78 },
  { date: '5', systolic: 121, diastolic: 81 },
];

export default function PatientDashboard() {
  const {
    patientProfile,
    patientAppointments,
    patientMedicalHistory,
    fetchPatientProfile,
    fetchPatientAppointments,
    fetchDoctors,
    fetchDepartments,
    doctors,
    departments,
  } = useStore();

  useEffect(() => {
    fetchPatientProfile();
    fetchPatientAppointments();
    fetchDoctors();
    fetchDepartments();
  }, [fetchPatientProfile, fetchPatientAppointments, fetchDoctors, fetchDepartments]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Existing overview content */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patientAppointments?.length || 0}</div>
              </CardContent>
            </Card>
            {/* ... other overview cards ... */}
          </div>
          {/* ... other overview content ... */}
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors?.map((doctor) => (
              <Card key={doctor._id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{doctor.name}</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  <Link href={`/patient/appointments?doctor=${doctor._id}`}>
                    <Button className="mt-4 w-full">Book Appointment</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments?.map((department) => (
              <Card key={department._id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{department.name}</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{department.description}</p>
                  <div className="mt-2">
                    <Badge>{department.doctors?.length || 0} Doctors</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 