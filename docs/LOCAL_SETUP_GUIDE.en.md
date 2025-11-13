# 🚀 Local Development Environment Setup Guide

This document provides detailed setup instructions for developing the **Gundam Universe Board** project in a local environment.

> **Note**: This guide is designed to be commit-ready. Do not include sensitive information (passwords, API keys) directly in this file. Use environment variables instead.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [PostgreSQL Installation & Setup](#2-postgresql-installation--setup)
3. [Backend Setup](#3-backend-setup)
4. [Frontend Setup](#4-frontend-setup)
5. [Google OAuth Setup](#5-google-oauth-setup)
6. [Local Execution](#6-local-execution)
7. [Troubleshooting](#7-troubleshooting)
8. [AWS Deployment Preparation](#8-aws-deployment-preparation)

---

## 1. Prerequisites

### Installation Check

Verify that the following software is installed:

- ✅ **Python 3.13.8** (currently installed)
- ✅ **Node.js v22.20.0** (currently installed)
- ⬜ **PostgreSQL 15+** (install below)
- ⬜ **Git**

### Version Check Commands

```powershell
# Check Python version
python --version

# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version (after installation)
psql --version
```

---

## 2. PostgreSQL Installation & Setup

### 2.1 PostgreSQL Installation (Windows)

#### Method 1: Official Installer

1. **Download**
   - Download the installer from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)
   - Or download from [EnterpriseDB Installer](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

2. **Installation Process**
   - Run the installer
   - Installation path: Use default (e.g., `C:\Program Files\PostgreSQL\15`)
   - Component selection: **Check all** (PostgreSQL Server, pgAdmin 4, Command Line Tools)
   - Port: **5432** (default)
   - Superuser (postgres) password: **Set your desired password** (Remember this!)

3. **Environment Variable Check**
   - If `psql` command doesn't work after installation, add to PATH:
   ```
   C:\Program Files\PostgreSQL\15\bin
   ```

#### Method 2: Install via Chocolatey (Recommended)

```powershell
# If Chocolatey is installed
choco install postgresql15 -y

# Or latest version
choco install postgresql -y
```

### 2.2 Start PostgreSQL Service

```powershell
# Check PostgreSQL service in Windows Services
# Or start via command
net start postgresql-x64-15
```

### 2.3 Create Database

```powershell
# Connect to PostgreSQL (password required)
psql -U postgres

# Execute the following commands in PostgreSQL prompt:
```

```sql
-- Create project database
CREATE DATABASE gundam_board;

-- List databases
\l

-- Connect to created database
\c gundam_board

-- Exit
\q
```

### 2.4 Record Connection Information

Record the following information for later use in `.env` file:

```
Host: localhost
Port: 5432
Database: gundam_board
Username: postgres
Password: [Password set during installation]
```

---

## 3. Backend Setup

### 3.1 Navigate to Directory

```powershell
cd D:\UTS\ToyProject\ToyProject-Gundam\backend
```

### 3.2 Create and Activate Python Virtual Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment (PowerShell)
.\venv\Scripts\Activate.ps1

# Activate virtual environment (CMD)
.\venv\Scripts\activate.bat
```

> **Note**: If you encounter script execution errors in PowerShell:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### 3.3 Install Python Packages

```powershell
# Install dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

### 3.4 Environment Variable Setup

```powershell
# Copy .env.example to create .env file
copy .env.example .env

# Open .env file with text editor
notepad .env
```

**Write `.env` file contents:**

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/gundam_board

# JWT Configuration
JWT_SECRET=gundam-super-secret-key-2024-change-me-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400

# Google OAuth Configuration (configure in step 5)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application Configuration
STAGE=dev
DEBUG=True
```

> ⚠️ **Important**: 
> - Replace `[YOUR_PASSWORD]` with the password set during PostgreSQL installation
> - Change `JWT_SECRET` to a random string
> - Google OAuth information will be configured in step 5

### 3.5 Create Database Tables

```powershell
# Run Python interpreter
python

# In Python prompt:
```

```python
from chalicelib.database import init_db
init_db()
print("Database initialized successfully!")
exit()
```

---

## 4. Frontend Setup

### 4.1 Navigate to Directory

```powershell
# Open new terminal (backend should still be running)
cd D:\UTS\ToyProject\ToyProject-Gundam\frontend
```

### 4.2 Install Node.js Packages

```powershell
# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### 4.3 Environment Variable Setup

```powershell
# Copy .env.local.example to create .env.local file
copy .env.local.example .env.local

# Open .env.local file with text editor
notepad .env.local
```

**Write `.env.local` file contents:**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth Configuration (configure in step 5)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Application Configuration
NEXT_PUBLIC_APP_NAME=Gundam Universe Board
NEXT_PUBLIC_APP_VERSION=1.0.0
```

> ⚠️ **Important**: Google OAuth Client ID will be configured in step 5

---

## 5. Google OAuth Setup

### 5.1 Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 5.2 Create New Project

1. Click **Project Selection** dropdown at the top
2. Click **New Project**
3. Project name: `Gundam Universe Board` (or your preferred name)
4. Click **Create**
5. Select the created project

### 5.3 Configure OAuth Consent Screen

1. Click **APIs & Services** > **OAuth consent screen** in the left menu
2. User Type: Select **External** and click **Create**
3. Enter app information:
   - App name: `Gundam Universe Board`
   - User support email: Your email
   - Developer contact information: Your email
4. Click **Save and Continue**
5. Scopes: Keep defaults and click **Save and Continue**
6. Test users: Add your email and click **Save and Continue**
7. Click **Back to Dashboard**

### 5.4 Create OAuth 2.0 Client ID

1. Click **APIs & Services** > **Credentials** in the left menu
2. Click **+ Create Credentials** > **OAuth client ID** at the top
3. Application type: Select **Web application**
4. Name: `Gundam Board Web Client`
5. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:8000
   ```
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth
   ```
7. Click **Create**

### 5.5 Save Client ID and Secret

Copy and save the generated information:

- **Client ID**: `123456789-abcdef.apps.googleusercontent.com` (example)
- **Client Secret**: `GOCSPX-abc123def456` (example)

### 5.6 Apply to Environment Variables

**Update backend `.env` file:**

```env
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
```

**Update frontend `.env.local` file:**

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
```

---

## 6. Local Execution

### 6.1 Run Backend

```powershell
# In backend directory
cd D:\UTS\ToyProject\ToyProject-Gundam\backend

# Activate virtual environment (if not already activated)
.\venv\Scripts\Activate.ps1

# Run Chalice local server
chalice local --port 8000
```

**Verification:**
- Access `http://localhost:8000/health` in browser
- If you see `{"status": "healthy"}`, success!

### 6.2 Run Frontend

```powershell
# In new terminal, navigate to frontend directory
cd D:\UTS\ToyProject\ToyProject-Gundam\frontend

# Run development server
npm run dev
```

**Verification:**
- Access `http://localhost:3000` in browser
- If main page appears, success!

### 6.3 Test Google Login

1. Access `http://localhost:3000/auth` page
2. Click **Google Login** button
3. Select Google account and sign in
4. On successful login, redirect to `/posts` page

---

## 7. Troubleshooting

### 7.1 PostgreSQL Connection Error

**Symptoms:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solutions:**
1. Check if PostgreSQL service is running:
   ```powershell
   # Check service status
   Get-Service postgresql-x64-15
   
   # Start service
   net start postgresql-x64-15
   ```

2. Check `.env` file DATABASE_URL:
   - If password contains special characters, URL encoding required
   - Example: `@` → `%40`, `#` → `%23`

3. Test PostgreSQL connection:
   ```powershell
   psql -U postgres -d gundam_board
   ```

### 7.2 Python Package Installation Error

**Symptoms:**
```
error: Microsoft Visual C++ 14.0 or greater is required
```

**Solutions:**
1. Install [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Or use psycopg2-binary (already included in requirements.txt)

### 7.3 Chalice Execution Error

**Symptoms:**
```
ImportError: No module named chalice
```

**Solutions:**
```powershell
# Check if virtual environment is activated
# Prompt should show (venv)

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Reinstall chalice
pip install chalice
```

### 7.4 Google OAuth Error

**Symptoms:**
```
Error 400: redirect_uri_mismatch
```

**Solutions:**
1. Check authorized redirect URIs in Google Cloud Console
2. Verify `http://localhost:3000/auth` is exactly entered
3. Ensure both frontend and backend use localhost

### 7.5 CORS Error

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Check CORS_HEADERS in backend `config.py`
2. Check API URL in frontend `.env.local`
3. Restart backend

### 7.6 Port Conflict Error

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
```powershell
# Find process using port
netstat -ano | findstr :3000

# Terminate process (after finding PID)
taskkill /PID [PROCESS_ID] /F

# Or use different port
npm run dev -- -p 3001
```

---

## 8. AWS Deployment Preparation

### 8.1 Install AWS CLI

```powershell
# Install via Chocolatey
choco install awscli -y

# Or MSI installer
# https://aws.amazon.com/cli/
```

### 8.2 Configure AWS Credentials

```powershell
# Run AWS Configure
aws configure

# Enter information:
# AWS Access Key ID: [YOUR_ACCESS_KEY]
# AWS Secret Access Key: [YOUR_SECRET_KEY]
# Default region name: ap-northeast-2 (Seoul)
# Default output format: json
```

### 8.3 Verify Chalice Deployment Configuration

The `backend/.chalice/config.json` file is already created.

Set environment variables before deployment:

```json
{
  "stages": {
    "dev": {
      "environment_variables": {
        "DATABASE_URL": "postgresql://username:password@your-rds-endpoint/gundam_board",
        "JWT_SECRET": "your-production-jwt-secret",
        "GOOGLE_CLIENT_ID": "your-client-id",
        "GOOGLE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

### 8.4 Create AWS RDS PostgreSQL (During Deployment)

1. AWS Console > RDS > Create Database
2. Engine: PostgreSQL
3. Template: Free tier (for testing)
4. DB instance identifier: `gundam-board-db`
5. Master username: `postgres`
6. Master password: Set strong password
7. Public access: Yes (for development)
8. VPC security group: Create new (allow port 5432)

### 8.5 Backend Deployment Commands

```powershell
cd backend

# Deploy to dev environment
chalice deploy --stage dev

# Deploy to production environment
chalice deploy --stage prod
```

After deployment, set API Gateway URL in frontend `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://xxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/api
```

### 8.6 Frontend Deployment (Vercel Recommended)

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

---

## 9. Development Workflow

### Daily Development Start

```powershell
# 1. Check PostgreSQL service
Get-Service postgresql-x64-15

# 2. Run backend (Terminal 1)
cd D:\UTS\ToyProject\ToyProject-Gundam\backend
.\venv\Scripts\Activate.ps1
chalice local --port 8000

# 3. Run frontend (Terminal 2)
cd D:\UTS\ToyProject\ToyProject-Gundam\frontend
npm run dev
```

### On Code Changes

- **Backend**: Chalice automatically reloads
- **Frontend**: Next.js automatically reloads
- **Database schema changes**: Re-run `init_db()`

### Pre-Commit Checklist

- [ ] Verify `.env` file is not committed
- [ ] Verify `node_modules/`, `venv/` are excluded
- [ ] Remove sensitive information (passwords, API keys)
- [ ] Run tests and verify they pass

---

## 10. References

### Official Documentation

- [Chalice Documentation](https://aws.github.io/chalice/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

### Project Documentation

- `01_API_Design.md` - API Specification
- `02_Database_Design.md` - Database Design
- `03_Frontend_Architecture.md` - Frontend Structure
- `04_Backend_Architecture.md` - Backend Structure
- `05_UI_UX_Design.md` - UI/UX Design

---

## 🎉 Setup Complete!

All setup is complete! You can now:

1. ✅ Run backend API server locally
2. ✅ Run frontend development server locally
3. ✅ Google OAuth login
4. ✅ Post CRUD functionality
5. ✅ Comment CRUD functionality

If you encounter issues, refer to the **Troubleshooting** section above or check the project documentation.

**Happy Coding! 🚀**

