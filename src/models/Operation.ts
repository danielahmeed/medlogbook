import { db } from '../utils/database';
import { Operation, OperationCreateRequest, PaginationQuery } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class OperationModel {
  static async findById(id: string): Promise<Operation | null> {
    const operation = await db('operations').where('id', id).first();
    return operation || null;
  }

  static async findByUserId(
    userId: string, 
    query: PaginationQuery = {}
  ): Promise<{ operations: Operation[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'operation_date',
      sortOrder = 'desc'
    } = query;

    const offset = (page - 1) * limit;

    let queryBuilder = db('operations').where('user_id', userId);

    // Apply search filter
    if (search) {
      queryBuilder = queryBuilder.where(function() {
        this.whereILike('operation_name', `%${search}%`)
          .orWhereILike('hospital', `%${search}%`)
          .orWhereILike('patient_id', `%${search}%`)
          .orWhereILike('operator_name', `%${search}%`);
      });
    }

    // Get total count for pagination
    const totalResult = await queryBuilder.clone().count('* as count').first();
    const total = totalResult ? Number(totalResult.count) : 0;

    // Apply sorting and pagination
    const operations = await queryBuilder
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset(offset);

    return { operations, total };
  }

  static async create(userId: string, operationData: OperationCreateRequest): Promise<Operation> {
    const id = uuidv4();
    const now = new Date();

    const operationToInsert = {
      id,
      user_id: userId,
      patient_id: operationData.patientId,
      patient_age: operationData.age,
      date_of_birth: operationData.dateOfBirth ? new Date(operationData.dateOfBirth) : null,
      operation_date: new Date(operationData.operationDate),
      operator_name: operationData.operatorName,
      operator_level: operationData.operatorLevel,
      urgency: operationData.urgency,
      asa_grade: operationData.asaGrade,
      operation_name: operationData.operation,
      hospital: operationData.hospital,
      notes: operationData.notes,
      complications: operationData.complications,
      is_private: operationData.isPrivate,
      created_at: now,
      updated_at: now,
    };

    await db('operations').insert(operationToInsert);
    
    const createdOperation = await this.findById(id);
    if (!createdOperation) {
      throw new Error('Failed to create operation');
    }
    
    return createdOperation;
  }

  static async update(id: string, userId: string, updates: Partial<OperationCreateRequest>): Promise<Operation | null> {
    // First check if the operation belongs to the user
    const existingOperation = await db('operations')
      .where('id', id)
      .andWhere('user_id', userId)
      .first();
    
    if (!existingOperation) {
      return null;
    }

    const updateData: any = {
      updated_at: new Date(),
    };

    if (updates.patientId !== undefined) updateData.patient_id = updates.patientId;
    if (updates.age !== undefined) updateData.patient_age = updates.age;
    if (updates.dateOfBirth !== undefined) {
      updateData.date_of_birth = updates.dateOfBirth ? new Date(updates.dateOfBirth) : null;
    }
    if (updates.operationDate !== undefined) updateData.operation_date = new Date(updates.operationDate);
    if (updates.operatorName !== undefined) updateData.operator_name = updates.operatorName;
    if (updates.operatorLevel !== undefined) updateData.operator_level = updates.operatorLevel;
    if (updates.urgency !== undefined) updateData.urgency = updates.urgency;
    if (updates.asaGrade !== undefined) updateData.asa_grade = updates.asaGrade;
    if (updates.operation !== undefined) updateData.operation_name = updates.operation;
    if (updates.hospital !== undefined) updateData.hospital = updates.hospital;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.complications !== undefined) updateData.complications = updates.complications;
    if (updates.isPrivate !== undefined) updateData.is_private = updates.isPrivate;

    await db('operations').where('id', id).update(updateData);
    
    return this.findById(id);
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const deletedRows = await db('operations')
      .where('id', id)
      .andWhere('user_id', userId)
      .del();
    
    return deletedRows > 0;
  }

  static async getOperationStats(userId: string): Promise<{
    totalOperations: number;
    operationsByLevel: Record<string, number>;
    operationsByMonth: Record<string, number>;
    recentOperations: Operation[];
  }> {
    // Total operations
    const totalResult = await db('operations')
      .where('user_id', userId)
      .count('* as count')
      .first();
    const totalOperations = totalResult ? Number(totalResult.count) : 0;

    // Operations by level
    const levelStats = await db('operations')
      .where('user_id', userId)
      .select('operator_level')
      .count('* as count')
      .groupBy('operator_level');
    
    const operationsByLevel: Record<string, number> = {};
    levelStats.forEach((stat: any) => {
      if (stat.operator_level) {
        operationsByLevel[stat.operator_level] = Number(stat.count);
      }
    });

    // Operations by month (last 12 months)
    const monthStats = await db('operations')
      .where('user_id', userId)
      .andWhere('operation_date', '>=', db.raw('DATE_SUB(NOW(), INTERVAL 12 MONTH)'))
      .select(db.raw('DATE_FORMAT(operation_date, "%Y-%m") as month'))
      .count('* as count')
      .groupBy(db.raw('DATE_FORMAT(operation_date, "%Y-%m")'))
      .orderBy('month');

    const operationsByMonth: Record<string, number> = {};
    monthStats.forEach((stat: any) => {
      if (stat.month) {
        operationsByMonth[stat.month] = Number(stat.count);
      }
    });

    // Recent operations (last 5)
    const recentOperations = await db('operations')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(5);

    return {
      totalOperations,
      operationsByLevel,
      operationsByMonth,
      recentOperations,
    };
  }
}