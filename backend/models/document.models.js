import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: "Untitled document"
        }, 
        content: {
            type: String,
            default: "// Start coding here!",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }, 
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        ]
    }, 
    {
        timestamps: true
    }
);

export const document = mongoose.model("Document", documentSchema);
