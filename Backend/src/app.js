import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";
import path from "path";
import fs from "fs";

const app = express();

const __dirname = path.resolve();

app.use(cors({
    origin: [
      "http://localhost:5173",
       "https://perplexity-rf72.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);


const frontendPath = path.join(__dirname, "../Frontend/dist");

app.use(express.static(frontendPath));

app.use((req, res, next) => {
  // ✅ ONLY handle non-API routes
  if (req.path.startsWith("/api")) {
    return next(); // let Express handle API
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});
export default app;
