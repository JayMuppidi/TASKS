import express from 'express'
import connectDB from './utils/connectDB.js'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
const app = express()

app.use(express.json())
app.use(cors());
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);

connectDB()
const PORT = process.env.port|| 8000;
app.listen( PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})