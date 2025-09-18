-- Create a table for tracking orders with date slots and stock management
CREATE TABLE IF NOT EXISTS public.order_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  quantity INTEGER NOT NULL, -- quantity in 500g units
  weight_kg NUMERIC NOT NULL, -- total weight in kg
  total_price NUMERIC NOT NULL,
  order_date DATE NOT NULL, -- the date slot this order is for
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reserved, confirmed, completed
  transaction_id TEXT,
  payment_screenshot_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.order_slots ENABLE ROW LEVEL SECURITY;

-- Create policies for order_slots
CREATE POLICY "Allow all to insert order_slots" 
ON public.order_slots 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all to view order_slots" 
ON public.order_slots 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all to update order_slots" 
ON public.order_slots 
FOR UPDATE 
USING (true);

-- Create index for better performance on date and product queries
CREATE INDEX idx_order_slots_product_date ON public.order_slots(product_id, order_date);
CREATE INDEX idx_order_slots_date ON public.order_slots(order_date);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_order_slots_updated_at
BEFORE UPDATE ON public.order_slots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();