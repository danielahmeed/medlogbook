import { db } from '../utils/database';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  static async findByUserId(userId: string): Promise<User | null> {
    const user = await db('users').where('user_id', userId).first();
    return user || null;
  }

  static async findById(id: string): Promise<User | null> {
    const user = await db('users').where('id', id).first();
    return user || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await db('users').where('email', email).first();
    return user || null;
  }

  static async create(userData: {
    userId: string;
    passwordHash: string;
    fullName?: string;
    email?: string;
    specialty?: string;
    hospitalAffiliation?: string;
  }): Promise<User> {
    const id = uuidv4();
    const now = new Date();

    const userToInsert = {
      id,
      user_id: userData.userId,
      password_hash: userData.passwordHash,
      full_name: userData.fullName,
      email: userData.email,
      specialty: userData.specialty,
      hospital_affiliation: userData.hospitalAffiliation,
      created_at: now,
      updated_at: now,
    };

    await db('users').insert(userToInsert);
    
    const createdUser = await this.findById(id);
    if (!createdUser) {
      throw new Error('Failed to create user');
    }
    
    return createdUser;
  }

  static async update(id: string, updates: {
    fullName?: string;
    email?: string;
    specialty?: string;
    hospitalAffiliation?: string;
    passwordHash?: string;
  }): Promise<User | null> {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.specialty !== undefined) updateData.specialty = updates.specialty;
    if (updates.hospitalAffiliation !== undefined) updateData.hospital_affiliation = updates.hospitalAffiliation;
    if (updates.passwordHash !== undefined) updateData.password_hash = updates.passwordHash;

    await db('users').where('id', id).update(updateData);
    
    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const deletedRows = await db('users').where('id', id).del();
    return deletedRows > 0;
  }

  static async userIdExists(userId: string): Promise<boolean> {
    const user = await db('users').where('user_id', userId).first();
    return !!user;
  }

  static async emailExists(email: string): Promise<boolean> {
    const user = await db('users').where('email', email).first();
    return !!user;
  }
}