import Joi from 'joi';

export const loginSchema = Joi.object({
  userId: Joi.string().required().min(1).max(100),
  password: Joi.string().required().min(1),
});

export const registerSchema = Joi.object({
  userId: Joi.string().required().min(3).max(100),
  password: Joi.string().required().min(6),
  fullName: Joi.string().optional().max(200),
  email: Joi.string().email().optional(),
  specialty: Joi.string().optional().max(100),
  hospitalAffiliation: Joi.string().optional().max(200),
});

export const operationSchema = Joi.object({
  patientId: Joi.string().required().min(1).max(50),
  dateOfBirth: Joi.date().optional().iso(),
  age: Joi.number().integer().min(0).max(150).required(),
  operationDate: Joi.date().required().iso(),
  operatorName: Joi.string().required().min(1).max(200),
  operatorLevel: Joi.string().required().valid(
    'Consultant',
    'Specialist Registrar',
    'Core Trainee',
    'Foundation Doctor',
    'Medical Student',
    'Other'
  ),
  urgency: Joi.string().optional().valid(
    'Elective',
    'Urgent',
    'Emergency',
    'Immediate'
  ),
  asaGrade: Joi.string().optional().valid(
    'ASA I',
    'ASA II',
    'ASA III',
    'ASA IV',
    'ASA V',
    'ASA VI'
  ),
  operation: Joi.string().required().min(1).max(500),
  hospital: Joi.string().required().min(1).max(200),
  notes: Joi.string().optional().max(2000),
  complications: Joi.string().optional().max(2000),
  isPrivate: Joi.boolean().required(),
});

export const operationUpdateSchema = Joi.object({
  patientId: Joi.string().optional().min(1).max(50),
  dateOfBirth: Joi.date().optional().iso(),
  age: Joi.number().integer().min(0).max(150).optional(),
  operationDate: Joi.date().optional().iso(),
  operatorName: Joi.string().optional().min(1).max(200),
  operatorLevel: Joi.string().optional().valid(
    'Consultant',
    'Specialist Registrar',
    'Core Trainee',
    'Foundation Doctor',
    'Medical Student',
    'Other'
  ),
  urgency: Joi.string().optional().valid(
    'Elective',
    'Urgent',
    'Emergency',
    'Immediate'
  ),
  asaGrade: Joi.string().optional().valid(
    'ASA I',
    'ASA II',
    'ASA III',
    'ASA IV',
    'ASA V',
    'ASA VI'
  ),
  operation: Joi.string().optional().min(1).max(500),
  hospital: Joi.string().optional().min(1).max(200),
  notes: Joi.string().optional().max(2000),
  complications: Joi.string().optional().max(2000),
  isPrivate: Joi.boolean().optional(),
});

export const cpdSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  description: Joi.string().optional().max(1000),
  category: Joi.string().required().max(100),
  hours: Joi.number().min(0).max(1000).required(),
  dateCompleted: Joi.date().required().iso(),
  provider: Joi.string().optional().max(200),
  certificateUrl: Joi.string().uri().optional(),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().max(100).optional(),
  sortBy: Joi.string().valid('operation_date', 'operation_name', 'hospital', 'created_at').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
});