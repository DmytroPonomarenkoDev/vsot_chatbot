import cors from "cors";
import express, { Request, Response } from "express";
import errorMiddleware from "./middlewares/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',  // During development
  credentials: true
}));

// JSON parsing before routes
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Error handling after routes
app.use(errorMiddleware);

// test api
app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "API is working" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default app;
