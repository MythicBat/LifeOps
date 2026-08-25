import { authFetch } from "./auth/auth-fetch";
import type { LifeOpsDocumentAnalysis } from "./document-intelligence";

export interface UploadedDocument {
    documentId: string;
    objectKey: string;
}

interface PresignResponse {
    documentId: string;
    objectKey: string;
    uploadUrl: string;
    expiresIn: number;
}

export async function uploadToLifeOps(file: File): Promise<UploadedDocument> {
    const presignResponse = await authFetch("/api/uploads/presign",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
            }),
        }
    );

    const presignData = await presignResponse.json();

    if (!presignResponse.ok) {
        throw new Error(presignData.error ?? "Failed to get presigned URL.");
    }

    const {
        uploadUrl,
        documentId,
        objectKey,
    } = presignData as PresignResponse;

    const uploadResponse = await authFetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
        },
        body: file,
    });

    if (!uploadResponse.ok) {
        throw new Error("Upload to LifeOps failed.");
    }

    return {
        documentId,
        objectKey,
    };
}

export async function analyseLifeOpsDocument(document: UploadedDocument): Promise<LifeOpsDocumentAnalysis> {
    const response = await authFetch("/api/documents/analyse",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                documentId: document.documentId,
                objectKey: document.objectKey,
            }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ?? data.error ?? "Document analysis failed.",
        );
    }

    return data.analysis;
}