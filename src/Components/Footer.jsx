import { Link } from "react-router-dom";

const groups = [
  {
    title: "Discover",
    links: [
      { to: "/get-all-events", label: "All events" },
      { to: "/book-events", label: "Book tickets" },
      { to: "/explore", label: "Explore" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Sign in" },
      { to: "/signup-user", label: "Create account" },
      { to: "/my-bookings", label: "My bookings" },
    ],
  },
  {
    title: "Host",
    links: [
      { to: "/signup-organizer", label: "Become an organizer" },
      { to: "/create-event", label: "Create an event" },
      { to: "/create-venue", label: "Add a venue" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-card">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="font-display text-xl font-extrabold text-foreground">
            Event<span className="text-primary">Sphere</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Discover shows, choose a seat, and keep the ticket on your phone.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm font-medium text-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
