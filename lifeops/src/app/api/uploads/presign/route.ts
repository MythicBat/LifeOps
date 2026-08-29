import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { s3 } from "@/lib/aws/s3";
import { getAuthenticatedUserSub } from "@/lib/server/cognito-auth";

const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

interface PresignRequest {
    fileName?: string;
    fileType?: string;
    fileSize?: number;
}

function sanitiseFileName(fileName: string): string {
    return fileName
        .trim()
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/-+/g, "-");
}

export async function POST(request: Request) {
    try {
        // Verify the Cognito access token and derive the user identity
        // server-side. Never trust a userId supplied by the browser.
        const userSub = await getAuthenticatedUserSub(request);

        if (!userSub) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 },
            );
        }

        const body = (await request.json()) as PresignRequest;

        const {
            fileName,
            fileType,
            fileSize,
        } = body;

        if (!fileName || !fileType || typeof fileSize !== "number") {
            return NextResponse.json(
                { error: "Missing file metadata." },
                { status: 400 },
            );
        }

        if (!ACCEPTED_FILE_TYPES.includes(fileType)) {
            return NextResponse.json(
                { error: "Invalid file type." },
                { status: 400 },
            );
        }

        if (fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File size exceeds the maximum limit." },
                { status: 400 },
            );
        }

        const bucket = process.env.AWS_S3_BUCKET;

        if (!bucket) {
            throw new Error("AWS Bucket is not configured.");
        }

        const documentId = crypto.randomUUID();
        const safeFileName = sanitiseFileName(fileName);

        const objectKey =
            `users/${userSub}/intake/${documentId}-${safeFileName}`;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            ContentType: fileType,
            Metadata: {
                "lifeops-document-id": documentId,
                "lifeops-source": "universal-drop",
            },
        });

        const uploadUrl = await getSignedUrl(s3, command, {
            expiresIn: 60,
        });

        return NextResponse.json({
            documentId,
            objectKey,
            uploadUrl,
            expiresIn: 60,
        });
    } catch (error) {
        console.error("Presign error:", error);

        return NextResponse.json(
            { error: "Unable to prepare upload." },
            { status: 500 },
        );
    }
}