import type {
    AnalyzeExpenseCommandOutput,
    ExpenseField,
} from "@aws-sdk/client-textract";

import type {
    ExtractedField,
    LifeOpsDocumentAnalysis,
} from "@/lib/document-intelligence";

function normaliseField(field: ExpenseField): ExtractedField {
    return {
        type: field.Type?.Text ?? "UNKNOWN",
        label: field.LabelDetection?.Text,
        value: field.ValueDetection?.Text,
        confidence: field.ValueDetection?.Confidence,
    };
}

function getFieldValue(fields: ExtractedField[], ...types: string[]) : string | undefined {
    const acceptedTypes = types.map((type) => type.toLowerCase());
    const match = fields.find(
        (field) => acceptedTypes.includes(field.type.toUpperCase()) && field.value,
    );

    return match?.value;
}

function parseMoney(value?: string) : number | undefined {
    if (!value) {
        return undefined;
    }

    const cleaned = value.replace(/[^0-9.-]/g, "").replace(/,/g, "");
    const number = Number.parseFloat(cleaned);

    return Number.isFinite(number) ? number : undefined;
}

function detectDocumentType(fields: ExtractedField[]): LifeOpsDocumentAnalysis["documentType"] {
    const types = new Set(
        fields.map((field) => field.type.toLowerCase()),
    );

    if (types.has("INVOICE_RECEIPT_ID") || types.has("DUE_DATE")) {
        return "invoice";
    }

    if (types.has("TOTAL") && types.has("VENDOR_NAME")) {
        return "receipt";
    }

    return "document";
}

export function normaliseExpenseAnalysis(
    response: AnalyzeExpenseCommandOutput,
    input: { documentId: string; objectKey: string },
) : LifeOpsDocumentAnalysis {
    const expenseDocuments = response.ExpenseDocuments ?? [];

    const fields: ExtractedField[] = expenseDocuments.flatMap((document) => (
        document.SummaryFields ?? []
    ).map(normaliseField));

    const vendor = getFieldValue(fields, "VENDOR_NAME");
    const totalText = getFieldValue(fields, "TOTAL", "AMOUNT_DUE");
    const invoiceNumber = getFieldValue(fields, "INVOICE_RECEIPT_ID");
    const date = getFieldValue(fields, "INVOICE_RECEIPT_DATE");
    const dueDate = getFieldValue(fields, "DUE_DATE");
    const accountNumber = getFieldValue(fields, "ACCOUNT_NUMBER");
    const currency = getFieldValue(fields, "CURRENCY");

    return {
        documentId: input.documentId,
        objectKey: input.objectKey,
        documentType: detectDocumentType(fields),
        vendor,
        total: parseMoney(totalText),
        currency,
        invoiceNumber,
        date,
        dueDate,
        accountNumber,
        fields,
        rawFieldCount: fields.length,
    };

}