"use client"
import { useEffect, useState } from "react";
import useStore from "@/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarMonthView,
  CalendarWeekView,
  CalendarDayView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  type CalendarEvent
} from "@/components/ui/full-calendar";
import { ChevronLeft, ChevronRight, User2, Building2, Stethoscope } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function DoctorAppointments() {
  const {
    doctorAppointments,
    fetchDoctorAppointments,
    updateAppointmentStatus,
    getStatusColor,
    getStatusClass
  } = useStore();
  const user = useStore(state => state.user);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    if (user?._id) {
      fetchDoctorAppointments();
    }
  }, [fetchDoctorAppointments, user?._id]);

  if (!user?._id) {
    return <div>Please log in to view appointments</div>;
  }

  const calendarEvents: CalendarEvent[] = doctorAppointments?.map(appointment => ({
    id: appointment._id,
    title: `${appointment.patient.name} - ${appointment.reason}`,
    start: new Date(appointment.appointmentDate),
    end: new Date(new Date(appointment.appointmentDate).getTime() + 30 * 60000),
    color: appointment.status === 'Completed' ? 'green' :
      appointment.status === 'Cancelled' ? 'pink' :
        appointment.status === 'Confirmed' ? 'blue' : 'default'
  })) || [];

  const handleEventClick = (event: CalendarEvent) => {
    const appointment = doctorAppointments?.find(apt => apt._id === event.id);
    if (appointment) {
      setSelectedAppointment(appointment);
    }
  };

  const handleStatusChange = async (id: string, status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Confirmed') => {
    try {
      await updateAppointmentStatus(id, status);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Appointments Calendar</CardTitle>
              <CardDescription>
                Manage and view your appointments
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Total: {doctorAppointments?.length || 0}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <CalendarPrevTrigger>
                <ChevronLeft className="h-4 w-4" />
              </CalendarPrevTrigger>
              <CalendarTodayTrigger>Today</CalendarTodayTrigger>
              <CalendarNextTrigger>
                <ChevronRight className="h-4 w-4" />
              </CalendarNextTrigger>
              <CalendarCurrentDate />
            </div>
            <div className="flex items-center gap-2">
              <CalendarViewTrigger view="month">Month</CalendarViewTrigger>
              <CalendarViewTrigger view="week">Week</CalendarViewTrigger>
              <CalendarViewTrigger view="day">Day</CalendarViewTrigger>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <Calendar
              events={calendarEvents}
              onEventClick={handleEventClick}
              defaultDate={new Date()}
              enableHotkeys={true}
            >
              <CalendarMonthView />
              <CalendarWeekView />
              <CalendarDayView />
            </Calendar>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage appointment information
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User2 className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-medium">Patient</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedAppointment.patient.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 text-primary">📅</div>
                <div>
                  <div className="font-medium">Date & Time</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(selectedAppointment.appointmentDate), 'PPP p')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-medium">Department</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedAppointment.department.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-medium">Reason</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedAppointment.reason}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-medium mb-2">Status</div>
                <Badge className={getStatusClass(selectedAppointment.status)}>
                  {selectedAppointment.status}
                </Badge>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedAppointment._id, 'Completed')}
                  disabled={selectedAppointment.status === 'Completed' || selectedAppointment.status === 'Cancelled'}
                >
                  Mark as Completed
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleStatusChange(selectedAppointment._id, 'Cancelled')}
                  disabled={selectedAppointment.status === 'Completed' || selectedAppointment.status === 'Cancelled'}
                >
                  Cancel Appointment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}