# Docker Setup Guide

This guide will help you set up and run your Next.js application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

1. **Create Environment File**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # API Configuration
   NEXT_PUBLIC_BASE_API=https://uapi.rg.in.th/uapi/rantcar/
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # Database Configuration
   DATABASE_URL=mysql://myapp:myapppassword@db:3306/myapp
   MYSQL_ROOT_PASSWORD=rootpassword
   MYSQL_DATABASE=myapp
   MYSQL_USER=myapp
   MYSQL_PASSWORD=myapppassword

   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

   # Email Configuration (if using Resend)
   RESEND_API_KEY=your_resend_api_key_here
   ```

2. **Build and Run with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up --build

   # Run in detached mode
   docker-compose up -d --build

   # Stop all services
   docker-compose down

   # Stop and remove volumes
   docker-compose down -v
   ```

3. **Access Your Application**
   - Frontend: http://localhost:3000
   - Database: localhost:3306 (MySQL)

## Development Mode

For development, you can use the development Dockerfile:

```bash
# Build development image
docker build -f Dockerfile.dev -t my-app-dev .

# Run development container
docker run -p 3000:3000 -v $(pwd):/app my-app-dev
```

## Production Deployment

1. **Build Production Image**
   ```bash
   docker build -t my-app-prod .
   ```

2. **Run Production Container**
   ```bash
   docker run -p 3000:3000 --env-file .env my-app-prod
   ```

## Database Setup

The MySQL database will be automatically initialized with the schema from `database_schema.sql`. The database data will persist in a Docker volume.

## Environment Variables

Make sure to update the following environment variables in your `.env` file:

- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `RESEND_API_KEY`: Your Resend API key (if using email functionality)
- `NEXT_PUBLIC_BASE_API`: Your API base URL
- `NEXT_PUBLIC_BASE_URL`: Your application base URL

## Troubleshooting

1. **Port Already in Use**
   If port 3000 is already in use, change the port mapping in `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Use port 3001 instead
   ```

2. **Database Connection Issues**
   - Ensure the database service is running: `docker-compose ps`
   - Check database logs: `docker-compose logs db`
   - Verify environment variables are set correctly

3. **Build Issues**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

## Useful Commands

```bash
# View logs
docker-compose logs -f app

# Access database
docker-compose exec db mysql -u myapp -p myapp

# Access application container
docker-compose exec app sh

# View running containers
docker-compose ps

# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v
```

## Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Consider using Docker secrets for production deployments
- Regularly update base images for security patches 