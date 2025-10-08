'use client'
import React, { useState } from 'react'
import InnerHeader from '../components/InnerHeader'
import { Search, Plus, Minus, Phone, Building, Cpu, DollarSign, HeadphonesIcon } from 'lucide-react'
const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const faqCategories = [
    {
      title: "General",
      icon: Building,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      gradient: "from-blue-500 to-cyan-500",
      questions: [
        {
          question: "What services do you offer for enterprises?",
          answer: "We provide comprehensive digital transformation services including cloud migration, AI integration, cybersecurity solutions, custom software development, and ongoing technical support tailored for enterprise needs."
        },
        {
          question: "How long does a typical enterprise project take?",
          answer: "Project timelines vary based on complexity, but typically range from 3-12 months. We follow agile methodology with 2-week sprints and provide regular progress updates."
        },
        {
          question: "Do you offer ongoing support and maintenance?",
          answer: "Yes, we provide 24/7 enterprise support with guaranteed 99.9% uptime, regular security updates, performance monitoring, and dedicated account managers."
        }
      ]
    },
    {
      title: "Technical",
      icon: Cpu,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      gradient: "from-purple-500 to-pink-500",
      questions: [
        {
          question: "What technologies do you specialize in?",
          answer: "We specialize in modern tech stacks including React, Node.js, Python, AWS, Azure, Kubernetes, Docker, MongoDB, and enterprise-grade security frameworks."
        },
        {
          question: "How do you ensure data security and compliance?",
          answer: "We implement SOC 2, GDPR, and HIPAA compliant solutions with end-to-end encryption, regular security audits, and enterprise-grade infrastructure protection."
        },
        {
          question: "Can you integrate with our existing systems?",
          answer: "Absolutely. We have extensive experience integrating with legacy systems, ERP platforms, CRM systems, and custom enterprise software through APIs and microservices."
        }
      ]
    },
    {
      title: "Pricing",
      icon: DollarSign,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      gradient: "from-green-500 to-emerald-500",
      questions: [
        {
          question: "What is your pricing model?",
          answer: "We offer flexible pricing including fixed-price projects, dedicated team models, and monthly retainers. Enterprise packages start at $50,000 with custom quotes available."
        },
        {
          question: "Do you offer volume discounts for large enterprises?",
          answer: "Yes, we provide significant discounts for annual contracts and enterprise-scale engagements. Contact our sales team for customized pricing."
        },
        {
          question: "Are there any hidden costs?",
          answer: "No hidden costs. We provide transparent pricing with detailed breakdowns. Any additional work is pre-approved and clearly communicated before proceeding."
        }
      ]
    },
    {
      title: "Support",
      icon: HeadphonesIcon,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      gradient: "from-orange-500 to-red-500",
      questions: [
        {
          question: "What is your response time for support requests?",
          answer: "Critical issues: <15 minutes, High priority: <1 hour, Normal requests: <4 hours. We provide 24/7 enterprise support with dedicated channels."
        },
        {
          question: "Do you provide training for our team?",
          answer: "Yes, we offer comprehensive training programs, documentation, and hands-on workshops to ensure your team is fully equipped to manage the solutions we deliver."
        },
        {
          question: "How do you handle emergency situations?",
          answer: "We have a dedicated emergency response team with escalation protocols, backup systems, and disaster recovery plans to ensure business continuity."
        }
      ]
    }
  ]

  // Filter questions based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <InnerHeader title="FAQ's" body="Frequently Asked Questions" />

      <main className="relative min-h-screen pb-20">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 shadow-lg hover:shadow-xl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto space-y-8">
            {filteredCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <div key={categoryIndex} className="group">
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-2xl ${category.bgColor} transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent ml-4"></div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {category.questions.map((item, questionIndex) => {
                      const globalIndex = categoryIndex * 10 + questionIndex
                      const isOpen = openIndex === globalIndex

                      return (
                        <div
                          key={questionIndex}
                          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-lg overflow-hidden group/question hover:border-gray-300"
                        >
                          <button
                            onClick={() => toggleQuestion(globalIndex)}
                            className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-all duration-300 group-hover/question:bg-gradient-to-r group-hover/question:from-white group-hover/question:to-gray-50/80"
                          >
                            <span className="font-semibold text-gray-900 text-lg pr-4 flex-1">
                              {item.question}
                            </span>
                            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${category.bgColor} ${category.iconColor} transition-all duration-300 ${isOpen ? `bg-gradient-to-br ${category.gradient} text-white shadow-lg` : 'group-hover/question:scale-110'}`}>
                              {isOpen ? (
                                <Minus className="w-4 h-4" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                            </div>
                          </button>

                          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-6 pb-5">
                              <div className={`w-12 h-1 bg-gradient-to-r ${category.gradient} rounded-full mb-4`}></div>
                              <p className="text-gray-600 leading-relaxed text-lg">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 text-lg">
                Try adjusting your search terms or browse the categories above.
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Our team is here to help you get the answers you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[50px] font-semibold overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                  {/* Content */}
                  <Phone size={20} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-10 whitespace-nowrap transition-all duration-300 group-hover:tracking-wide">
                    Contact Support
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default FAQPage