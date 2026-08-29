import { CognitoJwtVerifier } from "aws-jwt-verify";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

if (!userPoolId) {
    throw new Error("NEXT_PUBLIC_COGNITO_USER_POOL_ID is not configured.");
}

if (!clientId) {
    throw new Error("NEXT_PUBLIC_COGNITO_CLIENT_ID is not configured.");
}

const verifier = CognitoJwtVerifier.create({
    userPoolId,
    tokenUse: "access",
    clientId,
});

export async function getAuthenticatedUserSub(
    request: Request,
): Promise<string | null> {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
        return null;
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
        return null;
    }

    try {
        const payload = await verifier.verify(token);
        return payload.sub;
    } catch (error) {
        console.error("Cognito token verification failed:", error);
        return null;
    }
}