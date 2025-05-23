import express from "express";

const app = express();

const hostname = "localhost";
const port = 3000;

app.get("/", (req, res) => {
  res.end("<h1>Hello World!</h1><hr>");
});

app.listen(port, hostname, () => {
  console.log(`I am running at ${hostname}:${port}/`);
});
