import { User } from "../models/user.models.js";

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if([name, email, password].some((field) => (field?.trim() === ""))){
            throw new ApiError(400, "All fields are required!");
        }

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        const user = await User.create({name, email, password});
        user.password = undefined;
        
        res.status(201).json({message: "User created successfully!", user});
    } 
    catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if([email, password].some((field) => (field?.trim() === ""))){
            throw new ApiError(400, "All fields are required!");
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User does not exists!"});
        }

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