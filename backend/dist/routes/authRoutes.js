"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../resources/auth/controller");
const services_1 = require("../resources/auth/services");
const router = express_1.default.Router();
router.post('/', controller_1.login);
router.post('/', controller_1.signup);
router.post('/google', services_1.googleAuth);
exports.default = router;
