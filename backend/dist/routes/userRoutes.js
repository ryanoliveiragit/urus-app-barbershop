"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../resources/auth/authMiddleware"));
const controller_1 = require("../resources/users/controller");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.default, controller_1.getUsers);
router.get("/", controller_1.getUsers);
router.get("/barbers", controller_1.getBarbers);
router.post("/", controller_1.createNewUser);
exports.default = router;
