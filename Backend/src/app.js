import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

app.use(express.static(path.join(__dirname, "../Frontend/dist")));


app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});

export default app;
