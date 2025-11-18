import express from "express";
import cors from "cors";
import { envs } from "./src/config/config.env.js";
import { connectDB } from "./src/config/config.db.js";
import { routes } from "./src/routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use("/api", routes);

const PORT = envs.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
