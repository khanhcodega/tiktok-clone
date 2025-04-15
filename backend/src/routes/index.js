const authRoutes = require("./authRoutes");
const videoRoutes = require("./videoRoutes");
const userRoutes = require("./userRoutes");

function route(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/videos", videoRoutes);
  app.use("/api/users", userRoutes);

}

module.exports = route;
