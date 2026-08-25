import { authFetch } from "@/lib/auth/auth-fetch";
import {
  NextResponse,
} from "next/server";


const API_URL = process.env.LIFEOPS_AGENT_API


export async function GET(request: Request) {
  try {

    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required.",
        },
        {status: 401}
      );
    }

    const response =
      await authFetch(
        `${API_URL}/vault`,
        {
          method: "GET",
          headers: {
            Authorization: authorization,
          },
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