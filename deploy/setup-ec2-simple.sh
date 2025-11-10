#!/bin/bash
set -e

echo "🔧 Setting up EC2 instance..."
echo "=============================="

# Update system
echo "Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    rm get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi

# Install Certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    sudo apt install certbot python3-certbot-nginx -y
fi

# Install PostgreSQL client for backups
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL client..."
    sudo apt install postgresql-client -y
fi

# Configure Nginx
echo "Configuring Nginx..."
sudo cp ~/cleaning-app/deploy/nginx-config/premierprime.conf /etc/nginx/sites-available/premierprime
sudo ln -sf /etc/nginx/sites-available/premierprime /etc/nginx/sites-enabled/premierprime
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo ""
echo "✅ EC2 setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify DNS: nslookup premierprime.org"
echo "2. Deploy app: cd ~/cleaning-app && bash deploy/ec2-deploy.sh"
echo "3. Setup SSL: sudo certbot --nginx -d premierprime.org -d www.premierprime.org"