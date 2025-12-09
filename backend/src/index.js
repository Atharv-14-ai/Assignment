const express = require('express');
const cors = require('cors');
require('dotenv').config();

const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// 🚀 UPDATED CORS SETUP - COMPLETE FIX
// ----------------------
const allowedOrigins = [
  'https://truestate-frontend-3djo.onrender.com',  // Your deployed frontend
  'https://truestate-frontend.onrender.com',       // Alternative subdomain
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

// Function to check if origin is allowed
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin');
  let corsOptions;
  
  // Allow requests with no origin (like mobile apps, curl, etc.)
  if (!origin) {
    corsOptions = { origin: false }; // Disable CORS for these requests
    return callback(null, corsOptions);
  }
  
  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) {
    corsOptions = { 
      origin: true, // Reflect the requested origin
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Range', 'X-Content-Range']
    };
  } else {
    // Origin not allowed
    corsOptions = { origin: false };
  }
  
  callback(null, corsOptions);
};

// Apply CORS middleware
app.use(cors(corsOptionsDelegate));

// Handle preflight requests for all routes
app.options('*', cors(corsOptionsDelegate));

// Add CORS headers manually for extra safety
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  next();
});

// Log CORS requests for debugging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`[CORS] Origin: ${origin || 'No Origin'}, Method: ${req.method}, Path: ${req.path}`);
  next();
});
// ----------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} | Origin: ${req.headers.origin || 'No Origin'}`);
  next();
});

// API Routes
app.use('/api/sales', salesRoutes);

// API Root
app.get('/', (req, res) => {
  const origin = req.headers.origin;
  
  // Add CORS headers for root endpoint
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.json({
    message: 'TruEstate Retail Sales Management API',
    version: '1.0.0',
    status: 'operational',
    cors_allowed_origins: allowedOrigins,
    endpoints: {
      sales: '/api/sales',
      filters: '/api/sales/filters',
      stats: '/api/sales/stats',
      sample: '/api/sales/sample',
      health: '/api/sales/health'
    },
    documentation: 'See README for API documentation',
    cors_info: {
      allowed: allowedOrigins.includes(origin) ? 'YES' : 'NO',
      your_origin: origin || 'Not provided'
    }
  });
});

// Health Check Endpoint (no authentication needed)
app.get('/health', (req, res) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TruEstate Backend API',
    version: '1.0.0'
  });
});

// 404 Handler
app.use((req, res) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.url} does not exist`,
    allowed_endpoints: [
      '/api/sales',
      '/api/sales/filters',
      '/api/sales/stats',
      '/api/sales/health'
    ]
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Something went wrong. Please try again later.',
    request_id: req.headers['x-request-id'] || Date.now().toString(36)
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
  console.log(`✅ Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 Allowed Origins:`, allowedOrigins);
  console.log(`📝 CORS Mode: ${process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Export app for testing
module.exports = app;
