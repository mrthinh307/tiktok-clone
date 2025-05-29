import express from "express";
import route from "./routes/v1/index";
import cors from "cors";

const app = express();

// Cấu hình CORS
app.use(cors());

const hostname = "localhost";
const port = 3001;

// Cấu hình middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

route(app);

app.listen(port, hostname, () => {
  console.log(`I am running at ${hostname}:${port}/`);
});
