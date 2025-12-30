import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
    IUser,
    IUserRegistration,
    IUserLogin,
    IUserResponse,
    IAuthResponse,
    users
} from '../models/user.model';
import { config } from '../config/env';
import { AppError } from '../middleware/error.middleware';

export class UserService {
    private static hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    private static comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    private static generateToken(user: IUser): string {
        const options: jwt.SignOptions = {
            expiresIn: config.jwtExpiresIn
        };

        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username
            },
            config.jwtSecret,
            options
        );
    }

    private static sanitizeUser(user: IUser): IUserResponse {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
        };
    }

    static async register(data: IUserRegistration): Promise<IAuthResponse> {
        // Check if user already exists
        const existingUser = users.find(u => u.email === data.email);
        if (existingUser) {
            throw new AppError('User with this email already exists', 400);
        }

        // Check if username is taken
        const existingUsername = users.find(u => u.username === data.username);
        if (existingUsername) {
            throw new AppError('Username already taken', 400);
        }

        // Hash password
        const hashedPassword = await this.hashPassword(data.password);

        // Create user
        const newUser: IUser = {
            id: uuidv4(),
            email: data.email,
            username: data.username,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        users.push(newUser);

        // Generate token
        const token = this.generateToken(newUser);

        return {
            user: this.sanitizeUser(newUser),
            token,
        };
    }

    static async login(data: IUserLogin): Promise<IAuthResponse> {
        // Find user
        const user = users.find(u => u.email === data.email);
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Check password
        const isPasswordValid = await this.comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate token
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    static async getUserById(id: string): Promise<IUserResponse> {
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return this.sanitizeUser(user);
    }

    static async getAllUsers(): Promise<IUserResponse[]> {
        return users.map(user => this.sanitizeUser(user));
    }
}
