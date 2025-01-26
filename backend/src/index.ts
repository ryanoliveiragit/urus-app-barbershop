import express from "express";
import cors from "cors";
import agendamentRoutes from "./routes/agendamentRoutes";
import subscriptionsRoutes from "./routes/subscriptionsRoutes";
import commoditiesRoutes from "./routes/commoditiesRoutes";
import servicesRoutes from "./routes/servicesRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/user", userRoutes);
app.use("/services", servicesRoutes);
app.use("/agendament", agendamentRoutes);
app.use("/subscription", subscriptionsRoutes);
app.use("/commodity", commoditiesRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
