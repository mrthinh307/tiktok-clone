import { Express } from "express";
import videosRouter from "./videos.route";

function route(app: Express) {
  app.use("/api/v1/videos", videosRouter);
}

export default route;
