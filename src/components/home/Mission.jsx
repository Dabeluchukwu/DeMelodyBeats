"use client";

import { motion } from "framer-motion";
import { 
  HeartHandshake, 
  Users, 
  Mic, 
  GraduationCap, 
  Sparkles, 
  Building2,
  ArrowRight,
  Music4,
  Church,
  HandHelping,
  School,
  Briefcase,
} from "lucide-react";

const impactStats = [
  { value: "50+", label: "Community Events", icon: Users },
  { value: "100+", label: "Lives Touched", icon: HeartHandshake },
  { value: "5+", label: "Outreach Programs", icon: Sparkles },
  { value: "10+", label: "Partner Organizations", icon: Building2 },
];

const impactAreas = [
  {
    icon: HeartHandshake,
    title: "Charity & Visitations",
    description: "Bringing hope through music to hospitals, orphanages, and communities in need.",
    color: "from-rose-500/20 to-orange-500/20",
    iconColor: "text-rose-500",
  },
  {
    icon: Mic,
    title: "Music & Worship",
    description: "Sharing the love of Jesus Christ through powerful gospel music and worship.",
    color: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-amber-500",
  },
  {
    icon: HandHelping,
    title: "Health & Wellness",
    description: "Promoting health talks, hygiene practices, and the benefits of fitness.",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: School,
    title: "Education & Scholarships",
    description: "Supporting deserving students through scholarships and educational programs.",
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Briefcase,
    title: "Youth Empowerment",
    description: "Equipping young people with skills, mentorship, and opportunities for growth.",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: Church,
    title: "Church Partnership",
    description: "Collaborating with churches to spread the message of hope and salvation.",
    color: "from-indigo-500/20 to-violet-500/20",
    iconColor: "text-violet-500",
  },
];

export function Mission() {
  return (
    <section className="py-24 bg-white dark:bg-brand-black relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-brand-orange/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-brand-gold/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-4">
            <Sparkles className="h-3 w-3" />
            Making a Difference
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Transforming{' '}
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Communities
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            We believe music is more than sound — it's a vehicle for change, healing, and hope. 
            Through our outreach programs, we're building stronger, healthier communities.
          </p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand-orange/5 to-brand-gold/5 border border-brand-orange/10"
              >
                <div className="flex justify-center mb-2">
                  <Icon className="h-8 w-8 text-brand-orange" />
                </div>
                <div className="text-3xl md:text-4xl font-bold font-heading text-brand-orange">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Impact Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl bg-gray-50 dark:bg-brand-black/50 border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-500 hover:shadow-xl hover:shadow-brand-orange/5 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-opacity-10 bg-brand-orange/10 ${area.iconColor} group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white mb-2">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-r from-brand-orange/10 to-brand-gold/10 border border-brand-orange/20">
            <p className="text-xl md:text-2xl font-heading text-brand-orange font-bold italic">
              "Together, we're making our community a better place, one song at a time."
            </p>
            {/* <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
              <span>Join us in our mission</span>
              <ArrowRight className="h-4 w-4 text-brand-orange" />
            </div> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}