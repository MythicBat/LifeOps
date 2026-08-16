import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { NextResponse } from "next/server";
import { textract } from "@/lib/aws/textract";

export async function POST(request: Request) {
    try {
        const {documentId, objectKey} = await request.json();

        if (!documentId || !objectKey) {
            return NextResponse.json(
                {error: "Missing document information"},
                {status: 400},
            );
        }

        const bucket = process.env.AWS_S3_BUCKET;

        if (!bucket) {
            throw new Error("AWS_S3_BUCKET is missing.");
        }

        const command = new AnalyzeDocumentCommand({
            Document: {
                S3Object: {
                    Bucket: bucket,
                    Name: objectKey,
                },
            },
            FeatureTypes: ["FORMS", "TABLES", "LAYOUT", "QUERIES"],
            QueriesConfig: {
                Queries: [
                    {
                        Text: "What is the appointment date?",
                        Alias: "APPOINTMENT_DATE",
                    },
                    {
                        Text: "What is the appointment time?",
                        Alias: "APPOINTMENT_TIME",
                    },
                    {
                        Text: "What is the renewal date?",
                        Alias: "RENEWAL_DATE",
                    },
                    {
                        Text: "What is the expiry date?",
                        Alias: "EXPIRY_DATE",
                    },
                    {
                        Text: "What is the location?",
                        Alias: "LOCATION",
                    },
                ],
            },
        });

        const response = await textract.send(command);

        return NextResponse.json({
            success: true,
            documentId,
            objectKey,
            blocks: response.Blocks ?? [],
        });
    } catch (error) {
        console.error("General Textract error: ", error);

        return NextResponse.json(
            {success: false, error: "Unable to analyse document"},
            {status: 500},
        );
    }
}