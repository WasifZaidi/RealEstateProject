import Image from "next/image";

async function getAgents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents`, {
      cache: "no-store", // ✅ SSR - always fresh data
    });

    if (!res.ok) throw new Error("Failed to fetch agents");
    const data = await res.json();
    return data.agents || [];
  } catch (err) {
    console.error("Error fetching agents:", err);
    return [];
  }
}

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <section className="py-14 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-100">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Our Real Estate Agents
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              Meet Our Agents
            </span>
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Meet the top-performing real estate professionals helping you find your dream home.
            <span className="text-gray-900 font-medium"> Trusted, experienced, and dedicated.</span>
          </p>
        </div>

        {/* Enhanced Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {agents.map((agent, index) => {
            const leader = {
              name: `${agent.profile.firstName} ${agent.profile.lastName}`,
              role: agent.profile.designation || "Real Estate Agent",
              bio: agent.profile.bio || "Passionate about connecting people with their perfect properties.",
              image: agent.profile.profileImage?.url || "/default-avatar.jpg",
              experience: agent.profile.experienceYears
                ? `${agent.profile.experienceYears} Years`
                : "Expert",
              social: {
                linkedin: agent.profile.socialLinks?.linkedin,
                twitter: agent.profile.socialLinks?.twitter,
                email: agent.profile.email,
              },
            };

            return (
              <div key={agent.agentId} className="group relative cursor-pointer">
                {/* Card Container with Enhanced Glass Effect */}
                <div className="relative h-full bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100/50 border border-gray-200/80">

                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-indigo-600/0 rounded-3xl group-hover:from-blue-600/8 group-hover:via-purple-600/5 group-hover:to-indigo-600/8 transition-all duration-500 z-10 pointer-events-none"></div>

                  {/* Enhanced Image Container */}
                  <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover transition-all duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={index < 2}
                    />

                    {/* Enhanced Gradient Overlay on Image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Social Links - Enhanced on Hover */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      {leader.social.linkedin && (
                        <a
                          href={leader.social.linkedin}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-blue-600 text-gray-600 hover:text-white border border-white/60 hover:border-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md"
                          aria-label={`Connect with ${leader.name} on LinkedIn`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      {leader.social.twitter && (
                        <a
                          href={leader.social.twitter}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-blue-400 text-gray-600 hover:text-white border border-white/60 hover:border-blue-300 transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md"
                          aria-label={`Follow ${leader.name} on Twitter`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        </a>
                      )}
                      {leader.social.email && (
                        <a
                          href={`mailto:${leader.social.email}`}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-green-500 text-gray-600 hover:text-white border border-white/60 hover:border-green-400 transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md"
                          aria-label={`Email ${leader.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Experience Badge */}
                    <div className="absolute top-4 right-4 opacity-90 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                        {leader.experience}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="relative p-6 bg-gradient-to-b from-white to-gray-200/70 h-full">
                    {/* Name and Role */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 transition-all duration-300 group-hover:text-blue-600">
                        {leader.name}
                      </h3>

                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="h-px w-6 bg-gradient-to-r from-transparent to-blue-400"></div>
                        <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                          {leader.role}
                        </p>
                        <div className="h-px w-6 bg-gradient-to-l from-transparent to-blue-400"></div>
                      </div>
                    </div>

                    {/* Enhanced Decorative Line */}
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 mx-auto transition-all duration-500 group-hover:w-16 group-hover:from-blue-600 group-hover:to-purple-600"></div>

                    {/* Bio Section */}
                    <div className="text-center">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors mb-4">
                        {leader.bio}
                      </p>

                      {/* Enhanced Connect Section */}
                      <div className="mt-5 pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Connect With Me</span>

                          {/* Social Links Row */}
                          <div className="flex gap-3">
                            {leader.social.linkedin && (
                              <a
                                href={leader.social.linkedin}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 group/btn border border-blue-100 hover:border-blue-200 text-xs font-medium"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                                LinkedIn
                              </a>
                            )}

                            {leader.social.twitter && (
                              <a
                                href={leader.social.twitter}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-600 transition-all duration-300 group/btn border border-blue-100 hover:border-blue-200 text-xs font-medium"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                                Twitter
                              </a>
                            )}
                          </div>

                          {/* Email Link */}
                          {leader.social.email && (
                            <a
                              href={`mailto:${leader.social.email}`}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 group/btn border border-green-100 hover:border-green-200 text-xs font-medium"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Send Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Corner Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}