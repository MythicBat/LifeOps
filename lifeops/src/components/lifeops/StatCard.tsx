interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({
  value,
  label,
}: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
      <p className="text-3xl font-semibold tracking-tight text-zinc-950">
        {value}
      </p>

      <p className="mt-2 text-sm text-zinc-400">
        {label}
      </p>
    </div>
  );
}