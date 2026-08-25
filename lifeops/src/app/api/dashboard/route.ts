import { authFetch } from "@/lib/auth/auth-fetch";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const agentApi = process.env.LIFEOPS_AGENT_API;

        if (!agentApi) {
            throw new Error("LIFEOPS_AGENT_API is missing.");
        }

        const authorization = request.headers.get("authorization");

        if (!authorization) {
            return NextResponse.json(
                {success: false, error: "Authentication required"},
                {status: 401},
            )
        }

        const response = await authFetch(`${agentApi}/dashboard`, {
            headers: {
                Authorization: authorization,
            },
            cache: "no-store",
        });

        const data = await response.json();

        return NextResponse.json(
            data,
            {
                status: response.status,
            },
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {success: false},
            {status: 500},
        );
    }
}