import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { generateToken, comparePassword, hashPassword } from '../utils/auth';
import { LoginRequest, AuthResponse, ApiResponse } from '../types';
import { createError } from '../middleware/errorHandler';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { userId, password }: LoginRequest = req.body;

      // Find user by userId
      const user = await UserModel.findByUserId(userId);
      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid User ID or Password',
        };
        res.status(401).json(response);
        return;
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid User ID or Password',
        };
        res.status(401).json(response);
        return;
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        userId: user.user_id,
      });

      const authResponse: AuthResponse = {
        token,
        user: {
          id: user.id,
          userId: user.user_id,
          fullName: user.full_name,
          email: user.email,
        },
      };

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: authResponse,
        message: 'Login successful',
      };

      res.json(response);
    } catch (error) {
      throw createError('Login failed', 500);
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { userId, password, fullName, email, specialty, hospitalAffiliation } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByUserId(userId);
      if (existingUser) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'User ID already exists',
        };
        res.status(409).json(response);
        return;
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await UserModel.findByEmail(email);
        if (existingEmail) {
          const response: ApiResponse<null> = {
            success: false,
            error: 'Email already exists',
          };
          res.status(409).json(response);
          return;
        }
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const newUser = await UserModel.create({
        userId,
        passwordHash,
        fullName,
        email,
        specialty,
        hospitalAffiliation,
      });

      // Generate JWT token
      const token = generateToken({
        id: newUser.id,
        userId: newUser.user_id,
      });

      const authResponse: AuthResponse = {
        token,
        user: {
          id: newUser.id,
          userId: newUser.user_id,
          fullName: newUser.full_name,
          email: newUser.email,
        },
      };

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: authResponse,
        message: 'Registration successful',
      };

      res.status(201).json(response);
    } catch (error) {
      throw createError('Registration failed', 500);
    }
  }

  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        throw createError('User not found', 404);
      }

      const response: ApiResponse<{
        id: string;
        userId: string;
        fullName?: string;
        email?: string;
        specialty?: string;
        hospitalAffiliation?: string;
      }> = {
        success: true,
        data: {
          id: user.id,
          userId: user.user_id,
          fullName: user.full_name,
          email: user.email,
          specialty: user.specialty,
          hospitalAffiliation: user.hospital_affiliation,
        },
      };

      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}