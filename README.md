# AI-Powered Real-Time Collaborative Editor

A high-performance, real-time collaborative code editor built on the MERN stack, featuring a secure multi-user environment and an integrated AI assistant for on-demand code explanation and debugging.

---

## ✨ Key Features

-   **Real-Time Collaboration Engine:** Synchronizes code and user presence instantly across multiple clients using a stateful WebSocket server, achieving sub-150ms latency for a seamless pair programming experience.

-   **Secure Multi-User Environment:** Implements a robust authentication system using JSON Web Tokens (JWTs) with protected routes, ensuring that only authorized users can access and modify documents.

-   **Personalized User Dashboard:** Provides each user with a dedicated dashboard to create, view, and manage all documents they own or have been invited to collaborate on.

-   **AI-Powered Code Analysis:** Integrates the Google Gemini API to offer on-demand code explanation and debugging. Utilizes advanced prompt engineering to enforce a strict JSON-only response format for reliable, automated analysis.

-   **Hybrid State Management & Persistence:** Employs a hybrid state model, managing active session data in-memory for high-speed broadcasts while ensuring data durability with an automated save-on-session-end strategy to MongoDB.

---

## 🛠️ Tech Stack

| Category     | Technologies                                                              |
| :----------- | :------------------------------------------------------------------------ |
| **Frontend** | `React.js` `Vite` `Socket.IO Client` `React Router` `Axios` `Monaco Editor`    |
| **Backend** | `Node.js` `Express.js` `Socket.IO` `MongoDB` `Mongoose` `JWT` `Gemini API` |
| **Deployment** | `Vercel` (Frontend) & `Railway` (Backend)                                 |

---

## 🌊 Workflow

1.  **Authentication:** Users can register for a new account or log in to their existing one. The system uses a secure JWT-based flow.
2.  **Dashboard:** Upon logging in, the user is greeted with a personal dashboard that lists all documents they either own or are a collaborator on.
3.  **Document Creation:** From the dashboard, a user can create a new document by providing a title in a pop-up modal.
4.  **Joining a Document:** A user can join an existing session by entering the unique Document ID on their dashboard. The system then registers them as a collaborator.
5.  **Real-Time Editing:** Inside the editor, all changes to the code are broadcast to all connected clients in real-time. The list of active users is always visible.
6.  **AI Assistance:** A user can highlight any block of code and click the "Explain / Debug" button. An AI-powered panel will then provide a detailed explanation, identify potential bugs, and suggest fixes.

---

## 📖 API Endpoints

The backend provides a RESTful API for managing users and documents. All protected routes require a `Bearer` token in the `Authorization` header.

### Authentication (`/api/auth`)

| Method | Endpoint    | Description           | Access |
| :----- | :---------- | :-------------------- | :----- |
| `POST` | `/register` | Registers a new user. | Public |
| `POST` | `/login`    | Authenticates a user. | Public |

### Documents (`/api/docs`)

| Method | Endpoint                     | Description                                  | Access    |
| :----- | :--------------------------- | :------------------------------------------- | :-------- |
| `POST` | `/`                          | Creates a new document.                      | Protected |
| `GET`  | `/`                          | Fetches all documents for the logged-in user. | Protected |
| `POST` | `/:documentId/collaborators` | Adds the current user as a collaborator.     | Protected |

### AI Service (`/api/ai`)

| Method | Endpoint   | Description                              | Access    |
| :----- | :--------- | :--------------------------------------- | :-------- |
| `POST` | `/explain` | Explains/debugs a provided code snippet. | Protected |

---

## 🏛️ Project Learnings & Key Takeaways

This project demonstrates a comprehensive understanding of full-stack development and several advanced software engineering concepts.

-   **Full-Stack Development (MERN):** Built a complete, end-to-end application using the MERN stack (MongoDB, Express.js, React.js, Node.js) with a professional monorepo structure.

-   **Real-Time Systems Architecture:** Engineered a stateful backend with Socket.IO to manage persistent WebSocket connections, a fundamental requirement for any real-time application.

-   **AI Integration & Prompt Engineering:** Successfully integrated a powerful generative AI (Gemini API) and implemented a strict, product-focused prompting strategy to ensure a reliable and predictable JSON-only data contract.

-   **Secure Authentication & Authorization:** Implemented a robust, token-based (JWT) authentication system with custom middleware to protect API routes and manage user access control.

-   **Cloud Deployment & CI/CD:** Deployed a complex, multi-service application to modern cloud platforms (Vercel and Railway), demonstrating an understanding of environment variables, CORS, and automated deployments from a Git repository.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm & Git
-   A MongoDB Atlas account
-   A Google AI API Key

### Setup and Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/.git](https://github.com.git)
    cd CodeCollabPro
    ```

2.  **Install Backend Dependencies:**
    ```sh
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```sh
    cd ../frontend
    npm install
    ```

### Environment Variables

You will need to create a `.env` file in both the `frontend` and `backend` directories.

**Backend (`/backend/.env`):**

PORT=5001

MONGO_URI=<YOUR_MONGODB_ATLAS_URI>

JWT_SECRET=<YOUR_JWT_SECRET>

GEMINI_API_KEY=<YOUR_GOOGLE_GEMINI_API_KEY>

CORS_ORIGIN=http://localhost:5173


**Frontend (`/frontend/.env`):**

VITE_BACKEND_URL=http://localhost:5001


### Available Scripts

-   **To run the backend server:**
    ```sh
    # From the /backend directory
    npm start
    ```

-   **To run the frontend development server:**
    ```sh
    # From the /frontend directory
    npm run dev
    ```
