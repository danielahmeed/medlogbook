export interface User {
  id: string;
  user_id: string;
  password_hash: string;
  full_name?: string;
  email?: string;
  specialty?: string;
  hospital_affiliation?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Operation {
  id: string;
  user_id: string;
  patient_id: string;
  patient_age: number;
  date_of_birth?: Date;
  operation_date: Date;
  operator_name: string;
  operator_level: string;
  urgency?: string;
  asa_grade?: string;
  operation_name: string;
  hospital: string;
  notes?: string;
  complications?: string;
  is_private: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CPDEntry {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  hours: number;
  date_completed: Date;
  provider?: string;
  certificate_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    userId: string;
    fullName?: string;
    email?: string;
  };
}

export interface OperationCreateRequest {
  patientId: string;
  dateOfBirth?: string;
  age: number;
  operationDate: string;
  operatorName: string;
  operatorLevel: string;
  urgency?: string;
  asaGrade?: string;
  operation: string;
  hospital: string;
  notes?: string;
  complications?: string;
  isPrivate: boolean;
}

export interface OperationResponse {
  id: string;
  patientId: string;
  age: number;
  operation: string;
  hospital: string;
  date: string;
  operatorLevel: string;
  operatorName: string;
  urgency?: string;
  asaGrade?: string;
  notes?: string;
  complications?: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}