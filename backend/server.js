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
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

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
