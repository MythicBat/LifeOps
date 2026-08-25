import { authFetch } from "@/lib/auth/auth-fetch";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const agentApi = process.env.LIFEOPS_AGENT_API;

    if (!agentApi) {
        return NextResponse.json(
            {success: false},
            {status: 500},
        );
    }

    const authorization = request.headers.get("authorization");

    if (!authorization) {
        return NextResponse.json(
            {success: false, error: "Authentication required."},
            {status: 401},
        );
    }

    try {
        const response = await authFetch(`${agentApi}/upcoming`, {
            headers: {
                Authorization: authorization,
            },
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