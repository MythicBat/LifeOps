import { NextResponse } from "next/server";
import { authFetch } from "@/lib/auth/auth-fetch";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const agentApi = process.env.LIFEOPS_AGENT_API;

        if (!agentApi) {
            throw new Error("LIFEOPS_AGENT_API is missing.");
        }

        const authorization = request.headers.get("authorization");

        if (!authorization) {
            return NextResponse.json(
                {success: false, error: "Authentication required."},
                {status: 401},
            );
        }

        const response = await authFetch(`${agentApi}/ask`, {
            method: "POST",
            headers: {
                Authorization: authorization,
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