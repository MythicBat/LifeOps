import { NextResponse } from "next/server";

export async function GET() {
    const agentApi = process.env.LIFEOPS_AGENT_API;

    if (!agentApi) {
        return NextResponse.json(
            {success: false},
            {status: 500},
        );
    }

    try {
        const response = await fetch(`${agentApi}/upcoming`, {
            cache: "no-store",
        });

        const data = response.json();

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