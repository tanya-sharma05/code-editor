import jwt from "jsonwebtoken";

const verifyUser= async(req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){ // you are not logged in
        return res.status(401).json({message:"Unauthorized"});
    }

    try{ // verify user
        const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId= decoded._id; // Injecting authenticated user info into the request object
        next();
    } 
    catch(error) {
        return res.status(401).json({message:"Error in fetching user details"});
    }
};

export default verifyUser;
