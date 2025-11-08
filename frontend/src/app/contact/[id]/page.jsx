"use client";

import React, { useState, useEffect } from "react";
import {
    Phone,
    MessageCircle,
    Mail,
    Clock,
    Send,
    CheckCircle,
    ArrowRight,
} from "lucide-react";
import { useParams } from "next/navigation";

const ContactAgentPage = () => {
    const { id: agentId } = useParams(); // ✅ Correct param name based on /contact/[id]
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
    });
    const [contactInfo, setContactInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // ✅ Fetch agent contact info
    useEffect(() => {
        const fetchAgentContact = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/agent/contact/${agentId}`,
                    { cache: "no-store" }
                );

                if (!res.ok) throw new Error("Failed to fetch agent contact info");
                const data = await res.json();
                setContactInfo(data.contact);
            } catch (err) {
                console.error("❌ Error fetching contact info:", err);
                setError("Failed to load contact information");
            } finally {
                setLoading(false);
            }
        };

        if (agentId) fetchAgentContact();
    }, [agentId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 4000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-600 text-lg animate-pulse">
                    Loading agent contact info...
                </div>
            </div>
        );
    }

    if (error || !contactInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 font-medium mb-2">{error}</p>
                    <p className="text-gray-600">Please try again later.</p>
                </div>
            </div>
        );
    }

    // ✅ Use dynamic info from API
    const { phone, email, socialLinks, firstName, lastName, company } =
        contactInfo;


    const contactMethods = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Call Agent",
            description: `Speak directly with ${firstName}`,
            details: phone || "Not available",
            link: phone ? `tel:${phone}` : null, // Phone still uses tel:
            color: "bg-blue-50 border-blue-200",
            iconColor: "text-blue-600",
            buttonColor: "bg-blue-600 hover:bg-blue-700",
            buttonText: "Call Now",
            badge: "Direct Line",
            priority: true,
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Agent",
            description: "Send a professional inquiry",
            details: email || "Not available",
            // Open Gmail always
            link: email
                ? `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`
                : null,
            color: "bg-red-50 border-red-200",
            iconColor: "text-red-600",
            buttonColor: "bg-red-600 hover:bg-red-700",
                 buttonText: "Send Email",
            badge: "Best for Details",
            priority: true,
        },
    ];

    const priorityMethods = contactMethods.filter((m) => m.priority);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">

            <div className="max-w-7xl mx-auto">
                {/* Priority Quick Connect Section - Now at the top */}
                <div className="mb-16">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-4">
                            <MessageCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Get in Touch</span>
                        </div>


                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Quick Connect
                            </span>
                        </h2>

                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Choose your preferred method for immediate assistance
                        </p>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {priorityMethods.map((method, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-xl ${method.color} mr-4`}>
                                            <div className={method.iconColor}>{method.icon}</div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{method.title}</h3>
                                            <span className="text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded-full">
                                                {method.badge}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-2">{method.description}</p>
                                <p className="text-xl font-bold text-gray-900 mb-4">{method.details}</p>

                                {method.link ? (
                                    method.link.startsWith("tel:") ? (
                                        // Phone: use onClick to avoid opening new tab
                                        <button
                                            onClick={() => (window.location.href = method.link)}
                                            className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-[50px] text-white font-bold transition-all duration-200 hover:shadow-lg ${method.buttonColor}`}
                                        >
                                           {method.buttonText} <ArrowRight className="w-4 h-4 ml-2" />
                                        </button>
                                    ) : (
                                        // Gmail: open in new tab
                                        <a
                                            href={method.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-[50px] text-white font-bold transition-all duration-200 hover:shadow-lg ${method.buttonColor}`}
                                        >
                                           {method.buttonText}  <ArrowRight className="w-4 h-4 ml-2" />
                                        </a>
                                    )
                                ) : (
                                    <button
                                        disabled
                                        className="w-full inline-flex items-center justify-center px-6 py-3 rounded-[50px] bg-gray-300 text-gray-600 font-bold cursor-not-allowed"
                                    >
                                        Not Available
                                    </button>
                                )}
                            </div>
                        ))}

                    </div>
                    {/* Emergency Contact Banner */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[20px]">Critical Priority Support</h3>
                                    <p className="text-white/90 text-sm">For urgent business issues</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Live</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 rounded-xl p-4">
                            <div className="text-center sm:text-left">
                                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                                    <Clock className="w-4 h-4 text-white/80" />
                                    <span className="text-white/90 text-md font-[500]">Available 24/7</span>
                                </div>
                                <p className="text-white/90 font-[500] text-sm">Immediate response guaranteed</p>
                            </div>

                            <a
                                href="tel:+15551234568"
                                className="group relative bg-white text-red-600 px-6 py-3 rounded-[50px] font-bold transition-all duration-300 text-base flex items-center gap-2 min-w-[160px] justify-center hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-red-100"
                            >
                                {/* Hover ring effect */}
                                <div className="absolute inset-0 rounded-[50px] bg-red-600/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>

                                {/* Button content */}
                                <div className="relative z-10 flex items-center gap-2">
                                    <Phone className="w-4 h-4 transition-transform group-hover:scale-110" />
                                    <span>+1 (555) 123-4568</span>
                                </div>

                                {/* Click to call tooltip */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                    Click to call immediately
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                    {/* Quick Message Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Send className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Send Detailed Message</h2>
                                    <p className="text-gray-600">We'll respond within 2 hours</p>
                                </div>
                            </div>

                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-600 mb-6">We'll get back to you shortly.</p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="normal_input"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Company *
                                            </label>
                                            <input
                                                type="text"
                                                name="company"
                                                required
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="normal_input"
                                                placeholder="Your company name"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="normal_input"
                                                placeholder="your.email@company.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Subject *
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                className="normal_input"
                                                placeholder="What can we help you with?"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            rows={5}
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="normal_input resize-none"
                                            placeholder="Please describe your inquiry in detail..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-[50px] font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                        Send Message
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Additional Contact Options Sidebar */}
                    <div className="space-y-6">
                        {/* Support Hours */}
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:scale-[1.02]">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Support Hours
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-semibold text-green-600">24/7</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Weekends</span>
                                    <span className="font-semibold text-green-600">24/7</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Holidays</span>
                                    <span className="font-semibold text-orange-600">Emergency</span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Contact Methods */}
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:scale-[1.02]">
                            <h3 className="font-bold text-xl mb-6 text-gray-800">Other Ways to Connect</h3>
                            <div className="space-y-3">
                                {contactMethods.map((method, index) => {
                                    const handleClick = () => {
                                        if (!method.link) return;
                                        if (method.link.startsWith("tel:")) {
                                            // Phone: open native dialer
                                            window.location.href = method.link;
                                        } else {
                                            // Email: open Gmail in new tab
                                            window.open(method.link, "_blank", "noopener,noreferrer");
                                        }
                                    };

                                    return (
                                        <div
                                            key={index}
                                            onClick={handleClick}
                                            className="group relative flex items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white cursor-pointer overflow-hidden"
                                        >
                                            {/* Background glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Animated border effect */}
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-blue-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

                                            <div className={`p-3 rounded-xl ${method.color} mr-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                                <div className={`${method.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                                    {method.icon}
                                                </div>
                                            </div>

                                            <div className="flex-1 z-10">
                                                <h4 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                                                    {method.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                                                    {method.details}
                                                </p>
                                                <span className="text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded-full mt-2 inline-block">
                                                    {method.badge}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactAgentPage;
