const express = require('express');
const cors = require('cors');
require('dotenv').config();

const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// 🚀 UPDATED CORS SETUP
// ----------------------
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://truestate-frontend-3djo.onrender.com',  // Your deployed frontend  
        'http://localhost:5173'                     // For dev testing
      ]
    : [
        'http://localhost:3000',
        'http://localhost:5173'
      ],
  credentials: true
};

app.use(cors(corsOptions));
// ----------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/sales', salesRoutes);

// API Root
app.get('/', (req, res) => {
  res.json({
    message: 'TruEstate Retail Sales Management API',
    version: '1.0.0',
    endpoints: {
      sales: '/api/sales',
      filters: '/api/sales/filters',
      stats: '/api/sales/stats',
      sample: '/api/sales/sample',
      health: '/api/sales/health'
    },
    documentation: 'See README for API documentation'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.url} does not exist`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/sales/health`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

