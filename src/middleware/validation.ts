import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../types';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    let dataToValidate: any;
    
    // For GET requests, validate query parameters
    if (req.method === 'GET') {
      dataToValidate = req.query;
    } else {
      // For POST/PUT/PATCH requests, validate body
      dataToValidate = req.body;
    }

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: errorMessages.join(', '),
      };
      res.status(400).json(response);
      return;
    }

    // Replace the original data with validated/sanitized data
    if (req.method === 'GET') {
      req.query = value;
    } else {
      req.body = value;
    }

    next();
  };
};