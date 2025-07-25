import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';
import { ApiResponse } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    userId: string;
  };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Access token is required',
      };
      res.status(401).json(response);
      return;
    }

    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Invalid or expired token',
    };
    res.status(401).json(response);
  }
};