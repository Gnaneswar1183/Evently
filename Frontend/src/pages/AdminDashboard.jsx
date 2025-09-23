import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { saveAs } from 'file-saver';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', venue: '' });
  const [applicants, setApplicants] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/events', formData);
      alert('Event created successfully!');
      setFormData({ title: '', description: '', date: '', venue: '' }); // Reset form
      fetchEvents(); // Refresh event list
    } catch (err) {
      alert('Failed to create event.');
    }
  };

  const viewApplicants = async (eventId, eventTitle) => {
    try {
      const res = await api.get(`/admin/events/${eventId}/applications`);
      setApplicants(res.data);
      setSelectedEvent(eventTitle);
      setIsModalOpen(true);
    } catch (err) {
      alert('Could not fetch applicants.');
    }
  };

  const handleExport = async (eventId, eventTitle) => {
    try {
      const res = await api.get(`/admin/events/${eventId}/applications/export`, {
        responseType: 'blob', // Important to handle the file data correctly
      });
      
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `applicants-${eventTitle.replace(/\s+/g, '-')}.csv`);

    } catch (err) {
      alert('Failed to export applicants. They may not have applied yet.');
    }
  };

   return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen"> {/* Main background */}
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Event Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-700 dark:text-slate-300">Create New Event</h2> {/* Text color */}
            <form onSubmit={handleCreateEvent} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700"> {/* Card styles */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Title</label> {/* Label text */}
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" required /> {/* Input styles */}
              </div>
              {/* ... Apply similar dark mode classes to other inputs and labels ... */}
            </form>
          </div>

          {/* Manage Events List */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-700 dark:text-slate-300">Manage Events</h2>
            <div className="space-y-6">
              {events.map((event) => (
                <div key={event._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{event.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                  {/* ... Buttons ... */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Applicants Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4">
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Applicants for "{selectedEvent}"</h3>
              {/* ... Modal content with dark mode text colors ... */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;