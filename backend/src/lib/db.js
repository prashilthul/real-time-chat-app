import mongoose from "mongoose"

export const connectDB = async () =>
{
    try
    {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`mongodb conneted ${conn.connection.host}`)
    } catch (error)
    {
        console.log(`error connecting to the db `, error)
    }
} 