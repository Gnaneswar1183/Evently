import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { QRCodeSVG } from 'qrcode.react';

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allEventsRes, myApplicationsRes] = await Promise.all([
          api.get('/events'),
          api.get('/events/my-events'),
        ]);
        setEvents(allEventsRes.data);
        setMyApplications(myApplicationsRes.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/apply`);
      const myApplicationsRes = await api.get('/events/my-events');
      setMyApplications(myApplicationsRes.data);
      alert('Successfully applied!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to apply.');
    }
  };
  
  const handleViewQrCode = (application) => {
    setSelectedApplication(application);
    setIsQrModalOpen(true);
  };

  const myEventIds = myApplications.map(app => app.eventId._id);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-slate-700 dark:text-slate-300">Available Events</h2>
            <div className="space-y-6">
              {events.map((event) => (
                <div key={event._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{event.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="mt-4 text-slate-600 dark:text-slate-300">{event.description}</p>
                  <button
                    onClick={() => handleApply(event._id)}
                    disabled={myEventIds.includes(event._id)}
                    className="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200"
                  >
                    {myEventIds.includes(event._id) ? 'Applied' : 'Apply'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold mb-6 text-slate-700 dark:text-slate-300">My Tickets</h2>
            <div className="space-y-4">
              {myApplications.map((app) => (
                 <div key={app._id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border-l-4 border-green-500 dark:border-green-400">
                   <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{app.eventId.title}</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(app.eventId.date).toLocaleDateString()} at {app.eventId.venue}</p>
                   <button 
                      onClick={() => handleViewQrCode(app)}
                      className="mt-2 bg-gray-700 dark:bg-slate-600 hover:bg-gray-800 dark:hover:bg-slate-500 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors duration-200"
                   >
                     View QR Code
                   </button>
                 </div>
              ))}
              {myApplications.length === 0 && <p className="text-slate-500 dark:text-slate-400">You haven't applied to any events yet.</p>}
            </div>
          </div>
        </div>
      </main>

      {isQrModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" onClick={() => setIsQrModalOpen(false)}>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Your Ticket</h2>
            <h3 className="text-xl font-semibold mb-4 text-slate-600 dark:text-slate-400">{selectedApplication.eventId.title}</h3>
            <div className="p-4 bg-white rounded-md"> {/* White background for QR code visibility */}
                <QRCodeSVG
                    value={selectedApplication._id}
                    size={256} 
                    level={"H"}
                    includeMargin={true}
                />
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">Show this code at the event for attendance.</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">ID: {selectedApplication._id}</p>
            <button onClick={() => setIsQrModalOpen(false)} className="mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-md w-full transition-colors duration-200">
                Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;