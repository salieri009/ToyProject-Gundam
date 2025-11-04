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

## 🏛️ Solution Architecture

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

<div align="center">

**Made with ❤️ by Salieri | AI-Assisted Development with Cursor**

*A next-generation community platform inspired by Gundam Universal Century*

</div>
