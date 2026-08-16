import {
  AnalyzeDocumentCommand,
  AnalyzeExpenseCommand,
} from "@aws-sdk/client-textract";

import {
  NextResponse,
} from "next/server";

import {
  textract,
} from "@/lib/aws/textract";

import {
  normaliseExpenseAnalysis,
} from "@/lib/aws/normalise-expense";

interface AnalyseRequest {
  documentId?: string;
  objectKey?: string;
}

export async function POST(
  request: Request,
) {
  try {
    const {
      documentId,
      objectKey,
    } =
      (await request.json()) as AnalyseRequest;

    if (
      !documentId ||
      !objectKey
    ) {
      return NextResponse.json(
        {
          error:
            "Missing document information.",
        },
        {
          status: 400,
        },
      );
    }

    const bucket =
      process.env.AWS_S3_BUCKET;

    if (!bucket) {
      throw new Error(
        "AWS_S3_BUCKET is not configured.",
      );
    }

    const command =
      new AnalyzeExpenseCommand({
        Document: {
          S3Object: {
            Bucket: bucket,
            Name: objectKey,
          },
        },
      });

    const response =
      await textract.send(
        command,
      );
    
    console.log(
        JSON.stringify(response, null, 2),
    );

    const analysis =
      normaliseExpenseAnalysis(
        response,
        {
          documentId,
          objectKey,
        },
      );

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(
      "Textract analysis error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown Textract error.";

    return NextResponse.json(
      {
        success: false,
        error:
          "LifeOps could not analyse this document.",
        detail: message,
      },
      {
        status: 500,
      },
    );
  }
}