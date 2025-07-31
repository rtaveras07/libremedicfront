const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Patient interface based on real API
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string;
  medicalHistory: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// User/Doctor interface based on real API
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Diagnosis interface based on real API
export interface Diagnosis {
  id: number;
  patientId: number;
  doctorId: number;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  severity: string;
  status: string;
  diagnosisDate: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  Patient?: Patient;
  Doctor?: User;
}

// Prescription interface based on real API
export interface Prescription {
  id: number;
  patientId: number;
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  prescribedBy: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// Medical Center interface (if available)
export interface MedicalCenter {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  type?: string;
  capacity?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Appointment interface
export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  Patient?: Patient;
  Doctor?: User;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      // Handle the backend response structure
      return {
        success: true,
        data: data.data || data, // Backend returns { message, data } structure
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// API endpoints
export const API_ENDPOINTS = {
  // Patients
  PATIENTS: '/patients',
  PATIENT: (id: string | number) => `/patients/${id}`,
  
  // Users/Doctors (the backend uses /users for doctors)
  USERS: '/users',
  USER: (id: string | number) => `/users/${id}`,
  
  // Diagnoses (the backend uses /diagnostics)
  DIAGNOSES: '/diagnostics',
  DIAGNOSIS: (id: string | number) => `/diagnostics/${id}`,
  
  // Prescriptions
  PRESCRIPTIONS: '/prescriptions',
  PRESCRIPTION: (id: string | number) => `/prescriptions/${id}`,
  
  // Medical Centers
  MEDICAL_CENTERS: '/medical-centers',
  MEDICAL_CENTER: (id: string | number) => `/medical-centers/${id}`,
  
  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENT: (id: string | number) => `/appointments/${id}`,
  
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // Health check
  HEALTH: '/health',
} as const;

// Helper functions for common API operations
export const api = {
  // Patients
  getPatients: () => apiClient.get<Patient[]>(API_ENDPOINTS.PATIENTS),
  getPatient: (id: string | number) => apiClient.get<Patient>(API_ENDPOINTS.PATIENT(id)),
  createPatient: (data: Partial<Patient>) => apiClient.post<Patient>(API_ENDPOINTS.PATIENTS, data),
  updatePatient: (id: string | number, data: Partial<Patient>) => apiClient.put<Patient>(API_ENDPOINTS.PATIENT(id), data),
  deletePatient: (id: string | number) => apiClient.delete(API_ENDPOINTS.PATIENT(id)),

  // Users/Doctors
  getUsers: () => apiClient.get<User[]>(API_ENDPOINTS.USERS),
  getUser: (id: string | number) => apiClient.get<User>(API_ENDPOINTS.USER(id)),
  createUser: (data: Partial<User>) => apiClient.post<User>(API_ENDPOINTS.USERS, data),
  updateUser: (id: string | number, data: Partial<User>) => apiClient.put<User>(API_ENDPOINTS.USER(id), data),
  deleteUser: (id: string | number) => apiClient.delete(API_ENDPOINTS.USER(id)),

  // Diagnoses
  getDiagnoses: () => apiClient.get<Diagnosis[]>(API_ENDPOINTS.DIAGNOSES),
  getDiagnosis: (id: string | number) => apiClient.get<Diagnosis>(API_ENDPOINTS.DIAGNOSIS(id)),
  createDiagnosis: (data: Partial<Diagnosis>) => apiClient.post<Diagnosis>(API_ENDPOINTS.DIAGNOSES, data),
  updateDiagnosis: (id: string | number, data: Partial<Diagnosis>) => apiClient.put<Diagnosis>(API_ENDPOINTS.DIAGNOSIS(id), data),
  deleteDiagnosis: (id: string | number) => apiClient.delete(API_ENDPOINTS.DIAGNOSIS(id)),

  // Prescriptions
  getPrescriptions: () => apiClient.get<Prescription[]>(API_ENDPOINTS.PRESCRIPTIONS),
  getPrescription: (id: string | number) => apiClient.get<Prescription>(API_ENDPOINTS.PRESCRIPTION(id)),
  createPrescription: (data: Partial<Prescription>) => apiClient.post<Prescription>(API_ENDPOINTS.PRESCRIPTIONS, data),
  updatePrescription: (id: string | number, data: Partial<Prescription>) => apiClient.put<Prescription>(API_ENDPOINTS.PRESCRIPTION(id), data),
  deletePrescription: (id: string | number) => apiClient.delete(API_ENDPOINTS.PRESCRIPTION(id)),

  // Medical Centers
  getMedicalCenters: () => apiClient.get<MedicalCenter[]>(API_ENDPOINTS.MEDICAL_CENTERS),
  getMedicalCenter: (id: string | number) => apiClient.get<MedicalCenter>(API_ENDPOINTS.MEDICAL_CENTER(id)),
  createMedicalCenter: (data: Partial<MedicalCenter>) => apiClient.post<MedicalCenter>(API_ENDPOINTS.MEDICAL_CENTERS, data),
  updateMedicalCenter: (id: string | number, data: Partial<MedicalCenter>) => apiClient.put<MedicalCenter>(API_ENDPOINTS.MEDICAL_CENTER(id), data),
  deleteMedicalCenter: (id: string | number) => apiClient.delete(API_ENDPOINTS.MEDICAL_CENTER(id)),

  // Appointments
  getAppointments: () => apiClient.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS),
  getAppointment: (id: string | number) => apiClient.get<Appointment>(API_ENDPOINTS.APPOINTMENT(id)),
  createAppointment: (data: Partial<Appointment>) => apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS, data),
  updateAppointment: (id: string | number, data: Partial<Appointment>) => apiClient.put<Appointment>(API_ENDPOINTS.APPOINTMENT(id), data),
  deleteAppointment: (id: string | number) => apiClient.delete(API_ENDPOINTS.APPOINTMENT(id)),

  // Auth
  login: (credentials: { email: string; password: string }) => 
    apiClient.post(API_ENDPOINTS.LOGIN, credentials),
  logout: () => apiClient.post(API_ENDPOINTS.LOGOUT),

  // Health check
  healthCheck: () => apiClient.get(API_ENDPOINTS.HEALTH),
}; 