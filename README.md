# CodeHive — Real-Time Collaborative Code Editor

A full-stack, multiplayer code editor where developers can write, run, and debug code together in real time. Built with React + Vite on the frontend and Node.js + Express + Socket.IO on the backend, with MongoDB for persistence and Gemini AI for intelligent code explanation.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔴 **Real-Time Collaboration** | Multiple users can edit the same document simultaneously via Socket.IO WebSockets |
| 🧑‍💻 **Monaco Editor** | VS Code's editor engine with syntax highlighting, ligatures, minimap, and smooth scrolling |
| ▶ **Code Execution** | Run code in 15+ languages using the Judge0 API — see stdout, stderr, compile errors, execution time, and memory usage |
| 🤖 **AI Code Explanation** | Select any code snippet and get an instant AI-powered explanation, bug detection, corrected code, and key concepts using Gemini 2.5 Flash |
| 🔐 **JWT Authentication** | Secure register/login flow with bcrypt password hashing and JWT-protected routes |
| 📄 **Document Management** | Create named documents, join others by Document ID, and view all owned/collaborated documents from a dashboard |
| 💾 **Smart Write-Back Caching** | Code changes are buffered in server RAM (not written to MongoDB on every keystroke). The final state is persisted to MongoDB only when the last editor leaves the room |
| 👥 **Live Collaborator List** | See who is currently editing the document in real time via the sidebar |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **Monaco Editor** (`@monaco-editor/react`) — the editor core
- **Socket.IO Client** — real-time WebSocket communication
- **React Router DOM v7** — client-side routing
- **Axios** — HTTP requests
- **react-hot-toast** — toast notifications
- **react-markdown** — renders AI markdown responses
- **react-avatar** — user avatars in the collaborator sidebar

### Backend
- **Node.js** + **Express 5**
- **Socket.IO 4** — WebSocket server
- **Mongoose + MongoDB** — database and ORM
- **JWT + bcryptjs** — authentication and password hashing
- **@google/genai** (Gemini 2.5 Flash) — AI code explanation
- **Axios** — calls to Judge0 code execution API
- **dotenv** + **nodemon**

---

## 📁 Project Structure

```
ce/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── ai.controllers.js      # Gemini AI explain endpoint
│   │   ├── code.controllers.js    # Judge0 code execution
│   │   ├── document.controllers.js# CRUD for documents
│   │   └── user.controllers.js    # Register & Login
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── document.models.js     # Document schema (title, content, owner, collaborators)
│   │   └── user.models.js         # User schema (name, email, password hash, JWT generation)
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── code.routes.js
│   │   ├── document.routes.js
│   │   └── user.routes.js
│   ├── socket/
│   │   └── index.js               # Socket.IO event handlers (join, sync, disconnect, write-back)
│   ├── .env
│   ├── index.js                   # Express + HTTP server + Socket.IO bootstrap
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Client.jsx          # Single collaborator avatar + name
    │   │   ├── Editor.jsx          # Monaco editor with socket sync
    │   │   ├── ExplainationPanel.jsx # AI response panel
    │   │   ├── Logo.jsx
    │   │   ├── Modal.jsx           # Create document modal
    │   │   └── OutputTerminal.jsx  # Code execution output terminal
    │   ├── pages/
    │   │   ├── DashboardPage.jsx   # Document list, create, join
    │   │   ├── EditorPage.jsx      # Main editor page with sidebar
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── socket.js               # Socket.IO client init
    │   ├── App.jsx                 # Routes
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gemini API key ([Google AI Studio](https://aistudio.google.com/))

---

### 1. Clone the repository

```bash
git clone https://github.com/tanya-sharma05/code-editor.git
cd code-editor
```

---

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net
JWT_SECRET_KEY=your_strong_secret_key
JWT_SECRET_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore`.

Start the backend:

```bash
npm start
```

The server starts on `http://localhost:3000`.

---

### 3. Configure the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The app opens at `http://localhost:5173`.

---

## 🚀 Usage

1. **Register** a new account or **Login** with existing credentials.
2. From the **Dashboard**, create a new document (give it a title) or join an existing one by pasting its Document ID.
3. Inside the **Editor**:
   - Start typing — changes sync instantly to all connected collaborators.
   - Select a **language** from the dropdown (JavaScript, Python, Java, C++, Go, Rust, and more).
   - Click **▶ Run Code** to execute and see results in the output terminal.
   - **Select** any code snippet and click **Debug/Explain with AI** for an AI-powered breakdown.
   - Click **Copy Doc ID** and share it with teammates so they can join your session.
   - Click **Leave Room** to go back to the dashboard.

---

## 🔌 API Reference

### Auth Routes — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login and receive a JWT token |

### Document Routes — `/api/docs` *(JWT required)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all documents owned by or shared with the user |
| `POST` | `/` | Create a new document |
| `POST` | `/:documentId/collaborators` | Join a document as a collaborator |

### AI Routes — `/api/ai` *(JWT required)*
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/explain` | `{ code: string }` | Explain, debug, and analyse a code snippet using Gemini |

### Code Execution Routes — `/api/code` *(JWT required)*
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/run` | `{ code: string, language: string }` | Execute code via Judge0 and return stdout/stderr/status |

---

## 🔌 Socket.IO Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `join-document` | Client → Server | `{ documentId, username }` | Join a document room; receive current content |
| `send-changes` | Client → Server | `{ documentId, content }` | Broadcast code change to other users in the room |
| `receive-changes` | Server → Client | `content` (string) | Receive latest code from another collaborator |
| `update-client-list` | Server → Client | `[{ socketId, username }]` | Updated list of active users in the room |

---

## 💡 Architecture Highlights

### Write-Back Caching Strategy
To avoid hammering MongoDB on every keystroke, the server maintains an in-memory `Map` (`documentStates`) keyed by `documentId`. All real-time edits are stored in RAM. The final document content is only written to MongoDB when the **last user disconnects** from a room — using Socket.IO's `disconnecting` event (which fires before the socket leaves its rooms).

```
User typing → documentStates (RAM) → broadcast to room peers
                                          ↓ (on last user disconnect)
                                       MongoDB write-back
```

### Remote Change Guard
The `Editor` component uses an `isRemote` ref flag. When incoming socket changes trigger `editor.setValue()`, the flag is set to `true` to prevent that programmatic update from being re-emitted back to the server as a user change — avoiding infinite sync loops.

---

## 🌐 Supported Languages (Code Execution)

JavaScript, TypeScript, Python, Java, C++, C, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, Bash/Shell, SQL

---

## 🔮 Future Improvements

- [ ] Cursor and selection position sync per collaborator (Operational Transformation / CRDT)
- [ ] Persistent code execution history per document
- [ ] Document rename and delete
- [ ] User profile and avatar customization
- [ ] Light/dark theme toggle
- [ ] Export document as a file

---

## 👩‍💻 Author

**Tanya Sharma** — [GitHub](https://github.com/tanya-sharma05)