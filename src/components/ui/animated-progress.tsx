import { cn } from "@/lib/utils";

export function AnimatedProgress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
