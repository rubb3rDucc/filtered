import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());

export { app };