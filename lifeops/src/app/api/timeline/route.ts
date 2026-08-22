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
        "LIFEOPS_AGENT_API missing."
      );
    }

    const response =
      await fetch(
        `${agentApi}/timeline`,
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

  } catch (error) {

    console.error(
      "Timeline error:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        items:
          [],
      },
      {
        status:
          500,
      }
    );
  }
}