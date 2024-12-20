'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { PageWithFlow } from '@/components/layout/PageWithFlow';
import Link from 'next/link';
import { 
  Globe2, 
  Palette, 
  Code2, 
  BarChart3, 
  Wrench,
  Cpu,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

export default function ServicesPage() {
  const services = [
    {
      icon: Globe2,
      title: "Web Design & Development",
      description: "Beautiful, responsive websites built with modern technologies and optimized for performance and user experience.",
      features: [
        "Custom Website Design",
        "Mobile-First Development",
        "WordPress Solutions",
        "E-commerce Websites"
      ]
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Creating intuitive and engaging user experiences that look great and work even better for your visitors.",
      features: [
        "User Interface Design",
        "Brand Integration",
        "Interactive Prototypes",
        "Accessibility Focus"
      ]
    },
    {
      icon: Code2,
      title: "Website Features",
      description: "Custom functionality and integrations to make your website work harder for your business.",
      features: [
        "Contact Forms",
        "Booking Systems",
        "Payment Integration",
        "Content Management"
      ]
    },
    {
      icon: BarChart3,
      title: "Digital Marketing",
      description: "Strategic digital marketing to increase your online visibility and attract more customers to your website.",
      features: [
        "SEO Optimization",
        "Content Strategy",
        "Social Media",
        "Analytics Setup"
      ]
    },
    {
      icon: Cpu,
      title: "AI Chat Integration",
      description: "Enhance your website with intelligent chatbots to improve customer service and engagement.",
      features: [
        "24/7 Customer Support",
        "Lead Generation",
        "FAQ Automation",
        "Custom Responses"
      ]
    },
    {
      icon: Wrench,
      title: "Website Care",
      description: "Keep your website secure, up-to-date, and performing at its best with our maintenance services.",
      features: [
        "Regular Updates",
        "Security Monitoring",
        "Content Updates",
        "Technical Support"
      ]
    }
  ];

  return (
    <PageWithFlow variant="dark" opacity={0.4}>
      <main className="relative z-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16">
          <div className="relative z-10">
            <div className="container mx-auto px-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center"
              >
                <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-black leading-tight">
                  Transforming Digital<br />
                  Visions into Reality
                </h1>
                <div className="max-w-4xl mx-auto">
                  <div className="pt-12">
                    <p className="text-base md:text-lg mb-6 text-black">
                      We provide a full suite of digital solutions thoughtfully crafted to fit your unique needs. From visually engaging web design and intuitive user experiences, to strategic marketing and rock-solid development, we&apos;re committed to helping your business stand out in an ever-evolving online world.
                    </p>
                    <p className="text-base md:text-lg text-black">
                      Our approach is simple: we listen, collaborate, and deliver solutions designed to move your business forward. Whether you&apos;re launching a new venture or looking to optimize your current digital presence, we&apos;re here to guide you every step of the way—ensuring your brand not only thrives, but leads the pack.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="relative py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={container}
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="group relative overflow-hidden rounded-2xl bg-white/95 p-6 shadow-xl 
                    transition-all duration-300 hover:shadow-2xl border border-neutral-200
                    backdrop-blur-sm transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/80 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="mb-4 inline-block rounded-full bg-neutral-100 p-3">
                      <service.icon className="h-6 w-6 text-black" />
                    </div>
                    
                    <h3 className="mb-3 text-2xl font-bold text-black">
                      {service.title}
                    </h3>
                    
                    <p className="mb-4 text-neutral-700">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li 
                          key={idx}
                          className="flex items-center text-neutral-600"
                        >
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-black" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-neutral-900 text-white py-32">
          <motion.div 
            className="container mx-auto px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-4xl md:text-6xl mb-8">
                Ready to Transform Your Digital Presence?
              </h2>
              <p className="text-xl mb-12 text-neutral-300">
                Let&apos;s create something extraordinary together. Contact us today to discuss your project and discover how we can help bring your vision to life.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 
                  rounded-full hover:bg-neutral-900 hover:text-white hover:scale-105
                  hover:border-white transition-all duration-300 font-medium text-lg
                  border-2 border-white shadow-lg hover:shadow-xl gap-2"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </PageWithFlow>
  );
}