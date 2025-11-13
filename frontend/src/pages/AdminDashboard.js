import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllTickets();
      // Backend returns { success: true, data: tickets }
      setTickets(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.status !== 'all' && ticket.status !== filters.status) {
      return false;
    }
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const statusClass = `badge-${status.replace('-', '-')}`;
    return <span className={`badge ${statusClass}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    return <span className={`badge badge-${priority}`}>{priority}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      inProgress: tickets.filter((t) => t.status === 'in-progress').length,
      closed: tickets.filter((t) => t.status === 'closed').length,
    };
  };

  const stats = getStats();

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
          <div className="stat-card stat-open">
            <div className="stat-value">{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card stat-in-progress">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card stat-closed">
            <div className="stat-value">{stats.closed}</div>
            <div className="stat-label">Closed</div>
          </div>
        </div>

        <div className="card">
          <div className="filters">
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label htmlFor="status">Filter by Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label htmlFor="priority">Filter by Priority</label>
              <select
                id="priority"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="empty-state">
            <h3>No tickets found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="tickets-table">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>#{ticket.ticketId}</td>
                    <td>
                      <div
                        className="ticket-link"
                        onClick={() => navigate(`/ticket/${ticket._id}`)}
                      >
                        {ticket.title}
                      </div>
                    </td>
                    <td>{ticket.userId?.name || ticket.userId || 'N/A'}</td>
                    <td>{getStatusBadge(ticket.status)}</td>
                    <td>{getPriorityBadge(ticket.priority)}</td>
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/ticket/${ticket._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

