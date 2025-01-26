"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../resources/services/controller");
const router = express_1.default.Router();
router.get("/", controller_1.getServices);
router.post("/", controller_1.createNewServices);
exports.default = router;
