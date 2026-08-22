import {
  NextResponse,
} from "next/server";


const API_URL = process.env.LIFEOPS_AGENT_API


export async function GET() {
  try {

    const response =
      await fetch(
        `${API_URL}/vault`,
        {
          method: "GET",
          cache: "no-store",
        }
      );


    const data =
      await response.json();


    if (!response.ok) {
      return NextResponse.json(
        data,
        {
          status:
            response.status,
        }
      );
    }


    return NextResponse.json(
      data
    );

  } catch (error) {

    console.error(
      "Vault proxy error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to connect to LifeOps backend.",
      },
      {
        status: 500,
      }
    );
  }
}