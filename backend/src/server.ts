import app from './index';
import { BACKEND_PORT } from "./config/env";
import prisma from './config/prismaClient';

async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('Database connection established');

        app.listen(BACKEND_PORT, () => {
            console.log(`Server is running on port ${BACKEND_PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 