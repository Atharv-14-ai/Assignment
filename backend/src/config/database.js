const { Pool } = require('pg');
require('dotenv').config();

// 1. For Render/Railway → They provide DATABASE_URL automatically
// 2. For Local → fallback to manual credentials
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }  // Render/Railway require SSL
      : false,
});

// Test connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL connected successfully"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
