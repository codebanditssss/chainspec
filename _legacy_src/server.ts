import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

export const createServer = (): Application => {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS
    app.use(cors({
        origin: config.corsOrigin,
        credentials: true,
    }));

    // Body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Logging
    if (config.nodeEnv === 'development') {
        app.use(morgan('dev'));
    }

    // API routes
    app.use('/api', routes);

    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            message: 'ChainSpec API Server',
            version: '1.0.0',
            endpoints: {
                health: '/api/health',
                users: '/api/users',
            },
        });
    });

    // Error handling (must be last)
    app.use(errorHandler);

    return app;
};
