import {
  NextResponse,
} from "next/server";


export async function GET() {

  try {

    const agentApi =
      process.env
        .LIFEOPS_AGENT_API;

    if (!agentApi) {
      throw new Error(
        "Agent API missing."
      );
    }

    const response =
      await fetch(
        `${agentApi}/notifications`,
        {
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