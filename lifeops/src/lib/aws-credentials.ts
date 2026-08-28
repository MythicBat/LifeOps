import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

export function getAwsCredentials() {
    const roleArn = process.env.AWS_ROLE_ARN;

    if (!roleArn) {
        return undefined;
    }

    return awsCredentialsProvider({
        roleArn,
    });
}