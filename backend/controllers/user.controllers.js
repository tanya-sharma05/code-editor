import { User } from "../models/user.models.js";

// Function to register a user
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // If any field is missing, throw error
        if([name, email, password].some((field) => (field?.trim() === ""))){
            throw new ApiError(400, "All fields are required!");
        }

        // Check if a user already exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        // Create a user and hide its password
        const user = await User.create({name, email, password});
        user.password = undefined;
        
        res.status(201).json({message: "User created successfully!", user});
    } 
    catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// Function to login a user 
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if([email, password].some((field) => (field?.trim() === ""))){
            throw new ApiError(400, "All fields are required!");
        }

        // If user not found, then throw error
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User does not exists!"});
        }

        // Check if user's password is matching with the database password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        const token= user.generateToken();
        user.password= undefined;

        return res.status(200).json({message: "User logged in successfully!",token,user});   
    } 
    catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}
