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
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </Surface>
  );
}
