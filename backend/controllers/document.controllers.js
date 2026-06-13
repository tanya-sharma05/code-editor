import { document } from "../models/document.models.js";

// Function to create a new document 
export const createDocument = async (req, res ) => {
    try {
        const {title} = req.body;

        const doc = await document.create({
            title: title || "Untitled Document", 
            owner: req.userId, // comes from middleware
            collaborators: [] 
        });

        res.status(201).json(doc);
    } 
    catch(error) {
        res.status(500).json({message: "Server error"});
    }
};

// Function to get all the User documents 
export const getUserDocuments = async (req, res) => {
    try {
        const documents = await document.find({
            $or: [
                {owner: req.userId}, 
                {collaborators: req.userId}
            ]
        }).sort({updatedAt: -1}); // sorted in order of time 

        res.status(200).json(documents);
    } 
    catch(error) {
        res.status(500).json({ message: "Server error"});
    }
}

// Function to add a collaborator 
export const addCollaborator = async (req, res) => {
    try {
        const {documentId} = req.params;
        const collaboratorId = req.userId; // comes from middleware

        // find document by id taken from url params
        const doc = await document.findById(documentId);
        if(!doc){
            return res.status(404).json({message: "Document not found"});
        }

        if(doc.owner.toString() === collaboratorId.toString()){
            return res.status(200).json({message: "User is the owner"});
        }

        // find document and set its collaborator to new collaborator id
        await document.findByIdAndUpdate(documentId, {
            $addToSet: {collaborators: collaboratorId}
        });

        res.status(200).json({ message: "Collaborator added successfully"});
    } 
    catch(error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
};