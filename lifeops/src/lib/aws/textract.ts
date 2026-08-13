import { TextractClient } from "@aws-sdk/client-textract";

const region = process.env.AWS_REGION;

if (!region) {
    throw new Error("AWS_REGION is not configured.");
}

export const textractClient = new TextractClient({ region });