import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';

export function ContactPage() {
  return (
    <div className="min-h-screen pt-10 pb-16 bg-white dark:bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Have a question, booking inquiry, or want to collaborate? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}