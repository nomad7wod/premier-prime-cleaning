#!/bin/bash
set -e

echo "🚀 Deploying Premier Prime Cleaning App..."
echo "==========================================="

# Navigate to app directory
cd ~/cleaning-app

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build images
echo "Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start containers
echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "Waiting for services to start..."
sleep 10

# Check status
echo ""
echo "Container Status:"
docker-compose -f docker-compose.prod.yml ps

# Show logs
echo ""
echo "Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo "✅ Deployment complete!"
echo "Backend health: http://localhost:8080/api/health"
echo "Frontend: http://localhost:3000"