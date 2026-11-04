import { PageHeader, PageShell, EmptyState, ErrorState, Stepper, Surface } from "@/Components/ui/PageShell";
import EventPosterCard from "@/Components/EventPosterCard";

const sample = {
  eventId: "sample",
  title: "Sample night at the hall",
  startTime: new Date().toISOString(),
  eventImage: "",
  venueId: { venueName: "Grand Hall", venueLocation: "Bandra" },
};

export default function Styleguide() {
  return (
    <PageShell>
      <PageHeader
        kicker="Internal"
        title="Styleguide"
        subtitle="Tokens, actions, and the states used across EventSphere."
      />
      <Stepper steps={["Venue", "Details", "Publish"]} current={1} />
      <div className="grid gap-4 md:grid-cols-2">
        <Surface className="space-y-3 p-5">
          <p className="section-kicker">Actions</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="brand-btn">Primary</button>
            <button type="button" className="ghost-btn">Secondary</button>
            <span className="chip">Chip</span>
          </div>
          <input className="field-input" placeholder="Field" readOnly />
        </Surface>
        <EventPosterCard event={sample} variant="wide" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <EmptyState title="Empty" description="Nothing to show yet." />
        <ErrorState title="Error" description="The request did not finish." onRetry={() => {}} />
      </div>
    </PageShell>
  );
}
