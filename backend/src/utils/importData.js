import { createReadStream } from 'fs';
import csv from 'csv-parser';
import pool from '../db/index.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const importCSVData = async () => {
  const results = [];
  const filePath = join(__dirname, '../../data/truestate_assignment_dataset.csv');
  
  console.log('Looking for CSV file at:', filePath);
  
  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        
        const transformedRow = {
          customer_id: row['Customer ID'] || null,
          customer_name: row['Customer Name'] || '',
          phone_number: row['Phone Number'] || '',
          gender: row['Gender'] || '',
          age: parseInt(row['Age']) || null,
          customer_region: row['Customer Region'] || '',
          customer_type: row['Customer Type'] || '',
          product_id: row['Product ID'] || '',
          product_name: row['Product Name'] || '',
          brand: row['Brand'] || '',
          product_category: row['Product Category'] || '',
          // Store tags as a plain comma-separated string to avoid
          // Postgres array literal formatting like '{tag1,tag2}' when
          // parameterized with a JS array.
          tags: row['Tags'] ? row['Tags'].split(',').map(tag => tag.trim()).join(',') : '',
          quantity: parseInt(row['Quantity']) || 0,
          price_per_unit: parseFloat(row['Price per Unit']) || 0,
          discount_percentage: parseFloat(row['Discount Percentage']) || 0,
          total_amount: parseFloat(row['Total Amount']) || 0,
          final_amount: parseFloat(row['Final Amount']) || 0,
          date: row['Date'] ? new Date(row['Date']).toISOString().split('T')[0] : null,
          payment_method: row['Payment Method'] || '',
          order_status: row['Order Status'] || '',
          delivery_type: row['Delivery Type'] || '',
          store_id: row['Store ID'] || '',
          store_location: row['Store Location'] || '',
          salesperson_id: row['Salesperson ID'] || '',
          employee_name: row['Employee Name'] || ''
        };
        results.push(transformedRow);
      })
      .on('end', async () => {
        console.log(`CSV file processed. ${results.length} records found.`);
        
        if (results.length === 0) {
          console.log('No data to import. Check CSV file path and format.');
          resolve();
          return;
        }
        
        try {
          const client = await pool.connect();
          
          await client.query('DELETE FROM sales');
          
          const batchSize = 500;
          for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            const placeholders = [];
            const values = [];
            let paramCounter = 1;
            
            batch.forEach((row) => {
              const rowValues = [];
              Object.values(row).forEach(value => {
                values.push(value);
                rowValues.push(`$${paramCounter}`);
                paramCounter++;
              });
              placeholders.push(`(${rowValues.join(', ')})`);
            });
            
            const queryText = `
              INSERT INTO sales (
                customer_id, customer_name, phone_number, gender, age, 
                customer_region, customer_type, product_id, product_name, 
                brand, product_category, tags, quantity, price_per_unit, 
                discount_percentage, total_amount, final_amount, date, 
                payment_method, order_status, delivery_type, store_id, 
                store_location, salesperson_id, employee_name
              ) VALUES ${placeholders.join(', ')}
            `;
            
            await client.query(queryText, values);
            console.log(`Inserted ${batch.length} records (${i + batch.length}/${results.length})`);
          }
          
          client.release();
          console.log('Data import completed successfully!');
          resolve();
        } catch (error) {
          console.error('Error importing data:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
};