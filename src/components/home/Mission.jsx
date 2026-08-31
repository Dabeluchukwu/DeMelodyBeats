import { BRAND } from "@/lib/constants";

export function Mission() {
  return (
    <section className="py-16 bg-white dark:bg-brand-black border-y border-brand-orange/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Our Mission
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            We minister in songs to people, share the love of Jesus Christ, 
            give health talks and hygiene practices, and the benefits of fitness and exercise.
          </p>
          <p className="mt-4 text-brand-orange font-heading text-xl font-bold">
            "{BRAND.mission}"
          </p>
        </div>
      </div>
    </section>
  );
}