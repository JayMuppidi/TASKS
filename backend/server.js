import express from 'express'
import connectDB from './utils/connectDB.js'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors());

connectDB()
app.get('/',(req,res) => {
    res.send('Hello World')
});
const PORT = process.env.port|| 8000;
app.listen( PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})