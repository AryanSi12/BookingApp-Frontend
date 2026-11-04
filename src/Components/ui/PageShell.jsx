import { cn } from "@/lib/utils";

export function PageShell({ children, className, narrow = false }) {
  return (
    <div className={cn("pb-16 pt-24 md:pt-28", className)}>
      <div className={cn(narrow ? "mx-auto w-full max-w-3xl px-4 md:px-6" : "page-shell")}>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ kicker, title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl fade-up">
        {kicker && <p className="section-kicker mb-2">{kicker}</p>}
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm leading-relaxed text-slate-500 md:text-base">{subtitle}</p>}
      </div>
      {action && <div className="fade-up-delay shrink-0">{action}</div>}
    </div>
  );
}

export function Surface({ children, className }) {
  return <div className={cn("surface-card", className)}>{children}</div>;
}

export function EmptyState({ title, description, action }) {
  return (
    <Surface className="px-6 py-16 text-center">
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </Surface>
  );
}

export function ErrorState({ title = "Something went wrong", description, onRetry, action }) {
  return (
    <Surface className="px-6 py-16 text-center">
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button type="button" onClick={onRetry} className="brand-btn">
            Try again
          </button>
        )}
        {action}
      </div>
    </Surface>
  );
}

export function Stepper({ steps, current }) {
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-2 text-sm">
      {steps.map((step, index) => {
        const active = index === current;
        const done = index < current;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${
                active
                  ? "bg-primary text-primary-foreground"
                  : done
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </span>
            <span className={active ? "font-semibold text-foreground" : "text-muted-foreground"}>{step}</span>
            {index < steps.length - 1 && <span className="mx-1 hidden h-px w-6 bg-border sm:inline-block" />}
          </li>
        );
      })}
    </ol>
  );
}

export function AuthFrame({ kicker, title, lede, children }) {
  return (
    <PageShell>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-stretch">
        <div className="hidden flex-col justify-end overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-card md:flex">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">{kicker}</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold">{title}</h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/85">{lede}</p>
        </div>
        <Surface className="p-6 md:p-8">{children}</Surface>
      </div>
    </PageShell>
  );
}
