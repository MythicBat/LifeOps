import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

        const authorization = request.headers.get("authorization");

        if (!authorization) {
            return NextResponse.json(
                {success: false, error: "Authentication required"},
                {status: 401},
            );
        }

        const body = await request.json();

        const agentAPI = process.env.LIFEOPS_AGENT_API;

        if (!agentAPI) {
            throw new Error("LIFEOPS_AGENT_API is not configured.");
        }

        const response = await fetch(`${agentAPI}/process-document`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization,
                },
                body: JSON.stringify(body),
                cache: "no-store",
            },
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: "LifeOps agent failed.",
                    detail: data.detail ?? "Unknown agent error",
                },
                {status: response.status}
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Agent proxy error:", error);

        return NextResponse.json(
            {error: "Unable to reach the LifeOps agent."},
            {status: 500}
        );
    }
}