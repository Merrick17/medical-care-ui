import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/store/types";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Building2, Stethoscope, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ViewDoctorDialogProps {
  doctor: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verifyDoctor: (doctorId: string, isValidated: boolean) => void;
}

export function ViewDoctorDialog({ doctor, open, onOpenChange, verifyDoctor }: ViewDoctorDialogProps) {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Doctor Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <img
              src={doctor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                doctor.name
              )}&background=6366f1&color=fff`}
              alt={doctor.name}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{doctor.name}</h3>
              <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
              <Badge
                variant={doctor.isValidated ? "success" : "warning"}
                className="mt-2 cursor-pointer"
                onClick={() => verifyDoctor(doctor.id, !doctor.isValidated)}
              >
                {doctor.isValidated ? "Verified" : "Pending"}
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4 grid gap-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{doctor.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Department: {doctor.departmentId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Specialization: {doctor.specialization}</span>
              </div>
            </CardContent>
          </Card>

          {/* Availability Schedule */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Availability Schedule
            </h4>
            <div className="grid gap-4">
              {doctor.availability?.map((schedule) => (
                <Card key={schedule.day}>
                  <CardContent className="p-4">
                    <div className="font-medium mb-2">{schedule.day}</div>
                    <div className="flex flex-wrap gap-2">
                      {schedule.slots.map((slot) => (
                        <Badge
                          key={slot._id}
                          variant={slot.isBooked ? "secondary" : "outline"}
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {slot.time}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-4">
            <h4 className="font-medium">Credentials</h4>
            <div className="grid gap-4">
              {doctor.diplomaImage && (
                <img
                  src={doctor.diplomaImage}
                  alt="Diploma"
                  className="rounded-md w-full object-cover h-40"
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 