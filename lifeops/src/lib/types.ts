import type { LifeOpsDocumentAnalysis } from "./document-intelligence";

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

export type IntakeStatus = 
    | "idle"
    | "uploading"
    | "analyzing"
    | "complete"
    | "error";

export interface IntakeResult {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    category: "document" | "image" | "unknown";
    status: "received" | "analysed";
    createdAt: string;
    analysis?: LifeOpsDocumentAnalysis;
}