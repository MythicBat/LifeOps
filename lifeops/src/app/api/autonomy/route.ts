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
        `${agentApi}/autonomy`,
        {
          cache: "no-store",
        },
      );

    const data =
      await response.json();

    return NextResponse.json(
      data,
      {
        status:
          response.status,
      },
    );

  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}


export async function PUT(
  request: Request,
) {
  try {
    const settings =
      await request.json();

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
        `${agentApi}/autonomy`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              settings
            ),
        },
      );

    const data =
      await response.json();

    return NextResponse.json(
      data,
      {
        status:
          response.status,
      },
    );

  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}