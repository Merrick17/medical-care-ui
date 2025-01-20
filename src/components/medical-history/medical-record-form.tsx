"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useStore from "@/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const formSchema = z.object({
  appointmentId: z.string().optional(),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  prescription: z.array(z.string()).min(1, "At least one prescription is required"),
  notes: z.string().optional(),
  vitalSigns: z.object({
    bloodPressure: z.string().optional(),
    heartRate: z.string().optional(),
    temperature: z.string().optional(),
  }),
  followUpDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MedicalRecordFormProps {
  patientId: string;
  onSuccess: () => void;
}

export default function MedicalRecordForm({ patientId, onSuccess }: MedicalRecordFormProps) {
  const [prescriptionInputs, setPrescriptionInputs] = useState<string[]>(['']);
  const { doctorAppointments, fetchPatientsHistories } = useStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prescription: [''],
      vitalSigns: {},
    },
  });

  // Filter appointments for this patient - show all appointments except cancelled ones
  const patientAppointments = doctorAppointments
    .filter((apt) => apt.patientId === patientId && apt.status !== 'Cancelled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first

  const onSubmit = async (data: FormValues) => {
    try {
      // Filter out empty prescription strings
      const cleanedData = {
        ...data,
        prescription: data.prescription.filter(p => p.trim() !== ''),
      };

      await fetch('/api/medical-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          ...cleanedData,
        }),
      });

      await fetchPatientsHistories();
      onSuccess();
    } catch (error) {
      console.error('Failed to save medical record:', error);
    }
  };

  const handleAddPrescription = () => {
    setPrescriptionInputs([...prescriptionInputs, '']);
    form.setValue('prescription', [...form.getValues('prescription'), '']);
  };

  const handleRemovePrescription = (index: number) => {
    const newInputs = prescriptionInputs.filter((_, i) => i !== index);
    setPrescriptionInputs(newInputs);
    form.setValue(
      'prescription',
      form.getValues('prescription').filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Appointment Selection */}
            <FormField
              control={form.control}
              name="appointmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Appointment (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an appointment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patientAppointments.length === 0 ? (
                        <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none text-muted-foreground">
                          No appointments found
                        </div>
                      ) : (
                        patientAppointments.map((appointment) => (
                          <SelectItem key={appointment._id} value={appointment._id}>
                            {format(new Date(appointment.date), 'PPP')} at {appointment.time} - {appointment.status}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="ml-4 mt-8"
            onClick={() => onSuccess()} // This will close the form and return to patient selection
          >
            Change Patient
          </Button>
        </div>

        {/* Diagnosis */}
        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter diagnosis" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Prescriptions */}
        <div className="space-y-4">
          <FormLabel>Prescriptions</FormLabel>
          {prescriptionInputs.map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormField
                control={form.control}
                name={`prescription.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Enter prescription" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemovePrescription(index)}
                >
                  -
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPrescription}
          >
            Add Prescription
          </Button>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="vitalSigns.bloodPressure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Pressure</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 120/80" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vitalSigns.heartRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heart Rate (bpm)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 75" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vitalSigns.temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperature (°C)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 37.2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Follow-up Date */}
        <FormField
          control={form.control}
          name="followUpDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Follow-up Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter any additional notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit">Save Medical Record</Button>
        </div>
      </form>
    </Form>
  );
} 