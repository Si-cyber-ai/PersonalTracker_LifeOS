-- Migration: Add auto_renew column to subscriptions table
-- Run this in Supabase SQL Editor to fix subscription creation issue
-- This is safe to run even if the column already exists

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' 
    AND column_name = 'auto_renew'
  ) THEN
    ALTER TABLE subscriptions 
    ADD COLUMN auto_renew BOOLEAN DEFAULT true;
    
    -- Update existing subscriptions to have auto_renew = true
    UPDATE subscriptions SET auto_renew = true WHERE auto_renew IS NULL;
    
    RAISE NOTICE 'Column auto_renew added successfully';
  ELSE
    RAISE NOTICE 'Column auto_renew already exists';
  END IF;
END $$;
