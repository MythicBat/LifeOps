export type TimelineKind = 
    | "activity"
    | "obligation"
    | "appointment"
    | "renewal"
    | "warranty"
    | "decision";

export interface TimelineItem {
    id: string;
    kind: TimelineKind;
    title: string;
    description?: string;
    date?: string;
    status?: string;
    priority?: number;
}

export async function getTimeline(): Promise<TimelineItem[]> {
    const response = await fetch("/api/timeline", {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Unable to load timeline.");
    }

    const data = await response.json();

    return data.items ?? [];
}