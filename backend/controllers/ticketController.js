const Ticket = require('../models/Ticket');

// Generate ticket ID (TCKT-001, TCKT-002, etc.)
const generateTicketId = async () => {
  const count = await Ticket.countDocuments();
  const ticketNumber = String(count + 1).padStart(3, '0');
  return `TCKT-${ticketNumber}`;
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private (User)
const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and description are required' 
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({ 
        success: false,
        message: 'Title must be at least 3 characters' 
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({ 
        success: false,
        message: 'Description must be at least 10 characters' 
      });
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        success: false,
        message: 'Priority must be low, medium, or high' 
      });
    }

    const ticketId = await generateTicketId();

    const ticket = new Ticket({
      ticketId,
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'medium',
      userId: req.user._id
    });

    await ticket.save();
    await ticket.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get all tickets for a user
// @route   GET /api/tickets/user/:id
// @access  Private (User - own tickets only, Admin - any user)
const getUserTickets = async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only see their own tickets, admins can see any user's tickets
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You can only view your own tickets.' 
      });
    }

    const tickets = await Ticket.find({ userId: id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private (User - own tickets only, Admin - any ticket)
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate('userId', 'name email')
      .populate('history.updatedBy', 'name email role');

    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }

    // Users can only see their own tickets, admins can see all
    if (req.user.role !== 'admin' && ticket.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You can only view your own tickets.' 
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  createTicket,
  getUserTickets,
  getTicketById
};

