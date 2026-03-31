import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authMiddleware from "./Middleware/authMiddleware.js";

import { route } from "./Routes/route.js";
import "dotenv/config";
import connectDB from "./Db/index.js";

const server = express();
const PORT = process.env.PORT || 8000;
// server.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Specify frontend URL
//     credentials: true, // Allow cookies to be sent
//     allowedHeaders: ["Content-Type", "Authorization"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

server.use(cors(corsOptions));

server.use(cookieParser());
server.use(express.json({ limit: "16kb" }));
server.use(express.urlencoded({ extended: true }));

// connect to db:
connectDB()
  .then(() => {
    // starting the server
    server.listen(PORT, () => {
      console.log("Server is running at " + PORT);
    });
  })
  .catch((error) => {
    console.log("Error connecting::index.js", error);
  });

server.use("/api", route);

server.get("/", (req, res) => {
  res.send("Hello to backend");
});

server.get("*", (req, res) => {
  res.send("404 NOT FOUND <a href='./'> Go To Home</a>");
});