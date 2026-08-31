import { Hero } from "./Hero";
import { Mission } from "./Mission";
import { UpcomingShows } from "./UpcomingShows";
import { MusicPreview } from "./MusicPreview";
import { NewsletterSignup } from "./NewsletterSignup";

export function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <UpcomingShows />
      <MusicPreview />
      <NewsletterSignup />
    </>
  );
}