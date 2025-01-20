import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Building2, CheckCircle2 } from "lucide-react";

interface Statistics {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  appointmentsByStatus: Array<{ status: string; count: number }>;
}

interface StatisticsCardsProps {
  statistics: Statistics;
}

export function StatisticsCards({ statistics }: StatisticsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.totalDoctors}</div>
          <p className="text-xs text-muted-foreground">
            Healthcare professionals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.totalPatients}</div>
          <p className="text-xs text-muted-foreground">
            Registered patients
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.totalAppointments}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {statistics.appointmentsByStatus.map(status => (
              <span key={status.status} className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {status.count} {status.status}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Departments</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.totalDepartments}</div>
          <p className="text-xs text-muted-foreground">
            Medical departments
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 