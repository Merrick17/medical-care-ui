"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import useStore from "@/store";
import { Calendar, User, Video, Building2, Clock, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AppointmentsPage() {
  const {
    fetchPatientAppointments,
    patientAppointments,
    cancelAppointment,
    bookAppointment,
    fetchDoctors,
    doctors, departments
  } = useStore();
  const { user } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctor');

  const [statusFilter, setStatusFilter] = useState("all");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctorId || "");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [appointmentReason, setAppointmentReason] = useState("Regular checkup");

  useEffect(() => {
    if (user) {
      fetchPatientAppointments();
      fetchDoctors();
    }
  }, [user, fetchPatientAppointments, fetchDoctors]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      console.log("departments", departments);
      const doctor = doctors?.find(d => d._id === selectedDoctor);
      const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase();
      const doctorAvailability = doctor?.availability?.find(a => a.day.toLowerCase() === dayOfWeek);

      if (doctorAvailability) {
        const slots = doctorAvailability.slots
          .filter(slot => !slot.isBooked)
          .map(slot => slot.time);
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    }
  }, [selectedDoctor, selectedDate, doctors]);

  if (!patientAppointments) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredAppointments = statusFilter === "all"
    ? patientAppointments
    : patientAppointments.filter(apt => apt.status === statusFilter);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      return;
    }

    try {
      // Find the department that has the selected doctor
      const department = departments?.find(dept => 
        dept.doctors.some(doc => doc._id === selectedDoctor)
      );

      if (!department?._id) {
        throw new Error("Doctor's department not found");
      }

      const appointmentData = {
        doctorId: selectedDoctor,
        departmentId: department._id,
        appointmentDate: selectedDate,
        time: selectedSlot,
        reason: appointmentReason,
      };

      console.log("Booking appointment with data:", appointmentData);
      await bookAppointment(appointmentData);
      await fetchPatientAppointments();
      setIsBookingOpen(false);
      setSelectedDoctor("");
      setSelectedDate(undefined);
      setSelectedSlot("");
      setAppointmentReason("Regular checkup");
    } catch (error) {
      console.error("Failed to book appointment:", error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground">Manage your appointments and schedule new ones</p>
        </div>
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Select Doctor
                </label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors?.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{doctor.name}</span>
                          <span className="text-xs text-muted-foreground">{doctor.specialization}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDoctor && (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Select Date
                  </label>
                  <div className="rounded-md border p-3">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date: Date) => date < new Date()}
                      initialFocus
                      numberOfMonths={1}
                    />
                  </div>
                </div>
              )}

              {selectedDate && availableSlots.length > 0 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedSlot === slot ? "default" : "outline"}
                          onClick={() => setSelectedSlot(slot)}
                          className="w-full justify-start"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Reason for Visit
                    </label>
                    <Input
                      placeholder="Enter reason for appointment"
                      value={appointmentReason}
                      onChange={(e) => setAppointmentReason(e.target.value)}
                    />
                  </div>
                </>
              )}

              {selectedDate && availableSlots.length === 0 && (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <Clock className="mx-auto h-6 w-6 text-muted-foreground/60" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No available slots for this date
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={handleBookAppointment}
                disabled={!selectedDoctor || !selectedDate || !selectedSlot}
                className="w-full"
              >
                Book Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Appointments</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="upcoming" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments
              .filter(apt => new Date(apt.appointmentDate) >= new Date())
              .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
              .map((appointment) => (
                <Card key={appointment._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={appointment.doctor?.profileImage} />
                          <AvatarFallback>
                            {appointment.doctor?.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-medium">
                            {appointment.doctor?.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor?.specialization}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          appointment.status === "Confirmed"
                            ? "default"
                            : appointment.status === "Completed"
                              ? "success"
                              : appointment.status === "Pending"
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Building2 className="mr-2 h-4 w-4" />
                        {appointment.department?.name}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(new Date(appointment.appointmentDate), "PPP")}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {format(new Date(appointment.appointmentDate), "p")}
                      </div>
                      <div className="flex items-start text-muted-foreground">
                        <FileText className="mr-2 h-4 w-4 mt-0.5" />
                        <span className="flex-1">{appointment.reason}</span>
                      </div>
                    </div>
                    {(appointment.status === "Pending" || appointment.status === "Confirmed") && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        Cancel Appointment
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments
              .filter(apt => new Date(apt.appointmentDate) < new Date())
              .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
              .map((appointment) => (
                <Card key={appointment._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={appointment.doctor?.profileImage} />
                          <AvatarFallback>
                            {appointment.doctor?.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-medium">
                            {appointment.doctor?.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor?.specialization}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          appointment.status === "Completed"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Building2 className="mr-2 h-4 w-4" />
                        {appointment.department?.name}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(new Date(appointment.appointmentDate), "PPP")}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {format(new Date(appointment.appointmentDate), "p")}
                      </div>
                      <div className="flex items-start text-muted-foreground">
                        <FileText className="mr-2 h-4 w-4 mt-0.5" />
                        <span className="flex-1">{appointment.reason}</span>
                      </div>
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