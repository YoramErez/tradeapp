import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import { ValidationError } from '../utils/errors';
import logger from '../utils/logger';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validData = registerSchema.parse(req.body);
      const user = await authService.register(
        validData.email,
        validData.password,
        validData.name
      );

      logger.info(`New user registered: ${user.email}`);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validData = loginSchema.parse(req.body);
      const result = await authService.login(validData.email, validData.password);

      logger.info(`User logged in: ${result.user.email}`);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: any, res: Response, next: NextFunction) {
    try {
      const user = await authService.getUserById(req.userId);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();

