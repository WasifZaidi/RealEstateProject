"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomLoader from "@/app/components/CustomLoader";
import CustomToast from "@/app/components/SideComponents/CustomToast";

export default function RescheduleMeetingPage() {
    const { agentId, meetingId } = useParams();
    const router = useRouter();

    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [blockedDates, setBlockedDates] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [toast, setToast] = useState(null)
    // ✅ Fetch existing meeting details
    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const res = await fetch(
                    `http://localhost:3001/api/meeting/meeting/${meetingId}`,
                    {
                        credentials: "include",
                    }
                );

                if (res.status === 401) {
                    router.push("/signIn");
                    return;
                }

                const data = await res.json();
                if (!data.success) throw new Error(data.message);

                setMeeting(data.meeting);

                // Prefill selected date/time
                if (data.meeting.date) {
                    const dateObj = new Date(data.meeting.date);
                    setSelectedDate(dateObj);
                    setSelectedTime(
                        dateObj.toISOString().substring(11, 16)
                    );
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load meeting details.");
            } finally {
                setLoading(false);
            }
        };

        if (meetingId) fetchMeeting();
    }, [meetingId]);

    // ✅ Fetch blocked dates for agent
    useEffect(() => {
        const fetchBlockedDates = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/meeting/meetings/${agentId}`,
                    {
                        credentials: "include",
                    }
                );
                if (!res.ok) return;

                const data = await res.json();
                if (data.success && data.blockedDates) {
                    const formatted = data.blockedDates.map(
                        (d) => new Date(d).toISOString().split("T")[0]
                    );
                    setBlockedDates(formatted);
                }
            } catch {
                console.error("Error fetching blocked dates");
            }
        };
        if (agentId) fetchBlockedDates();
    }, [agentId]);

    // ✅ Create available time slots
    useEffect(() => {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`);
            if (hour < 17) slots.push(`${hour.toString().padStart(2, "0")}:30`);
        }
        setAvailableSlots(slots);
    }, []);

    // ✅ Calendar logic (reuse from schedule page)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    maxDate.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    );
    const lastDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    );

    const days = [];
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
        if (date >= today && date <= maxDate) days.push(date);
    }

    const navigateMonth = (dir) => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir, 1);
        if (newMonth < today || newMonth > maxDate) return;
        setCurrentMonth(newMonth);
    };

    const isDateAvailable = (date) => {
        const formatted = date.toISOString().split("T")[0];
        return !blockedDates.includes(formatted);
    };


    // ✅ Handle reschedule submission
    const handleReschedule = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!selectedDate || !selectedTime) {
            setToast({ type: "error", message: "Please select a new date and time." });
            return;
        }
        if (!reason.trim()) {
            setToast({ type: "error", message: "Please provide a reason for rescheduling." });
            return;
        }

        const newDateTime = `${selectedDate.toISOString().split("T")[0]}T${selectedTime}:00Z`;

        // Prevent rescheduling to the same slot
        if (meeting && new Date(meeting.date).toISOString() === newDateTime) {
            setToast({ type: "error", message: "You must choose a different date or time to reschedule." });
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/meeting/rescheduleMeetingOrTour/${meetingId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        newDate: newDateTime,
                        reason,
                    }),
                }
            );

            const data = await res.json();

            if (res.status === 401) {
                router.push("/signIn");
                return;
            }

            if (!data.success) {
                throw new Error(data.message || "Rescheduling failed.");
            }
            setToast({ type: "success", message: "Meeting rescheduled successfully!" });
            setTimeout(() => {
                router.push(`/tourDetails/${meeting.meetingPublic_Id}`);
            }, 2000);
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen pt-20">
                <CustomLoader />
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg font-medium">
                {error || "Meeting not found."}
            </div>
        );
    }

    const Calendar = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 30);
        maxDate.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
        );
        const lastDayOfMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
        );

        const days = [];
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);

            if (date >= today && date <= maxDate) {
                days.push(date);
            }
        }

        const navigateMonth = (dir) => {
            const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir, 1);

            const monthStart = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
            const monthEnd = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0);

            if (monthEnd < today || monthStart > maxDate) return;

            setCurrentMonth(newMonth);
        };

        const isDateAvailable = (date) => {
            if (!date) return false;
            const formatted = date.toISOString().split("T")[0];
            return !blockedDates.includes(formatted);
        };

        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 gap-2">
                    <button
                        onClick={() => navigateMonth(-1)}
                        disabled={
                            currentMonth.getMonth() === today.getMonth() &&
                            currentMonth.getFullYear() === today.getFullYear()
                        }
                        className={`p-2 rounded-lg transition-all ${currentMonth.getMonth() === today.getMonth() &&
                            currentMonth.getFullYear() === today.getFullYear()
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-blue-50"
                            }`}
                    >
                        <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        {currentMonth.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h3>

                    <button
                        onClick={() => navigateMonth(1)}
                        disabled={
                            currentMonth.getMonth() === maxDate.getMonth() &&
                            currentMonth.getFullYear() === maxDate.getFullYear()
                        }
                        className={`p-2 rounded-lg transition-all ${currentMonth.getMonth() === maxDate.getMonth() &&
                            currentMonth.getFullYear() === maxDate.getFullYear()
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-blue-50"
                            }`}
                    >
                        <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div
                            key={d}
                            className="text-center text-xs sm:text-sm font-semibold text-gray-500 py-2"
                        >
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {days.map((date, i) => {
                        const formatted = date?.toISOString().split("T")[0];
                        const isBlocked = blockedDates.includes(formatted);
                        const available = isDateAvailable(date);

                        return (
                            <div key={i} className="relative group">
                                <button
                                    disabled={!available}
                                    onClick={() => setSelectedDate(date)}
                                    className={`h-10 sm:h-12 w-full rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center
            ${!available
                                            ? "bg-red-100 text-red-600 cursor-not-allowed border border-red-200 hover:bg-red-100"
                                            : selectedDate &&
                                                date.toDateString() === selectedDate.toDateString()
                                                ? "bg-blue-600 text-white shadow-md hover:shadow-lg"
                                                : "text-gray-700 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300"
                                        }
          `}
                                >
                                    {date.getDate()}
                                </button>

                                {!available && (
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs sm:text-sm rounded-full bg-red-100 text-red-700 font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                        Already Booked
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-10 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                        Reschedule Your Tour
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-2">
                        Update your tour date and time easily.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl grid md:grid-cols-2 gap-6 sm:gap-10 p-4 sm:p-10">
                    {/* Left Side - Calendar */}
                    <Calendar />

                    {/* Right Side - Form */}
                    <form onSubmit={handleReschedule} className="flex flex-col gap-6">
                        {selectedDate && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                    Select a New Time
                                </h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                                    {availableSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setSelectedTime(slot)}
                                            className={`py-2 sm:py-3 px-3 rounded-[50px] border-2 text-xs sm:text-sm font-medium transition-all ${selectedTime === slot
                                                ? "bg-blue-600 text-white border-transparent"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Reason for Rescheduling *
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows="4"
                                placeholder="Please explain why you need to reschedule..."
                                className="w-full normal_input rounded-xl resize-none text-sm"
                                required
                            />
                        </div>

                        {/* Error or Success */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}
                        {successMsg && (
                            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg text-green-700 text-sm font-medium">
                                {successMsg}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`relative w-full py-3 rounded-[50px] font-semibold text-white text-base transition-all duration-300
                ${submitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                                }`}
                        >
                            {submitting ? "Rescheduling..." : "Confirm Reschedule"}
                        </button>
                    </form>
                </div>
            </div>
            {toast && <CustomToast {...toast} onClose={() => setToast(null)} duration={3000} />}
        </div>
    );
}
