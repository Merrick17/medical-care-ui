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
  vitals?: VitalSigns;
  isValidated?: boolean;
  role: 'Doctor' | 'Patient' | 'Admin';
  availability?: any[];
  createdAt?: string;
  updatedAt?: string;
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
  overview: {
    _id: null;
    totalAppointments: number;
    confirmedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    totalRevenue: number;
  };
  graphData: {
    monthly: Array<{
      _id: {
        year: number;
        month: number;
      };
      total: number;
      completed: number;
      cancelled: number;
      revenue: number;
    }>;
    daily: Array<{
      _id: {
        year: number;
        month: number;
        day: number;
      };
      total: number;
      completed: number;
      cancelled: number;
    }>;
    timeSlotDistribution: Array<{
      _id: number;
      count: number;
    }>;
  };
  patientAnalytics: {
    _id: null;
    totalUniquePatients: number;
    averageAge: number | null;
  };
  periodComparisons: {
    thisMonth: number;
    thisWeek: number;
    today: number;
  };
  performanceMetrics: {
    completionRate: string;
    cancellationRate: string;
    averageAppointmentsPerDay: string;
  };
}

export interface DoctorAvailability {
  day: string;
  slots: Array<{
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
  _id: string;
  diagnosis: string;
  prescription: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      _id: string;
    }>;
  };
  notes?: string;
  attachments: any[];
  createdAt: string;
  appointment?: {
    _id: string;
    patient: string;
    doctor: string;
    department: string;
    appointmentDate: string;
    reason: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  followUpDate?: string;
}

export interface PatientInfo {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  CIN: string;
  role: string;
  medicalHistory?: string;
  isValidated: boolean;
  availability: any[];
  createdAt: string;
  updatedAt: string;
  vitals?: VitalSigns;
}

export interface PatientWithHistory {
  _id: string;
  patient: PatientInfo;
  histories: MedicalHistory[];
  totalVisits: number;
  lastVisit: string;
  historySummary: {
    totalRecords: number;
    lastVisit: string;
    conditions: string[];
    allergies: string[];
    recentDiagnoses: string[];
  };
}

export interface DoctorPatientsHistories {
  totalPatients: number;
  totalRecords: number;
  patients: PatientWithHistory[];
} 