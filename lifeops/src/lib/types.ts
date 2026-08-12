export type ActivityType = 
    | "bill"
    | "appointment"
    | "subscription"
    | "receipt"
    | "warranty"
    | "renewal";

export interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    detail: string;
    time: string;
}

export interface Decision {
    id: string;
    category: string;
    title: string;
    description: string;
    oldValue?: string;
    newValue?: string;
    impact?: string;
    primaryAction: string;
    secondaryAction: string;
}