import { Express } from "express";
import videosRouter from "./videos.route";
import meRouter from "./me.route";
import usersRouter from "./users.route";
import authenticate from "~/middlewares/authenMiddleware";

function route(app: Express) {
  app.use("/api/v1/videos", videosRouter);
  app.use("/api/v1/me", authenticate, meRouter);
  app.use("/api/v1/users", authenticate, usersRouter);
}

export default route;
