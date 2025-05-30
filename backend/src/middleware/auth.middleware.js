import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) =>
{
    try
    {
        const token = req.cookie.jwttoken
        if (!token)
        {
            return res.status(401).json({message: "unathorised - no token given"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!decoded)
        {
            return res.status(401).json({message: "unathorised - no token given"})
        }
        const user = await User.findById(decoded.userId).select(-"password")//select everything part from password

        if (!user)
        {
            return res.status(404).json({message: "User not found"})
        }

        req.user = user
        next()


    } catch (error) {console.log(`error in auth middleware `, error)}
}

