---
title: Installation
name: Installation
---

Env Manager is a tool for managing environment variables across your projects with real-time collaboration features and secure synchronization capabilities.

# Prerequisites
 - [Docker](https://docs.docker.com/get-started/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
 - `curl` (to download necessary files)
 - `bash` shell environment


# Quick Installation

The simplest way to get started with Env Manager is to use our automated installation script:

```bash
# Download the install script
curl -L https://raw.githubusercontent.com/Angus-Paillaugue/Env-manager/main/scripts/install.sh -o install.sh

# Make the script executable
chmod +x install.sh

# Run the installation
./install.sh
```

The script will:
1. Download the required configuration files
2. Generate a secure `.env` file with necessary credentials
3. Set up required directories
4. Start the Docker containers

Once complete, Env Manager should be available at [http://localhost:4173](http://localhost:4173).

# Manual Installation

If you prefer to install manually, follow these steps:
1. Download the Docker Compose file:

```bash snippet
curl -L https://raw.githubusercontent.com/Angus-Paillaugue/Env-manager/main/docker-compose.yaml -o docker-compose.yaml
```

2. Create a `.env` file with the following content:

```txt
POSTGRES_DB=env_manager
POSTGRES_USER=env_manager_user
POSTGRES_PORT=5432
POSTGRES_PASSWORD=env_manager_password
JWT_SECRET=<your_random_jwt_secret_here>
```

3. Create the necessary directories:

```bash snippet
mkdir -p sql
mkdir -p uploads/{profile_pictures,logs}
```

4. Download the database initialization script:

```bash snippet
curl -L https://raw.githubusercontent.com/Angus-Paillaugue/Env-manager/main/uploads/profile_pictures/default.webp -o uploads/profile_pictures/default.webp
```

5. Download the default profile picture:

```bash snippet
curl -L https://raw.githubusercontent.com/Angus-Paillaugue/Env-manager/main/uploads/profile_pictures/default.webp -o uploads/profile_pictures/default.webp
```

6. Start the Docker containers:

```bash snippet
docker compose -f docker-compose.yaml --env-file .env up -d
```

## Verification
To verify that Env Manager is running correctly:
1. Check that the containers are up:

```bash snippet
docker ps
```
You should see containers named `env-manager` and `env-manager-db` running.

2. Access the web interface at [http://localhost:4173](http://localhost:4173)


# Troubleshooting

If you encounter issues during installation:

 - **Database connection errors**: Ensure the PostgreSQL container is running with `docker ps`. If not, check the logs with `docker logs env-manager-db`.
 - **Web application not accessible**: Check the logs of the web container with `docker logs env-manager`.
 - **Permission issues**: Make sure the `uploads` directory has the correct permissions for the Docker container to write to it.
 - **Port conflicts**: If port `4173` is already in use, modify the port mapping in the docker-compose.yaml file to use a different port.
