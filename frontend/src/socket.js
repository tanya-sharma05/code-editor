import { io } from 'socket.io-client';

// Exporting a function so other React components can call it whenever they need a socket connection
export const initSocket = async () => {

  // Socket connection configuration object
  const options = {
    // Creates a completely new socket connection every time instead of reusing an old existing connection
    'force new connection': true,
    // Number of times socket should try reconnecting if connection is lost
    reconnectionAttempts: 'Infinity', 
    // Maximum time to wait while trying to connect (10 seconds)
    timeout: 10000, 
    // Decide which transport method Socket.IO uses
    // By default socket.io starts with HTTP polling then upgrades to websocket
    // Here we force it to directly use websocket
    // Websocket gives full duplex realtime communication
    transports: ['websocket'],
  };

  // Create connection with backend server
  return io(import.meta.env.VITE_BACKEND_URL, options);
};