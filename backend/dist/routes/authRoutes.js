"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../resources/auth/controller");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/signup', controller_1.signup);
authRoutes.post('/login', controller_1.login);
exports.default = authRoutes;
