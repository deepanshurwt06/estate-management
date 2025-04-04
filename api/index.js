import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import listingRoute from "./routes/listing.route.js";

dotenv.config();
import cookieParser from "cookie-parser";
import path from "path";

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.listen(3000, () => {
  console.log("server is running on port 3000");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*',(req,res) => {
  res.sendFile(path.join(__dirname, 'client','dist', 'index.html'))
});

// middleware used to handle errors in the application

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      Success :false,
      error : message,
      statusCode,
    });
})