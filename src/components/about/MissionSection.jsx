import { Heart, Users, Music2, GraduationCap, Briefcase, Building } from 'lucide-react';

const missionPoints = [
  {
    icon: Heart,
    title: 'Charity Visitations',
    description: 'Visiting hospitals, orphanage homes, and churches to share love and hope through music.',
  },
  {
    icon: Users,
    title: 'Community Outreach',
    description: 'Engaging with local communities through music, health talks, and hygiene practices.',
  },
  {
    icon: Music2,
    title: 'Music Ministry',
    description: 'Ministering in songs, sharing the love of Jesus Christ through gospel music.',
  },
  {
    icon: GraduationCap,
    title: 'Scholarship Support',
    description: 'Supporting education through scholarships for deserving students in our community.',
  },
  {
    icon: Briefcase,
    title: 'Youth Empowerment',
    description: 'Empowering young people through mentorship, skill development, and opportunities.',
  },
  {
    icon: Building,
    title: 'Support Small Businesses',
    description: 'Contributing to local economic growth by supporting small businesses.',
  },
];

export function MissionSection() {
  return (
    <section className="py-16 bg-white dark:bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Our Mission
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            We believe we can make our community a better place by contributing immensely. 
            Through music, education, and compassion, we reach out to those in need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missionPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-brand-black/50 hover:border-brand-orange transition-all duration-300 card-hover"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-brand-orange/10 text-brand-orange">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-brand-orange">
                    {point.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}