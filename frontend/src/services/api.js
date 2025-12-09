// import axios from 'axios';

// // ------------------------------
// // 🔥 Smart BASE URL handling
// // ------------------------------
// const API_BASE_URL =
//   import.meta.env.VITE_API_URL ||
//   (import.meta.env.MODE === 'production'
//     ? 'https://truestate-backend-kwpj.onrender.com/api'   // Render backend 
//     : 'http://localhost:5000/api');                 // Local dev

// console.log("🌐 Using API Base URL:", API_BASE_URL);

// // ------------------------------
// // 🔥 Axios Instance
// // ------------------------------
// const API = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 500000000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // ------------------------------
// // 🔥 Caching Support (same logic)
// // ------------------------------
// const cache = new Map();
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// export const getSales = async (params = {}, options = {}) => {
//   try {
//     const cacheKey = JSON.stringify(params);
//     const cached = cache.get(cacheKey);

//     if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return cached.data;
//     }

//     const cleanParams = {};
//     Object.keys(params).forEach(key => {
//       if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
//         if (Array.isArray(params[key]) && params[key].length > 0) {
//           cleanParams[key] = params[key].join(',');
//         } else if (!Array.isArray(params[key])) {
//           cleanParams[key] = params[key];
//         }
//       }
//     });

//     const response = await API.get('/sales', {
//       params: cleanParams,
//       ...options
//     });

//     cache.set(cacheKey, {
//       data: response.data,
//       timestamp: Date.now()
//     });

//     if (cache.size > 50) {
//       const firstKey = cache.keys().next().value;
//       cache.delete(firstKey);
//     }

//     return response.data;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };


// export const getFilters = async () => {
//   try {
//     const cacheKey = 'filters';
//     const cached = cache.get(cacheKey);

//     if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return cached.data;
//     }

//     const response = await API.get('/sales/filters');

//     cache.set(cacheKey, {
//       data: response.data,
//       timestamp: Date.now()
//     });

//     return response.data;
//   } catch (error) {
//     console.error('API: Error fetching filters:', error);

//     return {
//       regions: ['North', 'South', 'East', 'West', 'Central'],
//       genders: ['Male', 'Female'],
//       categories: ['Electronics', 'Beauty', 'Fashion', 'Home'],
//       paymentMethods: ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking'],
//       tags: ['organic', 'smart', 'wireless', 'portable']
//     };
//   }
// };

// export const clearCache = () => cache.clear();

// export default {
//   getSales,
//   getFilters,
//   clearCache
// };


const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. ENABLE CORS FOR ALL ORIGINS
app.use(cors({
  origin: true, // Reflect the request origin
  credentials: true
}));

// 2. MANUAL CORS HEADERS AS BACKUP
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow any origin
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} | Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Import routes AFTER CORS middleware
const salesRoutes = require('./routes/salesRoutes');
app.use('/api/sales', salesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'truestate-backend',
    timestamp: new Date().toISOString(),
    cors_enabled: true,
    your_origin: req.headers.origin || 'Not provided'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TruEstate Backend API',
    version: '1.0.0',
    endpoints: ['/api/sales', '/health', '/api/sales/filters', '/api/sales/health'],
    cors: 'enabled'
  });
});

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working!',
    your_origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    headers_sent: {
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Credentials': 'true'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.url
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 CORS enabled for all origins`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`✅ CORS Test: http://localhost:${PORT}/cors-test`);
});

