import Image from "next/image";

async function getAgent(agentId) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent/${agentId}`, {
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch agent");
        const data = await res.json();
        return data.agent || null;
    } catch (err) {
        console.error("Error fetching agent:", err);
        return null;
    }
}

export default async function AgentProfilePage({ params }) {
    const agent = await getAgent(params.id);

    if (!agent) {
        return (
            <section className="min-h-screen flex items-center justify-center py-24">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Agent Not Found</h1>
                    <p className="text-gray-600">The agent you're looking for doesn't exist.</p>
                </div>
            </section>
        );
    }

    const {
        name,
        image,
        bio,
        designation,
        experienceYears,
        specialization = [],
        languages = [],
        socialLinks = {},
        performance = {},
    } = agent;

    const stats = [
        {
            label: "Total Listings",
            value: performance.totalListings || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            label: "Sold Properties",
            value: performance.soldProperties || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: "Happy Clients",
            value: performance.totalClients || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            label: "Rating",
            value: performance.rating ? `${performance.rating}/5` : "N/A",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ),
        },
    ];

    return (
        <section className="min-h-screen py-12 bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="container">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200/60">
                        <div className="lg:flex">
                            {/* Left Side - Profile Image & Basic Info */}
                            <div className="lg:w-2/5 p-8 lg:p-12 bg-gradient-to-br from-blue-50 to-indigo-50/50">
                                <div className="text-center lg:text-left">
                                    {/* Profile Image - Fixed 600x700 dimensions */}
                                    <div className="relative mx-auto lg:mx-0 mb-8">
                                        <div className="w-full max-w-[300px] lg:max-w-[400px] xl:max-w-[500px] aspect-[600/700] mx-auto">
                                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                                <Image
                                                    src={image || "/default-avatar.jpg"}
                                                    alt={name}
                                                    width={600}
                                                    height={700}
                                                    quality={100}
                                                    className="object-cover w-full h-full"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{name}</h2>
                                            <p className="text-blue-600 font-semibold text-lg">{designation}</p>
                                        </div>

                                        {/* Experience */}
                                        <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-600">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-medium">{experienceYears} Years Experience</span>
                                        </div>

                                        {/* Social Links */}
                                        {Object.keys(socialLinks).length > 0 && (
                                            <div className="pt-4 border-t border-gray-200">
                                                <p className="text-sm font-medium text-gray-500 mb-3">Connect With Me</p>
                                                <div className="flex justify-center lg:justify-start gap-3">
                                                    {socialLinks.linkedin && (
                                                        <a
                                                            href={socialLinks.linkedin}
                                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 transition-all hover:scale-110"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {socialLinks.twitter && (
                                                        <a
                                                            href={socialLinks.twitter}
                                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-400 border border-blue-100 transition-all hover:scale-110"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {socialLinks.facebook && (
                                                        <a
                                                            href={socialLinks.facebook}
                                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 transition-all hover:scale-110"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Detailed Information */}
                            <div className="lg:w-3/5 p-8 lg:p-12">
                                {/* Performance Stats */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    {stats.map((stat, index) => (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 text-center border border-gray-200/60 hover:border-blue-200 transition-all hover:shadow-lg"
                                        >
                                            <div className="text-blue-500 mb-2 flex justify-center">
                                                {stat.icon}
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                            <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bio Section */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <div className="w-[4px] h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                                        About Me
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">{bio}</p>
                                </div>

                                {/* Specialization & Languages */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Specialization */}
                                    <div>
                                        <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            Specialization
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {specialization.map((spec, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    <div>
                                        <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                            </svg>
                                            Languages
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {languages.map((lang, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100"
                                                >
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}