import { body } from 'express-validator'

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .isIn(['CUSTOMER', 'SALON_OWNER', 'STYLIST'])
    .withMessage('Role must be CUSTOMER, SALON_OWNER, or STYLIST'),
  
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be 1-50 characters'),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be 1-50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
]

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

export const validateSalonCreate = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Salon name is required and must be 1-100 characters'),
  
  body('address')
    .isLength({ min: 1, max: 200 })
    .withMessage('Address is required and must be 1-200 characters'),
  
  body('city')
    .isLength({ min: 1, max: 50 })
    .withMessage('City is required and must be 1-50 characters'),
  
  body('state')
    .isLength({ min: 1, max: 50 })
    .withMessage('State is required and must be 1-50 characters'),
  
  body('zipCode')
    .isPostalCode('any')
    .withMessage('Please provide a valid zip code'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
]

export const validateBookingCreate = [
  body('salonId')
    .isUUID()
    .withMessage('Valid salon ID is required'),
  
  body('stylistId')
    .isUUID()
    .withMessage('Valid stylist ID is required'),
  
  body('serviceIds')
    .isArray({ min: 1 })
    .withMessage('At least one service must be selected'),
  
  body('serviceIds.*')
    .isUUID()
    .withMessage('All service IDs must be valid'),
  
  body('datetime')
    .isISO8601()
    .withMessage('Valid datetime is required'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
]