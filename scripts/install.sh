#!/usr/bin/env bash

dockerComposeFileLocation="docker-compose.yaml"
dotEnvFileLocation=".env"
bootstrapSQLFileLocation="sql/database.sql"

function generateRandomString() {
  echo $(head -c 64 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9')
}

function getDotEnvValue() {
  # Check if file exists
  if [ ! -f $1 ]; then
    echo $(generateRandomString)
  else
    echo $(grep $2 $1 | cut -d '=' -f2)
  fi
}

# Get the docker compose file
if [ ! -f sql/database.sql ]; then
  echo "Downloading docker-compose.yaml..."
  curl -L https://raw.githubusercontent.com/Angus-Paillaugue/Env-manager/main/docker-compose.yaml -o $dockerComposeFileLocation &>/dev/null
else
  echo "The docker-compose file already exists, skipping download."
fi

# Generate the .env file
echo "Generating .env file..."
# Values
POSTGRES_DB=env_manager
POSTGRES_USER=env_manager_user
POSTGRES_PORT=5432
POSTGRES_PASSWORD=env_manager_password
JWT_SECRET="$(getDotEnvValue $dotEnvFileLocation 'JWT_SECRET')"

{
  echo "POSTGRES_DB=$POSTGRES_DB"
  echo "POSTGRES_USER=$POSTGRES_USER"
  echo "POSTGRES_PORT=$POSTGRES_PORT"
  echo "PUBLIC_BACKEND_PORT=$PUBLIC_BACKEND_PORT"
  echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
  echo "JWT_SECRET=$JWT_SECRET"
} > $dotEnvFileLocation

# Getting the bootstrap SQL file
if [ ! -d $(dirname "$bootstrapSQLFileLocation") ]; then
  mkdir -p $(dirname "$bootstrapSQLFileLocation")
fi

if [ ! -f "$bootstrapSQLFileLocation" ]; then
  echo "Downloading the bootstrap SQL file..."
  curl -L https://raw.githubusercontent.com/Angus-Paillaugue/Env-manager/main/sql/database.sql -o "$bootstrapSQLFileLocation" &>/dev/null
else
  echo "The SQL file already exists, skipping download."
fi

# Create uploads directory
if [ ! -d "uploads" ]; then
  echo "Creating uploads directory..."
  mkdir -p uploads/{profile_pictures,logs}
  # Get the default profile picture file
  if [ ! -f "uploads/profile_pictures/default.webp" ]; then
    echo "Downloading default profile picture..."
    curl -L https://raw.githubusercontent.com/Angus-Paillaugue/Env-manager/main/uploads/profile_pictures/default.webp -o "uploads/profile_pictures/default.webp" &>/dev/null
  else
    echo "Default profile picture already exists, skipping download."
  fi
else
  echo "Uploads directory already exists, skipping creation."
fi

# Check if containers are already running
if [ "$(docker ps -q -f name=env-manager-db)" ]; then
  echo "Containers are already running. Stopping them..."
  docker compose -f $dockerComposeFileLocation --env-file $dotEnvFileLocation down
fi

# Launch the docker containers
echo "Launching the docker containers..."
docker compose -f $dockerComposeFileLocation --env-file $dotEnvFileLocation up -d

# Wait for the containers to be up
echo "Waiting for the containers to be up..."
while ! docker exec -it env-manager-db pg_isready -U $POSTGRES_USER &>/dev/null; do
  sleep 1
done

echo "Containers are up and running."
