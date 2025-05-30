import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"


export const signup = async (req, res) =>
{
    const {fullName, email, password} = req.body
    try
    {
        if (!fullName || !password || !email)
        {
            res.status(400).json({message: "All feild are neeeded"})
        }
        if (password.length < 6)
        {
            res.status(400).json({message: "Password msut be atleast 6 chars"})
        }

        const user = await User.findOne({email})
        if (user) res.status(400).json({message: "user alraedy exist"})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })



        if (newUser)
        {
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

        } else
        {
            res.status(400).json({message: "Invalid user data"})
        }

    } catch (error)
    {
        console.log(`error in the signup controller`, error)
    }

}
export const login = async (req, res) =>
{
    try
    {
        const {email, password} = req.body
        if (!email || !password)
        {
            return res.status(400).json({message: "All feild are needed"})
        }
        const user = await User.findOne({email});
        if (!user)
        {
            return res.status(401).json({message: "Invalid email or password"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password
        )

        if (!isPasswordCorrect) return res.status(401).json({message: "Invalid email or password"})

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,

        })


    } catch (error)
    {
        console.log("error in the login controller", error.message)
        res.status(500).json({message: "Internal server error"})
    }

}
export const logout = (req, res) =>
{
    try
    {
        res.clearCookie("jwttoken")
        res.status(200).json({success: true, message: "Logout successfull"})
    } catch (error)
    {
        console.log(`error in logout controller`, error)
        res.status(500).json({message: "Internal server error"})

    }


}


export const updateProfile = async (req, res) =>
{
    try
    {
        const {profilePic} = req.body
        const userId = req.user._id
        if (!profilePic)
        {
            res.status(400).json({message: "profile pic is needed"})
        }

        const uploadResponse = cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: (await uploadResponse).secure_url}, {new: true})


        res.status(200).json(updatedUser)
    } catch (error)
    {
        console.log("error in update profile", error)
    }
}