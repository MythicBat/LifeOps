import { Amplify } from "aws-amplify";

let configured = false;

export function configuredAmplify() {
    if (configured) { return; }

    const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
    const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

    if (!userPoolId || !userPoolClientId) {
        throw new Error("Cognito environment variables is missing.");
    }

    Amplify.configure({
        Auth: {
            Cognito: {
                userPoolId,
                userPoolClientId,
                loginWith: {
                    email: true,
                },
            },
        },
    });

    configured = true;
}