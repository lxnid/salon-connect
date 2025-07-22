"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// POST /api/auth/register
router.post('/register', validation_1.validateRegister, auth_1.register);
// POST /api/auth/login
router.post('/login', validation_1.validateLogin, auth_1.login);
// GET /api/auth/profile
router.get('/profile', auth_2.authenticate, auth_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map