export interface BaseUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: 'Doctor' | 'Patient' | 'Admin';
  phoneNumber: string;
  CIN: string;
}

export interface User extends BaseUser {
  specialization?: string;
  departmentId?: string;
  isValidated?: boolean;

  medicalHistory?: string;
  profileImage?: string;
  diplomaImage?: string;
  availability?: DoctorAvailability[];
}

export interface DoctorPatient extends BaseUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  CIN: string;
  lastVisit?: string;
  lastAppointment?: {
    _id: string;
    date: string;
    status: string;
  };
  diagnoses?: {
    condition: string;
    date: string;
  }[];
  treatments?: {
    treatment: string;
    date: string;
  }[];
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
  };
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  doctors: Array<{ _id: string; name: string; email: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  patient: {
    name: string;
    email: string;
  };
  doctor: {
    name: string;
    specialization: string;
  };
  date: string;
  time: string;
  type: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  reason: string;
  departmentId: string;
}

export interface MedicalRecord {
  id: string;
  patient: string;
  doctor: string;
  appointment?: string;
  diagnosis: string;
  prescription: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  notes?: string;
  attachments?: {
    type: string;
    description: string;
  }[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
  };
  followUpDate?: string;
  date: string;
}

export interface DoctorStats {
  totalPatients: number;
  appointmentsByStatus: { status: string; count: number }[];
}

export interface DoctorAvailability {
  day: string;
  slots: Array<{
    _id: string;
    time: string;
    isBooked: boolean;
  }>;
}

export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
}

export interface MedicalHistory {
  diagnosis: string;
  prescription: string[];
  notes?: string;
  vitalSigns: VitalSigns;
  followUpDate?: string;
  createdAt: string;
}

export interface PatientWithHistory {
  patient: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    CIN: string;
    vitals?: VitalSigns;
  };
  histories: MedicalHistory[];
} 