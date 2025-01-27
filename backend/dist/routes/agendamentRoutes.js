"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../resources/agendament/controller");
const authMiddleware_1 = require("../resources/auth/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticateJWT, controller_1.getAgendaments);
router.post("/", authMiddleware_1.authenticateJWT, controller_1.createNewAgendament);
exports.default = router;
