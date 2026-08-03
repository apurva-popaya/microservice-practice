import dns from "node:dns";

import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/user.routes.js";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/v1", userRoutes);

connectDB();

app.listen(PORT, (req, res) => {
  console.log(`Server running on http://localhost:${PORT}`);
});
