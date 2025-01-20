"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Building2, Stethoscope, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { User } from "@/store/types";
import useStore from "@/store";

interface DoctorProfileDialogProps {
  doctor: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DoctorProfileDialog({ doctor, isOpen, onClose }: DoctorProfileDialogProps) {
  const { departments, updateDoctorStatus } = useStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (checked: boolean) => {
    if (!doctor) return;
    
    setIsUpdating(true);
    try {
      await updateDoctorStatus(doctor._id, checked);
    } catch (error) {
      console.error('Failed to update doctor status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!doctor) return null;

  const department = departments?.find(d => d._id === doctor.departmentId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Doctor Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
              </div>
              <Badge 
                variant={doctor.isValidated ? "default" : "secondary"}
                className={doctor.isValidated ? "bg-green-500/10 text-green-500" : ""}
              >
                {doctor.isValidated ? "Verified" : "Pending"}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="doctor-status"
                checked={doctor.isValidated}
                onCheckedChange={handleStatusChange}
                disabled={isUpdating}
              />
              <Label htmlFor="doctor-status">
                {doctor.isValidated ? "Active" : "Inactive"}
              </Label>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">{doctor.phoneNumber}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Department Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Department</h4>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm">{department?.name || 'Unassigned'}</span>
            </div>
          </div>

          <Separator />

          {/* Schedule Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Availability</h4>
            <div className="space-y-2">
              {doctor.availability?.map((schedule, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{schedule.day}</span>
                  </div>
                  <div className="pl-6 flex gap-2 flex-wrap">
                    {schedule.slots.map((slot, slotIndex) => (
                      <Badge 
                        key={slotIndex}
                        variant="outline"
                        className={slot.isBooked ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {slot.time}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 