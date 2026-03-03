// src/server.ts
import express from 'express';
import type { Application, Request, Response } from 'express'; // Types imported separately
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/db';
import chatRoutes from './routes/chatRoutes';
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';
import adminRoutes from './routes/adminRoutes';
// Load environment variables
dotenv.config();

// Initialize Express application
const app: Application = express();



// ==========================================
// ENTERPRISE SECURITY & MIDDLEWARE SETUP
// ==========================================

// 1. Set security HTTP headers (Prevents malicious script injections)
app.use(helmet());

// 2. Enable Cross-Origin Resource Sharing (CORS)

app.use(cors({
  origin: [
    'https://ethio-ai-s8gk.vercel.app', 
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Body parser, reading data from body into req.body
// Limits payload size to 10kb to prevent Denial of Service (DoS) attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Data sanitization against NoSQL query injection
//app.use(mongoSanitize());

// 5. Rate limiting to prevent Brute Force and DDoS attacks
// Limits each IP address to 100 requests per 15 minutes
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 15 minutes.',
});
app.use('/api', limiter);

// 6. Development HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==========================================
// DATABASE CONNECTION
// ==========================================

// 🔴 ጊዜያዊ ማቋረጥ፡ አለቃህ የ ዳታቤዝ IP እስኪያስተካክል ድረስ ዳታቤዙን አናነቃውም 🔴
// connectDB(); 

// Mount the chat routes under the /api/chat endpoint
app.use('/api/chat', chatRoutes);
// Mount authentication routes
app.use('/api/auth', authRoutes);
// Health check endpoint for server monitoring

app.use('/api/quiz', quizRoutes);

app.use('/api/admin', adminRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'RootGate Server is running securely and smoothly.',
    timestamp: new Date().toISOString()
  });
});

// Global unhandled route handler
// ==========================================
// GLOBAL 404 ERROR HANDLER
// ==========================================
// Catch-all route for undefined endpoints in Express 5.x
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server.`
  });
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SERVER] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`[SECURITY] Helmet, CORS, Rate-Limiting, and Mongo-Sanitize are ACTIVE.`);
});