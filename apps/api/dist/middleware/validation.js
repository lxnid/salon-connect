"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBookingCreate = exports.validateSalonCreate = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role')
        .isIn(['CUSTOMER', 'SALON_OWNER', 'STYLIST'])
        .withMessage('Role must be CUSTOMER, SALON_OWNER, or STYLIST'),
    (0, express_validator_1.body)('firstName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be 1-50 characters'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be 1-50 characters'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number')
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
exports.validateSalonCreate = [
    (0, express_validator_1.body)('name')
        .isLength({ min: 1, max: 100 })
        .withMessage('Salon name is required and must be 1-100 characters'),
    (0, express_validator_1.body)('address')
        .isLength({ min: 1, max: 200 })
        .withMessage('Address is required and must be 1-200 characters'),
    (0, express_validator_1.body)('city')
        .isLength({ min: 1, max: 50 })
        .withMessage('City is required and must be 1-50 characters'),
    (0, express_validator_1.body)('state')
        .isLength({ min: 1, max: 50 })
        .withMessage('State is required and must be 1-50 characters'),
    (0, express_validator_1.body)('zipCode')
        .isPostalCode('any')
        .withMessage('Please provide a valid zip code'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email')
];
exports.validateBookingCreate = [
    (0, express_validator_1.body)('salonId')
        .isUUID()
        .withMessage('Valid salon ID is required'),
    (0, express_validator_1.body)('stylistId')
        .isUUID()
        .withMessage('Valid stylist ID is required'),
    (0, express_validator_1.body)('serviceIds')
        .isArray({ min: 1 })
        .withMessage('At least one service must be selected'),
    (0, express_validator_1.body)('serviceIds.*')
        .isUUID()
        .withMessage('All service IDs must be valid'),
    (0, express_validator_1.body)('datetime')
        .isISO8601()
        .withMessage('Valid datetime is required'),
    (0, express_validator_1.body)('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes must be less than 500 characters')
];
//# sourceMappingURL=validation.js.map