import {
  NextResponse,
} from "next/server";


export async function GET(request: Request) {

  try {

    const agentApi =
      process.env
        .LIFEOPS_AGENT_API;

    if (!agentApi) {
      throw new Error(
        "Agent API missing."
      );
    }

    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {success: false, error: "Authentication required."},
        {status: 401},
      );
    }

    const response =
      await fetch(
        `${agentApi}/notifications`,
        {
          headers: {
            Authorization: authorization,
          },
          cache:
            "no-store",
        }
      );

    const data =
      await response.json();

    return NextResponse.json(
      data,
      {
        status:
          response.status,
      }
    );

  } catch {

    return NextResponse.json(
      {
        success:
          false,

        notifications:
          [],
      },
      {
        status:
          500,
      }
    );
  }
}