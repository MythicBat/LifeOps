import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore";

import {
  NextResponse,
} from "next/server";

import {
  randomUUID,
} from "crypto";

import {
    awsCredentialsProvider,
} from "@vercel/oidc-aws-credentials-provider";


const region =
  process.env.AWS_REGION;


const client =
  new BedrockAgentCoreClient({
    region,
    credentials: process.env.AWS_ROLE_ARN ? awsCredentialsProvider({
        roleArn: process.env.AWS_ROLE_ARN
    }) : undefined
  });


export async function POST(
  request: Request,
) {
  try {

    const body =
      await request.json();


    const runtimeArn =
      process.env
        .LIFEOPS_AGENTCORE_RUNTIME_ARN;


    if (!runtimeArn) {
      throw new Error(
        "LIFEOPS_AGENTCORE_RUNTIME_ARN is not configured.",
      );
    }


    /*
     * Later we can replace this
     * with the authenticated Cognito
     * user's sub.
     *
     * For now the document payload
     * already contains the LifeOps
     * information required by the agent.
     */

    const userId =
      body.userId ??
      "lifeops-web-user";


    const payload = {
      action:
        "process_document",

      userId,

      document: body,
    };


    const command =
      new InvokeAgentRuntimeCommand({
        agentRuntimeArn:
          runtimeArn,

        runtimeSessionId:
          randomUUID(),

        qualifier:
          "DEFAULT",

        contentType:
          "application/json",

        accept:
          "application/json",

        payload:
          JSON.stringify(
            payload,
          ),
      });


    const response =
      await client.send(
        command,
      );


    const responseText =
      await response.response
        ?.transformToString();


    if (!responseText) {
      throw new Error(
        "AgentCore returned an empty response.",
      );
    }


    let result;

    try {
      result =
        JSON.parse(
          responseText,
        );

    } catch {
      console.error(
        "Invalid AgentCore response:",
        responseText,
      );

      throw new Error(
        "AgentCore returned invalid JSON.",
      );
    }


    if (
      result?.success === false
    ) {
      return NextResponse.json(
        {
          error:
            result.error ??
            "LifeOps agent failed.",

          detail:
            result.detail,
        },
        {
          status: 500,
        },
      );
    }


    return NextResponse.json({
      result,
    });

  } catch (error) {

    console.error(
      "AgentCore proxy error:",
      error,
    );


    return NextResponse.json(
      {
        error:
          "Unable to reach the deployed LifeOps AgentCore runtime.",

        detail:
          error instanceof Error
            ? error.message
            : "Unknown AgentCore error.",
      },
      {
        status: 500,
      },
    );
  }
}