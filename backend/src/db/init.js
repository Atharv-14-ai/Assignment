import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from './index.js';
import { importCSVData } from '../utils/importData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('Creating database schema...');
    await pool.query(schema);
    console.log('Database schema created successfully!');
    
    console.log('Importing CSV data...');
    await importCSVData();
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();