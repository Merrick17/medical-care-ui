"use client"
import { useEffect, useState } from "react";
import useStore from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Activity } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const { doctorStats, doctorAppointments, fetchDoctorStats, fetchDoctorAppointments } = useStore();
  const user = useStore(state => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user?._id) {
        try {
          await Promise.all([
            fetchDoctorStats(),
            fetchDoctorAppointments()
          ]);
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [user?._id, fetchDoctorStats, fetchDoctorAppointments]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctorStats?.totalPatients || 0}</div>
          </CardContent>
        </Card>
        {doctorStats?.appointmentsByStatus?.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.status}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctorAppointments && doctorAppointments.length > 0 ? (
              doctorAppointments
                .filter(apt => apt.status === 'Pending')
                .slice(0, 5)
                .map((appointment, index) => (
                  <div key={appointment._id || index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <p className="text-sm font-medium">{appointment.patient?.name || 'Unknown Patient'}</p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.date && appointment.time ? 
                            format(new Date(`${appointment.date}T${appointment.time}`), 'PPP p') :
                            'Time not specified'
                          }
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/doctor/appointments')}
                    >
                      View
                    </Button>
                  </div>
                ))
            ) : (
              <p className="text-sm text-muted-foreground">No pending appointments</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 