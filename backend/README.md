# 🔬 Paprism Backend

> Production-ready Node.js + Express + MongoDB Atlas backend for **Paprism** (AI Research Paper Simplifier).  
> Designed to pair with the React + Vite frontend (`http://localhost:5173`) and proxy to the FastAPI AI microservice (`http://localhost:8000`).

---

## 🏗️ Architecture & Features

- **Authentication**: JWT token-based authentication with bcrypt password hashing (`/api/auth/*`).
- **Research Papers**: CRUD API with multi-format schemas matching the Paprism frontend contracts (`/api/papers/*`).
- **Multipart PDF Ingestion**: Multer middleware with PDF mime-type validation and 25MB upload limits.
- **Async Processing Pipeline**: Instant document creation with status lifecycle: `UPLOADING` ➔ `PROCESSING` ➔ `READY` (or `FAILED`).
- **RAG Proxy & Contextual Grounding**: Proxies to FastAPI ChromaDB/Groq microservice with resilient fallback responses if the AI service is offline.
- **Data Persistence**: Mongoose with clean `toJSON` transformation, virtual IDs, and flexible ID lookups (`_id` and semantic slugs).

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection & reconnect handling
├── controllers/
│   ├── authController.js     # User registration, login, profile
│   ├── paperController.js    # Paper retrieval, upload, and deletion
│   └── aiController.js       # Grounded RAG chat proxying
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer verification & optional auth
│   ├── errorHandler.js       # Standardized JSON error response handler
│   └── uploadMiddleware.js   # Multer PDF filter and 25MB limit
├── models/
│   ├── Paper.js              # Comprehensive Paper model matching frontend PRD
│   └── User.js               # User schema with bcrypt pre-save hashing
├── routes/
│   ├── aiRoutes.js           # /api/ai/chat
│   ├── authRoutes.js         # /api/auth/register, /login, /profile
│   └── paperRoutes.js        # /api/papers (list, get by id, upload, delete)
├── scripts/
│   └── seed.js               # Initial papers seed script (Attention, ResNet, BERT)
├── services/
│   └── aiService.js          # Client for FastAPI microservice + fallbacks
├── tests/
│   ├── uploadTest.js         # Multer & upload validation test
│   └── verifyContract.test.js# Contract and endpoint unit tests
├── uploads/                  # Local storage directory for uploaded PDFs
├── .env.example              # Environment variables template
├── package.json              # NPM configuration and dependencies
└── server.js                 # Express bootstrap and route mounting
```

---

## ⚙️ Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/paprism?retryWrites=true&w=majority
JWT_SECRET=paprism_super_secret_jwt_key_2026
AI_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
GROQ_API_KEY=gsk_...
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure MongoDB Atlas (or Local MongoDB)
See [Connecting to MongoDB Atlas](#-connecting-to-mongodb-atlas) below.

### 3. Seed Demo Data (Optional but Recommended)
Populates demo user and 3 seminal research papers (*Attention Is All You Need*, *Deep Residual Learning*, *BERT*):
```bash
npm run seed
```

### 4. Start the Server
- **Development (with hot reload)**:
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm start
  ```

Server will run at `http://localhost:5000`. Health check is available at `http://localhost:5000/api/health`.

### 5. Run Automated Tests
```bash
npm test
```

---

## 🍃 Connecting to MongoDB Atlas

1. **Create an Account / Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign in.
   - Create a free **M0 Sandbox** cluster.

2. **Configure Database Access**:
   - Under **Security** ➔ **Database Access**, click **Add New Database User**.
   - Select **Password** authentication, specify a username (e.g., `paprism_user`) and a secure password.
   - Grant role: **Read and write to any database**.

3. **Configure Network Access**:
   - Under **Security** ➔ **Network Access**, click **Add IP Address**.
   - For local development, choose **Allow Access from Anywhere** (`0.0.0.0/0`) or add your current IP.

4. **Copy Connection String**:
   - Go to **Database** ➔ **Connect** ➔ **Drivers** (Node.js).
   - Copy the URI and replace `<password>` and database name:
     ```env
     MONGO_URI=mongodb+srv://paprism_user:<your_password>@cluster0.abcde.mongodb.net/paprism?retryWrites=true&w=majority
     ```
   - Paste it into `backend/.env`.

---

## 🤖 Running Alongside the FastAPI AI Microservice

The Paprism backend acts as the gateway between the frontend and the FastAPI AI microservice:

```
[React Frontend] (Port 5173)
       │
       ▼ (REST /api)
[Node.js Backend] (Port 5000)
       │
       ▼ (Internal HTTP)
[FastAPI AI Service] (Port 8000) ──> [ChromaDB + Groq LLM]
```

### Endpoints proxied to FastAPI:
1. **Paper Ingestion & Embedding (`POST /process-paper`)**:
   - When a user uploads a PDF via `POST /api/papers/upload`, the Express backend saves the PDF to `uploads/` and immediately creates a paper document with `status: "UPLOADING"`.
   - In the background, `aiService.processPaperAsync` forwards the file/path to the FastAPI service at `${AI_SERVICE_URL}/process-paper`.
   - FastAPI extracts sections, generates multi-level summaries, flashcards, quizzes, and stores embeddings in ChromaDB.
   - Once complete, Express updates the paper's status to `"READY"` (or `"FAILED"` on fatal error).
2. **RAG Grounded Chat (`POST /chat`)**:
   - `POST /api/ai/chat` forwards `{ paperId, query }` to `${AI_SERVICE_URL}/chat`.
   - FastAPI retrieves top-k matching chunks from ChromaDB and invokes the LLM.
   - Returns `{ text, source, sourceId, time }` which Express forwards directly to the frontend.

> **Resilient Fallback**: If the FastAPI service is not running or unreachable during early development, the backend automatically provides intelligent contextual synthesis from the paper's saved metadata so that the UI continues to function without errors.

---

## 📡 API Contract Specification

All endpoints are prefixed with `/api`.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account (`{ name, email, password, role }`) | No |
| `POST` | `/api/auth/login` | Login user (`{ email, password }`) | No |
| `GET` | `/api/auth/profile` | Get current authenticated user profile | Bearer JWT |

### Papers (`/api/papers`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/papers` | Get user's papers + public demo papers | Optional |
| `GET` | `/api/papers/:id` | Get paper by Mongo `_id` or custom slug ID | No |
| `POST` | `/api/papers/upload` | Upload PDF (field `paper`) or URL (field `url`) | Optional |
| `DELETE` | `/api/papers/:id` | Delete paper and associated PDF from disk | Optional |

### AI / RAG Chat (`/api/ai`)
| Method | Endpoint | Description | Payload |
|---|---|---|---|
| `POST` | `/api/ai/chat` | Ask question grounded in a paper | `{ paperId, query }` |
