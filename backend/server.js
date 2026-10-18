require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const paperRoutes = require('./routes/paperRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas / Local MongoDB
connectDB();

// CORS Configuration
const rawAllowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://paprism-research-paper-analyzer.vercel.app',
].filter(Boolean);

// Normalize by removing trailing slashes
const normalizedAllowed = rawAllowedOrigins.map((o) => o.replace(/\/+$/, '').toLowerCase());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '').toLowerCase();

    // Check exact list, or match any *.vercel.app domain, or localhost
    const isAllowed =
      normalizedAllowed.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1') ||
      process.env.NODE_ENV !== 'production';

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check & Root Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Paprism Backend API',
    endpoints: {
      auth: '/api/auth',
      papers: '/api/papers',
      ai: '/api/ai',
      health: '/api/health',
    },
  });
});

// Mount Routes under /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/ai', aiRoutes);

// Catch 404 routes
app.use((req, res, next) => {
  res.status(404).json({ message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server if not imported by test runner
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Paprism Server listening on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`📡 AI Service URL: ${process.env.AI_SERVICE_URL || 'http://localhost:8000'}`);
    console.log(`🌐 CORS Allowed Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
    console.log(`=========================================`);
  });
}

module.exports = app;
