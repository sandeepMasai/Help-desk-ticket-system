const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  updateTicketPriority,
  addTicketNote
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(auth);
router.use(adminAuth);

// Admin routes
router.get('/tickets', getAllTickets);
router.get('/tickets/:id', getTicketById);
router.put('/tickets/:id/status', updateTicketStatus);
router.put('/tickets/:id/priority', updateTicketPriority);
router.post('/tickets/:id/history', addTicketNote);

module.exports = router;
