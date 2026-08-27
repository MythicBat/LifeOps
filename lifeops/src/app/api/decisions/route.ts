import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const agentApi = process.env.LIFEOPS_AGENT_API;

        if (!agentApi) {
            throw new Error("LIFEOPS_AGENT_API is not configured");
        }

        const authorization = request.headers.get("authorization");

        if (!authorization) {
            return NextResponse.json(
                {success: false, error: "Authentication required."},
                {status: 401},
            )
        }

        const response = await fetch(`${agentApi}/decisions`, {
            headers: {
                Authorization: authorization,
            },
            cache: "no-store",
        },);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail ?? "Unable to load decisions.");
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Decision API error:", error);
    }

    return NextResponse.json(
        {
            success: false,
            decisions: [],
        },
        {status: 500},
    );
}