-- Add Birthday feature to the database
-- This table stores birthday information for Imran and Ajsa

-- Create birthdays table
CREATE TABLE IF NOT EXISTS birthdays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE CHECK (user_name IN ('Imran', 'Ajsa')),
  birth_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for the table
ALTER TABLE birthdays ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for both users
CREATE POLICY "Allow all operations on birthdays" ON birthdays
  FOR ALL USING (true) WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_birthdays_user_name ON birthdays(user_name);
