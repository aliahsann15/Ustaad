import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimiter';
import userRoutes from './routes/userRoutes';
import providerRoutes from './routes/providerRoutes';
import serviceRequestRoutes from './routes/serviceRequestRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app = express();

// Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(cors());
app.use(express.json());
app.use('/api/', apiLimiter); // Apply rate limiting to all API routes

app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/bookings', bookingRoutes);

export default app;
