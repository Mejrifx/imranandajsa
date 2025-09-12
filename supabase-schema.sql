-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user TEXT NOT NULL CHECK (from_user IN ('Imran', 'Ajsa')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  added_by TEXT NOT NULL CHECK (added_by IN ('Imran', 'Ajsa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  person TEXT NOT NULL CHECK (person IN ('Imran', 'Ajsa')),
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bucket_list table
CREATE TABLE IF NOT EXISTS bucket_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_moods table
CREATE TABLE IF NOT EXISTS user_moods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE CHECK (user_name IN ('Imran', 'Ajsa')),
  mood_emoji TEXT NOT NULL DEFAULT '😊',
  mood_text TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default moods for both users
INSERT INTO user_moods (user_name, mood_emoji, mood_text) 
VALUES ('Imran', '😊', ''), ('Ajsa', '💕', '')
ON CONFLICT (user_name) DO NOTHING;

-- Enable RLS (Row Level Security) for all tables
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_moods ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for both users
CREATE POLICY "Allow all operations on notes" ON notes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on movies" ON movies
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on favorites" ON favorites
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on bucket_list" ON bucket_list
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on user_moods" ON user_moods
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movies_created_at ON movies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bucket_list_created_at ON bucket_list(created_at DESC);
