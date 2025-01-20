"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { registerFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useStore from "@/store";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";



type FormData = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Patient",
      phoneNumber: "",
      CIN: "",
      specialization: "",
      medicalHistory: "",
      diplomaImage: undefined,
      profileImage: undefined,
      departmentId: "",
    },
  });

  const role = form.watch("role");
  const { departments, fetchDepartments } = useStore();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      // Add all text fields
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && !(value instanceof FileList)) {
          formData.append(key, value);
        }
      });

      // Handle file uploads
      if (values.diplomaImage instanceof FileList && values.diplomaImage.length > 0) {
        formData.append('diplomaImage', values.diplomaImage[0]);
      }
      
      if (values.profileImage instanceof FileList && values.profileImage.length > 0) {
        formData.append('profileImage', values.profileImage[0]);
      }

      await useStore.getState().register(formData);
      toast({
        title: "Registration successful!",
        description: "Please log in to continue.",
        variant: "default",
      });
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      // Handle specific validation error
      if (error.message?.toLowerCase().includes("not been validated") || 
          error.message?.toLowerCase().includes("admin approval")) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created and is pending admin approval. You'll be notified when your account is validated.",
          variant: "default",
          duration: 6000, // Show for 6 seconds
        });
        router.push("/auth/login");
        return;
      }

      // Handle other errors
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-lg mx-auto"
      >
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2">
              <span className="text-white text-xl font-bold">+</span>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Create an Account</CardTitle>
            <CardDescription className="text-gray-600">
              Register to book appointments and manage your health records
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">I am a</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Patient">Patient</SelectItem>
                          <SelectItem value="Doctor">Doctor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="CIN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">CIN (Identity Card Number)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your CIN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {role === "Doctor" && (
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Specialization</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your medical specialization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {role === "Doctor" && (
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments?.map((dept) => (
                              <SelectItem key={dept._id} value={dept._id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {role === "Patient" && (
                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Medical History</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any relevant medical history"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {role === "Doctor" && (
                  <FormField
                    control={form.control}
                    name="diplomaImage"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Diploma Image
                          <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="grid w-full items-center gap-1.5">
                            <label
                              htmlFor="diploma-image"
                              className="w-full cursor-pointer"
                            >
                              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col items-center gap-2 text-center">
                                  <Upload className="h-8 w-8 text-gray-400" />
                                  <div className="text-sm text-gray-600">
                                    {value instanceof FileList && value.length > 0 ? (
                                      <span className="text-primary font-medium">
                                        {value[0].name}
                                      </span>
                                    ) : (
                                      <>
                                        <span className="font-semibold text-primary">
                                          Click to upload
                                        </span>{" "}
                                        or drag and drop
                                      </>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    PNG, JPG or JPEG (max. 5MB)
                                  </div>
                                </div>
                              </div>
                            </label>
                            <Input
                              id="diploma-image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => onChange(e.target.files)}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Profile Image</FormLabel>
                      <FormControl>
                        <div className="grid w-full items-center gap-1.5">
                          <label
                            htmlFor="profile-image"
                            className="w-full cursor-pointer"
                          >
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex flex-col items-center gap-2 text-center">
                                <Upload className="h-8 w-8 text-gray-400" />
                                <div className="text-sm text-gray-600">
                                  {value instanceof FileList && value.length > 0 ? (
                                    <span className="text-primary font-medium">
                                      {value[0].name}
                                    </span>
                                  ) : (
                                    <>
                                      <span className="font-semibold text-primary">
                                        Click to upload
                                      </span>{" "}
                                      or drag and drop
                                    </>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  PNG, JPG or JPEG (max. 5MB)
                                </div>
                              </div>
                            </div>
                          </label>
                          <Input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onChange(e.target.files)}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
} 