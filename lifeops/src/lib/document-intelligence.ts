export interface ExtractedField {
    type: string;
    label?: string;
    value?: string;
    confidence?: number;
}

export interface LifeOpsDocumentAnalysis {
    documentId: string;
    objectKey: string;
    documentType: "bill" | "receipt" | "invoice" | "document";
    vendor?: string;
    total?: number;
    currency?: string;
    invoiceNumber?: string;
    date?: string;
    dueDate?: string;
    accountNumber?: string;
    fields: ExtractedField[];
    rawFieldCount: number;
}