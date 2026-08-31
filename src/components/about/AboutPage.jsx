import { MissionSection } from './MissionSection';
import { MembersSection } from './MembersSection';
import { FounderSection } from './FounderSection';

export function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-brand-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-orange blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
                De Melody Beats
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              A Christian based Chorale focused on Hymns, classicals, folk tunes, 
              contemporary art songs and gospel songs.
            </p>
            <p className="mt-4 text-brand-gold font-heading text-lg italic">
              "More Than Music"
            </p>
          </div>
        </div>
      </section>

      <MissionSection />
      <FounderSection />
      <MembersSection />
    </>
  );
}