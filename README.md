 Demo

https://github.com/user-attachments/assets/87af0c5a-2a9f-48de-b809-8e0a970c6569

# NEXORA — Full-Stack AI Chat Application

NEXORA is a modern full-stack AI chat application designed to provide an intelligent and seamless conversational experience. It allows users to securely authenticate, create conversations, interact with an AI model, and access their previous chat history.

The application is built with a scalable frontend-backend architecture and integrates LLM-based responses with external web search capabilities to provide more useful and up-to-date answers.

## ✨ Features

- 🔐 **User Authentication** — Secure registration, login, email verification, and protected routes.
- 💬 **AI Conversations** — Chat with an AI model through a clean and responsive interface.
- 🗂️ **Persistent Chat History** — Conversations and messages are stored and can be accessed later.
- 🏷️ **Automatic Chat Titles** — Generates meaningful titles for conversations based on the initial prompt.
- 🌐 **Web Search Integration** — Uses Tavily to fetch relevant information from the web when required.
- ⚡ **Real-Time Communication** — Socket-based communication for a smoother chat experience.
- 🧠 **LLM Integration** — Uses modern LLM APIs to generate contextual AI responses.
- 🛡️ **Protected Backend APIs** — Authentication middleware protects user-specific resources.
- 📱 **Responsive UI** — Designed for a polished experience across different screen sizes.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Redux Toolkit
- Axios
- React Router
- Socket.IO Client

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO

**AI & External Services**
- LLM API
- LangChain
- Tavily Search API
- Nodemailer

## 🏗️ Architecture

NEXORA follows a client-server architecture where the React frontend communicates with the Express.js backend through REST APIs and real-time Socket.IO connections.

The backend handles authentication, chat management, message persistence, AI response generation, and external web-search integration, while MongoDB stores users, conversations, and messages.

## 🚀 Core Workflow

```text
User
 ↓
React Frontend
 ↓
Express.js API
 ↓
Authentication Middleware
 ↓
Chat / Message Service
 ↓
LLM + Tavily Search
 ↓
AI Response
 ↓
MongoDB
 ↓
Frontend
```

## 🎯 Project Goal

The goal of NEXORA is to understand and implement the architecture behind a production-style AI application rather than simply creating a basic chatbot. The project focuses on authentication, API design, database relationships, state management, real-time communication, LLM integration, and external tool usage in a single full-stack application.
