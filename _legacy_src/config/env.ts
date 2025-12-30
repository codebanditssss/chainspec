import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

interface Config {
  port: string | number;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiresIn: StringValue | number;
  databaseUrl: string;
  etherscanApiKey: string;
  sepoliaRpcUrl: string;
  corsOrigin: string;
}

export const config: Config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '7d') as StringValue,

  // Database (optional - for future use)
  databaseUrl: process.env.DATABASE_URL || '',

  // Ethereum Configuration
  etherscanApiKey: process.env.ETHERSCAN_API_KEY || '',
  sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL || '',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
