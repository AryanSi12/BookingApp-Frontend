import EventGrid from "@/Components/EventGrid";

const GetAllEvents = () => {
  return (
    <EventGrid
      kicker="Browse"
      title="All events"
      subtitle="Poster-led listings with venue, date, and starting price."
    />
  );
};

export default GetAllEvents;
