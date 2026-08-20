import { NextResponse } from "next/server";

export async function GET() {
    try {
        const agentApi = process.env.LIFEOPS_AGENT_API;

        if (!agentApi) {
            throw new Error("AGENT_API is missing.");
        }

        const response = await fetch(`${agentApi}/daily-brief`, {
            cache: "no-store",
        });

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