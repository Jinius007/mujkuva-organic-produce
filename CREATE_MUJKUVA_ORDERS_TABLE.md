# 📋 Create mujkuva_organic_orders Table

## Overview

This creates a new table `mujkuva_organic_orders` for storing all orders for Mujkuva Organic Cooperative.

## Table Features

- ✅ **Auto-generated Order Numbers**: Format `MO-YYYYMMDD-XXXX` (e.g., `MO-20250128-0001`)
- ✅ **Decimal Quantity Support**: Supports decimal values like 0.25, 0.5, etc.
- ✅ **Order Status Tracking**: pending, confirmed, processing, shipped, delivered, cancelled
- ✅ **Payment Status Tracking**: pending, paid, failed, refunded
- ✅ **Customer Information**: Name, phone, email, address
- ✅ **Product Details**: Product ID, name, quantity, weight, prices
- ✅ **Payment Information**: Transaction ID, screenshot path, payment method
- ✅ **Automatic Timestamps**: created_at and updated_at
- ✅ **RLS Policies**: Row Level Security enabled with public access policies

## How to Create the Table

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/zjjjajkzavxytdexkbrj
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### Step 2: Run the Script

1. Open the file: `supabase/create-mujkuva-organic-orders.sql`
2. Copy the entire script
3. Paste it into the SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)

### Step 3: Verify Creation

You should see:
- ✅ `mujkuva_organic_orders table: ✅ CREATED`
- ✅ Table structure with all columns
- ✅ Test insert successful
- ✅ `🎉 mujkuva_organic_orders table created successfully!`

## Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `order_number` | TEXT | Unique order number (auto-generated: MO-YYYYMMDD-XXXX) |
| `product_id` | TEXT | Product identifier |
| `product_name` | TEXT | Product name |
| `customer_name` | TEXT | Customer name |
| `customer_phone` | TEXT | Customer phone number |
| `customer_email` | TEXT | Customer email (optional) |
| `customer_address` | TEXT | Delivery address |
| `quantity` | NUMERIC | Quantity in kg (supports decimals) |
| `weight_kg` | NUMERIC | Total weight in kg |
| `unit_price` | NUMERIC | Price per kg |
| `total_price` | NUMERIC | Total price for this order |
| `order_date` | DATE | Date when order was placed |
| `delivery_date` | DATE | Expected delivery date (optional) |
| `status` | TEXT | Order status (default: 'pending') |
| `payment_status` | TEXT | Payment status (default: 'pending') |
| `transaction_id` | TEXT | Payment transaction ID |
| `payment_screenshot_path` | TEXT | Path to payment screenshot |
| `payment_method` | TEXT | Payment method (UPI, Bank Transfer, etc.) |
| `notes` | TEXT | Additional notes |
| `created_at` | TIMESTAMP | When record was created |
| `updated_at` | TIMESTAMP | When record was last updated |

## Order Status Values

- `pending` - Order placed but not confirmed
- `confirmed` - Order confirmed
- `processing` - Order being processed
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled

## Payment Status Values

- `pending` - Payment not received
- `paid` - Payment received
- `failed` - Payment failed
- `refunded` - Payment refunded

## Example Usage

### Insert a New Order

```sql
INSERT INTO public.mujkuva_organic_orders (
  product_id, product_name, customer_name, customer_phone,
  customer_address, quantity, weight_kg, unit_price, total_price,
  status, payment_status, transaction_id
) VALUES (
  'tindora',
  'Tindora',
  'John Doe',
  '1234567890',
  '123 Main Street, City',
  0.25,  -- 250 gm
  0.25,  -- Weight in kg
  100.0, -- Price per kg
  25.0,  -- Total price
  'confirmed',
  'paid',
  'TXN123456789'
) RETURNING *;
```

The `order_number` will be auto-generated automatically!

### Query Orders

```sql
-- Get all orders
SELECT * FROM public.mujkuva_organic_orders ORDER BY created_at DESC;

-- Get orders by status
SELECT * FROM public.mujkuva_organic_orders WHERE status = 'confirmed';

-- Get orders by customer phone
SELECT * FROM public.mujkuva_organic_orders WHERE customer_phone = '1234567890';

-- Get orders by date range
SELECT * FROM public.mujkuva_organic_orders 
WHERE order_date BETWEEN '2025-01-01' AND '2025-01-31';
```

### Update Order Status

```sql
UPDATE public.mujkuva_organic_orders
SET status = 'shipped', updated_at = now()
WHERE order_number = 'MO-20250128-0001';
```

## Indexes Created

The table has indexes on:
- `order_number` - For quick order lookup
- `customer_phone` - For customer order history
- `order_date` - For date-based queries
- `status` - For filtering by status
- `payment_status` - For payment tracking
- `product_id` - For product-based queries

## Next Steps

After creating the table, you can:
1. ✅ Start using it in your application
2. ✅ Migrate existing orders from `order_slots` if needed
3. ✅ Update your application code to use the new table
4. ✅ Set up any additional integrations or automations

## Files Created

- `supabase/create-mujkuva-organic-orders.sql` - Main script (use this one)
- `supabase/migrations/20250128000001-create-mujkuva-organic-orders.sql` - Migration file

