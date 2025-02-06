import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-sans font-bold text-gray-900 mb-4">
          Welcome to Z-Training
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Elevate your professional development with our comprehensive training platform.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {[
          {
            icon: GraduationCap,
            title: 'Expert-Led Courses',
            description: 'Learn from industry professionals with years of experience.',
          },
          {
            icon: BookOpen,
            title: 'Comprehensive Library',
            description: 'Access a vast collection of learning resources and materials.',
          },
          {
            icon: Users,
            title: 'Community Learning',
            description: 'Connect with peers and engage in collaborative learning.',
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-custom hover:shadow-lg transition-shadow duration-200"
          >
            <feature.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}