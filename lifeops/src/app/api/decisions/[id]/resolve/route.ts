import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    context: {
        params: Promise<{ id: string; }>;
    },
) {
    try {
        const {id} = await context.params;

        const body = await request.json();

        const agentApi = process.env.LIFEOPS_AGENT_API;

        if (!agentApi) {
            throw new Error("Agent API is missing.");
        }

        const response = await fetch(`${agentApi}/decisions/${id}/resolve`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            },
        );

        const data = await response.json();

        return NextResponse.json(
            data,
            {status: response.status},
        );
    } catch {
        return NextResponse.json(
            {success: false},
            {status: 500},
        );
    }
}