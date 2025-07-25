import { Request, Response } from 'express';
import { OperationModel } from '../models/Operation';
import { OperationCreateRequest, OperationResponse, ApiResponse, PaginationQuery, Operation } from '../types';
import { createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const transformOperationToResponse = (operation: Operation): OperationResponse => ({
  id: operation.id,
  patientId: operation.patient_id,
  age: operation.patient_age,
  operation: operation.operation_name,
  hospital: operation.hospital,
  date: new Date(operation.operation_date).toISOString().split('T')[0],
  operatorLevel: operation.operator_level,
  operatorName: operation.operator_name,
  urgency: operation.urgency || undefined,
  asaGrade: operation.asa_grade || undefined,
  notes: operation.notes || undefined,
  complications: operation.complications || undefined,
  isPrivate: operation.is_private,
  createdAt: operation.created_at,
});

export class OperationController {
  static async createOperation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      const operationData: OperationCreateRequest = req.body;
      const operation = await OperationModel.create(userId, operationData);

      const operationResponse = transformOperationToResponse(operation);

      const response: ApiResponse<OperationResponse> = {
        success: true,
        data: operationResponse,
        message: 'Operation created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getOperations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      const query: PaginationQuery = req.query as any;
      const { operations, total } = await OperationModel.findByUserId(userId, query);

      const operationResponses = operations.map(transformOperationToResponse);

      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const totalPages = Math.ceil(total / limit);

      const response: ApiResponse<OperationResponse[]> = {
        success: true,
        data: operationResponses,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };

      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getOperation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      const { id } = req.params;
      if (!id) {
        throw createError('Operation ID is required', 400);
      }
      const operation = await OperationModel.findById(id);

      if (!operation) {
        throw createError('Operation not found', 404);
      }

      // Check if the operation belongs to the user
      if (operation.user_id !== userId) {
        throw createError('Access denied', 403);
      }

      const operationResponse = transformOperationToResponse(operation);

      const response: ApiResponse<OperationResponse> = {
        success: true,
        data: operationResponse,
      };

      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async updateOperation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      const { id } = req.params;
      if (!id) {
        throw createError('Operation ID is required', 400);
      }
      const updateData: Partial<OperationCreateRequest> = req.body;

      const updatedOperation = await OperationModel.update(id, userId, updateData);

      if (!updatedOperation) {
        throw createError('Operation not found or access denied', 404);
      }

      const operationResponse = transformOperationToResponse(updatedOperation);

      const response: ApiResponse<OperationResponse> = {
        success: true,
        data: operationResponse,
        message: 'Operation updated successfully',
      };

      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async deleteOperation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      const { id } = req.params;
      if (!id) {
        throw createError('Operation ID is required', 400);
      }
      const deleted = await OperationModel.delete(id, userId);

      if (!deleted) {
        throw createError('Operation not found or access denied', 404);
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Operation deleted successfully',
      };

      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getOperationStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      const stats = await OperationModel.getOperationStats(userId);

      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats,
      };

      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}