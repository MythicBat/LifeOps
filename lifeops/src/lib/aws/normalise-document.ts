import type { Block } from "@aws-sdk/client-textract";

export interface DocumentQueries {
    appointmentDate?: string;
    appointmentTime?: string;
    renewalDate?: string;
    expiryDate?: string;
    location?: string;
}

export function extractQueryResults(blocks: Block[]): DocumentQueries {
    const result: DocumentQueries = {};

    const answers = new Map<string, string>();

    const blockMap = new Map(
        blocks.map((block) => [block.Id, block])
    );

    for (const block of blocks) {
        if (block.BlockType !== "QUERY") { continue; }

        const alias = block.Query?.Alias;

        const answerRelationship = block.Relationships?.find((relationship) => relationship.Type === "ANSWER");

        const answerId = answerRelationship?.Ids?.[0];

        if (!alias || !answerId) { continue; }

        const answer = blockMap.get(answerId);

        if (answer?.Text) {
            answers.set(alias, answer.Text);
        }
    }

    result.appointmentDate = answers.get("APPOINTMENT_DATE");
    result.appointmentTime = answers.get("APPOINTMENT_TIME");
    result.renewalDate = answers.get("RENEWAL_DATE");
    result.expiryDate = answers.get("EXPIRY_DATE");
    result.location = answers.get("LOCATION");

    return result;
}