import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true 
        },
        email: {
            type: String,
            required: true,
            unique: true 
        },
        password: {
            type: String,
            required: true 
        }
    }, 
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }

    this.password= await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken= function () {
    return jwt.sign(
        { // payload 
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.JWT_SECRET_KEY, 
        {expiresIn: process.env.JWT_SECRET_EXPIRES_IN}
    );
};

export const User = mongoose.model("user", userSchema);
