-- Create mujkuva_organic_orders table
-- This table stores all orders for Mujkuva Organic Cooperative

CREATE TABLE IF NOT EXISTS public.mujkuva_organic_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL, -- Unique order number for tracking
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  quantity NUMERIC NOT NULL, -- Quantity in kg (supports decimals)
  weight_kg NUMERIC NOT NULL, -- Total weight in kg
  unit_price NUMERIC NOT NULL, -- Price per kg
  total_price NUMERIC NOT NULL, -- Total price for this order item
  order_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Date when order was placed
  delivery_date DATE, -- Expected delivery date
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  transaction_id TEXT, -- Payment transaction ID
  payment_screenshot_path TEXT, -- Path to payment screenshot in storage
  payment_method TEXT, -- UPI, Bank Transfer, Cash, etc.
  notes TEXT, -- Additional notes or special instructions
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_order_number ON public.mujkuva_organic_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_customer_phone ON public.mujkuva_organic_orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_order_date ON public.mujkuva_organic_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_status ON public.mujkuva_organic_orders(status);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_payment_status ON public.mujkuva_organic_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_product_id ON public.mujkuva_organic_orders(product_id);

-- Enable Row Level Security
ALTER TABLE public.mujkuva_organic_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mujkuva_organic_orders
-- Allow all to insert orders
CREATE POLICY "Allow all to insert mujkuva_organic_orders" 
ON public.mujkuva_organic_orders 
FOR INSERT 
WITH CHECK (true);

-- Allow all to view orders
CREATE POLICY "Allow all to view mujkuva_organic_orders" 
ON public.mujkuva_organic_orders 
FOR SELECT 
USING (true);

-- Allow all to update orders
CREATE POLICY "Allow all to update mujkuva_organic_orders" 
ON public.mujkuva_organic_orders 
FOR UPDATE 
USING (true);

-- Allow all to delete orders (for admin purposes)
CREATE POLICY "Allow all to delete mujkuva_organic_orders" 
ON public.mujkuva_organic_orders 
FOR DELETE 
USING (true);

-- Create function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_num TEXT;
  date_prefix TEXT;
  seq_num INTEGER;
BEGIN
  -- Format: MO-YYYYMMDD-XXXX (e.g., MO-20250128-0001)
  date_prefix := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get the next sequence number for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 12) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM public.mujkuva_organic_orders
  WHERE order_number LIKE 'MO-' || date_prefix || '-%';
  
  -- Format with leading zeros (4 digits)
  order_num := 'MO-' || date_prefix || '-' || LPAD(seq_num::TEXT, 4, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order number before insert
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_mujkuva_order_number
BEFORE INSERT ON public.mujkuva_organic_orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_mujkuva_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mujkuva_organic_orders_updated_at
BEFORE UPDATE ON public.mujkuva_organic_orders
FOR EACH ROW
EXECUTE FUNCTION update_mujkuva_orders_updated_at();

-- Add comments to table and columns
COMMENT ON TABLE public.mujkuva_organic_orders IS 'Stores all orders for Mujkuva Organic Cooperative';
COMMENT ON COLUMN public.mujkuva_organic_orders.order_number IS 'Unique order number format: MO-YYYYMMDD-XXXX';
COMMENT ON COLUMN public.mujkuva_organic_orders.quantity IS 'Quantity in kg (supports decimal values like 0.25, 0.5, etc.)';
COMMENT ON COLUMN public.mujkuva_organic_orders.status IS 'Order status: pending, confirmed, processing, shipped, delivered, cancelled';
COMMENT ON COLUMN public.mujkuva_organic_orders.payment_status IS 'Payment status: pending, paid, failed, refunded';

-- Verify table creation
SELECT 
  'mujkuva_organic_orders table' as item,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mujkuva_organic_orders') 
       THEN '✅ CREATED' 
       ELSE '❌ FAILED' 
  END as status;

-- Show table structure
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'mujkuva_organic_orders'
ORDER BY ordinal_position;

SELECT '🎉 mujkuva_organic_orders table created successfully!' as message;

