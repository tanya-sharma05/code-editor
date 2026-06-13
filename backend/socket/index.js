import { document } from "../models/document.models.js";

// Stores which socket ID belongs to which username
const userSocketMap = {};

// Stores currently active documents in RAM memory
// Instead of saving every small change directly to MongoDB, we temporarily keep latest document states here
const documentStates = new Map();


// Function to get all users currently connected inside a document room
function getClientsInRoom(io, documentId) {
    const socketIds = io.sockets.adapter.rooms.get(documentId) || new Set();

    // Convert socket ids into user objects
    return Array.from(socketIds).map(socketId => ({
        socketId,
        username: userSocketMap[socketId],
    }));
}


// Exporting function which initializes socket server
// io = main Socket.IO server instance
export const initSocket = (io) => {
    // Runs whenever a new user connects
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);


        // Listening for join-document event from frontend
        socket.on('join-document', async ({documentId, username}) => {
            // Variable storing current document content
            let currentCode = "";

            // First check if document already exists in memory means someone is already editing this file
            if(documentStates.has(documentId)) {
                // Get latest version from RAM
                currentCode = documentStates.get(documentId);
            } 
            else {
                const doc = await document.findById(documentId);
                if(doc) {
                    // Store database content
                    currentCode = doc.content;
                    // Cache it into RAM
                    documentStates.set(documentId, currentCode);
                }
            }

            // Store connected user's username
            userSocketMap[socket.id] = username;
            // Add this socket/user into document room
            socket.join(documentId);
            console.log(`User ${username} (${socket.id}) joined room ${documentId}`);

            // Get all users currently inside document
            const clients = getClientsInRoom(io, documentId);

            // Send updated active users list to everyone inside the room
            io.to(documentId).emit("update-client-list", clients);

            // Send current document content ONLY to newly joined user
            socket.emit("receive-changes", currentCode);
        });


        // Runs whenever frontend sends new code changes
        socket.on("send-changes", ({documentId, content}) => {
            // Save latest code in memory not MongoDB yet
            documentStates.set(documentId, content);

            // Send changes to everyone else inside same document room except sender
            socket.to(documentId).emit("receive-changes",content);
        });



        // disconnecting fires BEFORE user leaves rooms
        socket.on("disconnecting", async () => {
            // Get all rooms user currently belongs to
            const rooms = Array.from(socket.rooms);

            for(const documentId of rooms) {
                // Ignore personal socket room
                if(documentId !== socket.id) {
                    // Get remaining clients after removing current disconnecting user
                    const clients = getClientsInRoom(io,documentId)
                                            .filter((c) => c.socketId !== socket.id);

                    // If no users are left means last editor closed document
                    if(clients.length === 0) {
                        // Check if document exists in memory
                        if(documentStates.has(documentId)) {

                            try {
                                // Get latest code
                                const finalContent = documentStates.get(documentId);
                                // Save final version into MongoDB
                                await document.findByIdAndUpdate(documentId, {
                                        content: finalContent
                                    }
                                );
                                // Remove document from RAM because nobody is editing now
                                documentStates.delete(documentId);

                                console.log(`Document ${documentId} saved to DB.`);
                            } 
                            catch(err) {
                                console.error("Failed to save document:", err);
                            }
                        }
                    } 
                    else {
                        io.to(documentId).emit("update-client-list",clients);
                    }
                }
            }
            // Remove disconnected user's username mapping
            delete userSocketMap[socket.id];
        });


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};