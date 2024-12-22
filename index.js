import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRouter from './routes/user.route.js';
import companyRouter from "./routes/company.route.js";
dotenv.config({})

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true,
}
app.use(cors(corsOptions));

//////// apis
app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})
