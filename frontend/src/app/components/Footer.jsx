import React from 'react'
import { Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-md border-t border-gray-100/50">
      <div className="max-w-7xl mx-auto px-6 py-12 pb-[12px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">PropertyFinder</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Discover your dream home with our advanced search and personalized property recommendations.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Explore</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  Buy Properties
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  Rent Properties
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  New Listings
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  Contact Agent
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Stay Updated</h4>
            <p className="text-sm text-gray-600">Subscribe to our newsletter for the latest property updates.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-3 px-4 bg-white/70 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-100/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} PropertyFinder. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>

  )
}

export default Footer