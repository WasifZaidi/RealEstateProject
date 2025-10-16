"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  User,
  Home,
  Clock,
  Phone,
  Mail,
  Navigation,
  Edit3,
  Trash2,
  Share2,
  ChevronLeft,
  AlertTriangle
} from 'lucide-react';
import CustomLoader from '@/app/components/CustomLoader';

const MeetingDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/meeting/meeting/${id}`, {
          cache: "no-store",
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meeting details');
        }

        const data = await response.json();
        console.log(data)
        if (data.success) {
          setMeeting(data.meeting);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingDetails();
  }, [id]);


  const handleCancelMeeting = async (e) => {
    e.preventDefault()
    try {
      setCanceling(true);
      const response = await fetch(`http://localhost:3001/api/meeting/cancelMeeting/${id}`, {
        method: 'POST',
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error('Failed to cancel tour');
      }

      const data = await response.json();

      if (data.success) {
        router.push('/');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      setShowCancelModal(false);
    } finally {
      setCanceling(false);
    }
  };

  const openCancelModal = () => {
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      short: date.toLocaleDateString('en-US')
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    // Implement edit functionality
    console.log('Edit meeting:', meeting.meetingPublic_Id);
  };

  const handleDelete = () => {
    // Implement delete functionality
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      console.log('Delete meeting:', meeting.meetingPublic_Id);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    alert('Meeting link copied to clipboard!');
  };

  // Cancel Meeting Modal Component
  const CancelMeetingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cancel Tour</h3>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to cancel this tour?
          </p>
          {meeting && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-3">
              <p className="text-sm font-medium text-red-800">
                {meeting.type} on {formatDate(meeting.date).full}
              </p>
              <p className="text-sm text-red-600 mt-1">
                {meeting.location.city}, {meeting.location.state}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={closeCancelModal}
            disabled={canceling}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-[50px] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            onClick={handleCancelMeeting}
            disabled={canceling}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-[50px] hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {canceling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Canceling...
              </>
            ) : (
              'Confirm Cancel'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <CustomLoader message='Loading Details Wait...' />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const dateInfo = formatDate(meeting.date);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cancel Meeting Modal */}
      {showCancelModal && <CancelMeetingModal />}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-[12px] gap-y-[12px] flex-wrap">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {meeting.type} Details
                </h1>
                <p className="text-gray-500 text-sm">
                  Meeting ID: {meeting.meetingPublic_Id}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>

              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share meeting"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Meeting Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date & Time Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Date & Time</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{dateInfo.full}</p>
                    <p className="text-sm text-gray-500">{dateInfo.short}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <p className="font-medium text-gray-900">{dateInfo.time}</p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {meeting.location.city}, {meeting.location.state}
                    </p>
                    {meeting.location.neighborhood && (
                      <p className="text-sm text-gray-600">
                        {meeting.location.neighborhood}
                      </p>
                    )}
                    {meeting.location.zipCode && (
                      <p className="text-sm text-gray-500">
                        ZIP: {meeting.location.zipCode}
                      </p>
                    )}
                  </div>
                </div>

               {meeting.location?.coordinates?.coordinates && (
  <button
    onClick={() => {
  const [lng, lat] = meeting.location.coordinates.coordinates;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const mapsUrl = isIOS
    ? `http://maps.apple.com/?ll=${lat},${lng}`
    : `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(mapsUrl, "_blank", "noopener,noreferrer");
}}

    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
  >
    <Navigation className="h-4 w-4" />
    <span className="text-sm font-medium">Open in Maps</span>
  </button>
)}

              </div>
            </div>

            {/* Participants Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Participants</h2>
              </div>

              <div className="space-y-4">
                {/* Agent */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {meeting.agent?.name || 'Agent Name'}
                      </p>
                      <p className="text-sm text-gray-500">Real Estate Agent</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a href={`tel:${meeting.agentContacts.phone}`} className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      <Phone className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => {
                        const email = meeting?.agentContacts?.email;
                        if (!email) return;

                        const subject = encodeURIComponent("Inquiry about your property listing");
                        const body = encodeURIComponent("Hello, I’d like to learn more about your listing.");

                        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
                        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

                        const win = window.open(gmailUrl, "_blank");
                        if (!win || win.closed || typeof win.closed === "undefined") {
                          window.location.href = mailtoUrl;
                        }
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <Mail className="h-4 w-4" />
                    </button>

                  </div>
                </div>

                {/* Client */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {meeting.client?.name || 'Client Name'}
                      </p>
                      <p className="text-sm text-gray-500">Client</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            {meeting.notes && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Edit3 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Notes</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{meeting.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {meeting?.agentContacts?.phone && (
                  <a
                    href={`tel:${meeting.agentContacts.phone}`}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-[50px] hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">Call Agent</span>
                  </a>
                )}


                {meeting.status === 'Scheduled' && (
                  <button
                    onClick={openCancelModal}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-[50px] hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>Cancel Tour</span>
                  </button>
                )}
              </div>
            </div>

            {/* Meeting Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">{meeting.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(meeting.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Listing */}
            {meeting.listing && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Home className="h-6 w-6 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Related Property</h3>
                </div>
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-3">
                  {/* Property image would go here */}
                  <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                    <Home className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <p className="font-medium text-gray-900 mb-1">Property Title</p>
                <p className="text-sm text-gray-600">Address details here</p>
                <button className="w-full mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Property Details →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeetingDetailsPage;