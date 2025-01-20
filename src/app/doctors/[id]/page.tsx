"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar as CalendarIcon, Mail, Phone, MapPin, Star, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function DoctorProfile({ params }: { params: { id: string } }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // This would come from your API in a real application
  const doctor = {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2800",
    rating: 4.9,
    experience: "15+ years",
    email: "dr.sarah@meditro.com",
    phone: "(+01) 999 888 777",
    location: "123 Medical Center, Healthcare Avenue",
    about: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology and heart failure management.",
    education: [
      "MD in Cardiology, Harvard Medical School",
      "Residency at Mayo Clinic",
      "Fellowship in Interventional Cardiology"
    ],
    availability: {
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
    }
  };

  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
  const availableSlots = doctor.availability[selectedDateStr] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div 
            className="md:col-span-1"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <Card>
              <CardContent className="p-6">
                <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                
                <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
                <p className="text-primary font-medium mb-4">{doctor.specialization}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{doctor.rating}</span>
                  <span className="text-gray-600">• {doctor.experience}</span>
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Calendar and Booking */}
          <motion.div 
            className="md:col-span-2 space-y-6"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-600 mb-6">{doctor.about}</p>
                
                <h3 className="font-semibold mb-2">Education & Training</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
                  {doctor.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Schedule Appointment</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Select Date
                    </h3>
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Available Time Slots
                    </h3>
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
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 