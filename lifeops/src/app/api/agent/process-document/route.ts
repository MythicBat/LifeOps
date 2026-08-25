import { NextResponse } from "next/server";
import { authFetch } from "@/lib/auth/auth-fetch";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const agentAPI = process.env.LIFEOPS_AGENT_API;

        if (!agentAPI) {
            throw new Error("LIFEOPS_AGENT_API is not configured.");
        }

        const response = await authFetch(`${agentAPI}/process-document`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
                    detail: data.detatil ?? "Unknown agent error",
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