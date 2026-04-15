# 🚀 Perplexity AI Clone – Full Stack AI Search Engine

An advanced AI-powered search assistant inspired by Perplexity AI, built using modern full-stack technologies and multiple LLM integrations.
It delivers real-time, context-aware answers by combining search APIs with powerful AI models.

🔗 **Live Demo:** https://perplexity-rf72.onrender.com
👨‍💻 **Author:** Vivek Channe
🔗 **LinkedIn:** https://www.linkedin.com/in/vivek-channe

---

# 📌 Overview

This project is a Perplexity-style AI search engine that integrates:

* 🔍 Real-time web search (Tavily API)
* 🤖 Multiple LLMs (Gemini + Mistral)
* 🧠 LangChain for orchestration
* 🔐 Secure authentication system
* ⚡ Redis-based session management

The system combines search + AI reasoning to generate accurate and contextual answers.

---

# ✨ Features

## 🔍 AI Search Engine

* Real-time search using Tavily API
* Context-aware AI responses
* Intelligent query handling

## 🤖 Multi-Model AI Support

* Gemini AI
* Mistral AI
* Optimized response generation

## 🔐 Authentication System

* JWT-based authentication
* Google OAuth login
* Protected routes

## 📩 Email Verification

* Email sent after registration
* Token-based verification
* Prevents fake accounts

## ⚡ Redis Session Management

* Stores active sessions
* Instant logout system
* Improved performance

---

# ⚙️ Tech Stack

## 🧠 AI & APIs

* LangChain
* Gemini AI API
* Mistral AI API
* Tavily Search API

## 🗄️ Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## 🔐 Authentication & Security

* JWT (JSON Web Tokens)
* Google OAuth 2.0
* Email verification (Gmail API)

## ⚡ Performance

* Redis (Session Store)

---

# 🏗️ Architecture

```
User Query
↓
Frontend (UI)
↓
Backend API (Node.js)
↓
LangChain Processing
↓
┌───────────────┬───────────────┐
│               │               │
Tavily API   Gemini API   Mistral API
│               │               │
└───────────────┴───────────────┘
↓
Final AI Response
↓
Frontend Display
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory:

```

# Server

PORT=5000

# Database

MONGO_URI=

# Google OAuth / Email

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_USER=

# Authentication

JWT_SECRET=

# AI APIs

GEMINI_API_KEY=
MISTRAL_API_KEY=

# Search API

TAVILY_API_KEY=

# Redis

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
```

---

# 🚀 Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/vivekchanne06-web/Perplexity.git
cd Perplexity
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Setup Environment Variables

Create `.env` file and add required keys

## 4️⃣ Run Development Server

```bash
npm run dev
```

---

# 🔐 Authentication Flow

```
User Signup
↓
Verification Email Sent
↓
User Clicks Verification Link
↓
Account Verified
↓
Login → JWT Issued
↓
Session Stored in Redis
```

---

# 🧠 AI Pipeline

```
User Query
↓
LangChain Processing
↓
Tavily → Fetch real-time data
↓
Gemini / Mistral → Generate response
↓
Formatted Answer
↓
Frontend Display
```

---

# ⚡ Redis Session Management

* Stores active sessions
* Enables instant logout
* Prevents token reuse
* Faster than database lookups

---

# 📂 Project Structure

```
/client             # Frontend
/server             # Backend
├── models        # Mongoose schemas
├── routes        # API routes
├── controllers   # Business logic
├── middleware    # Auth middleware
├── utils         # Helper functions
└── config        # DB & Redis setup
```

---

# 🔗 API Overview

## Auth Routes

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/verify-email

## AI Routes

* POST /api/ai/query

## User Routes

* GET /api/user/profile

---

# 🌍 Deployment

* Hosted on Render
* https://perplexity-rf72.onrender.com

---

# 🛠️ Future Improvements

* Chat memory (conversation history)
* AI analytics dashboard
* Multi-language support
* Source citations
* Mobile UI improvements

---

# 🧠 Learning Highlights

* Full-stack system design
* AI integration with real applications
* Authentication & security practices
* Scalable backend architecture
* API orchestration using LangChain

---

# 👨‍💻 Author

**Vivek Channe**

* LinkedIn: https://www.linkedin.com/in/vivek-channe

----
* GitHub: https://github.com/vivekchanne06-web

---

# ⭐ Support

If you like this project:

* Star the repository
* Fork it
* Contribute

---

# 📜 License

This project is licensed under the MIT License
