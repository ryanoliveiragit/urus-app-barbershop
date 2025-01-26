"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const agendamentRoutes_1 = __importDefault(require("./routes/agendamentRoutes"));
const subscriptionsRoutes_1 = __importDefault(require("./routes/subscriptionsRoutes"));
const commoditiesRoutes_1 = __importDefault(require("./routes/commoditiesRoutes"));
const servicesRoutes_1 = __importDefault(require("./routes/servicesRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/user", userRoutes_1.default);
app.use("/services", servicesRoutes_1.default);
app.use("/agendament", agendamentRoutes_1.default);
app.use("/subscription", subscriptionsRoutes_1.default);
app.use("/commodity", commoditiesRoutes_1.default);
app.use("/auth", authRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
