import { initials, cn } from "@/lib/utils";

type Props = {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
};

export function Avatar({ name, color, size = "md", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-black",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({
  people,
  max = 4,
}: {
  people: Array<{ name: string; color: string }>;
  max?: number;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p) => (
        <Avatar key={p.name} name={p.name} color={p.color} size="sm" />
      ))}
      {extra > 0 && (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface text-[10px] font-semibold text-cyan ring-2 ring-black border border-white/10">
          +{extra}
        </span>
      )}
    </div>
  );
}
