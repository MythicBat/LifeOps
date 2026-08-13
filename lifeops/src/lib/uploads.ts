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
    const presignResponse = await fetch("/api/uploads/presign",
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

    const uploadResponse = await fetch(uploadUrl, {
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