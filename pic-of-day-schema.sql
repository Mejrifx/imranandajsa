-- Add Pic of the Day feature to the database
-- This table stores daily photos uploaded by Imran and Ajsa

-- Create daily_photos table
CREATE TABLE IF NOT EXISTS daily_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL CHECK (user_name IN ('Imran', 'Ajsa')),
  photo_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  photo_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for the table
ALTER TABLE daily_photos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for both users
CREATE POLICY "Allow all operations on daily_photos" ON daily_photos
  FOR ALL USING (true) WITH CHECK (true);

-- Create unique constraint to ensure only one photo per user per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_photos_user_date 
ON daily_photos(user_name, photo_date);

-- Create index for better performance when querying by date
CREATE INDEX IF NOT EXISTS idx_daily_photos_photo_date 
ON daily_photos(photo_date DESC);

-- Create index for better performance when querying by user
CREATE INDEX IF NOT EXISTS idx_daily_photos_user_name 
ON daily_photos(user_name);
