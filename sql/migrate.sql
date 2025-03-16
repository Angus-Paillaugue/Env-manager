\c env_manager;

-- Add 'username' column to 'users' table
ALTER TABLE users
ADD COLUMN username TEXT UNIQUE NOT NULL DEFAULT 'default_username';

-- Add 'added_at' column to 'project_members' table
ALTER TABLE project_members
ADD COLUMN added_at TIMESTAMP DEFAULT NOW();

-- Add 'updated_at' column to 'variables' table
ALTER TABLE variables ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Set 'updated_at' to update automatically on row modification
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to the 'variables' table
CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON variables
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
