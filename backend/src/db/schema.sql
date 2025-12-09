DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50),
    customer_name VARCHAR(100),
    phone_number VARCHAR(20),
    gender VARCHAR(10),
    age INTEGER,
    customer_region VARCHAR(50),
    customer_type VARCHAR(50),
    product_id VARCHAR(50),
    product_name VARCHAR(100),
    brand VARCHAR(50),
    product_category VARCHAR(50),
    tags VARCHAR(255),
    quantity INTEGER,
    price_per_unit DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    total_amount DECIMAL(12, 2),
    final_amount DECIMAL(12, 2),
    date DATE,
    payment_method VARCHAR(50),
    order_status VARCHAR(50),
    delivery_type VARCHAR(50),
    store_id VARCHAR(50),
    store_location VARCHAR(100),
    salesperson_id VARCHAR(50),
    employee_name VARCHAR(100),
    transaction_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_name ON sales(customer_name);
CREATE INDEX idx_phone_number ON sales(phone_number);
CREATE INDEX idx_customer_region ON sales(customer_region);
CREATE INDEX idx_gender ON sales(gender);
CREATE INDEX idx_product_category ON sales(product_category);
CREATE INDEX idx_payment_method ON sales(payment_method);
CREATE INDEX idx_date ON sales(date);
CREATE INDEX idx_order_status ON sales(order_status);
CREATE INDEX idx_final_amount ON sales(final_amount);

-- Create text search index for better search performance
CREATE INDEX idx_search ON sales USING GIN (
    to_tsvector('english', 
        COALESCE(customer_name, '') || ' ' || 
        COALESCE(phone_number, '')
    )
);