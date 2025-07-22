"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salons_1 = require("../controllers/salons");
const router = (0, express_1.Router)();
// GET /api/salons - Search salons
router.get('/', salons_1.getSalons);
// GET /api/salons/:id - Get salon by ID
router.get('/:id', salons_1.getSalonById);
exports.default = router;
//# sourceMappingURL=salons.js.map