import React from 'react'
import { CheckCircle, Shield, Zap, Users, Award, TrendingUp } from 'lucide-react'
import { outfit } from '@/utils/fonts'

const WhyUs = () => {
    const features = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Trusted & Secure",
            description: "Enterprise-grade security with 99.9% uptime guarantee and SOC 2 compliance to protect your data."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Lightning Fast",
            description: "Optimized performance with sub-second response times and cutting-edge infrastructure."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Expert Support",
            description: "24/7 dedicated support team with industry experts ready to help you succeed."
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Award Winning",
            description: "Recognized by industry leaders and trusted by over 10,000+ satisfied customers worldwide."
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Proven Results",
            description: "Average 3x ROI improvement with measurable outcomes and transparent reporting."
        },
        {
            icon: <CheckCircle className="w-8 h-8" />,
            title: "Easy Integration",
            description: "Seamless setup in minutes with comprehensive APIs and developer-friendly documentation."
        }
    ]

    return (
      <></>
    )
}

export default WhyUs