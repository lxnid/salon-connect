#!/bin/bash
set -e

echo "🔨 Building SalonConnect API..."

# Install all dependencies including dev dependencies
echo "📦 Installing dependencies..."
npm install --include=dev

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate --schema=./packages/database/prisma/schema.prisma

# Build the API
echo "🏗️ Building API..."
npm run build --workspace=apps/api

# Run database migrations in production
echo "🗄️ Running database migrations..."
npx prisma migrate deploy --schema=./packages/database/prisma/schema.prisma

# Seed the database (idempotent)
echo "🌱 Seeding database..."
npm run seed --workspace=apps/api

echo "✅ Build completed successfully!"