import express from 'express'
import connectDB from './utils/connectDB.js'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import taskRoutes from './routes/tasks.js'
import tagRoutes from './routes/tags.js'
const app = express()

app.use(express.json())
app.use(cors());
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/tasks',taskRoutes);
app.use('/api/tags',tagRoutes);
connectDB()
const PORT = process.env.port|| 8000;
app.listen( PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})