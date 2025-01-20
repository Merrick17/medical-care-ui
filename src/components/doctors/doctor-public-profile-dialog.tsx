"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Mail, Phone, MapPin, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DoctorPublicProfileDialogProps {
  doctor: {
    name: string;
    specialization: string;
    image: string;
    rating: number;
    experience: string;
    email: string;
    phone: string;
    location: string;
    about: string;
    education: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DoctorPublicProfileDialog({
  doctor,
  isOpen,
  onClose,
}: DoctorPublicProfileDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // This would come from your API in a real application
  const availability = {
    "2024-02-19": [
      { time: "09:00 AM", available: true },
      { time: "10:00 AM", available: false },
      { time: "11:00 AM", available: true },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: false }
    ],
    "2024-02-20": [
      { time: "09:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "02:00 PM", available: true }
    ]
  };

  if (!doctor) return null;

  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const availableSlots = availability[selectedDateStr as keyof typeof availability] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Doctor Profile</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-8 mt-6">
          {/* Profile Info */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              <div className="relative h-64 rounded-xl overflow-hidden">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">{doctor.name}</h2>
                <p className="text-primary font-medium mb-4">{doctor.specialization}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{doctor.rating}</span>
                  <span className="text-gray-600">• {doctor.experience}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{doctor.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar and Booking */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <p className="text-gray-600 mb-6">{doctor.about}</p>
              
              <h4 className="font-semibold mb-2">Education & Training</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
                {doctor.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-6">Schedule Appointment</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Select Date
                  </h4>
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Available Time Slots
                  </h4>
                  {date ? (
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.map((slot, index) => (
                        <Button
                          key={index}
                          variant={slot.available ? "outline" : "ghost"}
                          className={`w-full ${slot.available ? 'hover:bg-primary hover:text-white' : 'opacity-50 cursor-not-allowed'}`}
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Please select a date to view available slots</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 