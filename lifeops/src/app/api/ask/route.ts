import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const agentApi = process.env.LIFEOPS_AGENT_API;

        if (!agentApi) {
            throw new Error("LIFEOPS_AGENT_API is missing.");
        }

        const response = await fetch(`${agentApi}/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const data = await response.json();

        return NextResponse.json(
            data,
            {status: response.status},
        );
    } catch (error) {
        console.error("Ask LifeOps error: ", error);

        return NextResponse.json(
            {
                success: false,
                error: "LifeOps is unavailable",
            },
            {status: 500},
        );
    }
}