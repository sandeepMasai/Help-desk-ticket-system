const express = require('express');
const router = express.Router();
const { createTicket, getUserTickets, getTicketById } = require('../controllers/ticketController');
const { auth, userAuth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// User routes - require user role
router.post('/', userAuth, createTicket);
router.get('/user/:id', getUserTickets);
router.get('/:id', getTicketById);

module.exports = router;
