import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xl bg-[#ebe4dc]", className)}
      {...props} />
  );
}

export { Skeleton }
