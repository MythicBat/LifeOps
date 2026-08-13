import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
];

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 },
            );
        }

        if (!ACCEPTED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Unsupported file type" },
                { status: 400 },
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large" },
                { status: 400 },
            );
        }

        const category = file.type.startsWith("image/")
            ? "image" : file.type === "application/pdf" ? "document" : "unknown";
        
        const result = {
            id: crypto.randomUUID(),
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            category,
            status: "received",
            createdAt: new Date().toISOString(),
        };

        // Later:
        //
        // 1. Generate an S3 object key
        // 2. Upload/store the document
        // 3. Trigger Textract
        // 4. Send extracted content to strands
        // 5. Create a LifeObject in DynamoDB

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error processing file upload:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}