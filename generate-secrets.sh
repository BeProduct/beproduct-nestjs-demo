#!/bin/bash

echo "============================================"
echo "  BeProduct OAuth - Secret Generator"
echo "============================================"
echo ""

# Generate secure random secrets
JWT_SECRET=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-64)
APP_SECRET=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-64)

echo "Generated Secrets:"
echo "=================="
echo ""
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "APP_SECRET=$APP_SECRET"
echo ""
echo "============================================"
echo ""

# Ask if user wants to update .env file
read -p "Do you want to update backend/.env with these secrets? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    ENV_FILE="backend/.env"

    if [ ! -f "$ENV_FILE" ]; then
        echo "Error: $ENV_FILE not found!"
        exit 1
    fi

    # Create backup
    cp "$ENV_FILE" "$ENV_FILE.backup"
    echo "Created backup: $ENV_FILE.backup"

    # Update JWT_SECRET
    if grep -q "^JWT_SECRET=" "$ENV_FILE"; then
        sed -i.tmp "s|^JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" "$ENV_FILE"
        echo "Updated JWT_SECRET in $ENV_FILE"
    else
        echo "JWT_SECRET=$JWT_SECRET" >> "$ENV_FILE"
        echo "Added JWT_SECRET to $ENV_FILE"
    fi

    # Update APP_SECRET
    if grep -q "^APP_SECRET=" "$ENV_FILE"; then
        sed -i.tmp "s|^APP_SECRET=.*|APP_SECRET=$APP_SECRET|" "$ENV_FILE"
        echo "Updated APP_SECRET in $ENV_FILE"
    else
        echo "APP_SECRET=$APP_SECRET" >> "$ENV_FILE"
        echo "Added APP_SECRET to $ENV_FILE"
    fi

    # Clean up temporary files
    rm -f "$ENV_FILE.tmp"

    echo ""
    echo "Secrets updated successfully!"
    echo "Backup saved to: $ENV_FILE.backup"
    echo ""
    echo "IMPORTANT: Restart your application for changes to take effect."
else
    echo ""
    echo "Secrets not saved to .env file."
    echo "Copy and paste the secrets above into your backend/.env file manually."
fi

echo ""
echo "============================================"
