import { document } from "../models/document.models.js";

// Socket.IO connection logic
const userSocketMap = {};
const documentStates = new Map();

function getClientsInRoom(documentId) {
    const socketIds = io.sockets.adapter.rooms.get(documentId) || new Set();
    return Array.from(socketIds).map(socketId => ({
        socketId,
        username: userSocketMap[socketId],
    }));
}

export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join-document', async ({ documentId, username }) => {
            // Load document from memory if active, otherwise from DB
            let currentCode = "";
            if(documentStates.has(documentId)) {
                currentCode = documentStates.get(documentId);
            } 
            else {
                const doc = await document.findById(documentId);
                if(doc) {
                    currentCode = doc.content;
                    documentStates.set(documentId, currentCode);
                }
            }

            // Handles user joining 
            userSocketMap[socket.id] = username;
            socket.join(documentId);
            console.log(`User ${username} (${socket.id}) joined room ${documentId}`);

            // Broadcast updated client list to everyone in the room
            const clients = getClientsInRoom(documentId);
            io.to(documentId).emit("update-client-list", clients);

            // Send current code only to the newly joined user
            socket.emit("receive-changes", currentCode);
        });

        socket.on("send-changes", ({ documentId, content }) => {
            documentStates.set(documentId, content);
            // Broadcast to everyone else sender already has the update
            socket.to(documentId).emit("receive-changes", content);
        });
        
        socket.on("disconnecting", async () => {
            const rooms = Array.from(socket.rooms);
            for(const documentId of rooms) {
                if(documentId !== socket.id) {
                    const clients = getClientsInRoom(documentId).filter(
                        (c) => c.socketId !== socket.id
                    );

                    // Last user left, save the document to DB
                    if(clients.length === 0) {
                        if(documentStates.has(documentId)) {
                            try {
                                const finalContent = documentStates.get(documentId);
                                await Document.findByIdAndUpdate(documentId, {content: finalContent});
                                documentStates.delete(documentId);
                                console.log(`Document ${documentId} saved to DB.`);
                            } 
                            catch(err) {
                                console.error("Failed to save document:", err);
                            }
                        }
                    } 
                    else {
                        io.to(documentId).emit("update-client-list", clients);
                    }
                }
            }
            delete userSocketMap[socket.id];
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
