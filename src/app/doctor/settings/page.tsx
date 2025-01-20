"use client"
import { useState, useEffect } from "react";
import useStore from "@/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User2, Calendar, Mail, Phone, Building2, FileText } from "lucide-react";
import { postApi, putApi } from "@/lib/apiHelpers";
import { ScrollArea } from "@/components/ui/scroll-area";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8; // Start from 8 AM
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

// First, let's define proper types for our availability data
interface TimeSlot {
  _id: string;
  time: string;
  isBooked: boolean;
}

interface DayAvailability {
  day: string;
  slots: TimeSlot[];
  _id: string;
}

export default function DoctorSettings() {
  const { user, updateDoctorProfile, updateDoctorAvailabilityProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    CIN: user?.CIN || '',
    specialization: user?.specialization || '',
    department: user?.department || '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [diplomaImage, setDiplomaImage] = useState<File | null>(null);
  const [availability, setAvailability] = useState<DayAvailability[]>(() => {
    if (user?.availability && user.availability.length > 0) {
      return user.availability;
    }

    return DAYS.map(day => ({
      day,
      slots: [],
      _id: `temp-${day.toLowerCase()}`
    }));
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        CIN: user.CIN || '',
        specialization: user.specialization || '',
        department: user.department || '',
      });

      if (!user.availability || user.availability.length === 0) {
        setAvailability(DAYS.map(day => ({
          day,
          slots: [],
          _id: `temp-${day.toLowerCase()}`
        })));
      } else {
        setAvailability(user.availability);
      }
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Add images only if they were changed
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }
      if (diplomaImage) {
        formDataToSend.append('diplomaImage', diplomaImage);
      }

      // Use the store action to update profile
      await updateDoctorProfile(formDataToSend);
      
      // Reset the image states after successful update
      setProfileImage(null);
      setDiplomaImage(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // You might want to show an error toast here
    }
  };

  const handleAvailabilityUpdate = async () => {
    try {
      if (!user?._id) {
        throw new Error('Doctor ID not found');
      }

      // Format availability data according to API requirements
      const formattedAvailability = availability.map(day => ({
        day: day.day,
        slots: day.slots.map(slot => ({
          time: slot.time,
          isBooked: slot.isBooked
        }))
      }));

      // Use the store action instead of direct API call
      await updateDoctorAvailabilityProfile(formattedAvailability);

      // No need to manually update state as the store will handle it
      // The store will update the user's availability which will trigger a re-render

    } catch (error) {
      console.error('Failed to update availability:', error);
      // You might want to show an error toast here
    }
  };

  const toggleTimeSlot = (dayIndex: number, timeStr: string) => {
    const newAvailability = [...availability];
    const daySlots = newAvailability[dayIndex].slots;

    const existingSlot = daySlots.find(slot => slot.time === timeStr);

    if (existingSlot) {
      // Remove the slot if it exists
      newAvailability[dayIndex].slots = daySlots.filter(slot => slot.time !== timeStr);
    } else {
      // Add new slot
      const newSlot: TimeSlot = {
        _id: `${dayIndex}-${timeStr}`, // Generate a temporary ID
        time: timeStr,
        isBooked: false
      };
      newAvailability[dayIndex].slots = [...daySlots, newSlot].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
    }

    setAvailability(newAvailability);
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your personal and professional information
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* Profile Image */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                    />
                  )}
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="CIN">CIN</Label>
                    <Input
                      id="CIN"
                      value={formData.CIN}
                      onChange={e => setFormData({ ...formData, CIN: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diplomaImage">Diploma Image</Label>
                  {user?.diplomaImage && (
                    <img
                      src={user.diplomaImage}
                      alt="Diploma"
                      className="max-w-xs rounded-md"
                    />
                  )}
                  {isEditing && (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setDiplomaImage(e.target.files?.[0] || null)}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Schedule & Availability</CardTitle>
                  <CardDescription>
                    Set your working hours and availability for appointments
                  </CardDescription>
                </div>
                <Button onClick={handleAvailabilityUpdate}>
                  Save Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {DAYS.map((day, dayIndex) => (
                    <div key={day} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">{day}</Label>
                        <Badge variant="outline">
                          {availability?.[dayIndex]?.slots?.length || 0} slots selected
                        </Badge>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {TIME_SLOTS.map(timeStr => (
                          <Button
                            key={timeStr}
                            variant={
                              availability[dayIndex]?.slots?.some(slot => slot.time === timeStr)
                                ? "default"
                                : "outline"
                            }
                            className="h-8"
                            onClick={() => toggleTimeSlot(dayIndex, timeStr)}
                          >
                            {timeStr}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
