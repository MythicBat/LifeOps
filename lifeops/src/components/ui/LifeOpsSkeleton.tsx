export function LifeOpsSkeleton({
    className = "",
} : {
    className?: string;
}) {
    return (
        <div className={`animate-pulse rounded-[20px] bg-black/[0.055] ${className}`} />
    );
}