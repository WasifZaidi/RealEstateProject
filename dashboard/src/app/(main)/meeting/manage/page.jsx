"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Pagination } from "@mui/material";
import {
    Calendar,
    MapPin,
    Clock,
    Search,
    Filter,
    MoreVertical,
    X,
    User,
    Home,
    Phone,
    Mail,
    Video,
    PhoneCall,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    MailIcon,
    CalendarX,
    Loader2
} from "lucide-react";
import MuiDropdown from "@/app/components/MuiDropdown";
import CustomToast from "@/app/components/CustomToast";
// Custom hook for API calls with abort controller
const useApi = () => {
    const abortControllers = useMemo(() => new Map(), []);

    const fetchWithAbort = useCallback(async (url, options = {}, key = 'default') => {
        // Abort previous request with same key
        if (abortControllers.has(key)) {
            abortControllers.get(key).abort();
        }

        const controller = new AbortController();
        abortControllers.set(key, controller);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } finally {
            abortControllers.delete(key);
        }
    }, [abortControllers]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            abortControllers.forEach(controller => controller.abort());
            abortControllers.clear();
        };
    }, [abortControllers]);

    return { fetchWithAbort };
};

const AgentMeetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0
    });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        status: "",
        type: "",
        startDate: "",
        endDate: "",
        search: ""
    });
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const [cancelConfirmInput, setCancelConfirmInput] = useState("");
    const [selectedMeetingPublicId, setSelectedMeetingPublicId] = useState("")
    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const { fetchWithAbort } = useApi();

    // Memoized status configuration
    const statusConfig = useMemo(() => ({
        Scheduled: {
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
            borderColor: "border-blue-200",
            dotColor: "bg-blue-500",
            label: "Scheduled"
        },
        Completed: {
            bgColor: "bg-green-50",
            textColor: "text-green-700",
            borderColor: "border-green-200",
            dotColor: "bg-green-500",
            label: "Completed"
        },
        Cancelled: {
            bgColor: "bg-red-50",
            textColor: "text-red-700",
            borderColor: "border-red-200",
            dotColor: "bg-red-500",
            label: "Cancelled"
        },
        Rescheduled: {
            bgColor: "bg-orange-50",
            textColor: "text-orange-700",
            borderColor: "border-orange-200",
            dotColor: "bg-orange-500",
            label: "Rescheduled"
        }
    }), []);

    // Memoized filter options
    const statusOptions = useMemo(() => [
        { value: "", label: "All Status" },
        { value: "scheduled", label: "Scheduled" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "rescheduled", label: "Rescheduled" }
    ], []);

    const typeOptions = useMemo(() => [
        { value: "", label: "All Types" },
        { value: "virtual", label: "Virtual" },
        { value: "phone", label: "Phone" },
        { value: "in_person", label: "In Person" }
    ], []);

    // ✅ Enhanced Fetch Meetings with error handling and abort
    const fetchMeetings = useCallback(async (pageNumber = 1, filterParams = {}) => {
        try {
            setLoading(true);
            setError(null);

            // Clean up empty filters
            const cleanFilters = Object.fromEntries(
                Object.entries(filterParams).filter(([_, value]) =>
                    value !== "" && value !== null && value !== undefined
                )
            );

            const queryParams = new URLSearchParams({
                page: pageNumber,
                limit: "10",
                ...cleanFilters
            }).toString();

            const data = await fetchWithAbort(
                `http://localhost:3001/api/dashboard/agent/meetings?${queryParams}`,
                { method: "GET" },
                'meetings-fetch'
            );

            if (data.success) {
                setMeetings(data.meetings || []);
                setTotalPages(data.totalPages || 1);
                updateStats(data.meetings || []);
            } else {
                setMeetings([]);
                setError(data.message || "Failed to fetch meetings");
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Request was aborted');
                return;
            }
            console.error("Error fetching meetings:", err);
            setError("Failed to load meetings. Please try again.");
            setMeetings([]);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAbort]);

    const updateStats = useCallback((meetingsList) => {
        const statsCount = {
            total: meetingsList.length,
            scheduled: meetingsList.filter(m => m.status === 'scheduled').length,
            completed: meetingsList.filter(m => m.status === 'completed').length,
            cancelled: meetingsList.filter(m => m.status === 'cancelled').length
        };
        setStats(statsCount);
    }, []);

    useEffect(() => {
        fetchMeetings(page, filters);
    }, [page, fetchMeetings]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.search) {
                setPage(1);
                fetchMeetings(1, filters);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [filters.search, fetchMeetings]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleApplyFilters = useCallback(() => {
        setPage(1);
        fetchMeetings(1, filters);
    }, [filters, fetchMeetings]);

    const handleClearFilters = useCallback(() => {
        const clearedFilters = {
            status: "",
            type: "",
            startDate: "",
            endDate: "",
            search: ""
        };
        setFilters(clearedFilters);
        setPage(1);
        fetchMeetings(1, clearedFilters);
    }, [fetchMeetings]);

    const handleSearch = useCallback(() => {
        setPage(1);
        fetchMeetings(1, filters);
    }, [filters, fetchMeetings]);

    const handleViewDetails = useCallback((meeting) => {
        setSelectedMeeting(meeting);
        setDetailOpen(true);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setDetailOpen(false);
        // Use setTimeout to allow the modal close animation to complete
        setTimeout(() => setSelectedMeeting(null), 300);
    }, []);
    const handleCancelMeeting = useCallback(async () => {
        if (!selectedMeetingPublicId) {
            setToast({ type: "error", message: `No meeting selected.` });
            return;
        }

        // Ensure the input matches for confirmation
        if (cancelConfirmInput.trim() !== selectedMeetingPublicId) {
            setToast({ type: "error", message: `Meeting ID confirmation does not match.` });
            return;
        }

        try {
            // Optional: show loading state here if using UI state hooks
            setCancelLoading(true);

            const response = await fetch(
                `http://localhost:3001/api/dashboard/agent/meeting/cancel/${selectedMeetingPublicId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to cancel meeting");
            }
            setToast({ type: "success", message: `Meeting cancelled successfully ✅` });


            setCancelConfirmOpen(false);
            setCancelConfirmInput("");
            fetchMeetings(); // reload meetings if you have such function

        } catch (error) {
            console.error("❌ Cancel Meeting Error:", error);
        } finally {
            setCancelLoading(false);
        }
    }, [cancelConfirmInput, selectedMeetingPublicId]);

    const handleCallClient = useCallback((phoneNumber) => {
        if (phoneNumber) {
            window.open(`tel:${phoneNumber}`, '_self');
        } else {
            alert('Phone number not available');
        }
    }, []);

    const handleEmailClient = useCallback((email) => {
        if (email) {
            window.open(`mailto:${email}`, '_self');
        } else {
            alert('Email not available');
        }
    }, []);

    // ✅ Status Chip Colors
    const getStatusChip = useCallback((status) => {
        return statusConfig[status] || statusConfig.scheduled;
    }, [statusConfig]);

    // ✅ Meeting Type Icons
    const getMeetingTypeIcon = useCallback((type) => {
        switch (type) {
            case "virtual":
                return <Video className="w-4 h-4 text-purple-600" />;
            case "phone":
                return <PhoneCall className="w-4 h-4 text-blue-600" />;
            case "in_person":
                return <MapPin className="w-4 h-4 text-green-600" />;
            default:
                return <Calendar className="w-4 h-4 text-gray-600" />;
        }
    }, []);

    const handleOpenConfirm = (id) => {
        setCancelConfirmInput("")
        setSelectedMeetingPublicId(id)
        setDetailOpen(false);
        setCancelConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setCancelConfirmOpen(false);
    };

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }, []);

    const formatTime = useCallback((dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const hasActiveFilters = useCallback(() => {
        return filters.status || filters.type || filters.startDate || filters.endDate || filters.search;
    }, [filters]);

    // Memoized modal component to prevent unnecessary re-renders
    const CustomModal = useMemo(() => {
        return ({ isOpen, onClose, children, title }) => {
            if (!isOpen) return null;

            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={onClose}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden transform animate-scale-in">
                        {children}
                    </div>
                </div>
            );
        };
    }, []);

    // Error boundary fallback UI
    if (error && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <X className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Meetings</h3>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button
                            onClick={() => fetchMeetings(1, filters)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col gap-y-[22px] mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                My Meetings
                            </h1>
                            <p className="text-gray-600 mt-2">Manage and track your property meetings</p>
                        </div>

                        {/* Search Box */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-[500px] w-[100%] lg:w-auto">
                            <div className="relative flex-1 w-full lg:min-w-96 items-center">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by Meeting ID, Client Name, or Property"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSearch();
                                        }
                                    }}
                                    className="normal_input mod_2"
                                    aria-label="Search by Meeting ID, Client Name, or Property"
                                />

                                {/* Clear button inside input when search exists */}
                                {filters.search && (
                                    <button
                                        onClick={() => handleFilterChange('search', '')}
                                        className="
          absolute right-3 top-1/2 transform -translate-y-1/2
          text-gray-400 hover:text-gray-600
          transition-colors duration-200
          p-1 rounded-full
          hover:bg-gray-100
        "
                                        aria-label="Clear search"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Conditional Clear Search Button */}
                            {filters.search && (
                                <button
                                    onClick={() => handleFilterChange('search', '')}
                                    className="
        px-4 py-2
        border border-gray-300
        rounded-[50px]
        text-gray-700
        hover:bg-gray-50
        hover:border-gray-400
        active:bg-gray-100
        transition-all duration-200
        font-medium
        whitespace-nowrap
        shadow-sm
      "
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>

                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { key: 'total', label: 'Total Meetings', icon: Calendar, color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
                        { key: 'scheduled', label: 'Scheduled', icon: Clock, color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-600' },
                        { key: 'completed', label: 'Completed', icon: User, color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
                        { key: 'cancelled', label: 'Cancelled', icon: X, color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-600' }
                    ].map((stat) => (
                        <div key={stat.key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats[stat.key]}</p>
                                </div>
                                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Filters Section */}
                <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Filter className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <p className="text-sm text-gray-600">Refine your meetings search</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {hasActiveFilters() && (
                                <button
                                    onClick={handleClearFilters}
                                    className="group cursor-pointer flex items-center gap-2 px-4 py-[8px] text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-xs hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 hover:shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                                >
                                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear All
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Basic Filters - Always Visible */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <MuiDropdown
                                options={statusOptions}
                                value={filters.status}
                                onChange={(val) => handleFilterChange('status', val)}
                                placeholder="All Status"
                                fullWidth
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
                            <MuiDropdown
                                options={typeOptions}
                                value={filters.type}
                                onChange={(val) => handleFilterChange('type', val)}
                                placeholder="All Types"
                                fullWidth
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="normal_input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="normal_input"
                            />
                        </div>
                    </div>

                    {/* Apply Filters Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                            onClick={handleApplyFilters}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-[50px] transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Meetings Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                            <p className="text-gray-600 font-medium">Loading meetings...</p>
                        </div>
                    ) : meetings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No meetings found</h3>
                            <p className="text-gray-600 max-w-sm mx-auto mb-4">
                                {hasActiveFilters() ?
                                    "No meetings match your current filters. Try adjusting your search criteria." :
                                    "You don't have any scheduled meetings yet."
                                }
                            </p>
                            {hasActiveFilters() && (
                                <button
                                    onClick={handleClearFilters}
                                    className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto smooth-scroll">
                                <table className="w-full min-w-[1000px] lg:min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[60px]">
                                                #
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[18%]">
                                                Meeting Details
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[23%]">
                                                Client & Property
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                                                Date & Time
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[12%]">
                                                Type
                                            </th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[12%]">
                                                Status
                                            </th>
                                            <th className="py-4 px-6 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {meetings.map((meeting, index) => {
                                            console.log("stat", meeting.status)
                                            const status = getStatusChip(meeting.status);
                                            const rowNumber = (page - 1) * 10 + index + 1;
                                            return (
                                                <tr
                                                    key={meeting._id}
                                                    className="hover:bg-gray-50 transition-colors group"
                                                >
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                                                            <span className="text-sm font-semibold text-gray-600">
                                                                {rowNumber}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                                {meeting.meetingPublic_Id}
                                                            </p>
                                                            <p className="text-xs text-gray-500 capitalize line-clamp-1">
                                                                {meeting.purpose || "Property Viewing"}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                                    {meeting.client?.name || "N/A"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Home className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <span className="text-sm text-gray-600 truncate">
                                                                    {meeting.listing?.title || "Property Details N/A"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                {formatDate(meeting.date)}
                                                            </div>
                                                            <div className="text-sm text-gray-600 whitespace-nowrap">
                                                                {formatTime(meeting.date)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-2 text-sm text-gray-700 capitalize whitespace-nowrap">
                                                            {getMeetingTypeIcon(meeting.type)}
                                                            {meeting.type?.replace('_', ' ') || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${status.bgColor} ${status.borderColor} ${status.textColor} whitespace-nowrap`}>
                                                            <div className={`w-2 h-2 rounded-full ${status.dotColor}`}></div>
                                                            <span className="text-xs font-semibold tracking-wide uppercase">
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleViewDetails(meeting)}
                                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                                                            >
                                                                <MoreVertical className="w-4 h-4" />
                                                                Details
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenConfirm(meeting.meetingPublic_Id)}
                                                                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                                                            >
                                                                <CalendarX className="w-4 h-4" />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                {/* Pagination */}
                {meetings.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{(page - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(page * 10, meetings.length)}</span> of <span className="font-semibold">{meetings.length}</span> meetings
                        </p>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, val) => setPage(val)}
                            color="primary"
                            shape="rounded"
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    borderRadius: '8px',
                                    margin: '0 2px',
                                    fontWeight: '500',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    fontWeight: '400',
                                    '&:hover': {
                                        backgroundColor: '#1d4ed8',
                                    }
                                }
                            }}
                        />
                    </div>
                )}

                {/* Custom Meeting Details Modal */}
                <CustomModal isOpen={detailOpen} onClose={handleCloseDetails}>
                    {selectedMeeting && (
                        <>
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Meeting Details</h2>
                                        <p className="text-blue-100 text-sm">{selectedMeeting.meetingPublic_Id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseDetails}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                                <div className="space-y-6">
                                    {/* Meeting Information */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                Meeting Information
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Purpose:</span>
                                                    <span className="font-medium text-gray-900 capitalize">{selectedMeeting.purpose || "Property Viewing"}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Type:</span>
                                                    <div className="flex items-center gap-2">
                                                        {getMeetingTypeIcon(selectedMeeting.type)}
                                                        <span className="font-medium text-gray-900 capitalize">{selectedMeeting.type?.replace('_', ' ') || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Duration:</span>
                                                    <span className="font-medium text-gray-900">{selectedMeeting.duration || '30 mins'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                Date & Time
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Date:</span>
                                                    <span className="font-medium text-gray-900">{formatDate(selectedMeeting.date)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Time:</span>
                                                    <span className="font-medium text-gray-900">{formatTime(selectedMeeting.date)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Status:</span>
                                                    {(() => {
                                                        const status = getStatusChip(selectedMeeting.status);
                                                        return (
                                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${status.bgColor} ${status.borderColor} ${status.textColor}`}>
                                                                <div className={`w-2 h-2 rounded-full ${status.dotColor}`}></div>
                                                                <span className="text-xs font-semibold tracking-wide uppercase">
                                                                    {status.label}
                                                                </span>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Client & Property Information */}
                                    {/* Client & Property Information */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-600" />
                                                Client Information
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-gray-900 truncate">{selectedMeeting.clientContacts?.name || "N/A"}</p>
                                                            <p className="text-gray-600 text-xs">Client Name</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-gray-900 truncate">{selectedMeeting.clientContacts?.email || "N/A"}</p>
                                                            <p className="text-gray-600 text-xs">Email Address</p>
                                                        </div>
                                                    </div>
                                                    {selectedMeeting.clientContacts?.email && (
                                                        <button
                                                            onClick={() => handleEmailClient(selectedMeeting.clientContacts.email)}
                                                            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[50px] cursor-pointer transition-colors shadow-sm hover:shadow-md flex-shrink-0 ml-2"
                                                            title="Send Email"
                                                        >
                                                            <MailIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-gray-900 truncate">{selectedMeeting.clientContacts?.phone || "N/A"}</p>
                                                            <p className="text-gray-600 text-xs">Phone Number</p>
                                                        </div>
                                                    </div>
                                                    {selectedMeeting.clientContacts?.phone && (
                                                        <button
                                                            onClick={() => handleCallClient(selectedMeeting.clientContacts.phone)}
                                                            className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-[50px] cursor-pointer transition-colors shadow-sm hover:shadow-md flex-shrink-0 ml-2"
                                                            title="Make Call"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Home className="w-4 h-4 text-blue-600" />
                                                Property Information
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <Home className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{selectedMeeting.listing?.title || "N/A"}</p>
                                                        <p className="text-gray-600 text-xs">Property Title</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Price:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {selectedMeeting.listing?.price?.amount ? `$${selectedMeeting.listing.price.amount}` : "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className="font-medium text-gray-900 capitalize">{selectedMeeting.listing?.status || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes Section */}
                                    {selectedMeeting.notes && (
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4 text-blue-600" />
                                                Additional Notes
                                            </h3>
                                            <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                                                {selectedMeeting.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </CustomModal>

                {
                    cancelConfirmOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                To confirm, please type <strong>{selectedMeetingPublicId}</strong> below.
                                This action is <span className="text-red-600 font-medium">irreversible</span>.
                            </p>

                            <input
                                type="text"
                                value={cancelConfirmInput}
                                onChange={(e) => setCancelConfirmInput(e.target.value)}
                                placeholder={`Type "${selectedMeetingPublicId}" to confirm`}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                            />

                            <div className="flex justify-end gap-3 mt-5">
                                <button
                                    onClick={handleCloseConfirm}
                                    className="px-4 py-2 rounded-[50px] cursor-pointer text-gray-600 border border-gray-300 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCancelMeeting}
                                    className={`flex items-center justify-center gap-2 px-6 py-2 rounded-[50px] font-medium text-white transition-all ${cancelConfirmInput.trim() === selectedMeetingPublicId
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-red-300 cursor-not-allowed"
                                        }`}
                                    disabled={cancelConfirmInput.trim() !== selectedMeetingPublicId || cancelLoading}
                                >
                                    {cancelLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                ></path>
                                            </svg>
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        "Confirm Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                }

            </div>
            {
                toast && <CustomToast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                    duration={3000} // auto close after 3s
                />
            }
        </div>
    );
}

export default React.memo(AgentMeetings);