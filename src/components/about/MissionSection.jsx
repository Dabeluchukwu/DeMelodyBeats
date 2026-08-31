"use client";

import { motion } from "framer-motion";
import { Heart, Users, Music2, GraduationCap, Briefcase, Building, Sparkles } from 'lucide-react';

const missionPoints = [
  {
    icon: Heart,
    title: 'Charity Visitations',
    description: 'Visiting hospitals, orphanage homes, and churches to share love and hope through music.',
    color: 'from-rose-500/20 to-orange-500/20',
    iconColor: 'text-rose-500',
  },
  {
    icon: Users,
    title: 'Community Outreach',
    description: 'Engaging with local communities through music, health talks, and hygiene practices.',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
  },
  {
    icon: Music2,
    title: 'Music Ministry',
    description: 'Ministering in songs, sharing the love of Jesus Christ through gospel music.',
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-amber-500',
  },
  {
    icon: GraduationCap,
    title: 'Scholarship Support',
    description: 'Supporting education through scholarships for deserving students in our community.',
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: Briefcase,
    title: 'Youth Empowerment',
    description: 'Empowering young people through mentorship, skill development, and opportunities.',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
  {
    icon: Building,
    title: 'Support Small Businesses',
    description: 'Contributing to local economic growth by supporting small businesses.',
    color: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-500',
  },
];

export function MissionSection() {
  return (
    <section className="py-24 bg-white dark:bg-brand-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-brand-orange/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-brand-gold/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-4">
            <Sparkles className="h-3 w-3" />
            Our Purpose
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Our Mission
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            We believe we can make our community a better place by contributing immensely. 
            Through music, education, and compassion, we reach out to those in need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missionPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl bg-gray-50 dark:bg-brand-black/50 border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-500 hover:shadow-xl hover:shadow-brand-orange/5 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-opacity-10 bg-brand-orange/10 ${point.iconColor} group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white mb-2">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}