import {
    ChevronRight,
    CreditCard,
    FileText,
    HeartPulse,
    RefreshCcw,
    ShieldCheck,
    WalletCards,
} from "lucide-react";

import type { VaultItem } from "@/lib/vault";

export function VaultCard({
    item,
    onClick,
} : {
    item: VaultItem;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex min-h-[220px] w-full flex-col rounded-[28px] border border-black/[0.055] bg-white p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.025)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(0,0,0,0.07)]"
        >
            <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#f5f5f7]">
                    {renderIcon(item.type)}
                </div>

                <ChevronRight
                    size={18}
                    className="text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-600"
                />
            </div>

            <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    {formatType(item.type)}
                </p>

                <h3 className="mt-2 line-clamp-2 text-[19px] font-semibold tracking-[-0.025em] text-zinc-950">
                    {item.title}
                </h3>

                {item.subtitle && (
                    <p className="mt-1 truncate text-sm text-zinc-400">{item.subtitle}</p>
                )}
            </div>

            <div className="mt-auto pt-7">
                {item.amount !== undefined ? (
                    <p className="text-[22px] font-semibold tracking-[-0.035em] text-zinc-950">
                        {formatMoney(item.amount, item.currency)}
                    </p>
                ) : item.date ? (
                    <p className="text-sm font-medium text-zinc-700">
                        {formatDate(item.date)}
                    </p>
                ) : (
                    <p className="text-sm text-zinc-400">
                        Tracked by LifeOps
                    </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                    <StatusBadge
                        status={item.status}
                    />

                    {item.date && item.amount !== undefined && (
                        <span className="text-xs text-zinc-400">
                            {formatDate(item.date)}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}

function StatusBadge({
    status,
} : {
    status?: string;
}) {
    if (!status) { return null; }

    return (
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium capitalize text-zinc-500">
            {status}
        </span>
    );
}

function renderIcon(type: string) {
    const props = {
        size: 18,
        strokeWidth: 1.8,
        className: "text-zinc-600",
    };

    switch (type) {
        case "subscription":
            return <WalletCards {...props} />;
        case "obligation":
            return <CreditCard {...props} />;
        case "warranty":
            return <ShieldCheck {...props} />;
        case "renewal":
            return <RefreshCcw {...props} />;
        case "appointment":
            return <HeartPulse {...props} />;
        case "receipt":
            return <FileText {...props} />;
        case "invoice":
            return <CreditCard {...props} />;
        default:
            return <FileText {...props} />;
    }
}

function formatType(value: string) {
    return value.replaceAll("_", " ");
}

function formatMoney(amount: number, currency?: string) {
    try {
        return new Intl.NumberFormat(
            "en-AU",
            {
                style: "currency",
                currency: currency ?? "AUD",
                minimumFractionDigits: 2,
            }
        ).format(Number(amount));
    } catch {
        return `$${Number(amount).toFixed(2)}`;
    }
}

function formatDate(value: string) {
    try {
        return new Intl.DateTimeFormat(
            "en-AU",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        ).format(new Date(value))
    } catch {
        return value;
    }
}