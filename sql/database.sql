-- CREATE USER env_manager_user
-- WITH
--     ENCRYPTED PASSWORD 'env_manager_password';

DROP DATABASE env_manager;

CREATE DATABASE env_manager;

\c env_manager;

GRANT ALL PRIVILEGES ON DATABASE env_manager TO env_manager_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO env_manager_user;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    profile_picture TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project_members (
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'guest')),
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, project_id)
);

CREATE TABLE environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (project_id, name)
);

CREATE TABLE variables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    environment_id UUID REFERENCES environments (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    value TEXT NOT NULL,
    UNIQUE (environment_id, name)
);


-- Set 'updated_at' to update automatically on row modification
CREATE OR REPLACE FUNCTION set_variable_updated_at()
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
EXECUTE FUNCTION set_variable_updated_at();
