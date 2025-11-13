import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketsAPI, adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [note, setNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const api = isAdmin ? adminAPI : ticketsAPI;
      const response = await api.getTicketById(id);
      // Backend returns { success: true, data: ticket }
      setTicket(response.data.data || response.data);
    } catch (err) {
      setError('Failed to load ticket');
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) return;

    try {
      setError('');
      await adminAPI.updateTicketStatus(id, newStatus);
      setSuccess('Status updated successfully!');
      fetchTicket();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePriorityChange = async (newPriority) => {
    if (!isAdmin) return;

    try {
      setError('');
      await adminAPI.updateTicketPriority(id, newPriority);
      setSuccess('Priority updated successfully!');
      fetchTicket();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update priority');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!isAdmin || !note.trim()) return;

    try {
      setError('');
      await adminAPI.addTicketNote(id, note);
      setSuccess('Note added successfully!');
      setNote('');
      setShowNoteForm(false);
      fetchTicket();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusClass = `badge-${status.replace('-', '-')}`;
    return <span className={`badge ${statusClass}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    return <span className={`badge badge-${priority}`}>{priority}</span>;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="loading">Loading ticket...</div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="error-message">Ticket not found</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
          style={{ marginBottom: '20px' }}
        >
          ← Back
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="ticket-detail">
          <div className="ticket-main">
            <div className="card">
              <div className="ticket-header-detail">
                <div>
                  <h1 className="ticket-title-detail">{ticket.title}</h1>
                  <div className="ticket-meta">
                    <span className="ticket-id-detail">#{ticket.ticketId}</span>
                    <span className="ticket-date-detail">
                      Created: {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="ticket-badges-detail">
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>

              <div className="ticket-description-detail">
                <h3>Description</h3>
                <p>{ticket.description}</p>
              </div>

              {isAdmin && (
                <div className="admin-actions">
                  <div className="form-group">
                    <label>Status</label>
                    <div className="status-buttons">
                      {['open', 'in-progress', 'closed'].map((status) => (
                        <button
                          key={status}
                          className={`btn ${
                            ticket.status === status
                              ? 'btn-primary'
                              : 'btn-secondary'
                          }`}
                          onClick={() => handleStatusChange(status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <div className="priority-buttons">
                      {['low', 'medium', 'high'].map((priority) => (
                        <button
                          key={priority}
                          className={`btn ${
                            ticket.priority === priority
                              ? 'btn-primary'
                              : 'btn-secondary'
                          }`}
                          onClick={() => handlePriorityChange(priority)}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowNoteForm(!showNoteForm)}
                    >
                      {showNoteForm ? 'Cancel' : '+ Add Note'}
                    </button>
                  </div>

                  {showNoteForm && (
                    <form onSubmit={handleAddNote}>
                      <div className="form-group">
                        <label htmlFor="note">Add Note</label>
                        <textarea
                          id="note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Enter a note about this ticket"
                          rows="4"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Add Note
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="ticket-history">
            <div className="card">
              <h2 className="card-title">History</h2>
              {ticket.history && ticket.history.length > 0 ? (
                <div className="history-list">
                  {ticket.history
                    .slice()
                    .reverse()
                    .map((entry, index) => (
                      <div key={index} className="history-item">
                        <div className="history-header">
                          <span className="history-date">
                            {formatDate(entry.timestamp)}
                          </span>
                          {entry.status && (
                            <span className={`badge badge-${entry.status.replace('-', '-')}`}>
                              {entry.status}
                            </span>
                          )}
                          {entry.priority && (
                            <span className={`badge badge-${entry.priority}`}>
                              {entry.priority}
                            </span>
                          )}
                        </div>
                        {entry.note && (
                          <p className="history-note">{entry.note}</p>
                        )}
                        <p className="history-user">
                          Updated by: {entry.updatedBy?.name || 'System'}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="empty-state">No history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

