-- Fix quantity field to allow decimal values
-- The quantity field was INTEGER but we need to store decimal values (0.25, 0.5, etc.)

-- Change quantity from INTEGER to NUMERIC to support decimal values
ALTER TABLE public.order_slots 
ALTER COLUMN quantity TYPE NUMERIC USING quantity::NUMERIC;

-- Add a comment to clarify
COMMENT ON COLUMN public.order_slots.quantity IS 'Quantity in kg (supports decimal values like 0.25, 0.5, etc.)';

