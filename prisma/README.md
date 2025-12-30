# Prisma Database Migration Guide

## Setup PostgreSQL Database

### 1. Install PostgreSQL
Download and install PostgreSQL from: https://www.postgresql.org/download/

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE chainspec_db;

# Create user (optional)
CREATE USER chainspec_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE chainspec_db TO chainspec_user;
```

### 3. Update .env File
Copy `.env.example` to `.env` and update the `DATABASE_URL`:

```bash
cp .env.example .env
```

Then edit `.env` and update:
```
DATABASE_URL=postgresql://username:password@localhost:5432/chainspec_db?schema=public
```

Replace:
- `username` with your PostgreSQL username
- `password` with your PostgreSQL password
- `localhost:5432` with your PostgreSQL host and port (if different)
- `chainspec_db` with your database name (if different)

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Run Database Migrations
```bash
npx prisma db push
```

Or create migration files:
```bash
npx prisma migrate dev --name init
```

### 6. (Optional) Seed Database
Create a seed script if needed:
```bash
npx prisma db seed
```

## Prisma Commands

### View Database in Prisma Studio
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### Format Schema
```bash
npx prisma format
```

### Generate Client After Schema Changes
```bash
npx prisma generate
```

## User Model

The User model includes:
- `id` - UUID primary key
- `email` - Unique email address
- `username` - Unique username
- `password` - Hashed password
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string

## Troubleshooting

### Connection Refused
- Make sure PostgreSQL is running
- Check if the port (default 5432) is correct
- Verify the database exists

### Authentication Failed
- Check username and password in DATABASE_URL
- Ensure user has proper permissions

### Schema Errors
- Run `npx prisma format` to fix formatting
- Run `npx prisma validate` to check for errors
