"use client"
import { useState } from 'react';
import useStore from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PatientSettings() {
  const { patientProfile, updatePatientProfile, isLoading } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patientProfile?.name || '',
    email: patientProfile?.email || '',
    phoneNumber: patientProfile?.phoneNumber || '',
    CIN: patientProfile?.CIN || '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleProfileUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      await updatePatientProfile(formDataToSend);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
              disabled={isLoading}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={patientProfile?.profileImage} />
                <AvatarFallback>{patientProfile?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                />
              )}
            </div>

            {/* Form Fields */}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 