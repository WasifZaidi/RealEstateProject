import React from 'react'

const InnerHeader = ({title, body}) => {
  return (
      <header className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
          {/* Animated Orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-blue-400/10 rounded-full blur-2xl md:blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-purple-400/10 rounded-full blur-2xl md:blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Glass Morphism Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 w-full">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl shadow-blue-500/10 max-w-4xl mx-auto w-[90%] sm:w-full">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed sm:leading-loose">
             {body}
            </p>
          </div>
        </div>
      </header>
  )
}

export default InnerHeader