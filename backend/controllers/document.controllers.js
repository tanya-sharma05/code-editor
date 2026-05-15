import { document } from "../models/document.models";

export const createDocument = async (req, res ) => {
    try {
        const {title} = req.body;

        const document = await Document.create({
            title: title || "Untitled Document", 
            owner: req.user._id,
            collaborators: [] 
        });

        res.status(201).json(document);
    } 
    catch (error) {
        res.status(500).json({message: "Server error"});
    }
};

export const getUserDocuments = async (req, res) => {
    try {
        const documents = await document.find({
            $or: [
                {owner: req.user._id}, 
                {collaborators: req.user._id}
            ]
        }).sort({updatedAt: -1});

        res.status(200).json(documents);
    } 
    catch (error) {
        res.status(500).json({ message: "Server error"});
    }
}

export const addCollaborator = async (req, res) => {
    try {
        const {documentId} = req.params;
        const collaboratorId = req.user._id;

        const doc = await document.findById(documentId);
        if(!doc){
            return res.status(404).json({message: "Document not found"});
        }

        if(doc.owner.toString() === collaboratorId.toString()){
            return res.status(200).json({message: "User is the owner"});
        }

        await document.findByIdAndUpdate(documentId, {
            $addToSet: {collaborators: collaboratorId}
        });

        res.status(200).json({ message: "Collaborator added successfully"});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
};