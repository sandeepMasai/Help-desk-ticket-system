const Ticket = require('../models/Ticket');

// @desc    Get all tickets with filters and search
// @route   GET /api/admin/tickets
// @access  Private (Admin only)
const getAllTickets = async (req, res) => {
    try {
        const { status, priority, search } = req.query;

        let query = {};

        // Filter by status
        if (status && ['open', 'in-progress', 'closed'].includes(status)) {
            query.status = status;
        }

        // Filter by priority
        if (priority && ['low', 'medium', 'high'].includes(priority)) {
            query.priority = priority;
        }

        // Search by ticket ID or title
        if (search) {
            query.$or = [
                { ticketId: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }
            ];
        }

        let tickets = await Ticket.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        // If search includes email, filter in memory (since we need to search populated field)
        if (search) {
            const searchLower = search.toLowerCase();
            tickets = tickets.filter(ticket =>
                ticket.ticketId.toLowerCase().includes(searchLower) ||
                ticket.title.toLowerCase().includes(searchLower) ||
                (ticket.userId && ticket.userId.email.toLowerCase().includes(searchLower))
            );
        }

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

// @desc    Get ticket by ID (admin view)
// @route   GET /api/admin/tickets/:id
// @access  Private (Admin only)
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

// @desc    Update ticket status
// @route   PUT /api/admin/tickets/:id/status
// @access  Private (Admin only)
const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, note } = req.body;

        // Validation
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        if (!['open', 'in-progress', 'closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: open, in-progress, or closed'
            });
        }

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // Validate status transition - cannot reopen closed tickets
        if (status === 'open' && ticket.status === 'closed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot reopen a closed ticket'
            });
        }

        const oldStatus = ticket.status;
        ticket.status = status;

        // Add to history
        ticket.history.push({
            status: status,
            priority: ticket.priority,
            updatedBy: req.user._id,
            timestamp: new Date(),
            note: note || `Status changed from ${oldStatus} to ${status}`
        });

        await ticket.save();
        await ticket.populate('userId', 'name email');
        await ticket.populate('history.updatedBy', 'name email role');

        res.json({
            success: true,
            message: 'Ticket status updated successfully',
            data: ticket
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update ticket priority
// @route   PUT /api/admin/tickets/:id/priority
// @access  Private (Admin only)
const updateTicketPriority = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority, note } = req.body;

        // Validation
        if (!priority) {
            return res.status(400).json({
                success: false,
                message: 'Priority is required'
            });
        }

        if (!['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid priority. Must be: low, medium, or high'
            });
        }

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        const oldPriority = ticket.priority;
        ticket.priority = priority;

        // Add to history
        ticket.history.push({
            status: ticket.status,
            priority: priority,
            updatedBy: req.user._id,
            timestamp: new Date(),
            note: note || `Priority changed from ${oldPriority} to ${priority}`
        });

        await ticket.save();
        await ticket.populate('userId', 'name email');
        await ticket.populate('history.updatedBy', 'name email role');

        res.json({
            success: true,
            message: 'Ticket priority updated successfully',
            data: ticket
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add note to ticket history
// @route   POST /api/admin/tickets/:id/history
// @access  Private (Admin only)
const addTicketNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;

        // Validation
        if (!note || !note.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Note is required and cannot be empty'
            });
        }

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // Add to history
        ticket.history.push({
            status: ticket.status,
            priority: ticket.priority,
            updatedBy: req.user._id,
            timestamp: new Date(),
            note: note.trim()
        });

        await ticket.save();
        await ticket.populate('userId', 'name email');
        await ticket.populate('history.updatedBy', 'name email role');

        res.json({
            success: true,
            message: 'Note added successfully',
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
    getAllTickets,
    getTicketById,
    updateTicketStatus,
    updateTicketPriority,
    addTicketNote
};

