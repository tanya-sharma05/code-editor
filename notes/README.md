## Development Journey 🚀

Started the project by creating two separate folders: `backend` for the backend and `frontend` for the frontend. Initialized the backend using `npm init -y` and created the frontend using `npm create vite@latest`.

The backend development started by creating the `index.js` file, where the Express server was configured and connected with the database. A separate `config/db.js` file was created for managing the database connection. After setting up the server, the user authentication system was developed by creating the User model, controller, and routes. Authentication functionalities like user registration and login were implemented using JWT. A middleware file was also created to protect private routes.

After completing authentication, the Document model, controller, and routes were created to manage collaborative documents. Then the AI functionality was added by creating an AI controller and route, integrating Google GenAI to provide code explanation features.

Frontend development started by creating the required components and pages folder structure along with configuring `main.jsx` and `App.jsx`. A Logo component was created first, followed by the Register and Login pages. After designing the UI, form handling was added using Axios requests with proper try-catch blocks and toast notifications.

Next, the Dashboard functionality was implemented. Documents were fetched using `useEffect`, followed by creating functions for creating new documents and joining existing documents. A reusable Modal component was also developed for handling user interactions.

After completing the dashboard, the main editor functionalities were developed. Components like Client, AI Explanation Panel, and Monaco Editor were created and integrated with the Editor Page. Features like language selection, code editing, and selecting code for AI explanation were added.

For real-time collaboration, a separate `socket/index.js` file was created in the backend to set up the Socket.IO server with different socket events. The frontend socket configuration was created using a `socket.js` file, successfully connecting the frontend and backend through WebSockets.

After the socket connection was completed, collaborative features were added in the Editor Page, including displaying connected users using socket IDs, copying document IDs, and handling AI explanations by getting selected code from the Monaco Editor component. The AI explanation feature was completed successfully.

The final major feature implemented was code execution. Judge0 API was integrated by creating a Code controller and route in the backend and updating the main backend server file. On the frontend, the `handleRunCode` function was added in the Editor Page, and changes were made in the Editor component to get the current code value.

Finally, the Output Terminal component was updated to display execution results, loading states, and errors properly. Final styling improvements were made in `index.css`, completing all major features before deployment.
