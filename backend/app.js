import express from "express";
import cors from "cors";    
import cookieParser from "cookie-parser"; 
import bodyParser from "body-parser";
import { Server,Socket } from "socket.io";
import run from './db/index.js';
import http from 'http' 
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";

dotenv.config(); 
const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: 'http://localhost:3000', // Update with your frontend URL
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: true
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
  methods: ["GET", "POST","DELETE"]
});



io.on("connection", (socket) => {
  console.log("user connected : ", socket.id);

  // Send initial messages to the connected socket
  console.log();
  // io.emit("receive_message", "Hi There!👋");
  setTimeout(() => {
    socket.emit("receive_message", "Hi There!👋");
    // socket.emit("receive_message", "I'm Wysa, an AI chatbot created by therapists");
  }, 1000);
  setTimeout(() => {
    socket.emit("receive_message", "I'm Wysa, an AI chatbot created by therapists");
  }, 2000);

  setTimeout(() => {
    socket.emit("receive_message", "I'm here to understand your concerns and connect you with the best resources available to support you.");
  }, 3000);

  setTimeout(() => {
    socket.emit("receive_message", "Can I help?");
  }, 4000);

  // Handle incoming messages from the client
  socket.on(socket.id, (message) => {
    // Echo the message back to the client
    io.emit("receive_message", message);
    // Handle the incoming message
  });
});

  
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public")); 

app.use(cookieParser());
app.use(bodyParser.json());


app.use("/api", authRouter);




run().then(() => {
    console.log("Database connected. Setting up routes...");

    // Example route to create a new user
    
    server.listen(8000, () => {
        console.log("The server is listening at port 8000");
    });
}).catch(err => {
    console.error("Error starting the application:", err);
    process.exit(1);
});
