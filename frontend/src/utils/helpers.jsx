export function formatBackendData(item) {
  if (!item) return item;
  
  return {
    'Transaction ID': item.transaction_id || item.id || '',
    'id': item.id,
    
    'Customer ID': item.customer_id || '',
    'Customer Name': item.customer_name || '',
    'Phone Number': item.phone_number || '',
    'Gender': item.gender || '',
    'Age': item.age || 0,
    'Customer Region': item.customer_region || '',
    'Customer Type': item.customer_type || '',
    
    'Product ID': item.product_id || '',
    'Product Name': item.product_name || '',
    'Brand': item.brand || '',
    'Product Category': item.product_category || '',
    'Tags': formatTags(item.tags),
    
    'Quantity': item.quantity || 0,
    'Price per Unit': parseFloat(item.price_per_unit) || 0,
    'Discount Percentage': parseFloat(item.discount_percentage) || 0,
    'Total Amount': parseFloat(item.total_amount) || 0,
    'Final Amount': parseFloat(item.final_amount) || 0,
    
    'Date': formatDate(item.date),
    'Payment Method': item.payment_method || '',
    'Order Status': item.order_status || '',
    'Delivery Type': item.delivery_type || '',
    'Store ID': item.store_id || '',
    'Store Location': item.store_location || '',
    'Salesperson ID': item.salesperson_id || '',
    'Employee Name': item.employee_name || '',
  };
}

export function formatTags(tags) {
  if (!tags) return '';
  try {
    const cleanTags = tags.replace(/[{}"]/g, '');
    return cleanTags.split(',').filter(tag => tag.trim()).join(', ');
  } catch (e) {
    return tags;
  }
}

export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

export const PAGE_SIZES = [10, 25, 50, 100];

export const menuItems = [
  { icon: 'Home', label: 'Dashboard', active: true },
  { icon: 'Invoice', label: 'Invoices' },
  { icon: 'ShoppingCart', label: 'Orders' },
  { icon: 'Customers', label: 'Customers' },
  { icon: 'Products', label: 'Products' },
  { icon: 'Reports', label: 'Reports' },
  { icon: 'Settings', label: 'Settings' }
];