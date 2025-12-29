import { createServer } from './server';
import { config } from './config/env';

const app = createServer();

const PORT = config.port;

app.listen(PORT, () => {
    console.log('ChainSpec Server Started!');
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`API: http://localhost:${PORT}/api`);
});