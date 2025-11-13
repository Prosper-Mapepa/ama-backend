#!/bin/bash

echo "🔄 Resetting database..."

# Stop any running processes
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Run migrations
echo "🚀 Running migrations..."
npm run migration:run

echo "✅ Database reset complete!"
echo "🎉 You can now start your backend with: npm run start:dev" 