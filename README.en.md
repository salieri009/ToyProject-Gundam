# 🤖 GUNDAM UNIVERSE BOARD

> **Next-Generation Community Platform with Gundam Universal Century Theme**  
> Google OAuth & JWT Authentication • Next.js + Chalice Microservices Architecture  
> PostgreSQL Database • AWS Lambda Serverless Deployment

[![Node.js](https://img.shields.io/badge/Node.js-v22.20.0-339933?logo=node.js)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.13.8-3776ab?logo=python)](https://www.python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)](https://nextjs.org)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%2B%20API%20Gateway-FF9900?logo=amazon-aws)](https://aws.amazon.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-316192?logo=postgresql)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[한국어](README.md) | **English** | [日本語](README.ja.md)

---

<div align="center">

![Header](https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=0,2,5,30&height=200&text=GUNDAM%20UNIVERSE%20BOARD&fontSize=60&fontColor=ffffff&animation=fadeIn&desc=Next-Generation%20Community%20Platform&descSize=20&descAlignY=70)

</div>

---

## 📖 About

**GUNDAM UNIVERSE BOARD** is a community platform designed for Gundam Universal Century fans.  
Built with modern web technologies, it demonstrates **user authentication**, **post CRUD operations**, and a **hierarchical comment system**.

This project showcases:

- 🔐 **JWT + Google OAuth** - Secure authentication flow
- 🏗️ **Microservices Architecture** - Decoupled frontend and backend
- 📊 **Database Optimization** - SQLAlchemy ORM, indexing, query optimization
- ☁️ **Cloud-Native Design** - AWS Lambda (Chalice), PostgreSQL RDS
- 🎨 **Retro 80s CRT Theme** - Nixie Tube numerals, phosphor green aesthetics

---

## 📁 Project Structure (30-Year Veteran Engineer's Perspective)

This section is written from the perspective of 30 years of software engineering experience. It clearly explains the architectural design principles and responsibility separation of each layer.

### Complete Directory Structure

```
ToyProject-Gundam/
├── backend/                          # AWS Chalice Backend Service
│   ├── app.py                        # Chalice application entry point
│   ├── requirements.txt              # Python dependency management
│   └── chalicelib/                   # Core business logic library
│       ├── config.py                 # Environment variables and configuration
│       ├── database.py               # SQLAlchemy session management and connection pool
│       ├── auth/                     # Authentication modules
│       │   ├── google_auth.py        # Google OAuth 2.0 verification logic
│       │   └── jwt.py                # JWT token generation/verification utilities
│       ├── models/                   # SQLAlchemy ORM models (domain entities)
│       │   ├── user.py               # User entity (users table)
│       │   ├── post.py               # Post entity (posts table)
│       │   ├── comment.py            # Comment entity (comments table)
│       │   └── refresh_token.py      # Refresh token entity
│       └── routes/                   # REST API endpoint definitions
│           ├── __init__.py           # Route registration and Blueprint integration
│           ├── auth.py               # Authentication API (/auth/*)
│           ├── posts.py              # Post API (/posts/*)
│           └── comments.py          # Comment API (/comments/*)
│
├── frontend/                         # Next.js Frontend Application
│   ├── package.json                  # Node.js dependencies and scripts
│   ├── next.config.js                # Next.js build configuration
│   ├── tailwind.config.js            # Tailwind CSS utility configuration
│   ├── tsconfig.json                 # TypeScript compiler configuration
│   └── src/
│       ├── app/                      # Next.js 14 App Router (file-based routing)
│       │   ├── layout.tsx            # Root layout (global styles, metadata)
│       │   ├── page.tsx               # Homepage (/)
│       │   ├── globals.css           # Global CSS styles (CRT theme)
│       │   ├── auth/
│       │   │   └── page.tsx          # Authentication page (/auth)
│       │   └── posts/
│       │       ├── page.tsx          # Post list (/posts)
│       │       ├── new/
│       │       │   └── page.tsx      # Create post (/posts/new)
│       │       └── [id]/
│       │           ├── page.tsx      # Post detail (/posts/:id)
│       │           └── edit/
│       │               └── page.tsx  # Edit post (/posts/:id/edit)
│       │
│       ├── components/               # Reusable React components
│       │   ├── layout/               # Layout components
│       │   │   ├── Header.tsx        # Navigation header
│       │   │   └── Footer.tsx       # Footer
│       │   └── ui/                   # UI primitive components
│       │       ├── LoadingSpinner.tsx    # Loading indicator
│       │       ├── NixieNumber.tsx       # Nixie Tube style number display
│       │       └── StatusIndicator.tsx   # Status indicator
│       │
│       ├── services/                 # External API communication layer
│       │   ├── api.ts                # Axios instance and interceptor configuration
│       │   └── weatherService.ts     # (Reference) Weather API service
│       │
│       ├── hooks/                    # Custom React Hooks
│       │   └── useAuth.ts            # Authentication state management hook
│       │
│       ├── context/                  # React Context API (global state)
│       │   └── WeatherContext.tsx    # (Reference) Weather context
│       │
│       ├── types/                    # TypeScript type definitions
│       │   ├── index.ts              # Common types (User, Post, Comment)
│       │   └── weather.ts            # Weather-related types
│       │
│       └── pages/                    # (Legacy) Pages Router components
│           ├── AuthPage.tsx
│           ├── HomePage.tsx
│           ├── PostsPage.tsx
│           ├── PostDetailPage.tsx
│           └── NewPostPage.tsx
│
└── docs/                             # Project documentation
    ├── DesignPlan.md                 # Project planning and design document
    ├── LOCAL_SETUP_GUIDE.md          # Local development environment setup guide
    ├── 01_API_Design.md              # REST API specification
    ├── 02_Database_Design.md         # Database schema design
    ├── 03_Frontend_Architecture.md   # Frontend architecture document
    ├── 04_Backend_Architecture.md    # Backend architecture document
    └── 05_UI_UX_Design.md           # UI/UX design guide
```

### Architectural Design Principles

#### 1. **Separation of Concerns**
- **Backend**: Handles only business logic, data validation, and database access
- **Frontend**: Handles only user interface, state management, and API calls
- **Database**: Handles data persistence and relationship management

#### 2. **Layered Architecture**
```
┌─────────────────────────────────────┐
│   Presentation Layer (Next.js)     │  ← User Interface
├─────────────────────────────────────┤
│   Application Layer (Chalice)      │  ← Business Logic
├─────────────────────────────────────┤
│   Data Access Layer (SQLAlchemy)   │  ← Database Abstraction
├─────────────────────────────────────┤
│   Database Layer (PostgreSQL)      │  ← Data Persistence
└─────────────────────────────────────┘
```

#### 3. **Dependency Inversion Principle**
- `routes/` modules depend on `models/` and `auth/`, but depend on interfaces rather than concrete implementations
- Database implementation details are abstracted through SQLAlchemy ORM

#### 4. **Single Responsibility Principle**
- Each module has only one clear responsibility
  - `auth/google_auth.py`: Handles only Google OAuth verification
  - `auth/jwt.py`: Handles only JWT token generation/verification
  - `routes/posts.py`: Handles only post-related APIs

### Core Module Detailed Explanation

#### Backend: `chalicelib/`

**`database.py`** - Database Connection Management
- SQLAlchemy `SessionLocal` factory pattern
- Performance optimization through connection pooling
- Session lifecycle management through context managers

**`models/`** - Domain Models (Entity Layer)
- SQLAlchemy 2.0 style ORM models
- Relational mapping (User ↔ Post ↔ Comment)
- Automatic timestamp management (`created_at`, `updated_at`)

**`routes/`** - API Endpoints (Controller Layer)
- Modularized routing through Chalice Blueprint
- Request validation and response serialization
- Authentication middleware integration

**`auth/`** - Authentication & Authorization (Security Layer)
- Google OAuth 2.0 ID token verification
- JWT access token and refresh token management
- Token expiration and renewal logic

#### Frontend: `src/`

**`app/`** - Next.js App Router (Routing Layer)
- File system-based routing
- Separation of server components and client components
- UI reuse through layout nesting

**`services/api.ts`** - HTTP Client (Communication Layer)
- Axios instance singleton pattern
- Request interceptor: Automatic JWT token injection
- Response interceptor: Automatic logout on 401 errors

**`components/`** - UI Components (Presentation Layer)
- Adherence to Atomic Design principles
- Reusable UI primitives
- Retro 80s CRT theme styling

**`hooks/useAuth.ts`** - Authentication State Management (State Layer)
- Global authentication state through React Context API
- Synchronization with local storage
- Token renewal logic

### Data Flow

```
1. User Action (Frontend)
   ↓
2. API Call (services/api.ts)
   ↓
3. HTTP Request (Axios Interceptor → Automatic JWT injection)
   ↓
4. API Gateway (AWS Lambda)
   ↓
5. Chalice Route Handler (routes/*.py)
   ↓
6. Authentication Middleware (auth/jwt.py)
   ↓
7. Business Logic Processing
   ↓
8. Database Query (SQLAlchemy ORM)
   ↓
9. PostgreSQL Execution
   ↓
10. Response Return (reverse order)
```

### Scalability Considerations

- **Horizontal Scaling**: AWS Lambda automatically scales based on traffic
- **Database Connection Pool**: Concurrent connection management through SQLAlchemy QueuePool
- **Caching Strategy**: Structure allows for future Redis integration
- **Microservice Separation**: Each Blueprint can be separated into independent Lambda functions

---

## 🏛️ Solution Architecture

<div align="center">

```
┌─────────────────────────────────────────────────────┐
│              GUNDAM UNIVERSE BOARD                  │
├──────────────────────┬──────────────────────────────┤
│  FRONTEND (Next.js)  │   BACKEND (AWS Chalice)      │
│                      │                              │
│  • React Components  │  • JWT + OAuth Routes        │
│  • TypeScript        │  • Post/Comment APIs         │
│  • Tailwind CSS      │  • Request Validation        │
│  • Axios HTTP Client │  • Lambda Functions          │
│                      │                              │
│  localhost:5173      │   API Gateway: api.*         │
└──────────┬───────────┴──────────┬───────────────────┘
           │                      │
           └──────────────────────┤
                    HTTPS/JSON-RPC
                  (JWT Authorization)
                                   │
                    ┌──────────────┴──────────────┐
                    │  PostgreSQL 15+ (RDS)      │
                    │  • Users                   │
                    │  • Posts                   │
                    │  • Comments (Hierarchical)│
                    │  • Refresh Tokens          │
                    └────────────────────────────┘
```

</div>

### Authentication Flow

1. **Login**: User → Google OAuth → Backend (`/auth/google`)
2. **Token Issuance**: Backend → JWT (24h) + Refresh Token (7d)
3. **API Requests**: Frontend → Axios Interceptor (Bearer Token auto-included)
4. **Token Refresh**: Expiration → `/auth/refresh` call → New JWT issued
5. **Logout**: Client token deletion + Refresh Token invalidation

---

## 🛠️ Tech Stack

### Frontend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | Production-grade React framework |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Utility-based styling |
| **HTTP Client** | Axios | Auto JWT interceptor |
| **Auth** | @react-oauth/google | Google OAuth 2.0 |
| **State** | React Context + Hooks | Global state management |
| **Forms** | React Hook Form + Zod | Form validation |

### Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | AWS Chalice | Python Lambda microframework |
| **Language** | Python 3.13 | Type hints supported |
| **ORM** | SQLAlchemy + psycopg2 | PostgreSQL object mapping |
| **Auth** | PyJWT + google-auth | JWT + Google token validation |
| **Deployment** | AWS Lambda + API Gateway | Serverless computing |
| **CORS** | Chalice CORS | Cross-domain request handling |

### Database

| Component | Technology |
|-----------|-----------|
| **DBMS** | PostgreSQL 15+ |
| **ORM** | SQLAlchemy 2.0 |
| **Connection Pool** | SQLAlchemy QueuePool |
| **Indexes** | B-tree on users.email, posts.user_id, comments.post_id |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v22.20.0 or higher
- **Python** 3.13 or higher
- **PostgreSQL** 15 or higher (local or AWS RDS)
- **Google OAuth 2.0** credentials ([Google Cloud Console](https://console.cloud.google.com))

### Local Development Setup

**For detailed setup instructions, see [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md).**

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/salieri009/ToyProject-Gundam.git
cd ToyProject-Gundam
```

#### 2️⃣ Backend Setup & Run

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate

# Or (Windows CMD/Git Bash)
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file (reference: .env.example)
# Add: DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID

# Start local development server (port 8000)
chalice local --port 8000
```

#### 3️⃣ Frontend Setup & Run

```bash
# Return to project root
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
# Create .env.local file (reference: .env.local.example)
# Add: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Start development server (port 5173)
npm run dev
```

#### 4️⃣ Access in Browser

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md) | Complete local development setup guide (PostgreSQL, environment variables, Google OAuth) |
| [`docs/01_API_Design.md`](docs/01_API_Design.md) | REST API endpoint specifications (request/response schemas) |
| [`docs/02_Database_Design.md`](docs/02_Database_Design.md) | PostgreSQL schema, SQLAlchemy models, indexing strategy |
| [`docs/03_Frontend_Architecture.md`](docs/03_Frontend_Architecture.md) | Next.js folder structure, component design, state management |
| [`docs/04_Backend_Architecture.md`](docs/04_Backend_Architecture.md) | Chalice structure, routing, authentication middleware |
| [`docs/05_UI_UX_Design.md`](docs/05_UI_UX_Design.md) | Retro 80s CRT theme, Nixie Tube design, CSS effects |

---

## ✨ Features

### 🔐 Authentication & Authorization

- ✅ **Google OAuth 2.0** login/logout
- ✅ **JWT tokens** (24-hour validity)
- ✅ **Refresh tokens** (7-day validity, auto-renewal)
- ✅ **Role-based access control** (only owners can edit/delete)

### 📝 Post Management

- ✅ **Create**: New post (title + content)
- ✅ **Read**: Post listing (pagination) & detailed view
- ✅ **Update**: Edit own posts
- ✅ **Delete**: Delete own posts

### 💬 Comment System

- ✅ **Nested comments** (1-level depth)
- ✅ **Create/edit/delete** comments
- ✅ **Hierarchical structure** based on parent comment

---

## 🧪 Testing & Deployment

### Local Testing

```bash
# Backend unit tests (example)
cd backend && pytest tests/

# Frontend component tests (example)
cd ../frontend && npm run test
```

### AWS Deployment

```bash
cd backend

# Deploy to dev stage
chalice deploy --stage dev

# Deploy to production stage
chalice deploy --stage prod

# Check deployment status
chalice status --stage dev
```

For detailed deployment guide, see [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md#-aws-deployment-preparation).

---

## 📖 References

### Architecture & Patterns

- 🔗 [AWS Chalice Documentation](https://aws.github.io/chalice/latest/)
- 🔗 [Next.js 14 App Router](https://nextjs.org/docs/app)
- 🔗 [SQLAlchemy 2.0 ORM](https://docs.sqlalchemy.org/en/20/)
- 🔗 [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

### Learning Resources

- 📖 **Building Microservices** - Sam Newman (Microservice design principles)
- 📖 **RESTful Web API Design** - Leonard Richardson (REST API design)
- 📖 **PostgreSQL Official Documentation** - [postgresql.org](https://www.postgresql.org/docs/)

### Related Projects

- 🔗 [EventualShop](https://github.com/AntonioFalcaoJr/EventualShop) - Event Sourcing + CQRS patterns
- 🔗 [Gundam Wiki](https://en.gundam.info/en/) - Gundam Universal Century background

---

---

<div align="center">

## 🤝 Contributing

To contribute to this project:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📋 Versioning

This project follows [Semantic Versioning](https://semver.org/).

See [Releases](https://github.com/salieri009/ToyProject-Gundam/releases) for release history.

---

## 👤 Author

**Salieri (salieri009)**

- GitHub: [@salieri009](https://github.com/salieri009)
- Project: [GUNDAM UNIVERSE BOARD](https://github.com/salieri009/ToyProject-Gundam)

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by Salieri | AI-Assisted Development with Cursor**

*A next-generation community platform inspired by Gundam Universal Century*

</div>
