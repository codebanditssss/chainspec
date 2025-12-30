import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
    static register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, username, password } = req.body;

        // Validation
        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, username, and password',
            });
        }

        const result = await UserService.register({ email, username, password });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    });

    static login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        const result = await UserService.login({ email, password });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    });

    static getProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = await UserService.getUserById(req.user!.id);

        res.status(200).json({
            success: true,
            data: { user },
        });
    });

    static getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const users = await UserService.getAllUsers();

        res.status(200).json({
            success: true,
            data: { users, count: users.length },
        });
    });
}
