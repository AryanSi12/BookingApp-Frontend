import { Link } from "react-router-dom";
import { ErrorState, PageShell } from "@/Components/ui/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <ErrorState
        title="Page not found"
        description="That address is not part of EventSphere. Head back to the listings."
        action={
          <Link to="/" className="ghost-btn">
            Go home
          </Link>
        }
      />
    </PageShell>
  );
}
