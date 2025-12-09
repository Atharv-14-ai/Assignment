const db = require('../config/database');

class SalesService {
  async getSales(filters) {
    try {
      const {
        search = '',
        regions = [],
        gender = [],
        categories = [],
        tags = [],
        paymentMethods = [],
        ageMin,
        ageMax,
        dateStart,
        dateEnd,
        sort = 'date_desc',
        page = 1,
        limit = 10
      } = filters;

      const offset = (page - 1) * limit;

      let whereConditions = [];
      let queryParams = [];
      let paramCount = 1;

      if (search) {
        whereConditions.push(`(customer_name ILIKE $${paramCount} OR phone_number ILIKE $${paramCount})`);
        queryParams.push(`%${search}%`);
        paramCount++;
      }

      if (regions.length > 0) {
        const placeholders = regions.map((_, i) => `$${paramCount + i}`).join(',');
        whereConditions.push(`customer_region IN (${placeholders})`);
        queryParams.push(...regions);
        paramCount += regions.length;
      }

      if (gender.length > 0) {
        const placeholders = gender.map((_, i) => `$${paramCount + i}`).join(',');
        whereConditions.push(`gender IN (${placeholders})`);
        queryParams.push(...gender);
        paramCount += gender.length;
      }

      if (categories.length > 0) {
        const placeholders = categories.map((_, i) => `$${paramCount + i}`).join(',');
        whereConditions.push(`product_category IN (${placeholders})`);
        queryParams.push(...categories);
        paramCount += categories.length;
      }

      if (paymentMethods.length > 0) {
        const placeholders = paymentMethods.map((_, i) => `$${paramCount + i}`).join(',');
        whereConditions.push(`payment_method IN (${placeholders})`);
        queryParams.push(...paymentMethods);
        paramCount += paymentMethods.length;
      }

      if (tags.length > 0) {
        const tagConditions = tags.map(tag => {
          const condition = `tags ILIKE $${paramCount}`;
          queryParams.push(`%${tag}%`);
          paramCount++;
          return condition;
        });
        whereConditions.push(`(${tagConditions.join(' OR ')})`);
      }

      if (ageMin !== undefined && ageMin !== '') {
        whereConditions.push(`age >= $${paramCount}`);
        queryParams.push(parseInt(ageMin));
        paramCount++;
      }

      if (ageMax !== undefined && ageMax !== '') {
        whereConditions.push(`age <= $${paramCount}`);
        queryParams.push(parseInt(ageMax));
        paramCount++;
      }

      if (dateStart) {
        whereConditions.push(`date >= $${paramCount}`);
        queryParams.push(dateStart);
        paramCount++;
      }

      if (dateEnd) {
        whereConditions.push(`date <= $${paramCount}`);
        queryParams.push(dateEnd);
        paramCount++;
      }

      let orderBy;
      switch (sort) {
        case 'date_desc':
          orderBy = 'date DESC';
          break;
        case 'date_asc':
          orderBy = 'date ASC';
          break;
        case 'quantity_desc':
          orderBy = 'quantity DESC';
          break;
        case 'quantity_asc':
          orderBy = 'quantity ASC';
          break;
        case 'customer_asc':
          orderBy = 'customer_name ASC';
          break;
        case 'customer_desc':
          orderBy = 'customer_name DESC';
          break;
        case 'amount_desc':
          orderBy = 'final_amount DESC';
          break;
        case 'amount_asc':
          orderBy = 'final_amount ASC';
          break;
        default:
          orderBy = 'date DESC';
      }

      let whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      const countQuery = `SELECT COUNT(*) as total FROM sales ${whereClause}`;
      const countResult = await db.query(countQuery, queryParams);
      const totalItems = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(totalItems / limit);

      const dataQuery = `
        SELECT 
          id,
          transaction_id,
          customer_id, customer_name, phone_number, gender, age, 
          customer_region, customer_type,
          product_id, product_name, brand, product_category, tags,
          quantity, price_per_unit, discount_percentage, 
          total_amount, final_amount,
          date, payment_method, order_status, delivery_type,
          store_id, store_location, salesperson_id, employee_name
        FROM sales 
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

      const finalParams = [...queryParams, limit, offset];
      const dataResult = await db.query(dataQuery, finalParams);

      return {
        data: dataResult.rows,
        totalItems,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('Error in getSales:', error);
      throw error;
    }
  }

  async getFilterMeta() {
    try {
      console.log('Fetching filter metadata...');
      
      const queries = [
        db.query(`SELECT DISTINCT customer_region as value FROM sales WHERE customer_region IS NOT NULL AND customer_region != '' ORDER BY customer_region`),
        db.query(`SELECT DISTINCT gender as value FROM sales WHERE gender IS NOT NULL AND gender != '' ORDER BY gender`),
        db.query(`SELECT DISTINCT product_category as value FROM sales WHERE product_category IS NOT NULL AND product_category != '' ORDER BY product_category`),
        db.query(`SELECT DISTINCT payment_method as value FROM sales WHERE payment_method IS NOT NULL AND payment_method != '' ORDER BY payment_method`)
      ];

      const [
        regionsResult,
        gendersResult,
        categoriesResult,
        paymentMethodsResult
      ] = await Promise.all(queries);

      let tagsResult;
      try {
        // Normalize tags: some rows store tags as Postgres array literals like
        // '{tag1,tag2}' or contain quotes — strip braces/quotes and trim each
        // value so the UI receives clean tag strings.
        tagsResult = await db.query(`
          SELECT DISTINCT TRIM(regexp_replace(unnest(string_to_array(tags, ',')), '[{}"]', '', 'g')) as value
          FROM sales
          WHERE tags IS NOT NULL AND tags != '' AND TRIM(tags) != ''
        `);
      } catch (error) {
        console.log('Using alternative tags query...');
        const allTagsResult = await db.query(`SELECT tags FROM sales WHERE tags IS NOT NULL AND tags != ''`);
        const tagsSet = new Set();
        
        allTagsResult.rows.forEach(row => {
          if (row.tags) {
            row.tags.split(',').forEach(tag => {
              const trimmed = tag.trim();
              if (trimmed) tagsSet.add(trimmed);
            });
          }
        });
        
        tagsResult = { rows: Array.from(tagsSet).map(tag => ({ value: tag })) };
      }

      const result = {
        regions: regionsResult.rows.map(row => row.value).filter(Boolean),
        genders: gendersResult.rows.map(row => row.value).filter(Boolean),
        categories: categoriesResult.rows.map(row => row.value).filter(Boolean),
        paymentMethods: paymentMethodsResult.rows.map(row => row.value).filter(Boolean),
        tags: tagsResult.rows.map(row => row.value).filter(Boolean).sort()
      };

      console.log('Filter metadata fetched successfully:', {
        regions: result.regions.length,
        genders: result.genders.length,
        categories: result.categories.length,
        paymentMethods: result.paymentMethods.length,
        tags: result.tags.length
      });

      return result;

    } catch (error) {
      console.error('Error in getFilterMeta:', error);
      
      return {
        regions: ['North', 'South', 'East', 'West'],
        genders: ['Male', 'Female'],
        categories: ['Electronics', 'Fashion', 'Home', 'Sports'],
        paymentMethods: ['Credit Card', 'Debit Card', 'UPI', 'Cash'],
        tags: ['premium', 'discount', 'new', 'sale', 'bestseller']
      };
    }
  }

  async getSummaryStats() {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_transactions,
          COALESCE(SUM(final_amount), 0) as total_revenue,
          COALESCE(AVG(final_amount), 0) as avg_transaction,
          COUNT(DISTINCT customer_id) as unique_customers,
          MIN(date) as earliest_date,
          MAX(date) as latest_date
        FROM sales
      `;

      const result = await db.query(statsQuery);
      return result.rows[0];

    } catch (error) {
      console.error('Error in getSummaryStats:', error);
      return {
        total_transactions: 0,
        total_revenue: 0,
        avg_transaction: 0,
        unique_customers: 0,
        earliest_date: null,
        latest_date: null
      };
    }
  }

  async getSampleData(limit = 10) {
    try {
      const query = `
        SELECT * FROM sales 
        ORDER BY date DESC 
        LIMIT $1
      `;
      const result = await db.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Error in getSampleData:', error);
      return [];
    }
  }
}

module.exports = new SalesService();